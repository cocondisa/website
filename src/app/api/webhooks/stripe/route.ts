import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import {
  clientConfirmationEmail,
  EMAIL_FROM,
  notificationEmail,
  resend,
} from "@/lib/resend";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Europe/Paris",
});

const heureFormatter = new Intl.DateTimeFormat("fr-FR", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Paris",
});

async function confirmReservation(reservationId: string) {
  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
    include: { creneau: true },
  });

  if (!reservation || reservation.statut === "CONFIRMEE") return;

  await prisma.reservation.update({
    where: { id: reservationId },
    data: { statut: "CONFIRMEE" },
  });

  const dateFormatee = dateFormatter.format(reservation.creneau.date);
  const heureFormatee = heureFormatter.format(reservation.creneau.date);
  const notificationRecipient = process.env.NOTIFICATION_EMAIL;

  await Promise.allSettled([
    resend.emails.send({
      from: EMAIL_FROM,
      to: reservation.email,
      ...clientConfirmationEmail({
        nomComplet: reservation.nomComplet,
        dateFormatee,
        heureFormatee,
      }),
    }),
    notificationRecipient
      ? resend.emails.send({
          from: EMAIL_FROM,
          to: notificationRecipient,
          ...notificationEmail({
            nomComplet: reservation.nomComplet,
            email: reservation.email,
            telephone: reservation.telephone,
            infosBebe: reservation.infosBebe,
            message: reservation.message,
            dateFormatee,
            heureFormatee,
          }),
        })
      : Promise.resolve(),
  ]);
}

async function releaseReservation(reservationId: string) {
  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
  });

  if (!reservation || reservation.statut !== "EN_ATTENTE_PAIEMENT") return;

  await prisma.$transaction([
    prisma.reservation.update({
      where: { id: reservationId },
      data: { statut: "ANNULEE" },
    }),
    prisma.creneau.update({
      where: { id: reservation.creneauId },
      data: { disponible: true },
    }),
  ]);
}

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");
  const payload = await request.text();

  if (!webhookSecret || !signature) {
    return NextResponse.json({ error: "Webhook non configuré." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    console.error("Signature Stripe invalide :", error);
    return NextResponse.json({ error: "Signature invalide." }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const reservationId = session.metadata?.reservationId;
      if (reservationId) await confirmReservation(reservationId);
      break;
    }
    case "checkout.session.expired": {
      const session = event.data.object as Stripe.Checkout.Session;
      const reservationId = session.metadata?.reservationId;
      if (reservationId) await releaseReservation(reservationId);
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
