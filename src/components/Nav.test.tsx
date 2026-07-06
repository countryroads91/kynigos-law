// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
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

function closeButton() {
  return document.querySelector("button.nav-burger") as HTMLButtonElement;
}

describe("Nav mobile menu", () => {
  it("toggles open and closed via the burger button", () => {
    mockPathname = "/";
    render(<Nav />);
    openMenu();
    expect(document.body.style.overflow).toBe("hidden");
    fireEvent.click(closeButton());
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

  it("shows every destination as a direct link—no accordion taps", () => {
    mockPathname = "/";
    render(<Nav />);
    openMenu();

    // One tap on the burger, and each of these is one more tap away.
    for (const label of [
      "Home",
      "Practice Areas",
      "Family & Personal",
      "Work & Employment",
      "Business & Corporate",
      "Real Estate & Housing",
      "Capital Markets & Finance",
      "About",
      "How It Works",
      "Philosophy",
      "Contact",
      "Insights",
      "Personal Essays",
      "Kynigos Publications",
      "White Papers",
    ]) {
      const links = screen
        .getAllByText(label)
        .filter((el) => el.closest(".menu-overlay"));
      expect(links.length).toBeGreaterThan(0);
    }
  });

  it("marks the page behind the open menu inert and restores it on close", () => {
    mockPathname = "/";
    const main = document.createElement("main");
    document.body.appendChild(main);
    try {
      render(<Nav />);
      openMenu();
      expect(main.hasAttribute("inert")).toBe(true);
      fireEvent.click(closeButton());
      expect(main.hasAttribute("inert")).toBe(false);
    } finally {
      main.remove();
    }
  });

  it("closes and releases the scroll lock when a menu link is tapped", () => {
    mockPathname = "/";
    render(<Nav />);
    openMenu();

    const insightsLink = screen
      .getAllByText("Insights")
      .find((el) => el.closest(".menu-overlay"))!;
    fireEvent.click(insightsLink);

    expect(screen.getByRole("button", { name: "Open menu" })).toBeTruthy();
    expect(document.body.style.overflow).toBe("");
  });

  it("routes each practice group to its directory anchor", () => {
    mockPathname = "/";
    render(<Nav />);
    openMenu();

    for (const [label, slug] of [
      ["Family & Personal", "family-personal"],
      ["Work & Employment", "work-employment"],
      ["Business & Corporate", "business-corporate"],
      ["Real Estate & Housing", "real-estate-housing"],
      ["Capital Markets & Finance", "capital-finance"],
    ]) {
      const links = screen
        .getAllByText(label)
        .map((el) => el.closest("a"))
        .filter(Boolean) as HTMLAnchorElement[];
      expect(links.length).toBeGreaterThan(0);
      for (const link of links) {
        expect(link.getAttribute("href")).toBe(`/practice-areas#${slug}`);
      }
    }
  });

  it("never marks hash links as the current page", () => {
    mockPathname = "/practice-areas";
    render(<Nav />);
    openMenu();

    const overlay = document.querySelector(".menu-overlay")!;
    const hashLinks = Array.from(
      overlay.querySelectorAll('a[href*="#"]'),
    );
    expect(hashLinks.length).toBeGreaterThan(0);
    for (const link of hashLinks) {
      expect(link.getAttribute("aria-current")).toBeNull();
    }
    // The parent page link itself still highlights.
    const parent = Array.from(overlay.querySelectorAll("a")).find(
      (a) => a.getAttribute("href") === "/practice-areas",
    )!;
    expect(parent.getAttribute("aria-current")).toBe("page");
  });

  it("marks the current page with aria-current in the overlay", () => {
    mockPathname = "/philosophy";
    render(<Nav />);
    openMenu();

    const active = screen
      .getAllByText("Philosophy")
      .find((el) => el.closest(".menu-overlay"))!;
    expect(active.getAttribute("aria-current")).toBe("page");
  });

  it("auto-closes when the viewport crosses the desktop breakpoint", () => {
    mockPathname = "/";
    const desktopListeners: Array<() => void> = [];
    const state = { desktop: false };
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      get matches() {
        return query === "(min-width: 901px)" ? state.desktop : false;
      },
      media: query,
      onchange: null,
      addEventListener: (_type: string, cb: () => void) => {
        if (query === "(min-width: 901px)") desktopListeners.push(cb);
      },
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    try {
      render(<Nav />);
      openMenu();
      expect(document.body.style.overflow).toBe("hidden");

      state.desktop = true;
      act(() => {
        desktopListeners.forEach((cb) => cb());
      });

      expect(screen.getByRole("button", { name: "Open menu" })).toBeTruthy();
      expect(document.body.style.overflow).toBe("");
    } finally {
      window.matchMedia = originalMatchMedia;
    }
  });

  it("wraps Tab focus back to the first focusable while the sheet is open", () => {
    mockPathname = "/";
    // jsdom reports offsetParent as null for every element; the focus trap
    // uses it to skip hidden elements. Pretend everything is laid out.
    const originalOffsetParent = Object.getOwnPropertyDescriptor(
      HTMLElement.prototype,
      "offsetParent",
    );
    Object.defineProperty(HTMLElement.prototype, "offsetParent", {
      configurable: true,
      get() {
        return (this as HTMLElement).parentElement;
      },
    });

    try {
      render(<Nav />);
      openMenu();

      const nav = document.querySelector("nav")!;
      const focusables = Array.from(
        nav.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"),
      );
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      last.focus();
      fireEvent.keyDown(document, { key: "Tab" });
      expect(document.activeElement).toBe(first);
    } finally {
      if (originalOffsetParent) {
        Object.defineProperty(
          HTMLElement.prototype,
          "offsetParent",
          originalOffsetParent,
        );
      }
    }
  });

  it("closes on Escape and returns focus to the burger", () => {
    mockPathname = "/";
    render(<Nav />);
    openMenu();

    fireEvent.keyDown(document, { key: "Escape" });

    const burger = screen.getByRole("button", { name: "Open menu" });
    expect(burger).toBeTruthy();
    expect(document.activeElement).toBe(burger);
  });
});
