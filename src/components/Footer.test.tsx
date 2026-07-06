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

import Footer from "./Footer";
import { PRACTICE_GROUPS } from "@/content/practices";

afterEach(cleanup);

describe("Footer", () => {
  it("links every practice group into the directory anchors", () => {
    render(<Footer />);

    const hrefs = screen
      .getAllByRole("link")
      .map((a) => a.getAttribute("href"));
    expect(hrefs).toContain("/practice-areas");
    for (const group of PRACTICE_GROUPS) {
      expect(hrefs).toContain(`/practice-areas#${group.slug}`);
    }
  });

  it("keeps firm contact details and the DC-only disclaimer", () => {
    render(<Footer />);

    expect(
      screen.getByRole("link", { name: "info@kynigos.law" }).getAttribute(
        "href",
      ),
    ).toBe("mailto:info@kynigos.law");
    expect(document.body.textContent).toContain(
      "licensed to practice law in the District of Columbia only",
    );
    expect(document.body.textContent).not.toContain("Maryland");
    expect(document.body.textContent).not.toContain("Bayan");
  });

  it("keeps the legal row and cookie settings entry point", () => {
    render(<Footer />);

    for (const label of [
      "Privacy Policy",
      "Website Disclaimer",
      "Attorney Advertising",
      "Cookie Policy",
      "Accessibility",
    ]) {
      expect(screen.getByRole("link", { name: label })).toBeTruthy();
    }
    expect(
      screen.getByRole("button", { name: /cookie settings/i }),
    ).toBeTruthy();
  });
});
