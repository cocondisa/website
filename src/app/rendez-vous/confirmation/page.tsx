import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Rendez-vous confirmé",
  robots: { index: false },
};

export default async function ConfirmationPage({
  searchParams,
}: PageProps<"/rendez-vous/confirmation">) {
  const params = await searchParams;
  const reservationId =
    typeof params.reservation === "string" ? params.reservation : null;

  return (
    <section className="py-20">
      <Container className="flex flex-col items-center gap-6 text-center">
        <span
          aria-hidden="true"
          className="flex h-16 w-16 items-center justify-center rounded-full bg-success/20 text-3xl text-success"
        >
          ✓
        </span>
        <h1 className="text-3xl font-semibold text-walnut sm:text-4xl">
          Votre rendez-vous est confirmé
        </h1>
        <p className="max-w-md text-base text-body">
          Un e-mail de confirmation vient de vous être envoyé avec tous les
          détails de votre séance.
        </p>
        {reservationId && (
          <p className="text-sm text-body">
            Référence de réservation :{" "}
            <span className="font-mono text-walnut">{reservationId}</span>
          </p>
        )}
        <ButtonLink href="/">Retour à l&apos;accueil</ButtonLink>
        <Link href="/rendez-vous" className="text-sm text-accent underline underline-offset-4">
          Prendre un autre rendez-vous
        </Link>
      </Container>
    </section>
  );
}
