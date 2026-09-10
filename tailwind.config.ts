import type { Config } from "tailwindcss";

// Palette "Cocon d'Isa" — définie en variables CSS dans src/app/globals.css
// pour pouvoir être ajustée sans toucher à ce fichier.
const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: "var(--color-parchment)",
        peach: "var(--color-peach)",
        border: "var(--color-border)",
        walnut: "var(--color-walnut)",
        body: "var(--color-text)",
        accent: {
          DEFAULT: "var(--color-accent)",
          hover: "var(--color-accent-hover)",
        },
        sage: "var(--color-sage)",
        success: "var(--color-success)",
        error: "var(--color-error)",
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

export default config;
