import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const vacances = await prisma.vacances.findMany({
    where: { fin: { gte: new Date() } },
    orderBy: { debut: "asc" },
  });

  return NextResponse.json({ vacances });
}

const vacancesSchema = z.object({
  debut: z.string().min(1),
  fin: z.string().min(1),
  label: z.string().trim().max(100).optional(),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = vacancesSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Période invalide." }, { status: 400 });
  }

  const debut = new Date(`${parsed.data.debut}T00:00:00`);
  const fin = new Date(`${parsed.data.fin}T23:59:59`);

  if (Number.isNaN(debut.getTime()) || Number.isNaN(fin.getTime()) || fin < debut) {
    return NextResponse.json({ error: "Période invalide." }, { status: 400 });
  }

  const vacances = await prisma.vacances.create({
    data: { debut, fin, label: parsed.data.label || null },
  });

  return NextResponse.json({ vacances }, { status: 201 });
}
