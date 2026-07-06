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

import ContactPage from "./page";

afterEach(cleanup);

describe("Contact page", () => {
  it("renders the form and the firm's contact channels", () => {
    render(<ContactPage />);

    expect(
      screen.getByRole("heading", { name: "The first move is yours." }),
    ).toBeTruthy();
    expect(screen.getByRole("button", { name: "Send Message" })).toBeTruthy();
    expect(
      screen
        .getByRole("link", { name: "(304) 549-1058" })
        .getAttribute("href"),
    ).toBe("tel:+13045491058");
    expect(
      screen
        .getByRole("link", { name: "info@kynigos.law" })
        .getAttribute("href"),
    ).toBe("mailto:info@kynigos.law");
    expect(document.body.textContent).not.toContain("bayan@");
  });

  it("carries the confidentiality warning and links to the legal pages", () => {
    render(<ContactPage />);

    const text = document.body.textContent ?? "";
    expect(text).toMatch(/does not create an\s*attorney-client relationship/);
    expect(text).toMatch(/confidential or time-sensitive\s*information/);
    expect(
      screen.getByRole("link", { name: "Privacy Policy" }).getAttribute("href"),
    ).toBe("/legal/privacy");
    expect(
      screen
        .getByRole("link", { name: "Website Disclaimer & Terms of Use" })
        .getAttribute("href"),
    ).toBe("/legal/disclaimer");
  });

  it("keeps the DC-only jurisdiction note", () => {
    render(<ContactPage />);

    expect(
      screen.getByText(
        /licensed to practice law in the District of\s*Columbia only/,
      ),
    ).toBeTruthy();
    expect(document.body.textContent).not.toContain("Maryland");
  });
});
