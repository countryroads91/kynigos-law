import { beforeEach, describe, expect, it } from "vitest";
import { POST } from "./route";

// Ensure no real email is ever sent from tests, even if the shell has keys.
beforeEach(() => {
  delete process.env.RESEND_API_KEY;
  delete process.env.LEAD_NOTIFY_EMAIL;
});

function post(body: unknown) {
  return POST(
    new Request("http://localhost/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  );
}

const valid = {
  name: "Test Person",
  email: "test@example.com",
  paper: "Misaligned Incentives",
};

describe("POST /api/lead", () => {
  it("accepts a valid lead", async () => {
    const res = await post(valid);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });

  it("rejects an invalid email", async () => {
    const res = await post({ ...valid, email: "nope" });
    expect(res.status).toBe(422);
    expect((await res.json()).ok).toBe(false);
  });

  it("rejects a too-short name", async () => {
    const res = await post({ ...valid, name: "A" });
    expect(res.status).toBe(422);
  });

  it("defaults a missing paper title rather than failing", async () => {
    const res = await post({ ...valid, paper: undefined });
    expect(res.status).toBe(200);
  });

  it("rejects malformed JSON with a 400", async () => {
    const res = await POST(
      new Request("http://localhost/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{not json",
      }),
    );
    expect(res.status).toBe(400);
  });
});
