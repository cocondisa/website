import { Resend } from "resend";
import { contact, siteConfig } from "@/lib/site-config";

// Fallback factice pour ne pas casser le build quand la clé n'est pas encore
// définie (ex. CI, build local sans .env) ; en production, l'envoi échouera
// explicitement si RESEND_API_KEY est manquante ou invalide à l'exécution.
export const resend = new Resend(process.env.RESEND_API_KEY || "re_placeholder");

export const EMAIL_FROM = "Cocon d'Isa <reservation@cocondisa.fr>";

const LOGO_URL = `${siteConfig.url}/brand/logo.png`;
const PHOTO_ISABELLE_URL = `${siteConfig.url}/images/photo-profil.jpeg`;

// Les clients mail n'exécutent pas JS et n'ont pas de contexte d'échappement
// automatique comme le DOM : on échappe à la main tout ce qui vient de
// l'utilisateur avant de l'interpoler dans le HTML de l'e-mail.
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Habillage commun à tous les e-mails transactionnels : logo en en-tête,
 * contenu spécifique, puis pied de page avec photo d'Isabelle et contact.
 */
function emailLayout(contentHtml: string): string {
  return `
    <div style="background-color: #FDF8F3; padding: 32px 16px; font-family: -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 480px; margin: 0 auto; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; border: 1px solid #EDD9C9;">
        <tr>
          <td style="padding: 28px 32px 8px; text-align: center; background-color: #FDF8F3;">
            <img src="${LOGO_URL}" alt="${siteConfig.name}" width="160" style="display: inline-block; height: auto;" />
          </td>
        </tr>
        <tr>
          <td style="padding: 24px 32px 8px; color: #7A5F4A; font-size: 15px; line-height: 1.6;">
            ${contentHtml}
          </td>
        </tr>
        <tr>
          <td style="padding: 24px 32px 32px;">
            <hr style="border: none; border-top: 1px solid #EDD9C9; margin: 0 0 24px;" />
            <table role="presentation" cellpadding="0" cellspacing="0">
              <tr>
                <td style="vertical-align: middle; padding-right: 14px;">
                  <img src="${PHOTO_ISABELLE_URL}" alt="Isabelle" width="52" height="52" style="display: block; border-radius: 50%; object-fit: cover;" />
                </td>
                <td style="vertical-align: middle;">
                  <p style="margin: 0; font-size: 14px; color: #412B0B; font-weight: 600;">
                    Une question ?
                    <a href="mailto:${contact.email}" style="color: #E8825F; text-decoration: none; font-weight: 600;">Contactez-moi</a>
                  </p>
                  <p style="margin: 4px 0 0; font-size: 12px; color: #7A5F4A;">${siteConfig.name} — ${contact.adresseCabinet}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  `;
}

export function clientConfirmationEmail({
  nomComplet,
  dateFormatee,
  heureFormatee,
}: {
  nomComplet: string;
  dateFormatee: string;
  heureFormatee: string;
}) {
  const content = `
    <h1 style="color: #412B0B; font-size: 21px; margin: 0 0 16px;">Rendez-vous confirmé</h1>
    <p style="margin: 0 0 16px;">Bonjour ${escapeHtml(nomComplet)},</p>
    <p style="margin: 0 0 16px;">
      Votre rendez-vous pour <strong>Le bain enveloppé</strong> est confirmé
      le <strong>${escapeHtml(dateFormatee)}</strong> à <strong>${escapeHtml(heureFormatee)}</strong>.
    </p>
    <p style="margin: 0 0 20px;">Isabelle a hâte de vous accueillir avec votre bébé.</p>
    <div style="background-color: #FFD6C0; border-radius: 12px; padding: 16px 20px; margin: 0 0 8px;">
      <p style="margin: 0 0 8px; font-weight: 600; color: #412B0B;">À prévoir avant la séance</p>
      <p style="margin: 0;">
        Rien de particulier : Isabelle fournit tout le nécessaire (couches, cotons,
        produits de toilette...). Pensez simplement à prévoir des affaires de
        rechange pour bébé.
      </p>
    </div>
  `;

  return {
    subject: "Votre rendez-vous Cocon d'Isa est confirmé",
    html: emailLayout(content),
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
  const content = `
    <h1 style="color: #412B0B; font-size: 21px; margin: 0 0 16px;">Nouvelle réservation</h1>
    <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; font-size: 14px;">
      <tr><td style="padding: 4px 0; color: #412B0B; font-weight: 600; width: 110px;">Date</td><td style="padding: 4px 0;">${escapeHtml(dateFormatee)} à ${escapeHtml(heureFormatee)}</td></tr>
      <tr><td style="padding: 4px 0; color: #412B0B; font-weight: 600;">Nom</td><td style="padding: 4px 0;">${escapeHtml(nomComplet)}</td></tr>
      <tr><td style="padding: 4px 0; color: #412B0B; font-weight: 600;">E-mail</td><td style="padding: 4px 0;">${escapeHtml(email)}</td></tr>
      <tr><td style="padding: 4px 0; color: #412B0B; font-weight: 600;">Téléphone</td><td style="padding: 4px 0;">${escapeHtml(telephone)}</td></tr>
      ${infosBebe ? `<tr><td style="padding: 4px 0; color: #412B0B; font-weight: 600;">Infos bébé</td><td style="padding: 4px 0;">${escapeHtml(infosBebe)}</td></tr>` : ""}
      ${message ? `<tr><td style="padding: 4px 0; color: #412B0B; font-weight: 600;">Message</td><td style="padding: 4px 0;">${escapeHtml(message)}</td></tr>` : ""}
    </table>
  `;

  return {
    subject: `Nouvelle réservation — ${dateFormatee} à ${heureFormatee}`,
    html: emailLayout(content),
  };
}
