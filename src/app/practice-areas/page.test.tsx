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

afterEach(cleanup);

describe("Practice Areas index page", () => {
  it("renders one H1 and links to all four practice areas", () => {
    render(<PracticeAreasPage />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Four practices. One model." }),
    ).toBeTruthy();

    const hrefs = screen
      .getAllByRole("link")
      .map((a) => a.getAttribute("href"));
    expect(hrefs).toContain("/practice-areas/family-law");
    expect(hrefs).toContain("/practice-areas/landlord-tenant");
    expect(hrefs).toContain("/practice-areas/capital-markets");
    expect(hrefs).toContain("/practice-areas/contract-review");
    expect(hrefs).toContain("/how-it-works");
  });

  it("keeps the DC-only note and invents no prices", () => {
    render(<PracticeAreasPage />);

    expect(
      screen.getByText(
        /licensed in the District of Columbia only/,
      ),
    ).toBeTruthy();
    expect(document.body.textContent).not.toContain("Maryland");
    // No dollar amounts on the index—$444 lives only on contract-review.
    expect(document.body.textContent).not.toMatch(/\$\d/);
  });
});
