import type { Config } from "tailwindcss";

// Palette "Cocon d'Isa" — définie en variables CSS (triplets RGB) dans
// src/app/globals.css pour pouvoir être ajustée sans toucher à ce fichier.
// On passe par rgb(var(--x) / <alpha-value>) plutôt qu'une référence var()
// directe : c'est le seul format que Tailwind sait décomposer pour injecter
// un canal alpha, donc celui qui rend les modificateurs d'opacité
// (bg-accent/25, text-parchment/80...) fonctionnels.
function withOpacity(variableName: string) {
  return ({ opacityValue }: { opacityValue?: string }) =>
    opacityValue !== undefined
      ? `rgb(var(${variableName}) / ${opacityValue})`
      : `rgb(var(${variableName}))`;
}

// Le type Config de @types/tailwindcss ne modélise pas les valeurs de
// couleur sous forme de fonction (le format documenté par Tailwind pour le
// support de l'opacité) : on type donc l'objet littéralement, puis on le
// caste en Config à l'export plutôt qu'au niveau de chaque couleur.
const config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: withOpacity("--color-parchment"),
        peach: withOpacity("--color-peach"),
        border: withOpacity("--color-border"),
        walnut: withOpacity("--color-walnut"),
        body: withOpacity("--color-text"),
        accent: {
          DEFAULT: withOpacity("--color-accent"),
          hover: withOpacity("--color-accent-hover"),
        },
        sage: withOpacity("--color-sage"),
        success: withOpacity("--color-success"),
        error: withOpacity("--color-error"),
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
    },
  },
  plugins: [],
};

export default config as unknown as Config;
