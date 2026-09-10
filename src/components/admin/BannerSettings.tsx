"use client";

import { FormEvent, useEffect, useState } from "react";
import Button from "@/components/ui/Button";

export default function BannerSettings() {
  const [actif, setActif] = useState(false);
  const [message, setMessage] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/admin/parametres")
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        setActif(data.parametres.bandeauActif);
        setMessage(data.parametres.bandeauMessage);
        setLoaded(true);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/admin/parametres", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bandeauActif: actif, bandeauMessage: message }),
      });

      setFeedback(res.ok ? "Enregistré." : "Impossible d'enregistrer.");
    } catch {
      setFeedback("Une erreur réseau est survenue.");
    } finally {
      setSaving(false);
    }
  }

  if (!loaded) {
    return <p className="text-sm text-body">Chargement…</p>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-2xl border border-border bg-white/60 p-6"
    >
      <label className="flex items-center gap-3 text-sm font-medium text-walnut">
        <input
          type="checkbox"
          checked={actif}
          onChange={(event) => setActif(event.target.checked)}
          className="h-4 w-4 accent-accent"
        />
        Afficher le bandeau en tête du site
      </label>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="bandeauMessage" className="text-sm font-medium text-walnut">
          Message du bandeau
        </label>
        <input
          id="bandeauMessage"
          type="text"
          maxLength={300}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Ex. : Fermeture exceptionnelle du 1er au 15 août"
          className="rounded-xl border border-border bg-parchment px-4 py-2.5 text-sm text-walnut focus:border-accent focus:outline-none"
        />
      </div>

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={saving}>
          {saving ? "Enregistrement…" : "Enregistrer"}
        </Button>
        {feedback && <p className="text-sm text-body">{feedback}</p>}
      </div>
    </form>
  );
}
