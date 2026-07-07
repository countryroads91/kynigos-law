// @vitest-environment jsdom
// With a Turnstile site key configured, every lead form must hold its submit
// button until the challenge resolves—and release it once a token arrives.
// TURNSTILE_SITE_KEY is a module-level const, so this file simulates the
// configured state by mocking the widget module rather than stubbing env.
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("./TurnstileWidget", () => ({
  TURNSTILE_SITE_KEY: "test-site-key",
  default: ({ onToken }: { onToken: (t: string) => void }) => (
    <button type="button" onClick={() => onToken("tok-1")}>
      solve challenge
    </button>
  ),
}));

import ContactForm from "./ContactForm";
import FirstMove from "./FirstMove";
import WhitePaperGate from "./WhitePaperGate";

afterEach(cleanup);

function expectGatedSubmit(buttonName: string) {
  const submit = screen.getByRole("button", {
    name: buttonName,
  }) as HTMLButtonElement;
  expect(submit.disabled).toBe(true);
  fireEvent.click(screen.getByRole("button", { name: "solve challenge" }));
  expect(submit.disabled).toBe(false);
}

describe("Turnstile submit gating (site key configured)", () => {
  it("ContactForm disables Send Message until the challenge resolves", () => {
    render(<ContactForm />);
    expectGatedSubmit("Send Message");
  });

  it("FirstMove disables its submit until the challenge resolves", () => {
    render(<FirstMove />);
    expectGatedSubmit("Make The First Move");
  });

  it("WhitePaperGate disables the download until the challenge resolves", () => {
    render(<WhitePaperGate paper="A" slug="paper-a" fileName="a.pdf" />);
    expectGatedSubmit("Download the White Paper");
  });
});
