"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { siteConfig } from "@/lib/site-config";

/**
 * Logo par défaut : lockup large (desktop) + marque compacte (mobile),
 * fournis dans /public/brand. La version blanche du footer
 * (/public/logo-white.png) n'a pas encore été fournie : fallback texte
 * tant que le fichier est absent ou échoue à charger.
 */
export default function Logo({
  variant = "default",
  className = "",
}: {
  variant?: "default" | "white";
  className?: string;
}) {
  const [whiteLogoFailed, setWhiteLogoFailed] = useState(false);

  if (variant === "white") {
    if (whiteLogoFailed) {
      return (
        <Link
          href="/"
          className={`text-xl font-semibold tracking-tight text-parchment ${className}`}
        >
          {siteConfig.shortName}
        </Link>
      );
    }

    return (
      <Link href="/" className={`inline-flex items-center ${className}`}>
        <Image
          src="/logo-white.png"
          alt={siteConfig.name}
          width={160}
          height={48}
          className="h-9 w-auto sm:h-10"
          onError={() => setWhiteLogoFailed(true)}
        />
      </Link>
    );
  }

  return (
    <Link href="/" className={`inline-flex items-center ${className}`}>
      <Image
        src="/brand/logo.png"
        alt={siteConfig.name}
        width={2394}
        height={372}
        priority
        className="hidden h-10 w-auto sm:block sm:h-12"
      />
      <Image
        src="/brand/logoMobile.png"
        alt={siteConfig.name}
        width={310}
        height={372}
        priority
        className="h-10 w-auto sm:hidden"
      />
    </Link>
  );
}
