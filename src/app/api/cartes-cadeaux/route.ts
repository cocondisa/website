import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { siteConfig } from "@/lib/site-config";
import { isPrestationId, prestations } from "@/lib/prestations";
import { genererCodeCarteCadeau } from "@/lib/carte-cadeau";

const HOLD_DURATION_MS = 30 * 60 * 1000; // 30 min, cohérent avec la réservation normale

const carteCadeauSchema = z.object({
  prestationId: z.string().min(1),
  acheteurNom: z.string().trim().min(2, "Le nom est requis."),
  acheteurEmail: z.string().trim().email("Adresse e-mail invalide."),
  destinataireEmail: z.string().trim().email("Adresse e-mail du destinataire invalide."),
  message: z.string().trim().max(500).optional(),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = carteCadeauSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Champs invalides.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { prestationId, acheteurNom, acheteurEmail, destinataireEmail, message } = parsed.data;

  if (!isPrestationId(prestationId)) {
    return NextResponse.json({ error: "Prestation invalide." }, { status: 400 });
  }

  const prestation = prestations[prestationId];

  try {
    const carte = await prisma.carteCadeau.create({
      data: {
        code: genererCodeCarteCadeau(),
        prestationId,
        montantCentimes: prestation.prixCentimes,
        acheteurNom,
        acheteurEmail,
        destinataireEmail,
        message,
        statut: "EN_ATTENTE_PAIEMENT",
      },
    });

    try {
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "eur",
              unit_amount: prestation.prixCentimes,
              product: prestation.stripeProductId,
            },
            quantity: 1,
          },
        ],
        customer_email: acheteurEmail,
        expires_at: Math.floor((Date.now() + HOLD_DURATION_MS) / 1000),
        success_url: `${siteConfig.url}/offrir/confirmation?carte=${carte.id}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${siteConfig.url}/offrir?prestation=${prestationId}`,
        metadata: { carteCadeauId: carte.id },
      });

      if (!session.url) {
        throw new Error("STRIPE_SESSION_SANS_URL");
      }

      await prisma.carteCadeau.update({
        where: { id: carte.id },
        data: { stripeSessionId: session.id },
      });

      return NextResponse.json({ checkoutUrl: session.url }, { status: 201 });
    } catch (stripeError) {
      await prisma.carteCadeau.update({
        where: { id: carte.id },
        data: { statut: "ANNULEE" },
      });
      throw stripeError;
    }
  } catch (error) {
    console.error("Erreur lors de l'achat d'une carte cadeau :", error);
    return NextResponse.json(
      { error: "Une erreur est survenue. Merci de réessayer." },
      { status: 500 }
    );
  }
}
