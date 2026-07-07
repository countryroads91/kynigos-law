// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import ConfirmSubscription from "./ConfirmSubscription";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("ConfirmSubscription", () => {
  it("does nothing until the human clicks—rendering alone must not confirm", () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    render(<ConfirmSubscription token="tok" />);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(
      screen.getByRole("button", { name: "Confirm Subscription" }),
    ).toBeTruthy();
  });

  it("POSTs the token on click and shows the subscribed state", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ ok: true }),
    });
    vi.stubGlobal("fetch", fetchMock);
    render(<ConfirmSubscription token="tok-123" />);
    fireEvent.click(screen.getByRole("button"));

    const status = await screen.findByRole("status");
    expect(status.textContent).toMatch(/subscribed/i);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/subscribe/confirm");
    expect((init as RequestInit).method).toBe("POST");
    expect(JSON.parse((init as RequestInit).body as string)).toEqual({
      token: "tok-123",
    });
  });

  it("shows the server's invalid/expired message", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: () =>
          Promise.resolve({
            ok: false,
            error: "This confirmation link is invalid, expired, or already used.",
          }),
      }),
    );
    render(<ConfirmSubscription token="stale" />);
    fireEvent.click(screen.getByRole("button"));
    const alert = await screen.findByRole("alert");
    expect(alert.textContent).toMatch(/invalid, expired/i);
  });

  it("tells a rate-limited clicker their link is still valid", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ ok: false, busy: true }),
      }),
    );
    render(<ConfirmSubscription token="tok" />);
    fireEvent.click(screen.getByRole("button"));
    const alert = await screen.findByRole("alert");
    expect(alert.textContent).toMatch(/still valid/i);
  });

  it("surfaces network errors and allows retry", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    render(<ConfirmSubscription token="tok" />);
    fireEvent.click(screen.getByRole("button"));
    const alert = await screen.findByRole("alert");
    expect(alert.textContent).toMatch(/network error/i);
    expect(screen.getByRole("button")).not.toHaveProperty("disabled", true);
  });
});
