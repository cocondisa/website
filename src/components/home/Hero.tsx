import { ButtonLink } from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import PlaceholderImage from "@/components/ui/PlaceholderImage";

export default function Hero() {
  return (
    <section className="bg-parchment">
      <Container className="grid grid-cols-1 items-center gap-10 py-16 sm:py-20 lg:grid-cols-2 lg:py-28">
        <div className="flex flex-col gap-6">
          <span className="text-sm font-semibold uppercase tracking-widest text-sage">
            Bien-être pour jeunes mamans &amp; nouveau-nés
          </span>
          <h1 className="text-4xl font-semibold leading-tight text-walnut sm:text-5xl">
            Un cocon de douceur pour votre nouveau-né
          </h1>
          <p className="max-w-lg text-lg text-body">
            Cocon d&apos;Isa accompagne les tout-petits (0 à 2 mois) et leurs
            parents avec le bain enveloppé, un moment d&apos;apaisement
            profond et de connexion.
          </p>
          <div>
            <ButtonLink href="/rendez-vous">Réserver un bain enveloppé</ButtonLink>
          </div>
        </div>

        <PlaceholderImage
          label="[PHOTO À VENIR — portrait chaleureux maman/bébé]"
          className="aspect-[4/5] w-full"
        />
      </Container>
    </section>
  );
}
