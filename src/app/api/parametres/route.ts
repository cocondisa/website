import { NextResponse } from "next/server";
import { getParametres } from "@/lib/parametres";

export async function GET() {
  try {
    const parametres = await getParametres();
    return NextResponse.json({
      bandeauActif: parametres.bandeauActif,
      bandeauMessage: parametres.bandeauMessage,
    });
  } catch (error) {
    console.error("Erreur /api/parametres :", error);
    return NextResponse.json(
      {
        error: "DEBUG_TEMP",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
