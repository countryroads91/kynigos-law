// Cookie-consent state, stored in a first-party cookie so it works without
// any backend and survives across visits. Strictly necessary is always on.

export type ConsentCategories = {
  necessary: true;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
};

export type Consent = ConsentCategories & {
  /** Bump when the category set changes to re-prompt returning visitors. */
  version: number;
  decidedAt: string; // ISO timestamp
};

export const CONSENT_VERSION = 1;
export const CONSENT_COOKIE = "kynigos-consent";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 365; // 12 months

export const OPEN_SETTINGS_EVENT = "kynigos:open-cookie-settings";
export const CONSENT_CHANGED_EVENT = "kynigos:consent-changed";

export function readConsent(): Consent | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${CONSENT_COOKIE}=`));
  if (!match) return null;
  try {
    const parsed = JSON.parse(
      decodeURIComponent(match.slice(CONSENT_COOKIE.length + 1)),
    ) as Consent;
    if (parsed.version !== CONSENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeConsent(
  categories: Omit<ConsentCategories, "necessary">,
): Consent {
  const consent: Consent = {
    necessary: true,
    ...categories,
    version: CONSENT_VERSION,
    decidedAt: new Date().toISOString(),
  };
  document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(
    JSON.stringify(consent),
  )}; max-age=${MAX_AGE_SECONDS}; path=/; SameSite=Lax`;
  cachedSnapshot = consent;
  window.dispatchEvent(
    new CustomEvent<Consent>(CONSENT_CHANGED_EVENT, { detail: consent }),
  );
  return consent;
}

// ── useSyncExternalStore adapters ──
// The snapshot is cached so repeated getSnapshot calls return a stable
// reference; the cache invalidates whenever consent changes.
let cachedSnapshot: Consent | null | undefined;

export function subscribeConsent(onChange: () => void): () => void {
  const handler = () => {
    cachedSnapshot = undefined;
    onChange();
  };
  window.addEventListener(CONSENT_CHANGED_EVENT, handler);
  return () => window.removeEventListener(CONSENT_CHANGED_EVENT, handler);
}

export function getConsentSnapshot(): Consent | null {
  if (cachedSnapshot === undefined) cachedSnapshot = readConsent();
  return cachedSnapshot;
}

// Server render (and hydration's first pass) assumes no consent yet.
export function getServerConsentSnapshot(): Consent | null {
  return null;
}

/** Test helper: forget the cached snapshot after external cookie edits. */
export function resetConsentCache(): void {
  cachedSnapshot = undefined;
}
