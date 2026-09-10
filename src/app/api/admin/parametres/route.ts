import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getParametres } from "@/lib/parametres";

export async function GET() {
  const parametres = await getParametres();
  return NextResponse.json({ parametres });
}

const updateSchema = z.object({
  bandeauActif: z.boolean(),
  bandeauMessage: z.string().trim().max(300),
});

export async function PATCH(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Champs invalides." }, { status: 400 });
  }

  const parametres = await prisma.parametres.upsert({
    where: { id: "default" },
    update: parsed.data,
    create: { id: "default", ...parsed.data },
  });

  return NextResponse.json({ parametres });
}
