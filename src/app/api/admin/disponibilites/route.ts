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
  lundiMatin: z.boolean(),
  lundiApresMidi: z.boolean(),
  mardiMatin: z.boolean(),
  mardiApresMidi: z.boolean(),
  mercrediMatin: z.boolean(),
  mercrediApresMidi: z.boolean(),
  jeudiMatin: z.boolean(),
  jeudiApresMidi: z.boolean(),
  vendrediMatin: z.boolean(),
  vendrediApresMidi: z.boolean(),
  samediMatin: z.boolean(),
  samediApresMidi: z.boolean(),
  dimancheMatin: z.boolean(),
  dimancheApresMidi: z.boolean(),
  heureDebut: z.string().regex(heureRegex, "Heure invalide."),
  heureMidi: z.string().regex(heureRegex, "Heure invalide."),
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

  if (
    parsed.data.heureDebut >= parsed.data.heureMidi ||
    parsed.data.heureMidi >= parsed.data.heureFin
  ) {
    return NextResponse.json(
      { error: "Les horaires doivent être dans l'ordre : début < milieu de journée < fin." },
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
