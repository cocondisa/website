import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const patchSchema = z.object({
  statut: z.enum(["UTILISEE", "ANNULEE", "ACTIVE"]),
});

// Change le statut d'une carte cadeau depuis /admin — typiquement marquée
// "utilisée" une fois le rendez-vous fixé à la main avec le destinataire,
// qui a contacté Isabelle avec son code.
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Statut invalide." }, { status: 400 });
  }

  const carte = await prisma.carteCadeau.findUnique({ where: { id } });
  if (!carte) {
    return NextResponse.json({ error: "Carte cadeau introuvable." }, { status: 404 });
  }

  const updated = await prisma.carteCadeau.update({
    where: { id },
    data: { statut: parsed.data.statut },
  });

  return NextResponse.json({ carte: updated });
}
