"use client";

import { useEffect } from "react";
import Script from "next/script";
import Container from "@/components/ui/Container";
import SectionTitle from "@/components/ui/SectionTitle";
import DecorativeBlobs from "@/components/ui/DecorativeBlobs";

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

// Sélection manuelle de publications mises en avant (widget officiel
// Instagram, pas d'API/jeton nécessaire). Pour en changer, demandez à
// Isabelle les liens des nouveaux posts à afficher.
const POSTS = [
  "https://www.instagram.com/p/Dd9Y4mhAoAG/",
  "https://www.instagram.com/p/Ddn-sT0AbEu/",
  "https://www.instagram.com/p/Ddv7yAFANgx/",
];

export default function InstagramFeed() {
  useEffect(() => {
    // Si le script est déjà chargé (navigation entre pages côté client), il
    // faut retraiter manuellement les blockquotes nouvellement montées.
    window.instgrm?.Embeds.process();
  }, []);

  return (
    <section className="relative isolate overflow-hidden bg-parchment py-16 sm:py-24">
      <DecorativeBlobs variant={1} />
      <Container className="flex flex-col items-center gap-10">
        <SectionTitle eyebrow="Instagram" title="Suivez Cocon d'Isa" />

        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-3">
          {POSTS.map((url) => (
            <blockquote
              key={url}
              className="instagram-media"
              data-instgrm-permalink={url}
              data-instgrm-version="14"
              style={{ margin: 0, width: "100%" }}
            >
              <a href={url} target="_blank" rel="noopener noreferrer">
                Voir cette publication sur Instagram
              </a>
            </blockquote>
          ))}
        </div>

        <a
          href="https://www.instagram.com/cocondisa/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-accent hover:text-accent-hover"
        >
          Voir plus sur @cocondisa →
        </a>
      </Container>

      <Script
        src="https://www.instagram.com/embed.js"
        strategy="lazyOnload"
        onLoad={() => window.instgrm?.Embeds.process()}
      />
    </section>
  );
}
