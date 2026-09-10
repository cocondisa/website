import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const creneaux = await prisma.creneau.findMany({
    where: {
      disponible: true,
      date: { gte: new Date() },
    },
    orderBy: { date: "asc" },
    select: { id: true, date: true, dureeMinutes: true },
  });

  return NextResponse.json({ creneaux });
}
