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

// The scrim is aria-hidden (the burger is the accessible close control), so
// role queries can't reach it—query by class instead.
function closeButton(className: "nav-burger" | "nav-scrim") {
  return document.querySelector(`button.${className}`) as HTMLButtonElement;
}

describe("Nav mobile menu", () => {
  it("toggles open and closed via the burger button", () => {
    mockPathname = "/";
    render(<Nav />);
    openMenu();
    expect(document.body.style.overflow).toBe("hidden");
    fireEvent.click(closeButton("nav-burger"));
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
      "How it Works",
      "Philosophy",
      "Contact",
      "All Practice Areas",
      "Family Law",
      "Landlord-Tenant",
      "Capital Markets",
      "Contract Review",
      "White Papers",
      "Blog",
    ]) {
      const links = screen
        .getAllByText(label)
        .filter((el) => el.closest(".nav-sheet"));
      expect(links.length).toBeGreaterThan(0);
    }
  });

  it("closes when the scrim behind the sheet is tapped", () => {
    mockPathname = "/";
    render(<Nav />);
    openMenu();
    fireEvent.click(closeButton("nav-scrim"));
    expect(screen.getByRole("button", { name: "Open menu" })).toBeTruthy();
    expect(document.body.style.overflow).toBe("");
  });

  it("closes and releases the scroll lock when a sheet link is tapped", () => {
    mockPathname = "/";
    render(<Nav />);
    openMenu();

    const blogLink = screen
      .getAllByText("Blog")
      .find((el) => el.closest(".nav-sheet"))!;
    fireEvent.click(blogLink);

    expect(screen.getByRole("button", { name: "Open menu" })).toBeTruthy();
    expect(document.body.style.overflow).toBe("");
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
