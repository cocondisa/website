"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        setError("Mot de passe incorrect.");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Une erreur est survenue. Merci de réessayer.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="py-20">
      <Container className="mx-auto flex max-w-sm flex-col gap-6">
        <h1 className="text-2xl font-semibold text-walnut">Espace admin</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium text-walnut">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              required
              autoFocus
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="rounded-xl border border-border bg-parchment px-4 py-2.5 text-sm text-walnut focus:border-accent focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
            />
          </div>
          {error && (
            <p role="alert" className="text-sm font-medium text-error">
              {error}
            </p>
          )}
          <Button type="submit" disabled={submitting}>
            {submitting ? "Connexion…" : "Se connecter"}
          </Button>
        </form>
      </Container>
    </section>
  );
}
