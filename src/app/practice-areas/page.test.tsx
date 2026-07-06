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

import PracticeAreasPage from "./page";
import { PRACTICE_GROUPS, serviceCount } from "@/content/practices";

afterEach(cleanup);

describe("Practice Areas index page", () => {
  it("renders one H1, the five group sections, and every service row", () => {
    render(<PracticeAreasPage />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Five practice groups. One discipline.",
      }),
    ).toBeTruthy();

    // Each group is an anchor target with a matching index chip.
    for (const group of PRACTICE_GROUPS) {
      expect(document.getElementById(group.slug)).toBeTruthy();
    }
    const chips = document.querySelectorAll(".pa-index-link");
    expect(chips.length).toBe(PRACTICE_GROUPS.length);

    // Every service in the taxonomy appears as a disclosure trigger.
    const triggers = document.querySelectorAll("button.pa-trigger");
    expect(triggers.length).toBe(serviceCount());
  });

  it("keeps deep links to all four flagship practice pages", () => {
    render(<PracticeAreasPage />);

    const hrefs = screen
      .getAllByRole("link")
      .map((a) => a.getAttribute("href"));
    expect(hrefs).toContain("/practice-areas/family-law");
    expect(hrefs).toContain("/practice-areas/landlord-tenant");
    expect(hrefs).toContain("/practice-areas/capital-markets");
    expect(hrefs).toContain("/practice-areas/contract-review");
    expect(hrefs).toContain("/how-it-works");
  });

  it("replaces the shared-principle band with the fee-design module", () => {
    render(<PracticeAreasPage />);

    expect(document.body.textContent).not.toContain("The Shared Principle");
    expect(document.body.textContent).not.toContain(
      "roots for your problem",
    );
    const shapes = document.querySelectorAll(".fee-shape");
    expect(shapes.length).toBe(4);
    expect(document.body.textContent).toContain("Flat fee");
    expect(document.body.textContent).toContain("Staged fixed fees");
    expect(document.body.textContent).toContain("Fixed + success");
    expect(document.body.textContent).toContain("Quoted per matter");
  });

  it("keeps the DC-only note and invents no prices", () => {
    render(<PracticeAreasPage />);

    expect(
      screen.getByText(/licensed in the District of Columbia only/),
    ).toBeTruthy();
    expect(document.body.textContent).not.toContain("Maryland");
    // No dollar amounts on the index—$444 lives only on contract-review.
    expect(document.body.textContent).not.toMatch(/\$\d/);
  });
});
