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

import NotFound from "./not-found";

afterEach(cleanup);

describe("404 page", () => {
  it("shows the branded headline and the 404 kicker", () => {
    render(<NotFound />);

    expect(
      screen.getByRole("heading", { name: "This page has no matter on file." }),
    ).toBeTruthy();
    expect(screen.getByText("404")).toBeTruthy();
  });

  it("links back to the main sections of the site", () => {
    render(<NotFound />);

    const links: Array<[string, string]> = [
      ["Back to Home", "/"],
      ["Practice Areas", "/practice-areas"],
      ["Insights", "/insights"],
      ["Contact", "/contact"],
    ];
    for (const [name, href] of links) {
      expect(screen.getByRole("link", { name }).getAttribute("href")).toBe(
        href,
      );
    }
  });
});
