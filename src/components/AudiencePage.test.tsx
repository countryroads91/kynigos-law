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

import PeoplePage from "@/app/people/page";
import BusinessesPage from "@/app/businesses/page";
import CapitalPage from "@/app/capital/page";
import { getAudience } from "@/content/audiences";

afterEach(cleanup);

const pages = [
  { slug: "people", Page: PeoplePage },
  { slug: "businesses", Page: BusinessesPage },
  { slug: "capital", Page: CapitalPage },
] as const;

describe("audience landing pages", () => {
  for (const { slug, Page } of pages) {
    it(`renders /${slug} with hero, matters, strip, and working intake`, () => {
      const audience = getAudience(slug)!;
      render(<Page />);

      // Hero speaks to the audience and routes to the intake anchor.
      expect(
        screen.getByRole("heading", { level: 1, name: audience.headline }),
      ).toBeTruthy();
      const cta = screen.getByRole("link", {
        name: "Tell Us What’s at Stake",
      });
      expect(cta.getAttribute("href")).toBe("#first-move");
      expect(document.getElementById("first-move")).toBeTruthy();

      // Every matter renders as a card with its fee shape.
      const cards = document.querySelectorAll("a.flagship-card");
      expect(cards.length).toBe(audience.matters.length);
      for (const matter of audience.matters) {
        expect(document.body.textContent).toContain(matter.name);
      }

      // The audience strip is anchored for deep links.
      expect(document.getElementById(audience.strip.id)).toBeTruthy();

      // The intake form works—no scheduler or upload placeholders—and its
      // prompt speaks this audience's language.
      expect(
        screen.getByRole("button", { name: "Make The First Move" }),
      ).toBeTruthy();
      const textarea = document.querySelector(".first-move-textarea")!;
      expect(textarea.getAttribute("placeholder")).toBe(audience.intakePrompt);
      expect(document.body.textContent).not.toContain("integration pending");

      // House rules: DC-only note present, no mojibake, no personal names.
      expect(document.body.textContent).toContain("District of Columbia");
      expect(document.body.textContent).not.toMatch(/Â|â€/);
      expect(document.body.textContent).not.toContain("Bayan");
    });
  }
});
