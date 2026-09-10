import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site-config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Placeholder généré dynamiquement en attendant un vrai visuel (photo + logo).
export default function OgImage() {
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
        <div
          style={{
            fontSize: 72,
            fontWeight: 600,
            color: "#412B0B",
          }}
        >
          {siteConfig.name}
        </div>
        <div style={{ fontSize: 28, color: "#7A5F4A", marginTop: 16 }}>
          Le bain enveloppé pour nouveau-nés
        </div>
      </div>
    ),
    { ...size }
  );
}
