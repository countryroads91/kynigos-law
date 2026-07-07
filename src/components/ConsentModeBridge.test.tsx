// @vitest-environment jsdom
import { act, cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  CONSENT_COOKIE,
  resetConsentCache,
  writeConsent,
} from "@/lib/consent";

// GA4_ID is captured when lib/analytics loads, so stub env then import fresh.
async function loadBridge() {
  const mod = await import("./ConsentModeBridge");
  return mod.default;
}

function clearConsent() {
  document.cookie = `${CONSENT_COOKIE}=; max-age=0; path=/`;
  resetConsentCache();
}

function dataLayerCalls(): IArguments[] {
  return ((window.dataLayer ?? []) as IArguments[]).filter(
    (a) => typeof a === "object",
  );
}

function consentUpdates() {
  return dataLayerCalls().filter(
    (a) => a[0] === "consent" && a[1] === "update",
  );
}

beforeEach(() => {
  vi.resetModules();
  clearConsent();
  delete (window as { dataLayer?: unknown[] }).dataLayer;
  document.getElementById("ga4-gtag")?.remove();
});

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
  clearConsent();
  document.getElementById("ga4-gtag")?.remove();
});

describe("ConsentModeBridge", () => {
  it("does nothing without a measurement id (feature off)", async () => {
    vi.stubEnv("NEXT_PUBLIC_GA4_MEASUREMENT_ID", "");
    const Bridge = await loadBridge();
    render(<Bridge />);
    act(() => {
      writeConsent({ functional: false, analytics: true, marketing: false });
    });
    expect(document.getElementById("ga4-gtag")).toBeNull();
    expect(window.dataLayer).toBeUndefined();
  });

  it("loads nothing before consent—no script, no pings", async () => {
    vi.stubEnv("NEXT_PUBLIC_GA4_MEASUREMENT_ID", "G-TEST123");
    const Bridge = await loadBridge();
    render(<Bridge />);
    expect(document.getElementById("ga4-gtag")).toBeNull();
    expect(window.dataLayer).toBeUndefined();
  });

  it("queues consent default before config, injects gtag.js, and grants analytics on consent", async () => {
    vi.stubEnv("NEXT_PUBLIC_GA4_MEASUREMENT_ID", "G-TEST123");
    const Bridge = await loadBridge();
    render(<Bridge />);
    act(() => {
      writeConsent({ functional: false, analytics: true, marketing: false });
    });

    const script = document.getElementById("ga4-gtag") as HTMLScriptElement;
    expect(script).not.toBeNull();
    expect(script.src).toContain("googletagmanager.com/gtag/js?id=G-TEST123");

    const calls = dataLayerCalls();
    // Order: consent default → js → config → consent update.
    expect(calls[0][0]).toBe("consent");
    expect(calls[0][1]).toBe("default");
    expect(calls[0][2]).toMatchObject({ analytics_storage: "denied" });
    const configIdx = calls.findIndex((a) => a[0] === "config");
    expect(configIdx).toBeGreaterThan(0);

    const update = consentUpdates().at(-1)!;
    expect(update[2]).toMatchObject({
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
  });

  it("grants the ad signals only when marketing is also consented", async () => {
    vi.stubEnv("NEXT_PUBLIC_GA4_MEASUREMENT_ID", "G-TEST123");
    const Bridge = await loadBridge();
    render(<Bridge />);
    act(() => {
      writeConsent({ functional: false, analytics: true, marketing: true });
    });
    const update = consentUpdates().at(-1)!;
    expect(update[2]).toMatchObject({
      analytics_storage: "granted",
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
    });
  });

  it("sends a denied update when consent is withdrawn after load", async () => {
    vi.stubEnv("NEXT_PUBLIC_GA4_MEASUREMENT_ID", "G-TEST123");
    const Bridge = await loadBridge();
    render(<Bridge />);
    act(() => {
      writeConsent({ functional: false, analytics: true, marketing: false });
    });
    expect(document.getElementById("ga4-gtag")).not.toBeNull();
    act(() => {
      writeConsent({ functional: false, analytics: false, marketing: false });
    });
    const update = consentUpdates().at(-1)!;
    expect(update[2]).toMatchObject({
      analytics_storage: "denied",
      ad_storage: "denied",
    });
  });
});
