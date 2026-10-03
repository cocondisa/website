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

        <div className="-mx-4 flex w-full snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 sm:snap-none">
          {POSTS.map((url) => (
            <div key={url} className="w-[80%] shrink-0 snap-center sm:w-auto sm:shrink">
              <blockquote
                className="instagram-media"
                data-instgrm-permalink={url}
                data-instgrm-version="14"
                style={{ margin: 0, width: "100%" }}
              >
                <a href={url} target="_blank" rel="noopener noreferrer">
                  Voir cette publication sur Instagram
                </a>
              </blockquote>
            </div>
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
