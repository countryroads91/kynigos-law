"use client";

import { Analytics } from "@vercel/analytics/next";
import { useSyncExternalStore } from "react";
import {
  getConsentSnapshot,
  getServerConsentSnapshot,
  subscribeConsent,
} from "@/lib/consent";

// Analytics loads only after the visitor consents to the analytics
// category—the consent banner controls real behavior, not theater.
export default function AnalyticsGate() {
  const consent = useSyncExternalStore(
    subscribeConsent,
    getConsentSnapshot,
    getServerConsentSnapshot,
  );

  if (consent?.analytics !== true) return null;
  return <Analytics />;
}
