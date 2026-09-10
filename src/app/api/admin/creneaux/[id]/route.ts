import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const creneau = await prisma.creneau.findUnique({
    where: { id },
    include: { reservation: true },
  });

  if (!creneau) {
    return NextResponse.json({ error: "Créneau introuvable." }, { status: 404 });
  }

  if (creneau.reservation && creneau.reservation.statut !== "ANNULEE") {
    return NextResponse.json(
      { error: "Impossible de supprimer un créneau réservé." },
      { status: 409 }
    );
  }

  await prisma.$transaction(async (tx) => {
    if (creneau.reservation) {
      await tx.reservation.delete({ where: { id: creneau.reservation.id } });
    }
    await tx.creneau.delete({ where: { id } });
  });

  return NextResponse.json({ ok: true });
}
