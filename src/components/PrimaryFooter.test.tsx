// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }: React.ComponentProps<"a"> & { href: string }) => (
    <a href={href} {...rest}>{children}</a>
  ),
}));

import PrimaryFooter from "./PrimaryFooter";

afterEach(cleanup);

describe("PrimaryFooter", () => {
  it("repeats the three client paths and keeps required firm details", () => {
    render(<PrimaryFooter />);
    expect(screen.getByRole("link", { name: "Individuals & Families" }).getAttribute("href")).toBe("/people");
    expect(screen.getByRole("link", { name: "Owners & Professionals" }).getAttribute("href")).toBe("/businesses");
    expect(screen.getByRole("link", { name: "Lenders & Investors" }).getAttribute("href")).toBe("/capital");
    expect(screen.getByRole("link", { name: "info@kynigos.law" }).getAttribute("href")).toBe("mailto:info@kynigos.law");
    expect(document.body.textContent).toContain("licensed to practice law in the District of Columbia only");
  });
});
