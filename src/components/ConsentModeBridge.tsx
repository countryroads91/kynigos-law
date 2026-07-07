"use client";

// Bridges the site's first-party consent store to Google Consent Mode v2 and
// loads GA4. Consent-first ("basic" mode): gtag.js is not fetched at all until
// the visitor grants the analytics category—no cookieless pings, matching the
// AnalyticsGate bar of real behavior over theater. The ads signals
// (ad_storage/ad_user_data/ad_personalization) follow the marketing category,
// so wiring Google Ads or LinkedIn later is a one-liner behind consent.

import { useEffect, useSyncExternalStore } from "react";
import { GA4_ID, gtag } from "@/lib/analytics";
import {
  getConsentSnapshot,
  getServerConsentSnapshot,
  subscribeConsent,
} from "@/lib/consent";

const SCRIPT_ID = "ga4-gtag";

// GA4 does not delete its own cookies on consent withdrawal—do it ourselves.
function expireGaCookies() {
  const names = document.cookie
    .split("; ")
    .map((c) => c.split("=")[0])
    .filter((n) => n === "_ga" || n.startsWith("_ga_"));
  for (const name of names) {
    document.cookie = `${name}=; max-age=0; path=/`;
    document.cookie = `${name}=; max-age=0; path=/; domain=.${location.hostname}`;
  }
}

export default function ConsentModeBridge() {
  const consent = useSyncExternalStore(
    subscribeConsent,
    getConsentSnapshot,
    getServerConsentSnapshot,
  );

  const analytics = consent?.analytics === true;
  const marketing = consent?.marketing === true;

  useEffect(() => {
    if (!GA4_ID) return;
    const loaded = Boolean(document.getElementById(SCRIPT_ID));

    if (!analytics) {
      // Nothing granted: if GA4 was loaded earlier this session and consent
      // was withdrawn, actually stop it—the denied update alone would leave
      // gtag sending cookieless pings and its _ga cookies on the device.
      if (loaded) {
        (window as unknown as Record<string, unknown>)[
          `ga-disable-${GA4_ID}`
        ] = true;
        gtag("consent", "update", {
          analytics_storage: "denied",
          ad_storage: "denied",
          ad_user_data: "denied",
          ad_personalization: "denied",
        });
        expireGaCookies();
      }
      return;
    }

    // Clear any earlier withdrawal before (re-)granting.
    (window as unknown as Record<string, unknown>)[`ga-disable-${GA4_ID}`] =
      false;

    if (!loaded) {
      // Order matters: consent default must queue before the config command.
      gtag("consent", "default", {
        analytics_storage: "denied",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
        wait_for_update: 500,
      });
      gtag("js", new Date());
      gtag("config", GA4_ID);
      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
      document.head.appendChild(script);
    }

    gtag("consent", "update", {
      analytics_storage: "granted",
      ad_storage: marketing ? "granted" : "denied",
      ad_user_data: marketing ? "granted" : "denied",
      ad_personalization: marketing ? "granted" : "denied",
    });
  }, [analytics, marketing]);

  return null;
}
