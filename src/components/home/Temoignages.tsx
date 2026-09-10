import Container from "@/components/ui/Container";
import SectionTitle from "@/components/ui/SectionTitle";
import { temoignages } from "@/lib/site-config";

export default function Temoignages() {
  return (
    <section className="bg-parchment py-16 sm:py-24">
      <Container className="flex flex-col gap-10">
        <SectionTitle eyebrow="Avis" title="Ce qu'en disent les parents" />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {temoignages.map((temoignage) => (
            <figure
              key={temoignage.nom}
              className="flex flex-col gap-4 rounded-2xl border border-border bg-white/60 p-6"
            >
              <div
                aria-hidden="true"
                className="h-12 w-12 rounded-full bg-peach"
              />
              <blockquote className="text-sm text-body">
                &ldquo;{temoignage.texte}&rdquo;
              </blockquote>
              <figcaption className="text-sm font-semibold text-walnut">
                {temoignage.nom}
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
