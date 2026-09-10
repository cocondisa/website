"use client";

import { useEffect, useState } from "react";

export default function AnnouncementBanner() {
  const [banner, setBanner] = useState<{ bandeauActif: boolean; bandeauMessage: string } | null>(
    null
  );

  useEffect(() => {
    let cancelled = false;

    fetch("/api/parametres")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data) setBanner(data);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  if (!banner?.bandeauActif || !banner.bandeauMessage) return null;

  return (
    <div className="bg-accent px-4 py-2.5 text-center text-sm font-medium text-parchment">
      {banner.bandeauMessage}
    </div>
  );
}
