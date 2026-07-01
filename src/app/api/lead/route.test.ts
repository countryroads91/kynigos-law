import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

const { sendMock } = vi.hoisted(() => ({ sendMock: vi.fn() }));

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: sendMock };
  },
}));

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
  it("accepts a valid lead and sends the notification email", async () => {
    const res = await post(valid);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(sendMock).toHaveBeenCalledOnce();
    expect(sendMock.mock.calls[0][0].replyTo).toBe(valid.email);
  });

  it("still returns 200 when the email send fails (download is the deliverable)", async () => {
    sendMock.mockRejectedValue(new Error("resend down"));
    const res = await post(valid);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });

  it("still returns 200 when email env vars are not configured", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    vi.stubEnv("LEAD_NOTIFY_EMAIL", "");
    const res = await post(valid);
    expect(res.status).toBe(200);
    expect(sendMock).not.toHaveBeenCalled();
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

  it("neutralizes control characters in name before the subject line", async () => {
    const res = await post({ ...valid, name: "Test\r\nInjected" });
    expect(res.status).toBe(200);
    expect(sendMock.mock.calls[0][0].subject).not.toMatch(/[\r\n]/);
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
