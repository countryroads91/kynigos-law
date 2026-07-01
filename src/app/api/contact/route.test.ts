import { beforeEach, describe, expect, it } from "vitest";
import { POST } from "./route";

// Ensure no real email is ever sent from tests, even if the shell has keys.
beforeEach(() => {
  delete process.env.RESEND_API_KEY;
  delete process.env.LEAD_NOTIFY_EMAIL;
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
  it("accepts a valid DC inquiry", async () => {
    const res = await post(valid);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });

  it("accepts a DC inquiry without a phone number", async () => {
    const res = await post({ ...valid, phone: undefined });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });

  it("rejects non-DC jurisdictions with the referral message", async () => {
    const res = await post({ ...valid, jurisdiction: "other" });
    expect(res.status).toBe(422);
    const data = await res.json();
    expect(data.ok).toBe(false);
    expect(data.error).toMatch(/District of Columbia/);
  });

  it("rejects a missing jurisdiction", async () => {
    const res = await post({ ...valid, jurisdiction: undefined });
    expect(res.status).toBe(422);
    expect((await res.json()).ok).toBe(false);
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

  it("rejects an empty message", async () => {
    const res = await post({ ...valid, message: "   " });
    expect(res.status).toBe(422);
  });

  it("rejects a message over 5000 characters", async () => {
    const res = await post({ ...valid, message: "x".repeat(5001) });
    expect(res.status).toBe(422);
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
