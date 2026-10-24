import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toDateKeyInTimeZone } from "@/lib/timezone";

// Compteur de vues agrégé (aucune donnée par visiteur) : un total par jour,
// incrémenté par le petit tracker client sur les pages publiques.
export async function POST() {
  const today = toDateKeyInTimeZone(new Date());

  await prisma.vueSite.upsert({
    where: { id: today },
    update: { compteur: { increment: 1 } },
    create: { id: today, compteur: 1 },
  });

  return NextResponse.json({ ok: true });
}
