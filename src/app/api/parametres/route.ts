import { NextResponse } from "next/server";
import { getParametres } from "@/lib/parametres";

export async function GET() {
  const parametres = await getParametres();
  return NextResponse.json({
    bandeauActif: parametres.bandeauActif,
    bandeauMessage: parametres.bandeauMessage,
  });
}
