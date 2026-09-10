import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Placeholder généré dynamiquement (logo sur fond Peach Fuzz) en attendant
// un vrai visuel (photo) à remplacer plus tard.
export default async function OgImage() {
  const logoBuffer = await readFile(
    join(process.cwd(), "public/brand/logo.png")
  );
  const logoSrc = `data:image/png;base64,${logoBuffer.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FFD6C0",
        }}
      >
        <img src={logoSrc} width={640} height={99} alt="" />
        <div style={{ fontSize: 28, color: "#7A5F4A", marginTop: 24 }}>
          Le bain enveloppé pour nouveau-nés
        </div>
      </div>
    ),
    { ...size }
  );
}
