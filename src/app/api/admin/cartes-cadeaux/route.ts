import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const cartes = await prisma.carteCadeau.findMany({
    where: { statut: { not: "EN_ATTENTE_PAIEMENT" } },
    orderBy: { createdAt: "desc" },
    include: { facture: { select: { id: true } } },
  });

  return NextResponse.json({ cartes });
}
