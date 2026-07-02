// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

let mockPathname = "/";
vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
}));
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

import Nav from "./Nav";

beforeAll(() => {
  // jsdom has no matchMedia; Nav uses it for hover detection and the
  // desktop-breakpoint auto-close.
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

function openMenu() {
  fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
}

describe("Nav mobile menu", () => {
  it("toggles open and closed via the burger button", () => {
    mockPathname = "/";
    render(<Nav />);
    openMenu();
    expect(document.body.style.overflow).toBe("hidden");
    fireEvent.click(screen.getByRole("button", { name: "Close menu" }));
    expect(screen.getByRole("button", { name: "Open menu" })).toBeTruthy();
    expect(document.body.style.overflow).toBe("");
  });

  // Regression: ISSUE-001 follow-up—the menu (and its body scroll lock) must
  // never survive a route change, whatever triggered the navigation.
  // Found by /qa on 2026-07-01.
  it("closes and releases the scroll lock when the pathname changes", () => {
    mockPathname = "/";
    const { rerender } = render(<Nav />);
    openMenu();
    expect(document.body.style.overflow).toBe("hidden");

    mockPathname = "/contact";
    rerender(<Nav />);

    expect(screen.getByRole("button", { name: "Open menu" })).toBeTruthy();
    expect(document.body.style.overflow).toBe("");
  });

  it("closes on Escape, resets the accordion, and returns focus to the burger", () => {
    mockPathname = "/";
    render(<Nav />);
    openMenu();
    const practiceTriggers = screen.getAllByRole("button", {
      name: "Practice Areas",
    });
    const mobileTrigger = practiceTriggers[practiceTriggers.length - 1];
    fireEvent.click(mobileTrigger);
    expect(mobileTrigger.getAttribute("aria-expanded")).toBe("true");

    fireEvent.keyDown(document, { key: "Escape" });

    const burger = screen.getByRole("button", { name: "Open menu" });
    expect(burger).toBeTruthy();
    expect(document.activeElement).toBe(burger);
  });
});
