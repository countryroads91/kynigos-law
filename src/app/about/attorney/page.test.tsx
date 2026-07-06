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

import AttorneyPage from "./page";

afterEach(cleanup);

describe("Attorney page", () => {
  it("names the attorney and keeps the DC-only license note", () => {
    render(<AttorneyPage />);

    expect(
      screen.getByRole("heading", { name: "Bayan Misaghi, Esq." }),
    ).toBeTruthy();
    expect(screen.getByText("Managing Partner")).toBeTruthy();
    // Jurisdiction—DC ONLY. The bar-admission line must say DC only.
    expect(
      screen.getByText(
        /Licensed in DC only—matters elsewhere get a prompt referral\./,
      ),
    ).toBeTruthy();
    expect(document.body.textContent).not.toContain("Maryland");
  });

  it("breadcrumbs back to About and lists the career timeline", () => {
    render(<AttorneyPage />);

    const breadcrumb = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(breadcrumb.textContent).toContain("The Attorney");
    expect(
      screen.getByRole("link", { name: "About" }).getAttribute("href"),
    ).toBe("/about");
    for (const org of [
      "Goldman Sachs",
      "Invictus Capital Partners",
      "LendingOne",
      "Rocade Capital",
      "Antonin Scalia Law School",
      "Washington and Lee University",
      "District of Columbia Bar",
    ]) {
      expect(screen.getByText(org)).toBeTruthy();
    }
  });

  it("links both personal essays and the closing CTAs", () => {
    render(<AttorneyPage />);

    const hrefs = screen
      .getAllByRole("link")
      .map((a) => a.getAttribute("href"));
    expect(hrefs).toContain("/blog/i-have-been-the-client");
    expect(hrefs).toContain("/blog/i-watched-the-meter-run");
    expect(
      screen
        .getByRole("link", { name: "Book A Free Consultation" })
        .getAttribute("href"),
    ).toBe("/contact");
    expect(
      screen
        .getByRole("link", { name: "Read the Philosophy" })
        .getAttribute("href"),
    ).toBe("/philosophy");
  });
});
