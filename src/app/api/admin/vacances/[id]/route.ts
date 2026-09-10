import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { regenererCreneauxAutomatiques } from "@/lib/generation-creneaux";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await prisma.vacances.delete({ where: { id } }).catch(() => null);
  await regenererCreneauxAutomatiques();

  return NextResponse.json({ ok: true });
}
