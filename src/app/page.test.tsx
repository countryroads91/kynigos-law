// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

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

import Home from "./page";

beforeAll(() => {
  // jsdom has no matchMedia; HeadlineReel uses it for prefers-reduced-motion.
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

describe("Home page", () => {
  it("anchors the hero Get Started button to the fork section", () => {
    render(<Home />);

    const anchor = screen.getByRole("link", { name: "Get Started" });
    expect(anchor.getAttribute("href")).toBe("#get-started");
    expect(document.getElementById("get-started")).toBeTruthy();

    // The consultation button is gone from the hero; every How It Works
    // link goes to the full page, not an in-page anchor.
    const hiw = screen.getAllByRole("link", { name: "How It Works" });
    expect(hiw.length).toBeGreaterThan(0);
    for (const link of hiw) {
      expect(link.getAttribute("href")).toBe("/how-it-works");
    }
  });

  it("chains the homepage sections with scroll cues", () => {
    render(<Home />);

    // hero → #get-started → #skin-in-the-game → #first-move
    expect(document.getElementById("skin-in-the-game")).toBeTruthy();
    expect(document.getElementById("first-move")).toBeTruthy();
    const cues = Array.from(document.querySelectorAll("a.scroll-cue")).map(
      (a) => a.getAttribute("href"),
    );
    expect(cues).toContain("#skin-in-the-game");
    expect(cues).toContain("#first-move");
  });

  it("renders the in-flow ticker with the expanded flat-fee service list", () => {
    render(<Home />);

    const ticker = document.querySelector(".ticker");
    expect(ticker).toBeTruthy();
    const text = ticker!.textContent ?? "";
    for (const item of [
      "Flat Fee Divorce",
      "Staged-Fee Divorce",
      "Flat Fee Privacy Policy Review",
      "Flat Fee Demand Letters",
      "Not for Feeding the Clock",
    ]) {
      expect(text).toContain(item);
    }
    // Vague items were removed with the rewrite.
    expect(text).not.toContain("Custody");
    expect(text).not.toContain("Contingency Employment");
  });

  it("shows the practice overview and typed featured insights", () => {
    render(<Home />);

    // Practice overview: four whole-card links + the index link.
    const practices = document.querySelectorAll("#practice-areas a.practice-card");
    expect(practices.length).toBe(4);
    const all = screen.getByRole("link", { name: "All Practice Areas" });
    expect(all.getAttribute("href")).toBe("/practice-areas");

    // Featured insights: three content types, visibly distinct, with the
    // essay personally attributed and the publication attributed to the firm.
    const insights = document.getElementById("insights")!;
    expect(insights.querySelector(".insight-card--essay")).toBeTruthy();
    expect(insights.querySelector(".insight-card--publication")).toBeTruthy();
    expect(insights.querySelector(".insight-card--paper")).toBeTruthy();
    expect(
      insights.querySelector(".insight-card--publication")!.textContent,
    ).toContain("Kynigos Law Firm");
    expect(
      insights.querySelector(".insight-card--publication")!.textContent,
    ).not.toContain("Bayan");
    expect(
      insights.querySelector(".insight-card--essay")!.textContent,
    ).toContain("Bayan Misaghi");
  });

  it("keeps the DC-only jurisdiction note on the page", () => {
    render(<Home />);

    const note = screen.getByText(/licensed in the District of Columbia\./);
    expect(note.textContent).toContain("outside DC may require referral");
  });

  it("explains the skin-in-the-game model with three arenas and a philosophy link", () => {
    render(<Home />);

    const section = document.getElementById("skin-in-the-game")!;
    expect(section.querySelectorAll(".skin-card").length).toBe(3);
    expect(section.textContent).toContain("Play to Win. Win to Play.");

    const phil = screen.getByRole("link", { name: "Read The Philosophy" });
    expect(phil.getAttribute("href")).toBe("/philosophy");
  });
});
