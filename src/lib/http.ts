// Canonical public origin for URLs that leave the site (emailed links).
// Never derive those from req.url: the Host header is attacker-influenced on
// non-Vercel proxies, and preview deployments would mint *.vercel.app links.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.kynigos.law";

export const MAX_BODY_BYTES = 32_768;

// Content-length guard shared by the form endpoints (each caps fields far
// below this; the header check just refuses to buffer oversized bodies).
export function oversizedRequest(req: Request): boolean {
  return Number(req.headers.get("content-length") ?? 0) > MAX_BODY_BYTES;
}

// Cross-site POST rejection. Browsers attach an Origin header to cross-site
// form/fetch POSTs; a mismatched host means someone else's page is driving a
// visitor's browser at our endpoints (email-send amplification that also
// dodges per-IP rate limits). Requests without the header (curl, tests,
// same-origin GET-initiated navigations) pass—this guards browsers, not bots;
// Turnstile and the honeypot handle those.

export function crossSiteRequest(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).host !== new URL(req.url).host;
  } catch {
    return true;
  }
}
