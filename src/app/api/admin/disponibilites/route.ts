import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { regenererCreneauxAutomatiques } from "@/lib/generation-creneaux";

export async function GET() {
  const disponibilite = await prisma.disponibilite.upsert({
    where: { id: "default" },
    update: {},
    create: { id: "default" },
  });

  return NextResponse.json({ disponibilite });
}

const heureRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

const disponibiliteSchema = z.object({
  lundi: z.boolean(),
  mardi: z.boolean(),
  mercredi: z.boolean(),
  jeudi: z.boolean(),
  vendredi: z.boolean(),
  samedi: z.boolean(),
  dimanche: z.boolean(),
  heureDebut: z.string().regex(heureRegex, "Heure invalide."),
  heureFin: z.string().regex(heureRegex, "Heure invalide."),
  dureeCreneauMinutes: z.number().int().min(15).max(480),
  maxRdvParJour: z.number().int().min(1).max(50),
});

export async function PATCH(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = disponibiliteSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Champs invalides." }, { status: 400 });
  }

  if (parsed.data.heureDebut >= parsed.data.heureFin) {
    return NextResponse.json(
      { error: "L'heure de début doit précéder l'heure de fin." },
      { status: 400 }
    );
  }

  const disponibilite = await prisma.disponibilite.upsert({
    where: { id: "default" },
    update: parsed.data,
    create: { id: "default", ...parsed.data },
  });

  const resultat = await regenererCreneauxAutomatiques();

  return NextResponse.json({ disponibilite, ...resultat });
}
