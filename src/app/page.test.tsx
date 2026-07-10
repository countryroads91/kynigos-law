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

import Home from "./page";
import { AUDIENCES } from "@/content/audiences";

afterEach(cleanup);

describe("Home page", () => {
  it("anchors the hero CTA to the three doors", () => {
    render(<Home />);

    const anchor = screen.getByRole("link", { name: "Find Your Path" });
    expect(anchor.getAttribute("href")).toBe("#doors");
    expect(document.getElementById("doors")).toBeTruthy();

    const fees = screen.getAllByRole("link", { name: "How Our Fees Work" });
    expect(fees.length).toBeGreaterThan(0);
    for (const link of fees) {
      expect(link.getAttribute("href")).toBe("/how-it-works");
    }
  });

  it("keeps the hero headline static—no rotating reel", () => {
    render(<Home />);

    expect(document.querySelector(".reel-track")).toBeNull();
    const headline = document.getElementById("hero-headline")!;
    expect(headline.textContent).toContain("Your attorney");
    expect(headline.textContent).toContain("skin in the game.");
  });

  it("renders a door card for each audience, linking to its landing page", () => {
    render(<Home />);

    const doors = document.querySelectorAll("#doors a.door-card");
    expect(doors.length).toBe(AUDIENCES.length);
    const hrefs = Array.from(doors).map((d) => d.getAttribute("href"));
    for (const a of AUDIENCES) {
      expect(hrefs).toContain(`/${a.slug}`);
    }
  });

  it("features six flagship engagements with fee shapes and the posted price", () => {
    render(<Home />);

    const cards = document.querySelectorAll("#engagements a.flagship-card");
    expect(cards.length).toBe(6);
    const section = document.getElementById("engagements")!;
    expect(section.textContent).toContain("Staged-Fee Divorce");
    expect(section.textContent).toContain("DC Legal Opinion Letters");
    expect(section.textContent).toContain("From $444");

    const review = Array.from(cards).find((c) =>
      c.textContent?.includes("Professional Contract Review"),
    )!;
    expect(review.getAttribute("href")).toBe("/practice-areas/contract-review");
  });

  it("renders the product ticker sweeping all three doors", () => {
    render(<Home />);

    const ticker = document.querySelector(".ticker");
    expect(ticker).toBeTruthy();
    const text = ticker!.textContent ?? "";
    for (const item of [
      "Staged-Fee Divorce",
      "Professional Contract Review",
      "Practice Buy-Ins & Buyouts",
      "DC Legal Opinion Letters",
      "Not for Feeding the Clock",
    ]) {
      expect(text).toContain(item);
    }
  });

  it("proves the three pillars and keeps the rule line", () => {
    render(<Home />);

    const section = document.getElementById("pillars")!;
    expect(section.querySelectorAll(".pillar").length).toBe(3);
    for (const name of ["Calculated", "Zealous", "Invested"]) {
      expect(section.textContent).toContain(name);
    }
    expect(section.textContent).toContain("Play to Win. Win to Play.");

    const phil = screen.getByRole("link", { name: "Read The Philosophy" });
    expect(phil.getAttribute("href")).toBe("/philosophy");
  });

  it("presents the attorney without naming him—credentials carry the trust", () => {
    render(<Home />);

    const section = document.getElementById("attorney")!;
    expect(section.textContent).toContain("I have been the client.");
    expect(section.textContent).toContain("Goldman Sachs");
    expect(section.textContent).toContain("District of Columbia");
    expect(document.body.textContent).not.toContain("Bayan");

    const essay = screen.getByRole("link", { name: "Read the Essay" });
    expect(essay.getAttribute("href")).toBe("/blog/i-have-been-the-client");
  });

  it("walks the engagement loop in four steps", () => {
    render(<Home />);

    const section = document.getElementById("how")!;
    expect(section.querySelectorAll(".loop-steps .process-step").length).toBe(4);
    expect(section.textContent).toContain("Approve a defined scope and price");
  });

  it("shows typed featured insights with correct attribution", () => {
    render(<Home />);

    const insights = document.getElementById("insights")!;
    expect(insights.querySelector(".insight-card--essay")).toBeTruthy();
    expect(insights.querySelector(".insight-card--publication")).toBeTruthy();
    expect(insights.querySelector(".insight-card--paper")).toBeTruthy();
    expect(
      insights.querySelector(".insight-card--publication")!.textContent,
    ).toContain("Kynigos Law Firm");
    expect(
      insights.querySelector(".insight-card--essay")!.textContent,
    ).toContain("The Managing Partner");

    // Pin the label copy exactly—a wrong-encoding save once shipped
    // "Personal Essay Â· Why Kynigos Exists" and nothing caught it.
    expect(
      insights.querySelector(".insight-card--essay .insight-label")!
        .textContent,
    ).toBe("Personal Essay · Why Kynigos Exists");
  });

  it("contains no placeholder integrations", () => {
    render(<Home />);
    expect(document.body.textContent).not.toContain("integration pending");
  });

  it("renders no mojibake anywhere on the page", () => {
    render(<Home />);
    // Double-encoded UTF-8 artifacts (Â, â€) must never reach the DOM.
    expect(document.body.textContent).not.toMatch(/Â|â€/);
  });

  it("keeps the DC-only jurisdiction note on the page", () => {
    render(<Home />);

    const notes = screen.getAllByText(
      /licensed in the District of Columbia\./,
    );
    expect(notes.length).toBeGreaterThan(0);
    expect(
      notes.some((n) => n.textContent?.includes("outside DC may require")),
    ).toBe(true);
  });

  it("ends with the working intake form, not a scheduler placeholder", () => {
    render(<Home />);

    expect(document.getElementById("first-move")).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Make The First Move" }),
    ).toBeTruthy();
    expect(document.querySelector(".calendly-placeholder")).toBeNull();
  });
});
