import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { siteConfig } from "@/lib/site-config";

const reservationSchema = z.object({
  creneauId: z.string().min(1, "Créneau invalide."),
  nomComplet: z.string().trim().min(2, "Le nom est requis."),
  email: z.string().trim().email("Adresse e-mail invalide."),
  telephone: z.string().trim().min(6, "Numéro de téléphone invalide."),
  infosBebe: z.string().trim().max(500).optional(),
  message: z.string().trim().max(1000).optional(),
});

const HOLD_DURATION_MS = 30 * 60 * 1000; // 30 min — minimum accepté par Stripe Checkout

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = reservationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Champs invalides.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { creneauId, nomComplet, email, telephone, infosBebe, message } =
    parsed.data;

  try {
    const expiresAt = new Date(Date.now() + HOLD_DURATION_MS);

    const reservation = await prisma.$transaction(async (tx) => {
      const found = await tx.creneau.findUnique({ where: { id: creneauId } });

      if (!found || !found.disponible) {
        throw new Error("CRENEAU_INDISPONIBLE");
      }

      await tx.creneau.update({
        where: { id: creneauId },
        data: { disponible: false },
      });

      return tx.reservation.create({
        data: {
          creneauId,
          nomComplet,
          email,
          telephone,
          infosBebe,
          message,
          statut: "EN_ATTENTE_PAIEMENT",
          expiresAt,
        },
      });
    });

    try {
      const priceId = process.env.STRIPE_PRICE_ID;
      if (!priceId) {
        throw new Error("STRIPE_PRICE_ID_MANQUANT");
      }

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: [{ price: priceId, quantity: 1 }],
        customer_email: email,
        allow_promotion_codes: true,
        expires_at: Math.floor((Date.now() + HOLD_DURATION_MS) / 1000),
        success_url: `${siteConfig.url}/rendez-vous/confirmation?reservation=${reservation.id}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${siteConfig.url}/rendez-vous`,
        metadata: { reservationId: reservation.id },
      });

      if (!session.url) {
        throw new Error("STRIPE_SESSION_SANS_URL");
      }

      await prisma.reservation.update({
        where: { id: reservation.id },
        data: { stripeSessionId: session.id },
      });

      return NextResponse.json({ checkoutUrl: session.url }, { status: 201 });
    } catch (stripeError) {
      // La création de la session Stripe a échoué : on libère le créneau
      // plutôt que de le laisser bloqué indéfiniment.
      await prisma.$transaction([
        prisma.reservation.update({
          where: { id: reservation.id },
          data: { statut: "ANNULEE" },
        }),
        prisma.creneau.update({
          where: { id: creneauId },
          data: { disponible: true },
        }),
      ]);
      throw stripeError;
    }
  } catch (error) {
    if (error instanceof Error && error.message === "CRENEAU_INDISPONIBLE") {
      return NextResponse.json(
        { error: "Ce créneau vient d'être réservé. Merci d'en choisir un autre." },
        { status: 409 }
      );
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Ce créneau vient d'être réservé. Merci d'en choisir un autre." },
        { status: 409 }
      );
    }

    console.error("Erreur lors de la réservation :", error);
    return NextResponse.json(
      { error: "Une erreur est survenue. Merci de réessayer." },
      { status: 500 }
    );
  }
}
