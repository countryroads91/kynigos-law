// @vitest-environment jsdom
import { cleanup, fireEvent, render } from "@testing-library/react";
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

import PracticeDirectory from "./PracticeDirectory";
import { PRACTICE_GROUPS } from "@/content/practices";

afterEach(cleanup);

function firstTrigger() {
  return document.querySelector("button.pa-trigger") as HTMLButtonElement;
}

describe("PracticeDirectory", () => {
  it("renders every service collapsed, with correct disclosure wiring", () => {
    render(<PracticeDirectory />);

    const triggers = document.querySelectorAll("button.pa-trigger");
    for (const trigger of triggers) {
      expect(trigger.getAttribute("aria-expanded")).toBe("false");
      const panel = document.getElementById(
        trigger.getAttribute("aria-controls")!,
      )!;
      expect(panel.hasAttribute("hidden")).toBe(true);
      expect(panel.getAttribute("aria-labelledby")).toBe(trigger.id);
    }
  });

  it("expands a service on click and collapses it on the second click", () => {
    render(<PracticeDirectory />);

    const trigger = firstTrigger();
    fireEvent.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    const panel = document.getElementById(
      trigger.getAttribute("aria-controls")!,
    )!;
    expect(panel.hasAttribute("hidden")).toBe(false);
    expect(panel.textContent).toContain(
      PRACTICE_GROUPS[0].services[0].description,
    );
    // Every expanded service offers a way to start.
    expect(
      Array.from(panel.querySelectorAll("a")).some(
        (a) => a.getAttribute("href") === "/contact",
      ),
    ).toBe(true);

    fireEvent.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(panel.hasAttribute("hidden")).toBe(true);
  });

  it("allows multiple panels open at once (independent disclosures)", () => {
    render(<PracticeDirectory />);

    const triggers = Array.from(
      document.querySelectorAll("button.pa-trigger"),
    ) as HTMLButtonElement[];
    fireEvent.click(triggers[0]);
    fireEvent.click(triggers[1]);
    expect(triggers[0].getAttribute("aria-expanded")).toBe("true");
    expect(triggers[1].getAttribute("aria-expanded")).toBe("true");
  });

  it("shows a fee badge on every service row", () => {
    render(<PracticeDirectory />);

    const badges = document.querySelectorAll(".pa-trigger .fee-badge");
    const total = PRACTICE_GROUPS.reduce((n, g) => n + g.services.length, 0);
    expect(badges.length).toBe(total);
  });

  it("links each flagship group to its deep practice page", () => {
    render(<PracticeDirectory />);

    for (const group of PRACTICE_GROUPS) {
      if (!group.flagship) continue;
      const section = document.getElementById(group.slug)!;
      const flagship = section.querySelector("a.pa-flagship")!;
      expect(flagship.getAttribute("href")).toBe(group.flagship.href);
    }
  });

  it("offers a full-practice-page link only for services with a deep page", () => {
    render(<PracticeDirectory />);

    const triggers = Array.from(
      document.querySelectorAll("button.pa-trigger"),
    ) as HTMLButtonElement[];
    const services = PRACTICE_GROUPS.flatMap((g) => g.services);
    expect(triggers.length).toBe(services.length);

    services.forEach((service, i) => {
      fireEvent.click(triggers[i]);
      const panel = document.getElementById(
        triggers[i].getAttribute("aria-controls")!,
      )!;
      const deepLinks = Array.from(panel.querySelectorAll("a")).filter(
        (a) => a.textContent!.includes("Full practice page"),
      );
      if (service.href) {
        expect(deepLinks.length).toBe(1);
        expect(deepLinks[0].getAttribute("href")).toBe(service.href);
      } else {
        expect(deepLinks.length).toBe(0);
      }
    });
  });
});
