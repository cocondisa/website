"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Compteur de vues agrégé, pas de suivi par visiteur ni cookie : on ignore
// simplement l'espace admin pour ne compter que les pages publiques.
export default function ViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;

    fetch("/api/track-view", { method: "POST" }).catch(() => {});
  }, [pathname]);

  return null;
}
