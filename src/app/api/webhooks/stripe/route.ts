import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import {
  clientConfirmationEmail,
  EMAIL_FROM,
  notificationEmail,
  carteCadeauDestinataireEmail,
  carteCadeauAcheteurEmail,
  carteCadeauNotificationEmail,
  resend,
} from "@/lib/resend";
import { genererFacturePdf, genererNumeroFacture } from "@/lib/facture";
import { prestations, type PrestationId } from "@/lib/prestations";

const VALIDITE_CARTE_CADEAU_JOURS = 366; // > 1 an, minimum légal en France

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

async function confirmReservation(reservationId: string, montantTotalCentimes: number | null) {
  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
    include: { creneau: true },
  });

  if (!reservation || reservation.statut === "CONFIRMEE") return;

  const prestation = prestations[reservation.creneau.prestationId as PrestationId];

  // Le montant réellement payé (après code promo éventuel) vient de la
  // session Stripe ; à défaut on retombe sur le tarif plein configuré.
  const montantCentimes = montantTotalCentimes ?? prestation.prixCentimes;

  const numero = await prisma.$transaction(async (tx) => {
    await tx.reservation.update({
      where: { id: reservationId },
      data: { statut: "CONFIRMEE" },
    });
    return genererNumeroFacture(tx);
  });

  const facturePdf = await genererFacturePdf({
    numero,
    nomClient: reservation.nomComplet,
    emailClient: reservation.email,
    datePrestation: reservation.creneau.date,
    montantCentimes,
    nomPrestation: prestation.nom,
  });

  await prisma.facture.create({
    data: {
      numero,
      reservationId,
      pdf: Buffer.from(facturePdf),
    },
  });

  const dateFormatee = dateFormatter.format(reservation.creneau.date);
  const heureFormatee = heureFormatter.format(reservation.creneau.date);
  const notificationRecipient = process.env.NOTIFICATION_EMAIL;
  const factureAttachment = {
    filename: `facture-${numero}.pdf`,
    content: Buffer.from(facturePdf),
    content_type: "application/pdf",
  };

  await Promise.allSettled([
    resend.emails.send({
      from: EMAIL_FROM,
      to: reservation.email,
      attachments: [factureAttachment],
      ...clientConfirmationEmail({
        nomComplet: reservation.nomComplet,
        nomPrestation: prestation.nom,
        dateFormatee,
        heureFormatee,
        afficherPreparationBain: prestation.id === "bain-enveloppe",
      }),
    }),
    notificationRecipient
      ? resend.emails.send({
          from: EMAIL_FROM,
          to: notificationRecipient,
          attachments: [factureAttachment],
          ...notificationEmail({
            nomComplet: reservation.nomComplet,
            nomPrestation: prestation.nom,
            email: reservation.email,
            telephone: reservation.telephone,
            infosBebe: reservation.infosBebe,
            message: reservation.message,
            adresseClient: reservation.adresseClient,
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

async function confirmCarteCadeau(carteCadeauId: string, montantTotalCentimes: number | null) {
  const carte = await prisma.carteCadeau.findUnique({ where: { id: carteCadeauId } });

  if (!carte || carte.statut !== "EN_ATTENTE_PAIEMENT") return;

  const prestation = prestations[carte.prestationId as PrestationId];
  const montantCentimes = montantTotalCentimes ?? carte.montantCentimes;
  const expiresAt = new Date(Date.now() + VALIDITE_CARTE_CADEAU_JOURS * 24 * 60 * 60 * 1000);

  const numero = await prisma.$transaction(async (tx) => {
    await tx.carteCadeau.update({
      where: { id: carteCadeauId },
      data: { statut: "ACTIVE", expiresAt },
    });
    return genererNumeroFacture(tx);
  });

  const facturePdf = await genererFacturePdf({
    numero,
    nomClient: carte.acheteurNom,
    emailClient: carte.acheteurEmail,
    datePrestation: carte.createdAt,
    montantCentimes,
    nomPrestation: `Carte cadeau — ${prestation.nom}`,
  });

  await prisma.facture.create({
    data: { numero, carteCadeauId, pdf: Buffer.from(facturePdf) },
  });

  const dateExpirationFormatee = dateFormatter.format(expiresAt);
  const notificationRecipient = process.env.NOTIFICATION_EMAIL;
  const factureAttachment = {
    filename: `facture-${numero}.pdf`,
    content: Buffer.from(facturePdf),
    content_type: "application/pdf",
  };

  await Promise.allSettled([
    resend.emails.send({
      from: EMAIL_FROM,
      to: carte.destinataireEmail,
      ...carteCadeauDestinataireEmail({
        acheteurNom: carte.acheteurNom,
        nomPrestation: prestation.nom,
        code: carte.code,
        message: carte.message,
        dateExpirationFormatee,
      }),
    }),
    resend.emails.send({
      from: EMAIL_FROM,
      to: carte.acheteurEmail,
      attachments: [factureAttachment],
      ...carteCadeauAcheteurEmail({
        nomPrestation: prestation.nom,
        destinataireEmail: carte.destinataireEmail,
        code: carte.code,
      }),
    }),
    notificationRecipient
      ? resend.emails.send({
          from: EMAIL_FROM,
          to: notificationRecipient,
          ...carteCadeauNotificationEmail({
            nomPrestation: prestation.nom,
            code: carte.code,
            acheteurNom: carte.acheteurNom,
            acheteurEmail: carte.acheteurEmail,
            destinataireEmail: carte.destinataireEmail,
            montantEuros: (montantCentimes / 100).toFixed(2).replace(".", ","),
          }),
        })
      : Promise.resolve(),
  ]);
}

async function releaseCarteCadeau(carteCadeauId: string) {
  await prisma.carteCadeau.updateMany({
    where: { id: carteCadeauId, statut: "EN_ATTENTE_PAIEMENT" },
    data: { statut: "ANNULEE" },
  });
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
      const carteCadeauId = session.metadata?.carteCadeauId;
      if (reservationId) await confirmReservation(reservationId, session.amount_total);
      if (carteCadeauId) await confirmCarteCadeau(carteCadeauId, session.amount_total);
      break;
    }
    case "checkout.session.expired": {
      const session = event.data.object as Stripe.Checkout.Session;
      const reservationId = session.metadata?.reservationId;
      const carteCadeauId = session.metadata?.carteCadeauId;
      if (reservationId) await releaseReservation(reservationId);
      if (carteCadeauId) await releaseCarteCadeau(carteCadeauId);
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
