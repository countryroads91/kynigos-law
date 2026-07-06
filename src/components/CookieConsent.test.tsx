// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, act } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

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

import CookieConsent from "./CookieConsent";
import {
  CONSENT_COOKIE,
  OPEN_SETTINGS_EVENT,
  readConsent,
  resetConsentCache,
} from "@/lib/consent";

function clearConsentCookie() {
  document.cookie = `${CONSENT_COOKIE}=; max-age=0; path=/`;
  resetConsentCache();
}

beforeEach(clearConsentCookie);
afterEach(() => {
  cleanup();
  clearConsentCookie();
});

describe("CookieConsent", () => {
  it("shows the banner with equal-effort accept and reject choices", () => {
    render(<CookieConsent />);

    expect(screen.getByLabelText("Cookie preferences")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Accept All" })).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Reject Non-Essential" }),
    ).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Manage Preferences" }),
    ).toBeTruthy();
  });

  it("Accept All stores full consent and dismisses the banner", () => {
    render(<CookieConsent />);
    fireEvent.click(screen.getByRole("button", { name: "Accept All" }));

    expect(screen.queryByLabelText("Cookie preferences")).toBeNull();
    const consent = readConsent()!;
    expect(consent.analytics).toBe(true);
    expect(consent.functional).toBe(true);
    expect(consent.marketing).toBe(true);
    expect(consent.necessary).toBe(true);
  });

  it("Reject Non-Essential stores necessary-only consent", () => {
    render(<CookieConsent />);
    fireEvent.click(
      screen.getByRole("button", { name: "Reject Non-Essential" }),
    );

    const consent = readConsent()!;
    expect(consent.necessary).toBe(true);
    expect(consent.analytics).toBe(false);
    expect(consent.functional).toBe(false);
    expect(consent.marketing).toBe(false);
  });

  it("Manage Preferences saves per-category choices", () => {
    render(<CookieConsent />);
    fireEvent.click(screen.getByRole("button", { name: "Manage Preferences" }));

    const dialog = screen.getByRole("dialog", { name: "Cookie preferences" });
    expect(dialog).toBeTruthy();
    // Strictly necessary is locked—no checkbox for it.
    expect(dialog.textContent).toContain("Always active");

    fireEvent.click(screen.getByLabelText("Analytics"));
    fireEvent.click(screen.getByRole("button", { name: "Save Preferences" }));

    const consent = readConsent()!;
    expect(consent.analytics).toBe(true);
    expect(consent.marketing).toBe(false);
    expect(consent.functional).toBe(false);
  });

  it("does not show the banner again once consent exists, and the footer event reopens settings", () => {
    const { unmount } = render(<CookieConsent />);
    fireEvent.click(screen.getByRole("button", { name: "Accept All" }));
    unmount();

    render(<CookieConsent />);
    expect(screen.queryByLabelText("Cookie preferences")).toBeNull();

    act(() => {
      window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT));
    });
    const dialog = screen.getByRole("dialog", { name: "Cookie preferences" });
    // Saved choices are reflected in the toggles.
    expect(
      (screen.getByLabelText("Analytics") as HTMLInputElement).checked,
    ).toBe(true);
    expect(dialog).toBeTruthy();
  });
});
