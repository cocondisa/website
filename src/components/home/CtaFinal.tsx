import { ButtonLink } from "@/components/ui/Button";
import Container from "@/components/ui/Container";

export default function CtaFinal() {
  return (
    <section className="bg-accent py-16 sm:py-20">
      <Container className="flex flex-col items-center gap-6 text-center">
        <h2 className="max-w-2xl text-3xl font-semibold text-parchment sm:text-4xl">
          Offrez à votre bébé un moment de douceur inoubliable
        </h2>
        <p className="max-w-xl text-parchment/90">
          Réservez dès maintenant votre séance de bain enveloppé et laissez
          Isabelle prendre soin de vous et de votre nouveau-né.
        </p>
        <ButtonLink
          href="/rendez-vous"
          variant="secondary"
          className="border-parchment text-parchment hover:bg-parchment hover:text-accent"
        >
          Prendre rendez-vous
        </ButtonLink>
      </Container>
    </section>
  );
}
