"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { siteConfig } from "@/lib/site-config";

/**
 * Le fichier /public/logo.png (et /public/logo-white.png pour le footer)
 * n'est pas encore fourni : on retombe sur un logo texte tant que
 * l'image n'est pas disponible ou si elle échoue à charger.
 */
export default function Logo({
  variant = "default",
  className = "",
}: {
  variant?: "default" | "white";
  className?: string;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const src = variant === "white" ? "/logo-white.png" : "/logo.png";

  if (imageFailed) {
    return (
      <Link
        href="/"
        className={`font-semibold text-xl tracking-tight ${
          variant === "white" ? "text-parchment" : "text-walnut"
        } ${className}`}
      >
        {siteConfig.shortName}
      </Link>
    );
  }

  return (
    <Link href="/" className={`inline-flex items-center ${className}`}>
      <Image
        src={src}
        alt={siteConfig.name}
        width={160}
        height={48}
        priority
        className="h-10 w-auto sm:h-12"
        onError={() => setImageFailed(true)}
      />
    </Link>
  );
}
