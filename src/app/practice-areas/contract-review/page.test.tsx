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

import ContractReviewPage from "./page";

afterEach(cleanup);

describe("Professional Contract Review page", () => {
  it("renders the H1 and a breadcrumb back to the practice-areas index", () => {
    render(<ContractReviewPage />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Professional Contract Review",
      }),
    ).toBeTruthy();
    expect(
      screen
        .getByRole("link", { name: "Practice Areas" })
        .getAttribute("href"),
    ).toBe("/practice-areas");
  });

  it("keeps the DC-only note and never mentions Maryland", () => {
    render(<ContractReviewPage />);

    expect(
      screen.getAllByText(/licensed in the District of Columbia only/).length,
    ).toBeGreaterThan(0);
    expect(document.body.textContent).not.toContain("Maryland");
  });

  it("states $444 as the only dollar amount on the site's practice pages", () => {
    render(<ContractReviewPage />);

    const amounts = document.body.textContent?.match(/\$\d[\d,.]*/g) ?? [];
    expect(amounts.length).toBeGreaterThan(0);
    for (const amount of amounts) {
      expect(amount).toBe("$444");
    }
  });

  it("offers the info@kynigos.law email fallback while checkout is pending", () => {
    render(<ContractReviewPage />);

    const mailLinks = screen
      .getAllByRole("link")
      .map((a) => a.getAttribute("href"))
      .filter((href) => href?.startsWith("mailto:"));
    expect(mailLinks).toContain("mailto:info@kynigos.law");
    expect(document.body.textContent).not.toContain("bayan@");
  });
});
