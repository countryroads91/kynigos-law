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

import WhitePapersPage from "./page";
import { papers } from "@/content/papers";

afterEach(cleanup);

describe("White papers page", () => {
  it("presents every paper with an executive summary", () => {
    render(<WhitePapersPage />);

    expect(screen.getAllByText("Executive Summary").length).toBe(papers.length);
    for (const paper of papers) {
      expect(screen.getByRole("heading", { name: paper.title })).toBeTruthy();
      expect(screen.getByText(paper.summary)).toBeTruthy();
    }
  });

  it("links related Kynigos publications from relatedPosts only", () => {
    const { container } = render(<WhitePapersPage />);

    // Misaligned Incentives is introduced in two publications.
    expect(
      container.querySelector(
        'a[href="/blog/your-lawyer-has-an-incentive-problem"]',
      )?.textContent,
    ).toBe("Your Lawyer Has an Incentive Problem");
    expect(
      container.querySelector(
        'a[href="/blog/why-divorce-makes-you-bad-at-math"]',
      )?.textContent,
    ).toBe("Why Divorce Makes You Bad at Math");
    // The Market for Lemons has no related posts—no invented relationships.
    const relations = [...container.querySelectorAll(".insight-relation")];
    expect(relations.length).toBe(2);
    expect(
      screen.getAllByText(/Introduced in the Kynigos publication/).length,
    ).toBe(2);
  });

  it("keeps the download gates and the in-production note", () => {
    render(<WhitePapersPage />);

    expect(
      screen.getAllByRole("button", { name: "Download the White Paper" })
        .length,
    ).toBe(papers.length);
    expect(screen.getByText(/behavioral contract theory/)).toBeTruthy();
  });

  it("emits Report JSON-LD with institutional authorship only", () => {
    const { container } = render(<WhitePapersPage />);

    const script = container.querySelector('script[type="application/ld+json"]');
    const data = JSON.parse(script!.textContent!);
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(papers.length);
    for (const entry of data) {
      expect(entry["@type"]).toBe("Report");
      expect(entry.author).toEqual({
        "@type": "Organization",
        name: "Kynigos Law Firm, PLLC",
      });
    }
    expect(document.body.textContent).not.toContain("Misaghi");
  });
});
