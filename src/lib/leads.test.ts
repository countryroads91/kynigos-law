import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { getDbMock, sendMock } = vi.hoisted(() => ({
  getDbMock: vi.fn(),
  sendMock: vi.fn(),
}));

vi.mock("./db", () => ({ getDb: getDbMock }));
vi.mock("resend", () => ({
  Resend: class {
    emails = { send: sendMock };
  },
}));

import { clean, persistLead, recordEvent, sendNotification } from "./leads";

// Minimal stand-in for drizzle's insert chain: .values() is awaitable and
// exposes .returning().
function makeDb(opts?: { failInsert?: boolean }) {
  const rows: unknown[] = [];
  const db = {
    insert: vi.fn(() => ({
      values: (v: unknown) => {
        if (opts?.failInsert) {
          // Reject lazily—an eager Promise.reject() that the code under test
          // never awaits (it calls .returning() first) escapes as an
          // unhandled rejection and fails the whole Vitest run.
          return {
            returning: () => Promise.reject(new Error("db down")),
            then: (ok: never, err: never) =>
              Promise.reject(new Error("db down")).then(ok, err),
          } as never;
        }
        rows.push(v);
        const done = Promise.resolve(undefined);
        return {
          returning: () => Promise.resolve([{ id: "lead-1" }]),
          then: done.then.bind(done),
          catch: done.catch.bind(done),
        } as never;
      },
    })),
    rows,
  };
  return db;
}

beforeEach(() => {
  // Tests must never send real email—the resend module is mocked above AND
  // the email env is blanked unless a test opts in.
  vi.stubEnv("RESEND_API_KEY", "");
  vi.stubEnv("LEAD_NOTIFY_EMAIL", "");
  vi.stubEnv("LEAD_FROM_EMAIL", "");
  getDbMock.mockReset();
  sendMock.mockReset();
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

const lead = {
  name: "Test Person",
  email: "test@example.com",
  source: "contact" as const,
};

describe("persistLead", () => {
  it("returns null and warns when the database is not configured", async () => {
    getDbMock.mockReturnValue(null);
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(await persistLead(lead)).toBeNull();
    expect(warn).toHaveBeenCalled();
  });

  it("writes the lead and its lead_created event, returning the id", async () => {
    const db = makeDb();
    getDbMock.mockReturnValue(db);
    expect(await persistLead(lead)).toBe("lead-1");
    expect(db.insert).toHaveBeenCalledTimes(2);
    expect(db.rows[1]).toMatchObject({ leadId: "lead-1", type: "lead_created" });
  });

  it("returns null (never throws) when the insert fails, and logs loudly", async () => {
    getDbMock.mockReturnValue(makeDb({ failInsert: true }));
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(await persistLead(lead)).toBeNull();
    expect(error.mock.calls[0][0]).toContain("LEAD NOT PERSISTED");
  });
});

describe("recordEvent", () => {
  it("is a silent no-op without a database", async () => {
    getDbMock.mockReturnValue(null);
    await expect(
      recordEvent("paper_downloaded", { paperSlug: "x" }),
    ).resolves.toBeUndefined();
  });

  it("swallows insert failures", async () => {
    getDbMock.mockReturnValue(makeDb({ failInsert: true }));
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    await expect(recordEvent("paper_downloaded")).resolves.toBeUndefined();
    expect(error).toHaveBeenCalled();
  });
});

describe("sendNotification", () => {
  const options = {
    subject: "Test subject",
    text: "Body",
    replyTo: "prospect@example.com",
  };

  it("returns false without sending when email env is not configured", async () => {
    expect(await sendNotification(options)).toBe(false);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("sends with the default from address and returns true", async () => {
    vi.stubEnv("RESEND_API_KEY", "test-key");
    vi.stubEnv("LEAD_NOTIFY_EMAIL", "notify@example.com");
    sendMock.mockResolvedValue({ data: { id: "email-1" } });
    expect(await sendNotification(options)).toBe(true);
    expect(sendMock).toHaveBeenCalledOnce();
    expect(sendMock.mock.calls[0][0]).toMatchObject({
      from: "Kynigos Law Firm <onboarding@resend.dev>",
      to: "notify@example.com",
      replyTo: "prospect@example.com",
      subject: "Test subject",
    });
  });

  it("normalizes a Resend error-in-result (v6 shape) to a throw", async () => {
    vi.stubEnv("RESEND_API_KEY", "test-key");
    vi.stubEnv("LEAD_NOTIFY_EMAIL", "notify@example.com");
    sendMock.mockResolvedValue({
      data: null,
      error: { message: "domain not verified" },
    });
    await expect(sendNotification(options)).rejects.toThrow(
      "domain not verified",
    );
  });
});

describe("clean", () => {
  it("strips control characters and trims", () => {
    expect(clean("  a\r\nb\tc  ")).toBe("a b c");
  });
});
