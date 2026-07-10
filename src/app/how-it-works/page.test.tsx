// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
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
  it("lays out the four-step flow and the interactive fee-shape board", () => {
    render(<HowItWorksPage />);

    // Four numbered steps in order.
    const steps = document.querySelectorAll(".process-steps--four .process-step");
    expect(steps.length).toBe(4);
    expect(steps[0].textContent).toContain("Free consultation");
    expect(steps[3].textContent).toContain("You decide what’s next");

    // Three expandable fee-shape rows replace the static examples grid.
    const triggers = document.querySelectorAll("button.games-row--trigger");
    expect(triggers.length).toBe(3);
    expect(document.querySelectorAll(".example-card").length).toBe(0);
    expect(document.body.textContent).not.toContain(
      "What that looks like on real matters",
    );

    // DC-only jurisdiction note survives the rewrite.
    expect(
      screen.getByText(/licensed in the District of Columbia\./),
    ).toBeTruthy();
    expect(document.body.textContent).not.toContain("Maryland");

    // Closing CTAs route to the philosophy page and the homepage intake.
    expect(
      screen
        .getByRole("link", { name: "Read The Philosophy" })
        .getAttribute("href"),
    ).toBe("/philosophy");
    expect(
      screen.getByRole("link", { name: "Get Started" }).getAttribute("href"),
    ).toBe("/#first-move");
  });

  it("reveals an illustrative matter when a fee shape is expanded", () => {
    render(<HowItWorksPage />);

    const triggers = Array.from(
      document.querySelectorAll("button.games-row--trigger"),
    ) as HTMLButtonElement[];

    // Collapsed by default.
    for (const trigger of triggers) {
      expect(trigger.getAttribute("aria-expanded")).toBe("false");
    }

    // The review shape carries the one posted price on the site.
    const review = triggers.find((t) =>
      t.textContent!.includes("Review & advice"),
    )!;
    fireEvent.click(review);
    expect(review.getAttribute("aria-expanded")).toBe("true");
    const panel = document.getElementById(
      review.getAttribute("aria-controls")!,
    )!;
    expect(panel.hasAttribute("hidden")).toBe(false);
    expect(panel.textContent).toContain("$444");
    expect(panel.textContent).toContain("Why it fits");
  });
});
