import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toDateKeyInTimeZone } from "@/lib/timezone";

function dateKeyMoinsJours(jours: number): string {
  const d = new Date();
  d.setDate(d.getDate() - jours);
  return toDateKeyInTimeZone(d);
}

export async function GET() {
  const toutes = await prisma.vueSite.findMany({ orderBy: { id: "desc" } });

  const total = toutes.reduce((somme, v) => somme + v.compteur, 0);
  const aujourdHui = toDateKeyInTimeZone(new Date());
  const il7Jours = dateKeyMoinsJours(6); // inclut aujourd'hui = 7 jours
  const il30Jours = dateKeyMoinsJours(29); // inclut aujourd'hui = 30 jours

  const vuesAujourdHui = toutes.find((v) => v.id === aujourdHui)?.compteur ?? 0;
  const vues7Jours = toutes.filter((v) => v.id >= il7Jours).reduce((s, v) => s + v.compteur, 0);
  const vues30Jours = toutes.filter((v) => v.id >= il30Jours).reduce((s, v) => s + v.compteur, 0);

  return NextResponse.json({
    total,
    aujourdHui: vuesAujourdHui,
    sept_jours: vues7Jours,
    trente_jours: vues30Jours,
  });
}
