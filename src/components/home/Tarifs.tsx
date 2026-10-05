import { ButtonLink } from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import SectionTitle from "@/components/ui/SectionTitle";
import DecorativeBlobs from "@/components/ui/DecorativeBlobs";
import { bainEnveloppe } from "@/lib/site-config";
import { prestationsList, type Prestation } from "@/lib/prestations";

const autresPrestations = prestationsList.filter((p) => p.id !== "bain-enveloppe");

function formatDuree(dureeMinutes: number): string {
  return dureeMinutes >= 60
    ? `${(dureeMinutes / 60).toLocaleString("fr-FR")} h`
    : `${dureeMinutes} min`;
}

// Regroupe les prestations partageant une `categorie` (ex. les deux formats
// d'accompagnement) sous une seule carte, pour garder une grille à 4
// colonnes propre plutôt que 5 cartes qui se replient en escalier.
function regrouperParCategorie(liste: Prestation[]): (Prestation | Prestation[])[] {
  const groupes = new Map<string, Prestation[]>();
  const resultat: (Prestation | Prestation[])[] = [];

  for (const p of liste) {
    if (!p.categorie) {
      resultat.push(p);
      continue;
    }
    const existant = groupes.get(p.categorie);
    if (existant) {
      existant.push(p);
    } else {
      const groupe: Prestation[] = [p];
      groupes.set(p.categorie, groupe);
      resultat.push(groupe);
    }
  }

  return resultat;
}

export default function Tarifs() {
  const cartes = regrouperParCategorie(autresPrestations);

  return (
    <section id="tarifs" className="relative isolate overflow-hidden bg-peach/40 py-16 sm:py-24">
      <DecorativeBlobs variant={3} />
      <Container className="flex flex-col items-center gap-10">
        <SectionTitle eyebrow="Tarifs" title="Un tarif simple et transparent" />

        <div className="-mx-4 flex w-full snap-x snap-mandatory items-stretch gap-6 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 sm:snap-none lg:grid-cols-4">
          <div className="flex h-full w-[80%] shrink-0 snap-center flex-col rounded-2xl border border-border bg-parchment p-8 text-center shadow-sm transition-shadow duration-300 hover:shadow-[0_0_32px_4px_rgba(232,130,95,0.35)] sm:w-auto sm:shrink">
            <h3 className="text-xl font-semibold text-walnut">
              {bainEnveloppe.nom}
            </h3>
            <p className="mt-1 text-sm font-medium text-sage">
              + {bainEnveloppe.complement}
            </p>
            <p className="mt-1 text-sm font-semibold text-sage">
              🥐 + Brunch inclus
            </p>
            <p className="mt-1 text-sm text-body">
              Pour les nouveau-nés de {bainEnveloppe.ageCible}
            </p>

            <p className="mt-6 text-4xl font-semibold text-accent">
              {bainEnveloppe.prix}
            </p>
            <p className="mt-2 text-sm text-body">Durée : {bainEnveloppe.duree}</p>

            <ButtonLink href="/rendez-vous?prestation=bain-enveloppe" className="mt-auto w-full">
              Réserver
            </ButtonLink>
          </div>

          {cartes.map((item) => {
            if (Array.isArray(item)) {
              const categorie = item[0].categorie!;
              return (
                <div
                  key={categorie}
                  className="flex h-full w-[80%] shrink-0 snap-center flex-col rounded-2xl border border-border bg-parchment p-8 text-center shadow-sm transition-shadow duration-300 hover:shadow-[0_0_32px_4px_rgba(232,130,95,0.35)] sm:w-auto sm:shrink"
                >
                  <h3 className="text-xl font-semibold text-walnut">{categorie}</h3>
                  <div className="mt-6 flex flex-1 flex-col justify-center gap-5">
                    {item.map((p) => (
                      <div key={p.id} className="border-t border-border pt-4 first:border-t-0 first:pt-0">
                        <p className="text-sm font-medium text-walnut">
                          {p.nom.replace(`${categorie} — `, "")}
                        </p>
                        <p className="mt-1 text-2xl font-semibold text-accent">{p.prixLabel}</p>
                        <p className="mt-1 text-xs text-body">{formatDuree(p.dureeMinutes)}</p>
                        <ButtonLink
                          href={`/rendez-vous?prestation=${p.id}`}
                          variant="ghost"
                          className="mt-2 !px-0 !py-0 text-xs"
                        >
                          Réserver →
                        </ButtonLink>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            const p = item;
            return (
              <div
                key={p.id}
                className="flex h-full w-[80%] shrink-0 snap-center flex-col rounded-2xl border border-border bg-parchment p-8 text-center shadow-sm transition-shadow duration-300 hover:shadow-[0_0_32px_4px_rgba(232,130,95,0.35)] sm:w-auto sm:shrink"
              >
                <h3 className="text-xl font-semibold text-walnut">{p.nom}</h3>
                <p className="mt-1 text-sm text-body">{p.lieu}</p>

                <p className="mt-6 text-4xl font-semibold text-accent">{p.prixLabel}</p>
                <p className="mt-2 text-sm text-body">Durée : {formatDuree(p.dureeMinutes)}</p>

                <ButtonLink
                  href={`/rendez-vous?prestation=${p.id}`}
                  variant="secondary"
                  className="mt-auto w-full"
                >
                  Réserver
                </ButtonLink>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
