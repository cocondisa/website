import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Téléchargement de la facture PDF d'une réservation, pour l'archivage
// comptable d'Isabelle depuis /admin.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ reservationId: string }> }
) {
  const { reservationId } = await params;

  const facture = await prisma.facture.findUnique({
    where: { reservationId },
  });

  if (!facture) {
    return NextResponse.json({ error: "Facture introuvable." }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(facture.pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="facture-${facture.numero}.pdf"`,
    },
  });
}
