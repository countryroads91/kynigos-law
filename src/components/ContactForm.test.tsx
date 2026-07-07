// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ContactForm from "./ContactForm";

// track() is env- and consent-gated (no-op here), so the GA4 wiring is
// asserted through a mock rather than the dataLayer.
const { trackMock } = vi.hoisted(() => ({ trackMock: vi.fn() }));
vi.mock("@/lib/analytics", () => ({ track: trackMock }));

beforeEach(() => {
  trackMock.mockClear();
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

function fillValidDCInquiry() {
  fireEvent.change(screen.getByLabelText("Name"), {
    target: { value: "Test Person" },
  });
  fireEvent.change(screen.getByLabelText("Email"), {
    target: { value: "test@example.com" },
  });
  fireEvent.change(screen.getByLabelText("Your matter involves"), {
    target: { value: "dc" },
  });
  fireEvent.change(screen.getByLabelText("How can we help?"), {
    target: { value: "A DC matter." },
  });
}

describe("ContactForm", () => {
  it("blocks submission and shows the referral note for non-DC matters", () => {
    render(<ContactForm />);
    fireEvent.change(screen.getByLabelText("Your matter involves"), {
      target: { value: "other" },
    });

    expect(screen.getByRole("status").textContent).toMatch(
      /District of Columbia/,
    );
    const submit = screen.getByRole("button", {
      name: "Send Message",
    }) as HTMLButtonElement;
    expect(submit.disabled).toBe(true);
  });

  it("re-enables submission when the jurisdiction returns to DC", () => {
    render(<ContactForm />);
    const select = screen.getByLabelText("Your matter involves");
    fireEvent.change(select, { target: { value: "other" } });
    fireEvent.change(select, { target: { value: "dc" } });

    expect(screen.queryByRole("status")).toBeNull();
    const submit = screen.getByRole("button", {
      name: "Send Message",
    }) as HTMLButtonElement;
    expect(submit.disabled).toBe(false);
  });

  it("shows the thank-you state after a successful submit", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    });
    vi.stubGlobal("fetch", fetchMock);
    const { container } = render(<ContactForm />);
    fillValidDCInquiry();
    fireEvent.submit(container.querySelector("form")!);

    const status = await screen.findByRole("status");
    expect(status.textContent).toMatch(/Thanks, Test/);

    const body = JSON.parse(
      (fetchMock.mock.calls[0][1] as RequestInit).body as string,
    );
    expect(body.company).toBe(""); // honeypot untouched by a real user
    // Without a Turnstile site key the token is sent blank (server skips it).
    expect(body.turnstileToken).toBe("");
    // The accepted inquiry is a GA4 conversion.
    expect(trackMock).toHaveBeenCalledWith("generate_lead", {
      method: "contact_form",
    });
  });

  it("shows the server's fallback error when delivery fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({
          ok: false,
          error: "We could not send your message.",
        }),
      }),
    );
    const { container } = render(<ContactForm />);
    fillValidDCInquiry();
    fireEvent.submit(container.querySelector("form")!);

    const alert = await screen.findByRole("alert");
    expect(alert.textContent).toMatch(/could not send/);
    // Nothing was delivered—no conversion event.
    expect(trackMock).not.toHaveBeenCalled();
  });

  it("reports a network failure and re-enables the submit button", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("failed")));
    const { container } = render(<ContactForm />);
    fillValidDCInquiry();
    fireEvent.submit(container.querySelector("form")!);

    const alert = await screen.findByRole("alert");
    expect(alert.textContent).toBe("Network error. Please try again.");
    const submit = screen.getByRole("button", {
      name: "Send Message",
    }) as HTMLButtonElement;
    expect(submit.disabled).toBe(false);
  });
});
