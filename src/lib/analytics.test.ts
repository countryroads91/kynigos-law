// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CONSENT_COOKIE, resetConsentCache, writeConsent } from "./consent";

// GA4_ID is captured at module load, so each test stubs the env first and
// imports the module fresh (same pattern as TurnstileWidget tests).
async function loadAnalytics() {
  return await import("./analytics");
}

function clearConsent() {
  document.cookie = `${CONSENT_COOKIE}=; max-age=0; path=/`;
  resetConsentCache();
}

beforeEach(() => {
  vi.resetModules();
  clearConsent();
  delete (window as { dataLayer?: unknown[] }).dataLayer;
});

afterEach(() => {
  vi.unstubAllEnvs();
  clearConsent();
});

describe("track", () => {
  it("is a no-op without a measurement id (feature off)", async () => {
    vi.stubEnv("NEXT_PUBLIC_GA4_MEASUREMENT_ID", "");
    const { track } = await loadAnalytics();
    writeConsent({ functional: false, analytics: true, marketing: false });
    track("generate_lead", { method: "contact_form" });
    expect(window.dataLayer).toBeUndefined();
  });

  it("is a no-op without analytics consent", async () => {
    vi.stubEnv("NEXT_PUBLIC_GA4_MEASUREMENT_ID", "G-TEST123");
    const { track } = await loadAnalytics();
    track("generate_lead");
    writeConsent({ functional: false, analytics: false, marketing: true });
    track("generate_lead");
    expect(window.dataLayer).toBeUndefined();
  });

  it("pushes an event once the id is set and analytics is consented", async () => {
    vi.stubEnv("NEXT_PUBLIC_GA4_MEASUREMENT_ID", "G-TEST123");
    const { track } = await loadAnalytics();
    writeConsent({ functional: false, analytics: true, marketing: false });
    track("file_download", { paper: "misaligned-incentives" });
    expect(window.dataLayer).toHaveLength(1);
    // gtag.js requires Arguments objects on the dataLayer, not arrays.
    const args = window.dataLayer![0] as IArguments;
    expect(Array.isArray(args)).toBe(false);
    expect(args[0]).toBe("event");
    expect(args[1]).toBe("file_download");
    expect(args[2]).toMatchObject({ paper: "misaligned-incentives" });
  });
});
