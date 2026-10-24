import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { regenererCreneauxAutomatiques } from "@/lib/generation-creneaux";
import { isPrestationId, prestations } from "@/lib/prestations";

export async function GET(request: NextRequest) {
  const serviceId = request.nextUrl.searchParams.get("serviceId") ?? "bain-enveloppe";

  if (!isPrestationId(serviceId)) {
    return NextResponse.json({ error: "Prestation invalide." }, { status: 400 });
  }

  const disponibilite = await prisma.disponibilite.upsert({
    where: { id: serviceId },
    update: {},
    create: { id: serviceId },
  });

  return NextResponse.json({ disponibilite });
}

const heureRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

const disponibiliteSchema = z.object({
  serviceId: z.string().min(1),
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
  samediHeureDebut: z.string().regex(heureRegex, "Heure invalide."),
  samediHeureFin: z.string().regex(heureRegex, "Heure invalide."),
  maxRdvParJour: z.number().int().min(1).max(50),
});

export async function PATCH(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = disponibiliteSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Champs invalides." }, { status: 400 });
  }

  const { serviceId, ...data } = parsed.data;

  if (!isPrestationId(serviceId)) {
    return NextResponse.json({ error: "Prestation invalide." }, { status: 400 });
  }

  // Une prestation nocturne (ex. garde de nuit) traverse minuit, et une
  // prestation à plage fixe (ex. le brunch) n'utilise pas ces champs du
  // tout : pas de vérification d'ordre "début < milieu < fin" pour elles.
  const prestation = prestations[serviceId];
  const verifierOrdre = !prestation.nocturne && !prestation.plageFixe;
  if (
    verifierOrdre &&
    (data.heureDebut >= data.heureMidi ||
      data.heureMidi >= data.heureFin ||
      data.samediHeureDebut >= data.heureMidi ||
      data.heureMidi >= data.samediHeureFin)
  ) {
    return NextResponse.json(
      { error: "Les horaires doivent être dans l'ordre : début < milieu de journée < fin (semaine et samedi)." },
      { status: 400 }
    );
  }

  const disponibilite = await prisma.disponibilite.upsert({
    where: { id: serviceId },
    update: data,
    create: { id: serviceId, ...data },
  });

  const resultat = await regenererCreneauxAutomatiques();

  return NextResponse.json({ disponibilite, ...resultat });
}
