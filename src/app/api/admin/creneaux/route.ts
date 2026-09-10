import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const creneaux = await prisma.creneau.findMany({
    where: { date: { gte: new Date() } },
    orderBy: { date: "asc" },
    include: {
      reservation: {
        select: { id: true, nomComplet: true, email: true, telephone: true, statut: true },
      },
    },
  });

  return NextResponse.json({ creneaux });
}

const creneauSchema = z.object({
  date: z.string().datetime({ offset: true }).or(z.string().min(1)),
  dureeMinutes: z.number().int().positive().optional(),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = creneauSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Créneau invalide." }, { status: 400 });
  }

  const date = new Date(parsed.data.date);
  if (Number.isNaN(date.getTime())) {
    return NextResponse.json({ error: "Date invalide." }, { status: 400 });
  }

  const creneau = await prisma.creneau.create({
    data: {
      date,
      dureeMinutes: parsed.data.dureeMinutes ?? 90,
    },
  });

  return NextResponse.json({ creneau }, { status: 201 });
}
