// Géocodage et distance pour la tarification de la garde de nuit, via l'API
// Adresse du gouvernement français (api-adresse.data.gouv.fr) — gratuite,
// sans clé, pas de quota. On ne fait jamais confiance à une distance ou des
// coordonnées envoyées par le client : tout est recalculé ici, côté serveur.

// 9 rue des Rossignols, 31170 Tournefeuille (géocodée une fois, fixe).
export const ADRESSE_ISABELLE = { lat: 43.589772, lon: 1.312475 };

export const DISTANCE_SEUIL_SURCOUT_KM = 20;
export const DISTANCE_MAX_KM = 35;
export const SURCOUT_DISTANCE_CENTIMES = 1500;

type ResultatGeocodage = {
  label: string;
  lat: number;
  lon: number;
};

export async function geocoderAdresse(adresse: string): Promise<ResultatGeocodage | null> {
  const url = `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(adresse)}&limit=1`;

  let response: Response;
  try {
    response = await fetch(url);
  } catch {
    return null;
  }

  if (!response.ok) return null;

  const data = await response.json().catch(() => null);
  const feature = data?.features?.[0];
  if (!feature) return null;

  const [lon, lat] = feature.geometry.coordinates as [number, number];
  return { label: feature.properties.label as string, lat, lon };
}

/** Distance à vol d'oiseau (km) entre deux points, formule de Haversine. */
export function distanceKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }): number {
  const R = 6371;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
