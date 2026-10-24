"use client";

import { useEffect, useState } from "react";

type Stats = {
  total: number;
  aujourdHui: number;
  sept_jours: number;
  trente_jours: number;
};

export default function StatsVues() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/admin/stats/vues")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setStats(data);
      })
      .catch(() => {
        if (!cancelled) setError("Impossible de charger les statistiques de vues.");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return <p className="text-sm text-error">{error}</p>;
  }

  const tuiles: { label: string; valeur: number | null }[] = [
    { label: "Aujourd'hui", valeur: stats?.aujourdHui ?? null },
    { label: "7 derniers jours", valeur: stats?.sept_jours ?? null },
    { label: "30 derniers jours", valeur: stats?.trente_jours ?? null },
    { label: "Total", valeur: stats?.total ?? null },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {tuiles.map((t) => (
        <div
          key={t.label}
          className="flex flex-col gap-1 rounded-2xl border border-border bg-white/60 p-4 text-center"
        >
          <span className="text-2xl font-semibold text-accent">
            {t.valeur === null ? "…" : t.valeur.toLocaleString("fr-FR")}
          </span>
          <span className="text-xs text-body">{t.label}</span>
        </div>
      ))}
    </div>
  );
}
