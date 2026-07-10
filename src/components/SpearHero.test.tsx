// @vitest-environment jsdom
import { cleanup, render, waitFor } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import SpearHero from "./SpearHero";

beforeAll(() => {
  // jsdom has no matchMedia; SpearHero reads prefers-reduced-motion.
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

describe("SpearHero", () => {
  // jsdom has no WebGL: getContext returns null, so the component must fall
  // back to the static SVG mark rather than rendering a dead canvas.
  it("falls back to the SVG mark when WebGL is unavailable", async () => {
    render(<SpearHero />);

    await waitFor(() => {
      expect(document.querySelector(".hero-spear svg")).toBeTruthy();
    });
    expect(document.querySelector(".hero-spear canvas")).toBeNull();
    expect(
      document.querySelector(".hero-spear")?.getAttribute("aria-hidden"),
    ).toBe("true");
  });
});
