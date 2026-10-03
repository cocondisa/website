import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { regenererCreneauxAutomatiques } from "@/lib/generation-creneaux";
import { isPrestationId, prestations } from "@/lib/prestations";

export async function GET() {
  // Maintient la fenêtre glissante de créneaux AUTO à jour à chaque
  // consultation de l'admin (pas besoin de tâche planifiée pour le MVP).
  await regenererCreneauxAutomatiques();

  // Isabelle est disponible en continu selon ses disponibilités récurrentes :
  // inutile de lister les centaines de créneaux AUTO libres. Seuls les
  // créneaux réservés (à gérer) et les ajouts manuels exceptionnels
  // (qu'elle a explicitement créés) sont affichés ici.
  const creneaux = await prisma.creneau.findMany({
    where: {
      date: { gte: new Date() },
      OR: [{ reservation: { isNot: null } }, { origine: "MANUEL" }],
    },
    orderBy: { date: "asc" },
    select: {
      id: true,
      date: true,
      dureeMinutes: true,
      disponible: true,
      origine: true,
      prestationId: true,
      reservation: {
        select: {
          id: true,
          nomComplet: true,
          email: true,
          telephone: true,
          adresseClient: true,
          statut: true,
          facture: { select: { id: true } },
        },
      },
    },
  });

  return NextResponse.json({ creneaux });
}

const creneauSchema = z.object({
  date: z.string().datetime({ offset: true }).or(z.string().min(1)),
  serviceId: z.string().min(1),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = creneauSchema.safeParse(body);

  if (!parsed.success || !isPrestationId(parsed.data.serviceId)) {
    return NextResponse.json({ error: "Créneau invalide." }, { status: 400 });
  }

  const date = new Date(parsed.data.date);
  if (Number.isNaN(date.getTime())) {
    return NextResponse.json({ error: "Date invalide." }, { status: 400 });
  }

  const prestation = prestations[parsed.data.serviceId];

  const creneau = await prisma.creneau.create({
    data: {
      date,
      dureeMinutes: prestation.dureeMinutes,
      prestationId: prestation.id,
    },
  });

  return NextResponse.json({ creneau }, { status: 201 });
}
