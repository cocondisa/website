import type { Disponibilite } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { zonedTimeToUtc, toDateKeyInTimeZone } from "@/lib/timezone";
import { prestationsList, type Prestation } from "@/lib/prestations";

const FENETRE_JOURS = 120; // horizon glissant de génération (~4 mois)

function dateKeyPlusDays(baseKey: string, days: number): string {
  const [y, m, d] = baseKey.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + days));
  return `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, "0")}-${String(
    dt.getUTCDate()
  ).padStart(2, "0")}`;
}

function isoWeekdayOfDateKey(dateKey: string): number {
  const [y, m, d] = dateKey.split("-").map(Number);
  const jsDay = new Date(Date.UTC(y, m - 1, d)).getUTCDay(); // 0=dimanche..6=samedi
  return jsDay === 0 ? 7 : jsDay;
}

function demiJourneesActives(dispo: Disponibilite, isoWeekday: number): { matin: boolean; apresMidi: boolean } {
  switch (isoWeekday) {
    case 1:
      return { matin: dispo.lundiMatin, apresMidi: dispo.lundiApresMidi };
    case 2:
      return { matin: dispo.mardiMatin, apresMidi: dispo.mardiApresMidi };
    case 3:
      return { matin: dispo.mercrediMatin, apresMidi: dispo.mercrediApresMidi };
    case 4:
      return { matin: dispo.jeudiMatin, apresMidi: dispo.jeudiApresMidi };
    case 5:
      return { matin: dispo.vendrediMatin, apresMidi: dispo.vendrediApresMidi };
    case 6:
      return { matin: dispo.samediMatin, apresMidi: dispo.samediApresMidi };
    case 7:
      return { matin: dispo.dimancheMatin, apresMidi: dispo.dimancheApresMidi };
    default:
      return { matin: false, apresMidi: false };
  }
}

function toMinutes(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function genererHeuresEntre(heureDebut: string, heureFin: string, dureeMinutes: number): string[] {
  const debut = toMinutes(heureDebut);
  const fin = toMinutes(heureFin);
  const heures: string[] = [];
  for (let t = debut; t + dureeMinutes <= fin; t += dureeMinutes) {
    const h = Math.floor(t / 60);
    const m = t % 60;
    heures.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
  }
  return heures;
}

/**
 * Heures de créneaux d'un jour donné pour une prestation, en ne générant que
 * les demi-journées actives. Pour une prestation nocturne (ex. garde de
 * nuit), le créneau unique du jour démarre à `heureDebut` et traverse minuit
 * (sa durée vient entièrement de la prestation, pas d'un découpage en
 * sous-créneaux) ; seule la bascule `*ApresMidi` du jour sert alors
 * d'indicateur "nuit disponible", `*Matin` n'est pas utilisé. Pour une
 * prestation à plage horaire fixe (ex. le brunch entre midi et deux), même
 * principe : `*ApresMidi` sert de bascule "jour disponible", mais les
 * créneaux sont générés sur `prestation.plageFixe` plutôt que sur les heures
 * de la Disponibilite (qui ne sont alors pas utilisées).
 */
function genererHeuresDuJour(dispo: Disponibilite, prestation: Prestation, isoWeekday: number): string[] {
  const { matin, apresMidi } = demiJourneesActives(dispo, isoWeekday);

  if (prestation.nocturne) {
    return apresMidi ? [dispo.heureDebut] : [];
  }

  if (prestation.plageFixe) {
    if (!apresMidi) return [];
    return genererHeuresEntre(prestation.plageFixe.debut, prestation.plageFixe.fin, prestation.dureeMinutes);
  }

  const heures: string[] = [];
  if (matin) heures.push(...genererHeuresEntre(dispo.heureDebut, dispo.heureMidi, prestation.dureeMinutes));
  if (apresMidi) heures.push(...genererHeuresEntre(dispo.heureMidi, dispo.heureFin, prestation.dureeMinutes));
  return heures;
}

/**
 * Régénère les créneaux AUTO à venir, pour chaque prestation, à partir de
 * ses disponibilités récurrentes propres : crée ceux qui manquent, supprime
 * ceux qui ne correspondent plus à la règle actuelle (uniquement s'ils ne
 * sont pas réservés). Les créneaux ajoutés manuellement, passés, ou réservés
 * ne sont jamais touchés.
 */
export async function regenererCreneauxAutomatiques() {
  const vacances = await prisma.vacances.findMany();
  const todayKey = toDateKeyInTimeZone(new Date());

  let totalCrees = 0;
  let totalSupprimes = 0;

  for (const prestation of prestationsList) {
    const disponibilite = await prisma.disponibilite.upsert({
      where: { id: prestation.id },
      update: {},
      create: { id: prestation.id },
    });

    const creneauxValides = new Map<string, Date>();

    for (let i = 0; i < FENETRE_JOURS; i++) {
      const dateKey = dateKeyPlusDays(todayKey, i);
      const heuresDuJour = genererHeuresDuJour(disponibilite, prestation, isoWeekdayOfDateKey(dateKey));
      if (heuresDuJour.length === 0) continue;

      const jourDebut = zonedTimeToUtc(dateKey, "00:00");
      const dansVacances = vacances.some((v) => jourDebut >= v.debut && jourDebut <= v.fin);
      if (dansVacances) continue;

      for (const heure of heuresDuJour) {
        const instant = zonedTimeToUtc(dateKey, heure);
        creneauxValides.set(instant.toISOString(), instant);
      }
    }

    const creneauxAutoExistants = await prisma.creneau.findMany({
      where: { origine: "AUTO", prestationId: prestation.id, date: { gte: new Date() } },
      include: { reservation: true },
    });
    const instantsExistants = new Set(creneauxAutoExistants.map((c) => c.date.toISOString()));

    const aSupprimer = creneauxAutoExistants.filter(
      (c) =>
        !creneauxValides.has(c.date.toISOString()) &&
        (!c.reservation || c.reservation.statut === "ANNULEE")
    );
    if (aSupprimer.length > 0) {
      const ids = aSupprimer.map((c) => c.id);
      await prisma.$transaction([
        prisma.reservation.deleteMany({ where: { creneauId: { in: ids } } }),
        prisma.creneau.deleteMany({ where: { id: { in: ids } } }),
      ]);
    }

    const aCreer = [...creneauxValides.entries()].filter(([iso]) => !instantsExistants.has(iso));
    if (aCreer.length > 0) {
      await prisma.creneau.createMany({
        data: aCreer.map(([, date]) => ({
          date,
          dureeMinutes: prestation.dureeMinutes,
          prestationId: prestation.id,
          origine: "AUTO" as const,
        })),
      });
    }

    totalCrees += aCreer.length;
    totalSupprimes += aSupprimer.length;
  }

  return { crees: totalCrees, supprimes: totalSupprimes };
}
