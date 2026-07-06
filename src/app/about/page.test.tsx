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

import AboutPage from "./page";

afterEach(cleanup);

describe("About page", () => {
  it("opens with the firm framing and keeps the DC-only license note", () => {
    render(<AboutPage />);

    expect(
      screen.getByRole("heading", {
        name: "A law firm built like an investment.",
      }),
    ).toBeTruthy();
    expect(
      screen.getByRole("heading", {
        name: "Licensed in the District of Columbia.",
      }),
    ).toBeTruthy();
    // Jurisdiction—DC ONLY. Never imply any other license.
    expect(document.body.textContent).toContain("licensed in DC only");
    expect(document.body.textContent).not.toContain("Maryland");
  });

  it("features the origin essay and routes to it and the philosophy", () => {
    render(<AboutPage />);

    expect(
      screen.getByText(/I have been the client\. I have paid large retainers/),
    ).toBeTruthy();
    // No personal names anywhere on the site, by request.
    expect(document.body.textContent).not.toContain("Bayan");
    expect(document.body.textContent).not.toContain("Misaghi");
    expect(
      screen.getByRole("link", { name: "Read the Essay" }).getAttribute("href"),
    ).toBe("/blog/i-have-been-the-client");
    expect(
      screen.getByRole("link", { name: "See How It Works" }).getAttribute("href"),
    ).toBe("/how-it-works");
    // Philosophy is linked from both the origin and model sections.
    for (const link of screen.getAllByRole("link", {
      name: "Read the Philosophy",
    })) {
      expect(link.getAttribute("href")).toBe("/philosophy");
    }
  });

  it("links the section directory to every top-level destination", () => {
    render(<AboutPage />);

    const hrefs = screen
      .getAllByRole("link")
      .map((a) => a.getAttribute("href"));
    for (const expected of [
      "/how-it-works",
      "/philosophy",
      "/practice-areas",
      "/contact",
    ]) {
      expect(hrefs).toContain(expected);
    }
  });
});
