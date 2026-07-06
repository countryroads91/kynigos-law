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

import LandlordTenantPage from "./page";

afterEach(cleanup);

describe("Landlord-Tenant page", () => {
  it("renders the H1 and a breadcrumb back to the practice-areas index", () => {
    render(<LandlordTenantPage />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Landlord-Tenant" }),
    ).toBeTruthy();
    expect(
      screen
        .getByRole("link", { name: "Practice Areas" })
        .getAttribute("href"),
    ).toBe("/practice-areas");
  });

  it("keeps the DC-only note, no Maryland, and no invented dollar amounts", () => {
    render(<LandlordTenantPage />);

    expect(
      screen.getAllByText(/licensed in the District of Columbia only/).length,
    ).toBeGreaterThan(0);
    expect(document.body.textContent).not.toContain("Maryland");
    expect(document.body.textContent).not.toMatch(/\$\d/);
  });

  it("states the hybrid fee shape without a number", () => {
    render(<LandlordTenantPage />);

    expect(
      screen.getByText("Fixed fee + success component"),
    ).toBeTruthy();
  });
});
