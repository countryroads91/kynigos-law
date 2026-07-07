import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { sendMock, getDbMock } = vi.hoisted(() => ({
  sendMock: vi.fn(),
  getDbMock: vi.fn(),
}));

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: sendMock };
  },
}));
vi.mock("@/lib/db", () => ({ getDb: getDbMock }));

import { GET } from "./route";

// select().from().where() is awaited directly for the subscribers count and
// via .groupBy() for the grouped queries—support both shapes.
function chain(rows: unknown[]) {
  const p = Promise.resolve(rows);
  return {
    groupBy: () => p,
    then: p.then.bind(p),
    catch: p.catch.bind(p),
  };
}

function makeDb() {
  let call = 0;
  const results = [
    [
      { source: "contact", n: 3 },
      { source: "white_paper", n: 2 },
    ],
    [
      { type: "lead_created", n: 5 },
      { type: "paper_downloaded", n: 4 },
    ],
    [{ n: 1 }],
  ];
  return {
    select: vi.fn(() => ({
      from: () => ({ where: () => chain(results[call++]) }),
    })),
  };
}

beforeEach(() => {
  vi.stubEnv("CRON_SECRET", "cron-secret");
  vi.stubEnv("RESEND_API_KEY", "test-key");
  vi.stubEnv("LEAD_NOTIFY_EMAIL", "bayan@example.com");
  sendMock.mockReset();
  sendMock.mockResolvedValue({ data: { id: "email-1" } });
  getDbMock.mockReset();
  getDbMock.mockReturnValue(makeDb());
});

afterEach(() => {
  vi.unstubAllEnvs();
});

function get(auth?: string) {
  return GET(
    new Request("http://localhost/api/digest", {
      headers: auth ? { authorization: auth } : {},
    }),
  );
}

describe("GET /api/digest", () => {
  it("rejects requests without the cron bearer token", async () => {
    expect((await get()).status).toBe(401);
    expect((await get("Bearer wrong")).status).toBe(401);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("is unavailable when CRON_SECRET is not configured", async () => {
    vi.stubEnv("CRON_SECRET", "");
    expect((await get("Bearer cron-secret")).status).toBe(503);
  });

  it("is unavailable when the database is not configured", async () => {
    getDbMock.mockReturnValue(null);
    expect((await get("Bearer cron-secret")).status).toBe(503);
  });

  it("emails the weekly summary with lead, event, and subscriber counts", async () => {
    const res = await get("Bearer cron-secret");
    expect(res.status).toBe(200);
    expect((await res.json())).toMatchObject({ ok: true, leads: 5 });
    const payload = sendMock.mock.calls[0][0];
    expect(payload.to).toBe("bayan@example.com");
    expect(payload.subject).toContain("5 leads");
    expect(payload.text).toContain("contact");
    expect(payload.text).toContain("paper_downloaded");
    expect(payload.text).toContain("New confirmed subscribers: 1");
  });

  it("returns 502 when the digest email cannot be sent", async () => {
    sendMock.mockRejectedValue(new Error("resend down"));
    expect((await get("Bearer cron-secret")).status).toBe(502);
  });

  it("returns 502 when the notify address is not configured (sendNotification reports false)", async () => {
    vi.stubEnv("LEAD_NOTIFY_EMAIL", "");
    const res = await get("Bearer cron-secret");
    expect(res.status).toBe(502);
    expect(sendMock).not.toHaveBeenCalled();
  });
});
