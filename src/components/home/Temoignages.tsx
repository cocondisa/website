import Container from "@/components/ui/Container";
import SectionTitle from "@/components/ui/SectionTitle";
import DecorativeBlobs from "@/components/ui/DecorativeBlobs";
import { temoignages } from "@/lib/site-config";

function getInitials(nom: string) {
  return nom
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function Temoignages() {
  return (
    <section className="relative isolate overflow-hidden bg-parchment py-16 sm:py-24">
      <DecorativeBlobs variant={4} />
      <Container className="flex flex-col gap-10">
        <SectionTitle eyebrow="Avis" title="Ce qu'en disent les parents" />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {temoignages.map((temoignage) => (
            <figure
              key={temoignage.nom}
              className="flex flex-col gap-4 rounded-2xl border border-border bg-white/60 p-6"
            >
              <div
                aria-label={`Note : ${temoignage.note} sur 5`}
                className="flex gap-0.5 text-accent"
              >
                {Array.from({ length: temoignage.note }).map((_, index) => (
                  <span key={index} aria-hidden="true">
                    ★
                  </span>
                ))}
              </div>
              <blockquote className="text-sm text-body">
                &ldquo;{temoignage.texte}&rdquo;
              </blockquote>
              <figcaption className="mt-auto flex items-center gap-3">
                <div
                  aria-hidden="true"
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-peach text-sm font-semibold text-walnut"
                >
                  {getInitials(temoignage.nom)}
                </div>
                <span className="text-sm font-semibold text-walnut">
                  {temoignage.nom}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
