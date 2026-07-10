// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

let pathname = "/";
vi.mock("next/navigation", () => ({ usePathname: () => pathname }));
vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }: React.ComponentProps<"a"> & { href: string }) => (
    <a href={href} {...rest}>{children}</a>
  ),
}));

import PrimaryNav from "./PrimaryNav";

beforeAll(() => {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
});

afterEach(cleanup);

describe("PrimaryNav", () => {
  it("uses the audience-first desktop navigation and restrained Start CTA", () => {
    pathname = "/";
    render(<PrimaryNav />);
    for (const [label, href] of [
      ["People", "/people"],
      ["Businesses", "/businesses"],
      ["Capital", "/capital"],
      ["How It Works", "/how-it-works"],
      ["Insights", "/insights"],
      ["About", "/about"],
      ["Start", "/contact"],
    ]) {
      expect(screen.getByRole("link", { name: label }).getAttribute("href")).toBe(href);
    }
    expect(document.body.textContent).not.toContain("Book A Free Consultation");
  });

  it("opens an accessible mobile sheet and releases its scroll lock on close", () => {
    pathname = "/";
    render(<PrimaryNav />);
    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    expect(screen.getByRole("dialog", { name: "Site menu" })).toBeTruthy();
    expect(document.body.style.overflow).toBe("hidden");
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog", { name: "Site menu" })).toBeNull();
    expect(document.body.style.overflow).toBe("");
  });

  it("marks the active audience page", () => {
    pathname = "/capital";
    render(<PrimaryNav />);
    expect(screen.getByRole("link", { name: "Capital" }).getAttribute("aria-current")).toBe("page");
  });
});
