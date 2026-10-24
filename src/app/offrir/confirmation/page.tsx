import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Carte cadeau envoyée",
  robots: { index: false },
};

export default async function OffrirConfirmationPage() {
  return (
    <section className="py-20">
      <Container className="flex flex-col items-center gap-6 text-center">
        <span
          aria-hidden="true"
          className="flex h-16 w-16 items-center justify-center rounded-full bg-success/20 text-3xl text-success"
        >
          🎁
        </span>
        <h1 className="text-3xl font-semibold text-walnut sm:text-4xl">
          Votre carte cadeau est envoyée
        </h1>
        <p className="max-w-md text-base text-body">
          Le destinataire vient de recevoir un e-mail avec son code cadeau et
          les instructions pour réserver. Vous recevez aussi une confirmation
          par e-mail.
        </p>
        <ButtonLink href="/">Retour à l&apos;accueil</ButtonLink>
        <Link href="/offrir" className="text-sm text-accent underline underline-offset-4">
          Offrir une autre carte cadeau
        </Link>
      </Container>
    </section>
  );
}
