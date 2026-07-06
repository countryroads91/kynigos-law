// @vitest-environment jsdom
import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import EngagementShapes from "./EngagementShapes";

afterEach(cleanup);

function triggers() {
  return Array.from(
    document.querySelectorAll("button.games-row--trigger"),
  ) as HTMLButtonElement[];
}

describe("EngagementShapes", () => {
  it("renders three fee shapes, all collapsed, with disclosure wiring", () => {
    render(<EngagementShapes />);

    const rows = triggers();
    expect(rows.length).toBe(3);
    for (const row of rows) {
      expect(row.getAttribute("aria-expanded")).toBe("false");
      const panel = document.getElementById(
        row.getAttribute("aria-controls")!,
      )!;
      expect(panel.hasAttribute("hidden")).toBe(true);
      expect(panel.getAttribute("aria-labelledby")).toBe(row.id);
    }
  });

  it("expands each shape into a four-block illustrative matter", () => {
    render(<EngagementShapes />);

    for (const row of triggers()) {
      fireEvent.click(row);
      const panel = document.getElementById(
        row.getAttribute("aria-controls")!,
      )!;
      expect(panel.hasAttribute("hidden")).toBe(false);
      const heads = Array.from(panel.querySelectorAll("dt")).map(
        (dt) => dt.textContent,
      );
      expect(heads).toEqual([
        "The objective",
        "The work",
        "The fee",
        "Why it fits",
      ]);
    }
  });

  it("toggles closed again and keeps independent rows independent", () => {
    render(<EngagementShapes />);

    const [first, second] = triggers();
    fireEvent.click(first);
    fireEvent.click(second);
    expect(first.getAttribute("aria-expanded")).toBe("true");
    expect(second.getAttribute("aria-expanded")).toBe("true");

    fireEvent.click(first);
    expect(first.getAttribute("aria-expanded")).toBe("false");
    expect(second.getAttribute("aria-expanded")).toBe("true");
  });
});
