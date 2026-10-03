// Catalogue des prestations proposées par Isabelle. Figé dans le code pour
// l'instant (pas de gestion depuis /admin) : toute modification de nom, prix
// ou durée passe par un déploiement. Chaque prestation a ses propres
// disponibilités récurrentes (table Disponibilite, une ligne par id ici).

export type PrestationId =
  | "bain-enveloppe"
  | "rituel-rebozo"
  | "appel-conseil"
  | "accompagnement-brunch"
  | "garde-nuit";

export type Prestation = {
  id: PrestationId;
  nom: string;
  description: string;
  dureeMinutes: number;
  prixCentimes: number;
  prixLabel: string;
  lieu: string;
  // Regroupe visuellement plusieurs prestations sous un même intitulé dans
  // les listes (ex. les deux formats d'accompagnement), sans les fusionner :
  // chacune garde son propre id, sa durée et ses disponibilités.
  categorie?: string;
  // Créneau qui commence un jour et se termine le lendemain (ex. 20h → 4h) :
  // change la façon dont la génération de créneaux calcule l'heure de fin.
  nocturne?: boolean;
  // Plage horaire fixe, non modifiable depuis /admin (contrainte métier,
  // ex. le brunch ne se prend qu'entre midi et deux) : remplace entièrement
  // heureDebut/heureMidi/heureFin de la Disponibilite pour cette prestation.
  // Seuls les jours de la semaine restent configurables par Isabelle.
  plageFixe?: { debut: string; fin: string };
  // Le prix dépend d'une donnée saisie à la réservation (distance du
  // domicile pour la garde de nuit) : prixCentimes/prixLabel ci-dessus
  // restent le tarif de base affiché, le montant réel est recalculé côté
  // serveur dans /api/reservations.
  tarifVariable?: boolean;
  // Produit Stripe correspondant (mode live), pour que les paiements soient
  // rattachés à un produit nommé dans le dashboard plutôt qu'à un simple
  // montant ad hoc. Le prix reste calculé dynamiquement (price_data) pour
  // garder la flexibilité des codes promo et du tarif variable de la garde
  // de nuit — seul le produit est figé.
  stripeProductId: string;
};

export const prestations: Record<PrestationId, Prestation> = {
  "bain-enveloppe": {
    id: "bain-enveloppe",
    nom: "Le bain enveloppé",
    description:
      "Un moment d'apaisement profond pour le nouveau-né (0 à 2 mois), enveloppé dans un lange pendant son immersion dans l'eau chaude, suivi d'un brunch convivial pour échanger avec Isabelle (inclus).",
    dureeMinutes: 90,
    prixCentimes: 15000,
    prixLabel: "150 €",
    lieu: "Chez Isabelle, à Tournefeuille (31)",
    stripeProductId: "prod_VEcNda4saCdgpy",
  },
  "rituel-rebozo": {
    id: "rituel-rebozo",
    nom: "Rituel Rebozo",
    description:
      "Un massage-enveloppement ancestral au tissu tissé, pour relâcher les tensions du corps après la grossesse et l'accouchement.",
    dureeMinutes: 120,
    prixCentimes: 10000,
    prixLabel: "100 €",
    lieu: "Chez Isabelle, à Tournefeuille (31)",
    stripeProductId: "prod_VN7QkIMecam7U2",
  },
  "appel-conseil": {
    id: "appel-conseil",
    nom: "Accompagnement — Appel téléphonique",
    description:
      "Un échange téléphonique avec Isabelle pour répondre à vos questions sur le sommeil, l'allaitement, le quotidien avec bébé...",
    dureeMinutes: 60,
    prixCentimes: 2500,
    prixLabel: "25 €",
    lieu: "Par téléphone",
    categorie: "Accompagnement",
    stripeProductId: "prod_VN7QlsNoWxBrG3",
  },
  "accompagnement-brunch": {
    id: "accompagnement-brunch",
    nom: "Accompagnement — Rencontre avec brunch",
    description:
      "Un moment d'échange en tête-à-tête chez Isabelle, accompagné d'un brunch, pour prendre le temps de parler de votre quotidien avec bébé. Proposé entre midi et deux.",
    dureeMinutes: 90,
    prixCentimes: 4000,
    prixLabel: "40 €",
    lieu: "Chez Isabelle, à Tournefeuille (31)",
    categorie: "Accompagnement",
    plageFixe: { debut: "12:00", fin: "14:00" },
    stripeProductId: "prod_VN7Q562zGJxMdd",
  },
  "garde-nuit": {
    id: "garde-nuit",
    nom: "Garde de nuit à domicile",
    description:
      "Isabelle veille sur votre bébé chez vous, de 20h à 4h du matin, pour vous offrir une vraie nuit de repos. Tarif selon la distance depuis Tournefeuille : 100 € à moins de 20 km, 115 € entre 20 et 35 km. Au-delà de 35 km, Isabelle ne se déplace pas.",
    dureeMinutes: 480,
    prixCentimes: 10000,
    prixLabel: "à partir de 100 €",
    lieu: "À votre domicile",
    nocturne: true,
    tarifVariable: true,
    stripeProductId: "prod_VN7QHcrM1OKtZ6",
  },
};

export const prestationsList = Object.values(prestations);

export function isPrestationId(value: string): value is PrestationId {
  return value in prestations;
}
