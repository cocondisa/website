"use client";

import { useState } from "react";
import Container from "@/components/ui/Container";
import SectionTitle from "@/components/ui/SectionTitle";
import DecorativeBlobs from "@/components/ui/DecorativeBlobs";
import { faq } from "@/lib/site-config";

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="relative isolate overflow-hidden bg-peach/40 py-16 sm:py-24">
      <DecorativeBlobs variant={2} />
      <Container className="flex flex-col gap-10">
        <SectionTitle eyebrow="Questions fréquentes" title="Tout ce qu'il faut savoir" />

        <div className="mx-auto w-full max-w-2xl divide-y divide-border rounded-2xl border border-border bg-parchment">
          {faq.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={item.question}>
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${index}`}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-base font-medium text-walnut focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
                  >
                    {item.question}
                    <span aria-hidden="true" className="text-accent">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                </h3>
                {isOpen && (
                  <div id={`faq-panel-${index}`} className="px-6 pb-5 text-sm text-body">
                    {item.reponse}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
