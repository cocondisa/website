import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { Prisma } from "@prisma/client";
import { legal, siteConfig, bainEnveloppe } from "@/lib/site-config";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Europe/Paris",
});

/**
 * Numéro de facture séquentiel, remis à 1 chaque année civile (ex. "2026-0001").
 * Doit être appelé à l'intérieur d'une transaction pour rester sans trou même
 * en cas de confirmations simultanées.
 */
export async function genererNumeroFacture(
  tx: Prisma.TransactionClient
): Promise<string> {
  const annee = new Date().getFullYear();
  const parametres = await tx.parametres.findUnique({ where: { id: "default" } });

  const prochainNumero =
    parametres?.anneeNumeroFacture === annee
      ? parametres.prochainNumeroFacture
      : 1;

  await tx.parametres.upsert({
    where: { id: "default" },
    update: { prochainNumeroFacture: prochainNumero + 1, anneeNumeroFacture: annee },
    create: {
      id: "default",
      prochainNumeroFacture: prochainNumero + 1,
      anneeNumeroFacture: annee,
    },
  });

  return `${annee}-${String(prochainNumero).padStart(4, "0")}`;
}

export async function genererFacturePdf({
  numero,
  nomClient,
  emailClient,
  datePrestation,
  montantCentimes,
}: {
  numero: string;
  nomClient: string;
  emailClient: string;
  datePrestation: Date;
  montantCentimes: number;
}): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595.28, 841.89]); // A4
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

  const walnut = rgb(0.25, 0.17, 0.04);
  const body = rgb(0.3, 0.24, 0.18);
  const accent = rgb(0.91, 0.51, 0.37);

  const margin = 56;
  let y = 841.89 - margin;

  const montantEuros = (montantCentimes / 100).toFixed(2).replace(".", ",");

  function line(
    text: string,
    { size = 11, bold = false, color = body, x = margin }: {
      size?: number;
      bold?: boolean;
      color?: ReturnType<typeof rgb>;
      x?: number;
    } = {}
  ) {
    page.drawText(text, { x, y, size, font: bold ? fontBold : font, color });
  }

  line("FACTURE", { size: 24, bold: true, color: walnut });
  y -= 20;
  line(`N° ${numero}`, { size: 11, color: accent, bold: true });
  y -= 14;
  line(`Émise le ${dateFormatter.format(new Date())}`, { size: 10 });
  y -= 40;

  line("Émetteur", { size: 10, bold: true, color: walnut });
  y -= 16;
  line(legal.raisonSociale, { size: 11 });
  y -= 14;
  line(legal.statut, { size: 10 });
  y -= 14;
  line(`SIRET : ${legal.siret}`, { size: 10 });
  y -= 14;
  line(legal.adresseSiege, { size: 10 });
  y -= 40;

  line("Client", { size: 10, bold: true, color: walnut });
  y -= 16;
  line(nomClient, { size: 11 });
  y -= 14;
  line(emailClient, { size: 10 });
  y -= 40;

  // Tableau (une seule prestation)
  const colDescription = margin;
  const colDate = 330;
  const colMontant = 470;

  line("Prestation", { size: 10, bold: true, color: walnut, x: colDescription });
  line("Date", { size: 10, bold: true, color: walnut, x: colDate });
  line("Montant TTC", { size: 10, bold: true, color: walnut, x: colMontant });
  y -= 6;
  page.drawLine({
    start: { x: margin, y },
    end: { x: 595.28 - margin, y },
    thickness: 0.75,
    color: rgb(0.86, 0.78, 0.7),
  });
  y -= 18;

  line(bainEnveloppe.nom, { size: 10, x: colDescription });
  line(dateFormatter.format(datePrestation), { size: 10, x: colDate });
  line(`${montantEuros} €`, { size: 10, x: colMontant });
  y -= 30;

  page.drawLine({
    start: { x: margin, y },
    end: { x: 595.28 - margin, y },
    thickness: 0.75,
    color: rgb(0.86, 0.78, 0.7),
  });
  y -= 24;

  line("Total TTC", { size: 12, bold: true, color: walnut, x: colDate });
  line(`${montantEuros} €`, { size: 12, bold: true, color: walnut, x: colMontant });
  y -= 30;

  line("TVA non applicable, art. 293 B du CGI.", { size: 9 });
  y -= 14;
  line("Facture acquittée — paiement reçu par carte bancaire.", { size: 9 });

  // Pied de page
  page.drawText(`${siteConfig.name} — ${legal.adresseSiege}`, {
    x: margin,
    y: 40,
    size: 8,
    font,
    color: rgb(0.6, 0.55, 0.5),
  });

  return doc.save();
}
