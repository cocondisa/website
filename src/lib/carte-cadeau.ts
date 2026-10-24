import { randomInt } from "crypto";

// Alphabet sans caractères ambigus (0/O, 1/I/L) pour rester lisible à
// l'oral/à l'écrit quand le destinataire le communique à Isabelle.
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

export function genererCodeCarteCadeau(): string {
  let suffixe = "";
  for (let i = 0; i < 6; i++) {
    suffixe += ALPHABET[randomInt(ALPHABET.length)];
  }
  return `CADEAU-${suffixe}`;
}
