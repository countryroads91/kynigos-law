// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

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

import Home from "./page";

beforeAll(() => {
  // jsdom has no matchMedia; HeadlineReel uses it for prefers-reduced-motion.
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
});

afterEach(cleanup);

describe("Home page", () => {
  it("anchors the hero button to the three-step How It Works section", () => {
    render(<Home />);

    const anchor = screen.getByRole("link", { name: "How It Works" });
    expect(anchor.getAttribute("href")).toBe("#how-it-works");

    const section = document.getElementById("how-it-works");
    expect(section).toBeTruthy();
    expect(section!.querySelectorAll(".process-step").length).toBe(3);
    // Section CTA points at the full page, not another anchor.
    const learnMore = screen.getByRole("link", { name: "Learn More" });
    expect(learnMore.getAttribute("href")).toBe("/how-it-works");
  });

  it("renders the in-flow ticker band and the DC-only jurisdiction note", () => {
    render(<Home />);

    // TickerBar moved out of the layout; the homepage must render it itself.
    expect(document.querySelector(".ticker")).toBeTruthy();

    const note = screen.getByText(/licensed in the District of Columbia/);
    expect(note.textContent).toContain("outside DC may require referral");
  });
});
