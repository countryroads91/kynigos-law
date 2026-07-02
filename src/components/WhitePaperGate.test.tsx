// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import WhitePaperGate from "./WhitePaperGate";

afterEach(cleanup);

// Regression: ISSUE-002—two gates on one page shared hardcoded input ids, so
// the second paper's labels focused the first paper's inputs.
// Found by /qa on 2026-07-01.
describe("WhitePaperGate", () => {
  it("renders two instances with unique, correctly-associated ids", () => {
    render(
      <>
        <WhitePaperGate paper="A" file="/a.pdf" fileName="a.pdf" />
        <WhitePaperGate paper="B" file="/b.pdf" fileName="b.pdf" />
      </>,
    );

    const nameInputs = screen.getAllByLabelText("Name");
    const emailInputs = screen.getAllByLabelText("Email");
    expect(nameInputs).toHaveLength(2);
    expect(emailInputs).toHaveLength(2);

    const ids = [...nameInputs, ...emailInputs].map((el) => el.id);
    expect(new Set(ids).size).toBe(ids.length);

    const allIds = Array.from(document.querySelectorAll("[id]")).map(
      (el) => el.id,
    );
    expect(allIds.filter((v, i) => allIds.indexOf(v) !== i)).toEqual([]);
  });
});
