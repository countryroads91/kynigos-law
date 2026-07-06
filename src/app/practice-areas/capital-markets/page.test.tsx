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

import CapitalMarketsPage from "./page";

afterEach(cleanup);

describe("Capital Markets page", () => {
  it("renders the H1 and a breadcrumb back to the practice-areas index", () => {
    render(<CapitalMarketsPage />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Capital Markets" }),
    ).toBeTruthy();
    expect(
      screen
        .getByRole("link", { name: "Practice Areas" })
        .getAttribute("href"),
    ).toBe("/practice-areas");
  });

  it("keeps the DC-only note, no Maryland, and no invented dollar amounts", () => {
    render(<CapitalMarketsPage />);

    expect(
      screen.getByText(
        /licensed in the District of Columbia only/,
      ),
    ).toBeTruthy();
    expect(document.body.textContent).not.toContain("Maryland");
    expect(document.body.textContent).not.toMatch(/\$\d/);
  });

  it("states the co-counsel requirement for multi-state opinions", () => {
    render(<CapitalMarketsPage />);

    expect(
      screen.getAllByText(/multi-state opinions require\s+co-counsel/i).length,
    ).toBeGreaterThan(0);
  });
});
