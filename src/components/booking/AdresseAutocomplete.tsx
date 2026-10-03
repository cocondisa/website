"use client";

import { useEffect, useRef, useState } from "react";

type Suggestion = { label: string };

export default function AdresseAutocomplete({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.trim().length < 4) {
      return;
    }

    debounceRef.current = setTimeout(() => {
      fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(value)}&limit=5`)
        .then((res) => res.json())
        .then((data: { features: { properties: { label: string } }[] }) => {
          setSuggestions(data.features.map((f) => ({ label: f.properties.label })));
        })
        .catch(() => setSuggestions([]));
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value]);

  return (
    <div className="relative flex flex-col gap-1.5">
      <label htmlFor="adresse" className="text-sm font-medium text-walnut">
        Adresse où Isabelle doit se rendre <span className="text-error">*</span>
      </label>
      <input
        id="adresse"
        name="adresse"
        type="text"
        required
        autoComplete="off"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder="Numéro, rue, ville…"
        className="rounded-xl border border-border bg-parchment px-4 py-2.5 text-sm text-walnut focus:border-accent focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
      />
      {open && value.trim().length >= 4 && suggestions.length > 0 && (
        <ul className="absolute top-full z-10 mt-1 w-full overflow-hidden rounded-xl border border-border bg-parchment shadow-md">
          {suggestions.map((s) => (
            <li key={s.label}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onChange(s.label);
                  setSuggestions([]);
                  setOpen(false);
                }}
                className="block w-full px-4 py-2 text-left text-sm text-walnut hover:bg-peach/40"
              >
                {s.label}
              </button>
            </li>
          ))}
        </ul>
      )}
      <p className="text-xs text-body">
        100 € à moins de 20 km de Tournefeuille, 115 € entre 20 et 35 km. Au-delà, Isabelle ne se déplace pas.
      </p>
    </div>
  );
}
