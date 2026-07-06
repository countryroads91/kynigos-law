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

import DisclaimerPage from "./page";

afterEach(cleanup);

describe("Disclaimer & Terms of Use page", () => {
  it("states that the site and its forms create no attorney-client relationship", () => {
    render(<DisclaimerPage />);

    expect(
      screen.getByRole("heading", {
        name: "Website Disclaimer & Terms of Use",
      }),
    ).toBeTruthy();
    expect(
      screen.getByRole("heading", { name: "No attorney-client relationship" }),
    ).toBeTruthy();
    expect(
      screen.getByText(/does not create an\s+attorney-client relationship/),
    ).toBeTruthy();
  });

  it("keeps the DC-only licensure statement with no Maryland claim", () => {
    render(<DisclaimerPage />);

    expect(
      screen.getByText(
        /licensed to practice law in the District\s+of Columbia only/,
      ),
    ).toBeTruthy();
    expect(document.body.textContent).not.toContain("Maryland");
  });

  it("shows the last-updated line", () => {
    render(<DisclaimerPage />);
    expect(screen.getByText("Last updated July 6, 2026")).toBeTruthy();
  });
});
