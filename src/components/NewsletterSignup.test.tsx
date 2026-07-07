// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// NEWSLETTER_ENABLED is captured at module load, so each test stubs the env
// first and imports the component fresh.
async function loadSignup() {
  const mod = await import("./NewsletterSignup");
  return mod.default;
}

beforeEach(() => {
  vi.resetModules();
});

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("NewsletterSignup", () => {
  it("renders nothing until NEXT_PUBLIC_NEWSLETTER_ENABLED is set (feature off)", async () => {
    vi.stubEnv("NEXT_PUBLIC_NEWSLETTER_ENABLED", "");
    const NewsletterSignup = await loadSignup();
    const { container } = render(<NewsletterSignup />);
    expect(container.innerHTML).toBe("");
  });

  it("submits the email with the untouched honeypot and shows the check-your-inbox state", async () => {
    vi.stubEnv("NEXT_PUBLIC_NEWSLETTER_ENABLED", "1");
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ ok: true }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const NewsletterSignup = await loadSignup();
    const { container } = render(<NewsletterSignup />);
    fireEvent.change(container.querySelector("input[type='email']")!, {
      target: { value: "reader@example.com" },
    });
    fireEvent.submit(container.querySelector("form")!);

    const status = await screen.findByRole("status");
    expect(status.textContent).toMatch(/check your inbox/i);

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/subscribe");
    expect(JSON.parse((init as RequestInit).body as string)).toMatchObject({
      email: "reader@example.com",
      company: "",
    });
  });

  it("surfaces the server's error message", async () => {
    vi.stubEnv("NEXT_PUBLIC_NEWSLETTER_ENABLED", "1");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: () =>
          Promise.resolve({ ok: false, error: "Please enter a valid email address." }),
      }),
    );
    const NewsletterSignup = await loadSignup();
    const { container } = render(<NewsletterSignup />);
    fireEvent.change(container.querySelector("input[type='email']")!, {
      target: { value: "reader@example.com" },
    });
    fireEvent.submit(container.querySelector("form")!);
    const alert = await screen.findByRole("alert");
    expect(alert.textContent).toContain("valid email");
  });
});
