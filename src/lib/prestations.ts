// Catalogue des prestations proposées par Isabelle. Figé dans le code pour
// l'instant (pas de gestion depuis /admin) : toute modification de nom, prix
// ou durée passe par un déploiement. Chaque prestation a ses propres
// disponibilités récurrentes (table Disponibilite, une ligne par id ici).

export type PrestationId =
  | "bain-enveloppe"
  | "rituel-rebozo"
  | "appel-conseil"
  | "garde-nuit";

export type Prestation = {
  id: PrestationId;
  nom: string;
  description: string;
  dureeMinutes: number;
  prixCentimes: number;
  prixLabel: string;
  lieu: string;
  // Créneau qui commence un jour et se termine le lendemain (ex. 20h → 4h) :
  // change la façon dont la génération de créneaux calcule l'heure de fin.
  nocturne?: boolean;
};

export const prestations: Record<PrestationId, Prestation> = {
  "bain-enveloppe": {
    id: "bain-enveloppe",
    nom: "Le bain enveloppé",
    description:
      "Un moment d'apaisement profond pour le nouveau-né (0 à 2 mois), enveloppé dans un lange pendant son immersion dans l'eau chaude.",
    dureeMinutes: 90,
    prixCentimes: 15000,
    prixLabel: "150 €",
    lieu: "Chez Isabelle, à Tournefeuille (31)",
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
  },
  "appel-conseil": {
    id: "appel-conseil",
    nom: "Appel de conseil",
    description:
      "Un échange téléphonique avec Isabelle pour répondre à vos questions sur le sommeil, l'allaitement, le quotidien avec bébé...",
    dureeMinutes: 60,
    prixCentimes: 2500,
    prixLabel: "25 €",
    lieu: "Par téléphone",
  },
  "garde-nuit": {
    id: "garde-nuit",
    nom: "Garde de nuit à domicile",
    description:
      "Isabelle veille sur votre bébé chez vous en soirée et la nuit, pour vous offrir une vraie nuit de repos.",
    dureeMinutes: 480,
    prixCentimes: 10000,
    prixLabel: "100 €",
    lieu: "À votre domicile",
    nocturne: true,
  },
};

export const prestationsList = Object.values(prestations);

export function isPrestationId(value: string): value is PrestationId {
  return value in prestations;
}
