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
