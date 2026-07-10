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

import PhilosophyPage from "./page";

afterEach(cleanup);

describe("Philosophy page", () => {
  it("states the six-word rule and keeps the DC-only license note", () => {
    render(<PhilosophyPage />);

    expect(
      screen.getByRole("heading", { name: "Play to Win. Win to Play." }),
    ).toBeTruthy();
    // Jurisdiction—DC ONLY. The bar-admission line must say DC only.
    expect(
      screen.getByText(/Licensed in DC only—matters elsewhere get a prompt referral\./),
    ).toBeTruthy();
    expect(document.body.textContent).not.toContain("Maryland");
  });

  it("routes the closing CTAs to the homepage intake and the contact page", () => {
    render(<PhilosophyPage />);

    expect(
      screen.getByRole("link", { name: "Get Started" }).getAttribute("href"),
    ).toBe("/#first-move");
    expect(
      screen
        .getByRole("link", { name: "Book A Free Consultation" })
        .getAttribute("href"),
    ).toBe("/contact");
    expect(
      screen
        .getByRole("link", { name: "Read The White Papers" })
        .getAttribute("href"),
    ).toBe("/white-papers");
  });
});
