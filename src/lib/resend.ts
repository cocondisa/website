import { Resend } from "resend";

// Fallback factice pour ne pas casser le build quand la clé n'est pas encore
// définie (ex. CI, build local sans .env) ; en production, l'envoi échouera
// explicitement si RESEND_API_KEY est manquante ou invalide à l'exécution.
export const resend = new Resend(process.env.RESEND_API_KEY || "re_placeholder");

export const EMAIL_FROM = "Cocon d'Isa <reservation@cocondisa.fr>";

export function clientConfirmationEmail({
  nomComplet,
  dateFormatee,
  heureFormatee,
}: {
  nomComplet: string;
  dateFormatee: string;
  heureFormatee: string;
}) {
  return {
    subject: "Votre rendez-vous Cocon d'Isa est confirmé",
    html: `
      <div style="font-family: sans-serif; background-color: #FDF8F3; padding: 32px; color: #7A5F4A;">
        <h1 style="color: #412B0B; font-size: 22px;">Rendez-vous confirmé</h1>
        <p>Bonjour ${nomComplet},</p>
        <p>
          Votre rendez-vous pour <strong>Le bain enveloppé</strong> est confirmé
          le <strong>${dateFormatee}</strong> à <strong>${heureFormatee}</strong>.
        </p>
        <p>Isabelle a hâte de vous accueillir avec votre bébé.</p>
        <p style="margin-top: 32px; font-size: 12px; color: #7A5F4A;">Cocon d'Isa</p>
      </div>
    `,
  };
}

export function notificationEmail({
  nomComplet,
  email,
  telephone,
  infosBebe,
  message,
  dateFormatee,
  heureFormatee,
}: {
  nomComplet: string;
  email: string;
  telephone: string;
  infosBebe?: string | null;
  message?: string | null;
  dateFormatee: string;
  heureFormatee: string;
}) {
  return {
    subject: `Nouvelle réservation — ${dateFormatee} à ${heureFormatee}`,
    html: `
      <div style="font-family: sans-serif; background-color: #FDF8F3; padding: 32px; color: #7A5F4A;">
        <h1 style="color: #412B0B; font-size: 22px;">Nouvelle réservation</h1>
        <ul>
          <li><strong>Date :</strong> ${dateFormatee} à ${heureFormatee}</li>
          <li><strong>Nom :</strong> ${nomComplet}</li>
          <li><strong>Email :</strong> ${email}</li>
          <li><strong>Téléphone :</strong> ${telephone}</li>
          ${infosBebe ? `<li><strong>Infos bébé :</strong> ${infosBebe}</li>` : ""}
          ${message ? `<li><strong>Message :</strong> ${message}</li>` : ""}
        </ul>
      </div>
    `,
  };
}
