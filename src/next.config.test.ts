// Guards the security-header and PDF-bundling invariants in next.config.ts.
// If someone edits the CSP and drops the Turnstile or Calendly hosts, the
// widget/scheduler breaks silently in Report-Only mode—these assertions fail
// first.
import { describe, expect, it } from "vitest";
import nextConfig from "../next.config";

describe("next.config security headers", () => {
  it("applies the security header set to every route", async () => {
    const rules = await nextConfig.headers!();
    expect(rules).toHaveLength(1);
    expect(rules[0].source).toBe("/(.*)");

    const headers = Object.fromEntries(
      rules[0].headers.map((h) => [h.key, h.value]),
    );
    expect(headers["Strict-Transport-Security"]).toBe(
      "max-age=31536000; includeSubDomains",
    );
    expect(headers["X-Content-Type-Options"]).toBe("nosniff");
    expect(headers["X-Frame-Options"]).toBe("SAMEORIGIN");
    expect(headers["Referrer-Policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["Permissions-Policy"]).toContain("camera=()");
  });

  it("ships CSP as Report-Only (not enforced yet) and allows Turnstile + Calendly", async () => {
    const rules = await nextConfig.headers!();
    const headers = Object.fromEntries(
      rules[0].headers.map((h) => [h.key, h.value]),
    );
    // Enforcement waits until the report console is quiet—see the comment in
    // next.config.ts. Flipping this key to enforcing is a deliberate act.
    expect(headers["Content-Security-Policy"]).toBeUndefined();
    const csp = headers["Content-Security-Policy-Report-Only"];
    expect(csp).toContain("default-src 'self'");
    expect(csp).toMatch(/script-src [^;]*https:\/\/challenges\.cloudflare\.com/);
    expect(csp).toMatch(/connect-src [^;]*https:\/\/challenges\.cloudflare\.com/);
    expect(csp).toMatch(/frame-src [^;]*https:\/\/challenges\.cloudflare\.com/);
    expect(csp).toMatch(/frame-src [^;]*https:\/\/calendly\.com/);
    expect(csp).toContain("frame-ancestors 'self'");
  });

  it("allows the GA4/Consent Mode hosts (gtag.js + analytics beacons)", async () => {
    const rules = await nextConfig.headers!();
    const headers = Object.fromEntries(
      rules[0].headers.map((h) => [h.key, h.value]),
    );
    const csp = headers["Content-Security-Policy-Report-Only"];
    expect(csp).toMatch(
      /script-src [^;]*https:\/\/www\.googletagmanager\.com/,
    );
    expect(csp).toMatch(
      /connect-src [^;]*https:\/\/www\.google-analytics\.com/,
    );
    // Regional collection endpoints (region1.google-analytics.com etc.).
    expect(csp).toMatch(
      /connect-src [^;]*https:\/\/\*\.google-analytics\.com/,
    );
    expect(csp).toMatch(/img-src [^;]*https:\/\/www\.google-analytics\.com/);
  });

  it("bundles the gated white-paper PDFs into the /api/paper function", () => {
    expect(nextConfig.outputFileTracingIncludes).toMatchObject({
      "/api/paper/*": ["./src/content/white-papers/**"],
    });
  });
});
