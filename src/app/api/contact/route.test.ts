import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

const { sendMock } = vi.hoisted(() => ({ sendMock: vi.fn() }));

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: sendMock };
  },
}));

// Default: email env is configured and the send succeeds. Individual tests
// override. vi.stubEnv keeps mutations restorable; no real email can be sent
// because the resend module is mocked above.
beforeEach(() => {
  vi.stubEnv("RESEND_API_KEY", "test-key");
  vi.stubEnv("LEAD_NOTIFY_EMAIL", "notify@example.com");
  sendMock.mockReset();
  sendMock.mockResolvedValue({ data: { id: "test" } });
});

afterEach(() => {
  vi.unstubAllEnvs();
});

function post(body: unknown) {
  return POST(
    new Request("http://localhost/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  );
}

const valid = {
  name: "Test Person",
  email: "test@example.com",
  phone: "(555) 010-0000",
  jurisdiction: "dc",
  message: "I need help with a DC matter.",
};

describe("POST /api/contact", () => {
  it("accepts a valid DC inquiry and sends the notification email", async () => {
    const res = await post(valid);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(sendMock).toHaveBeenCalledOnce();
    const payload = sendMock.mock.calls[0][0];
    expect(payload.replyTo).toBe(valid.email);
    expect(payload.subject).toContain(valid.name);
    expect(payload.text).toContain(valid.message);
  });

  it("accepts a DC inquiry without a phone number", async () => {
    const res = await post({ ...valid, phone: undefined });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });

  it("returns 502 with fallback contact info when the send fails", async () => {
    sendMock.mockRejectedValue(new Error("resend down"));
    const res = await post(valid);
    expect(res.status).toBe(502);
    const data = await res.json();
    expect(data.ok).toBe(false);
    expect(data.error).toMatch(/call \(304\) 549-1058|bayan@kynigos\.law/);
  });

  it("returns 502 when email env vars are not configured", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    vi.stubEnv("LEAD_NOTIFY_EMAIL", "");
    const res = await post(valid);
    expect(res.status).toBe(502);
    expect((await res.json()).ok).toBe(false);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("neutralizes control characters in name before subject and send", async () => {
    const res = await post({ ...valid, name: "Test\r\nInjected: person" });
    expect(res.status).toBe(200);
    const payload = sendMock.mock.calls[0][0];
    expect(payload.subject).not.toMatch(/[\r\n]/);
  });

  it("silently accepts honeypot submissions without sending", async () => {
    const res = await post({ ...valid, company: "Totally Real LLC" });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("rejects non-DC jurisdictions with the referral message", async () => {
    const res = await post({ ...valid, jurisdiction: "other" });
    expect(res.status).toBe(422);
    const data = await res.json();
    expect(data.ok).toBe(false);
    expect(data.error).toMatch(/District of Columbia/);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("rejects a missing jurisdiction as unanswered, not as non-DC", async () => {
    const res = await post({ ...valid, jurisdiction: undefined });
    expect(res.status).toBe(422);
    const data = await res.json();
    expect(data.ok).toBe(false);
    expect(data.error).toMatch(/select the jurisdiction/i);
  });

  it("normalizes jurisdiction case", async () => {
    const res = await post({ ...valid, jurisdiction: "DC" });
    expect(res.status).toBe(200);
  });

  it("rejects an invalid email", async () => {
    const res = await post({ ...valid, email: "not-an-email" });
    expect(res.status).toBe(422);
    expect((await res.json()).ok).toBe(false);
  });

  it("rejects a too-short name", async () => {
    const res = await post({ ...valid, name: "A" });
    expect(res.status).toBe(422);
  });

  it("accepts a name at the 120-character boundary", async () => {
    const res = await post({ ...valid, name: "N".repeat(120) });
    expect(res.status).toBe(200);
  });

  it("rejects a name over 120 characters", async () => {
    const res = await post({ ...valid, name: "N".repeat(121) });
    expect(res.status).toBe(422);
  });

  it("rejects an empty message", async () => {
    const res = await post({ ...valid, message: "   " });
    expect(res.status).toBe(422);
  });

  it("rejects a message over 5000 characters", async () => {
    const res = await post({ ...valid, message: "x".repeat(5001) });
    expect(res.status).toBe(422);
  });

  it("rejects oversized payloads before parsing", async () => {
    const res = await POST(
      new Request("http://localhost/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": "100000",
        },
        body: JSON.stringify(valid),
      }),
    );
    expect(res.status).toBe(413);
  });

  it("rejects malformed JSON with a 400", async () => {
    const res = await POST(
      new Request("http://localhost/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{not json",
      }),
    );
    expect(res.status).toBe(400);
  });
});
