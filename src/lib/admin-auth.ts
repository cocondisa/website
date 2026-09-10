// Utilise l'API Web Crypto (et non node:crypto) pour rester compatible avec
// le runtime Edge du middleware qui protège /admin.

export const ADMIN_SESSION_COOKIE = "admin_session";
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 jours

const encoder = new TextEncoder();

function getSecret() {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) {
    throw new Error("ADMIN_PASSWORD n'est pas configuré.");
  }
  return secret;
}

function toHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function constantTimeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

async function getKey() {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
}

async function sign(expiresAt: number) {
  const key = await getKey();
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(String(expiresAt)));
  return toHex(signature);
}

export async function createAdminSessionToken() {
  const expiresAt = Date.now() + SESSION_DURATION_MS;
  return `${expiresAt}.${await sign(expiresAt)}`;
}

export async function verifyAdminSessionToken(
  token: string | undefined | null
): Promise<boolean> {
  if (!token) return false;

  const [expiresAtRaw, signature] = token.split(".");
  const expiresAt = Number(expiresAtRaw);
  if (!expiresAtRaw || !signature || Number.isNaN(expiresAt)) return false;
  if (Date.now() > expiresAt) return false;

  const expected = await sign(expiresAt);
  return constantTimeEqual(signature, expected);
}

export function verifyAdminPassword(password: string): boolean {
  return constantTimeEqual(password, getSecret());
}
