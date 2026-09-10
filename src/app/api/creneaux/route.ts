import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    return await handleGet();
  } catch (error) {
    console.error("Erreur /api/creneaux :", error);
    return NextResponse.json(
      {
        error: "DEBUG_TEMP",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

async function handleGet() {
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

  return NextResponse.json({ creneaux });
}
