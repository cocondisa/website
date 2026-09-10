import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toDateKeyInTimeZone } from "@/lib/timezone";

export async function GET() {
  // Libère les créneaux dont la retenue de paiement a expiré (client parti
  // sans finaliser son paiement Stripe) avant de renvoyer la liste.
  await prisma.reservation.updateMany({
    where: {
      statut: "EN_ATTENTE_PAIEMENT",
      expiresAt: { lt: new Date() },
    },
    data: { statut: "ANNULEE" },
  });
  await prisma.creneau.updateMany({
    where: {
      disponible: false,
      reservation: { statut: "ANNULEE" },
    },
    data: { disponible: true },
  });

  const vacances = await prisma.vacances.findMany({
    where: { fin: { gte: new Date() } },
    select: { debut: true, fin: true },
  });

  const creneaux = await prisma.creneau.findMany({
    where: {
      disponible: true,
      date: { gte: new Date() },
      // Exclut les créneaux qui tombent dans une période de vacances,
      // sans avoir besoin de les supprimer un par un.
      NOT: vacances.map(({ debut, fin }) => ({ date: { gte: debut, lte: fin } })),
    },
    orderBy: { date: "asc" },
    select: { id: true, date: true, dureeMinutes: true },
  });

  // Une fois le nombre maximal de RDV/jour atteint (réservations confirmées
  // ou en cours de paiement), le jour entier disparaît de la sélection,
  // même s'il reste des créneaux techniquement libres ce jour-là.
  const { maxRdvParJour } = await prisma.disponibilite.upsert({
    where: { id: "default" },
    update: {},
    create: { id: "default" },
    select: { maxRdvParJour: true },
  });

  const reservationsActives = await prisma.reservation.findMany({
    where: {
      statut: { in: ["CONFIRMEE", "EN_ATTENTE_PAIEMENT"] },
      creneau: { date: { gte: new Date() } },
    },
    select: { creneau: { select: { date: true } } },
  });

  const compteParJour = new Map<string, number>();
  for (const { creneau } of reservationsActives) {
    const key = toDateKeyInTimeZone(creneau.date);
    compteParJour.set(key, (compteParJour.get(key) ?? 0) + 1);
  }

  const creneauxDisponibles = creneaux.filter((c) => {
    const jourComplet = (compteParJour.get(toDateKeyInTimeZone(c.date)) ?? 0) >= maxRdvParJour;
    return !jourComplet;
  });

  return NextResponse.json({ creneaux: creneauxDisponibles });
}
