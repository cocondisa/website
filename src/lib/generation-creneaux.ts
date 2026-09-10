import type { Disponibilite } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { zonedTimeToUtc, toDateKeyInTimeZone } from "@/lib/timezone";

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

function estJourActif(dispo: Disponibilite, isoWeekday: number): boolean {
  switch (isoWeekday) {
    case 1:
      return dispo.lundi;
    case 2:
      return dispo.mardi;
    case 3:
      return dispo.mercredi;
    case 4:
      return dispo.jeudi;
    case 5:
      return dispo.vendredi;
    case 6:
      return dispo.samedi;
    case 7:
      return dispo.dimanche;
    default:
      return false;
  }
}

function genererHeuresDuJour(heureDebut: string, heureFin: string, dureeMinutes: number): string[] {
  const toMinutes = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };
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
 * Régénère les créneaux AUTO à venir à partir des disponibilités
 * récurrentes : crée ceux qui manquent, supprime ceux qui ne correspondent
 * plus à la règle actuelle (uniquement s'ils ne sont pas réservés). Les
 * créneaux ajoutés manuellement, passés, ou réservés ne sont jamais touchés.
 */
export async function regenererCreneauxAutomatiques() {
  const disponibilite = await prisma.disponibilite.upsert({
    where: { id: "default" },
    update: {},
    create: { id: "default" },
  });

  const vacances = await prisma.vacances.findMany();
  const todayKey = toDateKeyInTimeZone(new Date());
  const heuresDuJour = genererHeuresDuJour(
    disponibilite.heureDebut,
    disponibilite.heureFin,
    disponibilite.dureeCreneauMinutes
  );

  const creneauxValides = new Map<string, Date>();

  for (let i = 0; i < FENETRE_JOURS; i++) {
    const dateKey = dateKeyPlusDays(todayKey, i);
    if (!estJourActif(disponibilite, isoWeekdayOfDateKey(dateKey))) continue;

    const jourDebut = zonedTimeToUtc(dateKey, "00:00");
    const dansVacances = vacances.some((v) => jourDebut >= v.debut && jourDebut <= v.fin);
    if (dansVacances) continue;

    for (const heure of heuresDuJour) {
      const instant = zonedTimeToUtc(dateKey, heure);
      creneauxValides.set(instant.toISOString(), instant);
    }
  }

  const creneauxAutoExistants = await prisma.creneau.findMany({
    where: { origine: "AUTO", date: { gte: new Date() } },
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
        dureeMinutes: disponibilite.dureeCreneauMinutes,
        origine: "AUTO" as const,
      })),
    });
  }

  return { crees: aCreer.length, supprimes: aSupprimer.length };
}
