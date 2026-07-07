// Short-lived HMAC tokens for white-paper downloads. With PAPER_TOKEN_SECRET
// set, /api/paper/[slug] serves a PDF only to a URL signed by /api/lead—the
// gate becomes real. Without the secret the route serves unsigned requests,
// which is no weaker than the old public-folder behavior.

import { createHmac, timingSafeEqual } from "node:crypto";

export const PAPER_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour—covers "Download again"

function sign(secret: string, slug: string, exp: number): string {
  return createHmac("sha256", secret).update(`${slug}.${exp}`).digest("hex");
}

// Returns the download URL for a slug—signed when the secret is configured.
export function paperDownloadUrl(slug: string, now = Date.now()): string {
  const secret = process.env.PAPER_TOKEN_SECRET;
  if (!secret) return `/api/paper/${slug}`;
  const exp = now + PAPER_TOKEN_TTL_MS;
  return `/api/paper/${slug}?e=${exp}&s=${sign(secret, slug, exp)}`;
}

export function verifyPaperToken(
  slug: string,
  e: string | null,
  s: string | null,
  now = Date.now(),
): boolean {
  const secret = process.env.PAPER_TOKEN_SECRET;
  if (!secret) return true;
  if (!e || !s) return false;
  const exp = Number(e);
  if (!Number.isFinite(exp) || exp < now) return false;
  const expected = Buffer.from(sign(secret, slug, exp));
  const given = Buffer.from(s);
  return given.length === expected.length && timingSafeEqual(given, expected);
}
