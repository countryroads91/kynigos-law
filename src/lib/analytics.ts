// GA4 event plumbing, consent-first. Env-gated on NEXT_PUBLIC_GA4_MEASUREMENT_ID
// (no id—every call is a no-op) and consent-gated on the analytics category
// (the banner controls real behavior, not theater—same bar as AnalyticsGate).
// Postgres stays the source of truth for conversions; GA4 is the marketing lens.

import { readConsent } from "./consent";

export const GA4_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

// gtag.js reads Arguments objects off the dataLayer—arrays do not work. The
// rest param exists only to type the call signature; `arguments` is what ships.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function gtag(..._args: unknown[]) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer.push(arguments);
}

export type ConversionEvent =
  | "generate_lead"
  | "file_download"
  | "book_consultation"
  | "begin_checkout"
  | "purchase"
  | "sign_up";

export function track(
  event: ConversionEvent,
  params?: Record<string, unknown>,
): void {
  if (!GA4_ID || typeof window === "undefined") return;
  if (readConsent()?.analytics !== true) return;
  gtag("event", event, params ?? {});
}
