"use client";

import { useEffect, useState } from "react";
import { prestations, type PrestationId } from "@/lib/prestations";

type CarteCadeauAdmin = {
  id: string;
  code: string;
  prestationId: string;
  montantCentimes: number;
  acheteurNom: string;
  acheteurEmail: string;
  destinataireEmail: string;
  message: string | null;
  statut: "ACTIVE" | "UTILISEE" | "ANNULEE";
  expiresAt: string | null;
  createdAt: string;
  facture: { id: string } | null;
};

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const statutLabels: Record<string, { label: string; className: string }> = {
  ACTIVE: { label: "Active — non utilisée", className: "bg-peach/60 text-walnut" },
  UTILISEE: { label: "Utilisée", className: "bg-success/20 text-success" },
  ANNULEE: { label: "Annulée", className: "bg-error/10 text-error" },
};

export default function CartesCadeauxList() {
  const [cartes, setCartes] = useState<CarteCadeauAdmin[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/admin/cartes-cadeaux")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setCartes(data.cartes);
      })
      .catch(() => {
        if (!cancelled) setError("Impossible de charger les cartes cadeaux.");
      });

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  async function marquerUtilisee(id: string) {
    if (!confirm("Marquer cette carte cadeau comme utilisée ?")) return;

    const res = await fetch(`/api/admin/cartes-cadeaux/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ statut: "UTILISEE" }),
    });
    if (!res.ok) {
      alert("Impossible de mettre à jour cette carte cadeau.");
      return;
    }
    setRefreshKey((k) => k + 1);
  }

  if (error) return <p className="text-sm text-error">{error}</p>;
  if (!cartes) return <p className="text-sm text-body">Chargement…</p>;
  if (cartes.length === 0) {
    return <p className="text-sm text-body">Aucune carte cadeau vendue pour le moment.</p>;
  }

  return (
    <div className="flex max-h-[32rem] flex-col divide-y divide-border overflow-y-auto rounded-2xl border border-border bg-white/60">
      {cartes.map((carte) => {
        const statut = statutLabels[carte.statut];
        const nomPrestation = prestations[carte.prestationId as PrestationId]?.nom ?? carte.prestationId;

        return (
          <div
            key={carte.id}
            className="flex flex-wrap items-center justify-between gap-3 px-6 py-4"
          >
            <div>
              <p className="text-sm font-semibold text-walnut">
                {carte.code} — {nomPrestation}
              </p>
              <p className="text-xs text-body">
                {carte.acheteurNom} ({carte.acheteurEmail}) offre à {carte.destinataireEmail}
              </p>
              <p className="text-xs text-body">
                Achetée le {dateFormatter.format(new Date(carte.createdAt))}
                {carte.expiresAt && ` — valable jusqu'au ${dateFormatter.format(new Date(carte.expiresAt))}`}
              </p>
              {carte.message && (
                <p className="mt-1 text-xs italic text-body">« {carte.message} »</p>
              )}
            </div>

            <div className="flex items-center gap-3">
              {statut && (
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statut.className}`}>
                  {statut.label}
                </span>
              )}
              {carte.facture && (
                <a
                  href={`/api/admin/factures-cadeaux/${carte.id}`}
                  className="text-sm text-walnut underline underline-offset-4"
                >
                  Facture
                </a>
              )}
              {carte.statut === "ACTIVE" && (
                <button
                  type="button"
                  onClick={() => marquerUtilisee(carte.id)}
                  className="text-sm text-accent underline underline-offset-4"
                >
                  Marquer utilisée
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
