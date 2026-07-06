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

import HowItWorksPage from "./page";

afterEach(cleanup);

describe("How it Works page", () => {
  it("lays out the four-step flow, the fee-matching board, and real examples", () => {
    render(<HowItWorksPage />);

    // Four numbered steps in order.
    const steps = document.querySelectorAll(".process-steps--four .process-step");
    expect(steps.length).toBe(4);
    expect(steps[0].textContent).toContain("Free consultation");
    expect(steps[3].textContent).toContain("You decide what’s next");

    // Three game/skin/fee rows and four worked examples.
    expect(document.querySelectorAll(".games-row").length).toBe(3);
    expect(document.querySelectorAll(".example-card").length).toBe(4);
    // The one posted price on the site.
    expect(document.body.textContent).toContain("$444");

    // DC-only jurisdiction note survives the rewrite.
    expect(
      screen.getByText(/licensed in the District of Columbia\./),
    ).toBeTruthy();
    expect(document.body.textContent).not.toContain("Maryland");

    // Closing CTAs route to the philosophy page and the homepage fork.
    expect(
      screen
        .getByRole("link", { name: "Read The Philosophy" })
        .getAttribute("href"),
    ).toBe("/philosophy");
    expect(
      screen.getByRole("link", { name: "Get Started" }).getAttribute("href"),
    ).toBe("/#get-started");
  });
});
