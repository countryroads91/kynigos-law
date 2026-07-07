// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import FirstMove from "./FirstMove";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

function fill() {
  fireEvent.change(
    screen.getByLabelText("Describe your document or situation"),
    { target: { value: "I have an employment contract to review." } },
  );
  fireEvent.change(screen.getByLabelText("Name"), {
    target: { value: "Jordan Reyes" },
  });
  fireEvent.change(screen.getByLabelText("Email"), {
    target: { value: "jordan@example.com" },
  });
}

describe("FirstMove", () => {
  it("blocks submission and shows the referral note for non-DC matters", () => {
    render(<FirstMove />);
    fill();
    fireEvent.change(screen.getByLabelText("Matter involves"), {
      target: { value: "other" },
    });

    expect(
      screen.getByRole("button", { name: "Make The First Move" }),
    ).toHaveProperty("disabled", true);
    expect(screen.getByRole("status").textContent).toContain(
      "licensed in the District of Columbia only",
    );
  });

  it("posts to /api/contact and confirms delivery", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ ok: true }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<FirstMove />);
    fill();
    fireEvent.change(screen.getByLabelText("Matter involves"), {
      target: { value: "dc" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: "Make The First Move" }),
    );

    await waitFor(() =>
      expect(screen.getByRole("status").textContent).toContain(
        "Thanks, Jordan",
      ),
    );
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/contact",
      expect.objectContaining({ method: "POST" }),
    );
    const body = JSON.parse(
      (fetchMock.mock.calls[0][1] as RequestInit).body as string,
    );
    expect(body.jurisdiction).toBe("dc");
    expect(body.message).toContain("employment contract");
    // The API labels FirstMove leads by this source tag.
    expect(body.source).toBe("first_move");
    expect(body.company).toBe(""); // honeypot untouched by a real user
    // Without a Turnstile site key the token is sent blank (server skips it).
    expect(body.turnstileToken).toBe("");
  });

  it("surfaces a server rejection instead of pretending success", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ ok: false, error: "Request too large." }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<FirstMove />);
    fill();
    fireEvent.change(screen.getByLabelText("Matter involves"), {
      target: { value: "dc" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: "Make The First Move" }),
    );

    await waitFor(() =>
      expect(screen.getByRole("alert").textContent).toBe("Request too large."),
    );
  });

  it("reports a network failure and re-enables the submit button", async () => {
    const fetchMock = vi.fn().mockRejectedValue(new TypeError("failed"));
    vi.stubGlobal("fetch", fetchMock);

    render(<FirstMove />);
    fill();
    fireEvent.change(screen.getByLabelText("Matter involves"), {
      target: { value: "dc" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: "Make The First Move" }),
    );

    await waitFor(() =>
      expect(screen.getByRole("alert").textContent).toBe(
        "Network error. Please try again.",
      ),
    );
    // status is "error", not "submitting"—the user can retry.
    expect(
      screen.getByRole("button", { name: "Make The First Move" }),
    ).toHaveProperty("disabled", false);
  });
});
