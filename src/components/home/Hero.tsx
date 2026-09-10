import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import Container from "@/components/ui/Container";

const heroAlt = "Moment de bain enveloppé entre un parent et son nouveau-né";

export default function Hero() {
  return (
    <section className="bg-parchment">
      {/* Mobile / tablette : image plein cadre, texte superposé */}
      <div className="relative aspect-[4/5] w-full overflow-hidden lg:hidden">
        <Image
          src="/images/enveloppement.jpeg"
          alt={heroAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-top"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-walnut from-10% via-walnut/85 via-55% to-walnut/10"
        />
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 px-4 pb-10 pt-20 sm:px-6">
          <span className="text-sm font-semibold uppercase tracking-widest text-peach">
            Bien-être pour jeunes parents &amp; nouveau-nés
          </span>
          <h1 className="text-4xl font-bold leading-tight text-parchment sm:text-5xl">
            Bain enveloppé pour nouveau‑nés
          </h1>
          <p className="text-sm font-medium text-peach">
            📍 À Tournefeuille (31)
          </p>
          <p className="max-w-md text-base text-parchment">
            Cocon d&apos;Isa accompagne les tout-petits (0 à 2 mois) et leurs
            parents avec le bain enveloppé, un moment d&apos;apaisement
            profond et de connexion.
          </p>
          <div>
            <ButtonLink href="/rendez-vous">Réserver un bain enveloppé</ButtonLink>
          </div>
        </div>
      </div>

      {/* Desktop : texte et image côte à côte */}
      <Container className="hidden items-center gap-10 py-16 lg:grid lg:grid-cols-2 lg:py-28">
        <div className="flex flex-col gap-6">
          <span className="text-sm font-semibold uppercase tracking-widest text-sage">
            Bien-être pour jeunes parents &amp; nouveau-nés
          </span>
          <h1 className="text-5xl font-bold leading-tight text-walnut sm:text-6xl">
            Bain enveloppé pour nouveau‑nés
          </h1>
          <p className="text-sm font-medium text-sage">
            📍 À Tournefeuille (31)
          </p>
          <p className="max-w-lg text-lg text-body">
            Cocon d&apos;Isa accompagne les tout-petits (0 à 2 mois) et leurs
            parents avec le bain enveloppé, un moment d&apos;apaisement
            profond et de connexion.
          </p>
          <div>
            <ButtonLink href="/rendez-vous">Réserver un bain enveloppé</ButtonLink>
          </div>
        </div>

        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[63%_37%_54%_46%/43%_37%_63%_57%]">
          <Image
            src="/images/pendant-le-bain.jpeg"
            alt="Parent tenant délicatement la tête de bébé pendant le bain enveloppé"
            fill
            priority
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover"
          />
        </div>
      </Container>
    </section>
  );
}
