import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Annule une réservation (quel que soit son statut) et remet son créneau
// disponible, sans supprimer le créneau lui-même.
export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const reservation = await prisma.reservation.findUnique({ where: { id } });

  if (!reservation) {
    return NextResponse.json({ error: "Réservation introuvable." }, { status: 404 });
  }

  await prisma.$transaction([
    prisma.reservation.update({
      where: { id },
      data: { statut: "ANNULEE" },
    }),
    prisma.creneau.update({
      where: { id: reservation.creneauId },
      data: { disponible: true },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
