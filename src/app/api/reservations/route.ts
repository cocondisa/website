import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  clientConfirmationEmail,
  EMAIL_FROM,
  notificationEmail,
  resend,
} from "@/lib/resend";

const reservationSchema = z.object({
  creneauId: z.string().min(1, "Créneau invalide."),
  nomComplet: z.string().trim().min(2, "Le nom est requis."),
  email: z.string().trim().email("Adresse e-mail invalide."),
  telephone: z.string().trim().min(6, "Numéro de téléphone invalide."),
  infosBebe: z.string().trim().max(500).optional(),
  message: z.string().trim().max(1000).optional(),
});

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

  let creneau;
  try {
    const result = await prisma.$transaction(async (tx) => {
      const found = await tx.creneau.findUnique({ where: { id: creneauId } });

      if (!found || !found.disponible) {
        throw new Error("CRENEAU_INDISPONIBLE");
      }

      await tx.creneau.update({
        where: { id: creneauId },
        data: { disponible: false },
      });

      const reservation = await tx.reservation.create({
        data: { creneauId, nomComplet, email, telephone, infosBebe, message },
      });

      return { reservation, creneau: found };
    });

    creneau = result.creneau;

    const dateFormatee = dateFormatter.format(creneau.date);
    const heureFormatee = heureFormatter.format(creneau.date);

    const notificationRecipient = process.env.NOTIFICATION_EMAIL;

    await Promise.allSettled([
      resend.emails.send({
        from: EMAIL_FROM,
        to: email,
        ...clientConfirmationEmail({ nomComplet, dateFormatee, heureFormatee }),
      }),
      notificationRecipient
        ? resend.emails.send({
            from: EMAIL_FROM,
            to: notificationRecipient,
            ...notificationEmail({
              nomComplet,
              email,
              telephone,
              infosBebe,
              message,
              dateFormatee,
              heureFormatee,
            }),
          })
        : Promise.resolve(),
    ]);

    return NextResponse.json(
      { reservationId: result.reservation.id },
      { status: 201 }
    );
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "CRENEAU_INDISPONIBLE"
    ) {
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
