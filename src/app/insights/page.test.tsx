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

import InsightsPage from "./page";

afterEach(cleanup);

describe("Insights hub", () => {
  it("renders the three channel sections with their kickers", () => {
    const { container } = render(<InsightsPage />);

    expect(container.querySelector("section#essays")).toBeTruthy();
    expect(container.querySelector("section#publications")).toBeTruthy();
    expect(container.querySelector("section#papers")).toBeTruthy();
    expect(screen.getByText("Personal Essays")).toBeTruthy();
    expect(screen.getByText("Kynigos Publications")).toBeTruthy();
    expect(screen.getByText("White Papers")).toBeTruthy();
  });

  it("features I Have Been the Client as the why-the-firm-exists essay", () => {
    const { container } = render(<InsightsPage />);

    const featured = container.querySelector(
      "article.insight-card--essay",
    ) as HTMLElement;
    expect(featured).toBeTruthy();
    expect(featured.textContent).toContain("I Have Been the Client");
    expect(featured.textContent).toContain("why-the-firm-exists");
    expect(
      featured.querySelector('a[href="/blog/i-have-been-the-client"]'),
    ).toBeTruthy();
    expect(featured.querySelector('a[href="/about"]')).toBeTruthy();
  });

  it("labels each channel correctly and keeps the personal name off publication cards", () => {
    const { container } = render(<InsightsPage />);

    const essayCards = container.querySelectorAll("a.insight-card--essay");
    expect(essayCards.length).toBeGreaterThan(0);
    for (const card of essayCards) {
      expect(card.textContent).toContain("Personal Essay");
      expect(card.textContent).toContain(
        "By Bayan Misaghi, Esq., Managing Partner",
      );
    }

    const pubCards = container.querySelectorAll("a.insight-card--publication");
    expect(pubCards.length).toBeGreaterThan(0);
    for (const card of pubCards) {
      expect(card.textContent).toContain("Kynigos Publication");
      expect(card.textContent).toContain("By Kynigos Law Firm");
      // Authorship is the point: publications never carry the personal name.
      expect(card.textContent).not.toContain("Bayan");
      expect(card.textContent).not.toContain("Misaghi");
    }
  });

  it("shows real article-to-paper relationships from relatedPaper only", () => {
    const { container } = render(<InsightsPage />);

    const pubCards = [
      ...container.querySelectorAll("a.insight-card--publication"),
    ];
    // Both current publications relate to Misaligned Incentives via posts.ts.
    for (const card of pubCards) {
      expect(card.textContent).toContain(
        "Based on the Kynigos white paper Misaligned Incentives",
      );
    }
  });

  it("renders paper cards linking to /white-papers with the in-production note unlinked", () => {
    const { container } = render(<InsightsPage />);

    const paperCards = [...container.querySelectorAll("a.insight-card--paper")];
    expect(paperCards.length).toBe(2);
    for (const card of paperCards) {
      expect(card.getAttribute("href")).toBe("/white-papers");
    }
    const note = screen.getByText(/behavioral contract theory/);
    expect(note.querySelector("a")).toBeNull();
  });
});
