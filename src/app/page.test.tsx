// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }: React.ComponentProps<"a"> & { href: string }) => (
    <a href={href} {...rest}>{children}</a>
  ),
}));

import Home from "../app/page";

afterEach(cleanup);

describe("Redesigned home page", () => {
  it("keeps the central promise static and routes visitors into the audience paths", () => {
    render(<Home />);

    expect(screen.getByRole("heading", { level: 1 }).textContent).toContain(
      "Your attorney should have skin in the game.",
    );
    expect(document.querySelector(".reel-track")).toBeNull();
    expect(screen.getByRole("link", { name: "Find Your Legal Path" }).getAttribute("href")).toBe("#paths");
    expect(document.getElementById("paths")).toBeTruthy();
    expect(screen.getByRole("link", { name: "How Our Fees Work" }).getAttribute("href")).toBe("/how-it-works");
  });

  it("provides three audience doors as the primary information architecture", () => {
    render(<Home />);

    const paths = document.getElementById("paths")!;
    const cards = paths.querySelectorAll("a.pathway-card");
    expect(cards.length).toBe(3);
    expect(Array.from(cards).map((card) => card.getAttribute("href"))).toEqual([
      "/people",
      "/businesses",
      "/capital",
    ]);
    expect(paths.textContent).toContain("Individuals & Families");
    expect(paths.textContent).toContain("Owners & Professionals");
    expect(paths.textContent).toContain("Lenders & Investors");
  });

  it("features six concrete engagements with fee structures", () => {
    render(<Home />);

    const rows = document.querySelectorAll("#engagements a.engagement-row");
    expect(rows.length).toBe(6);
    const text = document.getElementById("engagements")!.textContent ?? "";
    for (const title of [
      "Staged-Fee Divorce",
      "Professional Contract Review",
      "Business Counsel",
      "Practice & Partner Transactions",
      "Private Lender Counsel",
      "DC Legal Opinion Letters",
    ]) expect(text).toContain(title);
    expect(text).toContain("Staged fixed fee");
    expect(text).toContain("Deal or portfolio fee");
  });

  it("turns Calculated, Zealous, and Invested into evidenced promises", () => {
    render(<Home />);

    const band = document.querySelector(".promise-band")!;
    expect(band.querySelectorAll(".promise-list li").length).toBe(3);
    expect(band.textContent).toContain("Define the game");
    expect(band.textContent).toContain("Earn the next stage");
    expect(band.textContent).toContain("Carry real risk");
  });

  it("shows founder-led trust without publishing the founder's name", () => {
    render(<Home />);

    const founder = document.querySelector(".founder-story")!;
    expect(founder.textContent).toContain("The Attorney Behind the Model");
    expect(founder.textContent).toContain("Founder-led engagements");
    expect(founder.textContent).toContain("District of Columbia");
    expect(founder.textContent).not.toContain("Bayan");
  });

  it("shows the four-decision engagement loop", () => {
    render(<Home />);
    const loop = document.querySelector(".engagement-loop")!;
    expect(loop.querySelectorAll(".loop-steps li").length).toBe(4);
    expect(loop.textContent).toContain("Tell us what is at stake.");
    expect(loop.textContent).toContain("Approve a scope and price.");
    expect(loop.textContent).toContain("Decide what comes next.");
  });

  it("uses a curated product ticker instead of the old breadth manifesto", () => {
    render(<Home />);
    const ticker = document.querySelector(".product-ticker")!;
    expect(ticker.textContent).toContain("Practice Buyouts");
    expect(ticker.textContent).toContain("DC Legal Opinions");
    expect(ticker.textContent).not.toContain("Not for Feeding the Clock");
  });

  it("keeps insights, contact, jurisdiction, and encoding safeguards", () => {
    render(<Home />);
    expect(document.getElementById("insights")).toBeTruthy();
    expect(document.getElementById("first-move")).toBeTruthy();
    expect(document.body.textContent).toMatch(/licensed in the District of Columbia\./i);
    expect(document.body.textContent).not.toMatch(/Â|â€/);
  });
});
