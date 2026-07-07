// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...rest
  }: React.ComponentProps<"a"> & { href: string }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

import PrivacyPage from "./page";

afterEach(cleanup);

describe("Privacy Policy page", () => {
  it("names the actual service providers and the consent-based cookie posture", () => {
    render(<PrivacyPage />);

    expect(
      screen.getByRole("heading", { name: "Privacy Policy" }),
    ).toBeTruthy();
    const text = document.body.textContent ?? "";
    expect(text).toContain("Vercel");
    expect(text).toContain("Resend");
    expect(text).toContain("Neon");
    expect(text).toContain("Cloudflare");
    expect(text).toContain("Upstash");
    expect(text).toContain("only with your consent");
    expect(text).toContain("Cookie Settings");
    expect(text).toContain("we do not sell personal");
  });

  it("routes privacy requests to info@kynigos.law, never bayan@", () => {
    render(<PrivacyPage />);

    const emails = screen.getAllByRole("link", { name: "info@kynigos.law" });
    expect(emails.length).toBeGreaterThan(0);
    for (const a of emails) {
      expect(a.getAttribute("href")).toBe("mailto:info@kynigos.law");
    }
    expect(document.body.textContent).not.toContain("bayan@");
  });

  it("shows the last-updated line and the no-relationship warning", () => {
    render(<PrivacyPage />);

    expect(screen.getByText("Last updated July 7, 2026")).toBeTruthy();
    expect(
      screen.getByText(/does not create an attorney-client relationship/),
    ).toBeTruthy();
  });
});
