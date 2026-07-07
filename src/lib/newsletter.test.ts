import { createHash } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { getDbMock, contactCreateMock, sendMock } = vi.hoisted(() => ({
  getDbMock: vi.fn(),
  contactCreateMock: vi.fn(),
  sendMock: vi.fn(),
}));

vi.mock("./db", () => ({ getDb: getDbMock }));
vi.mock("resend", () => ({
  Resend: class {
    contacts = { create: contactCreateMock };
    emails = { send: sendMock };
  },
}));

import {
  confirmSubscriber,
  startSubscription,
  TOKEN_TTL_MS,
  upsertPendingSubscriber,
} from "./newsletter";

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

type FakeRow = {
  id: string;
  email: string;
  name: string | null;
  status: string;
  tokenIssuedAt?: Date | null;
};

// Minimal drizzle stand-in for the chains newsletter.ts uses:
// select().from().where().limit(), update().set().where(), insert().values().
function makeDb(selectRows: FakeRow[]) {
  const updates: unknown[] = [];
  const inserts: unknown[] = [];
  return {
    select: vi.fn(() => ({
      from: () => ({
        where: () => ({ limit: () => Promise.resolve(selectRows) }),
      }),
    })),
    update: vi.fn(() => ({
      set: (v: unknown) => {
        updates.push(v);
        return { where: () => Promise.resolve() };
      },
    })),
    insert: vi.fn(() => ({
      values: (v: unknown) => {
        inserts.push(v);
        return Promise.resolve();
      },
    })),
    updates,
    inserts,
  };
}

beforeEach(() => {
  getDbMock.mockReset();
  contactCreateMock.mockReset();
  contactCreateMock.mockResolvedValue({ data: { id: "c1" } });
  sendMock.mockReset();
  sendMock.mockResolvedValue({ data: { id: "email-1" } });
  vi.stubEnv("RESEND_API_KEY", "");
  vi.stubEnv("RESEND_AUDIENCE_ID", "");
  vi.stubEnv("LEAD_FROM_EMAIL", "");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("upsertPendingSubscriber", () => {
  it("returns null when the database is not configured", async () => {
    getDbMock.mockReturnValue(null);
    expect(await upsertPendingSubscriber("a@example.com")).toBeNull();
  });

  it("inserts a pending row storing only a HASH of the returned token", async () => {
    const db = makeDb([]);
    getDbMock.mockReturnValue(db);
    const result = await upsertPendingSubscriber("a@example.com", "Ada");
    expect(result).toMatchObject({ outcome: "pending" });
    const token = (result as { token: string }).token;
    expect(token).toMatch(/^[0-9a-f]{48}$/);
    const stored = db.inserts[0] as { token: string; tokenIssuedAt: Date };
    // At-rest form is the SHA-256 of the emailed token, never the token itself.
    expect(stored.token).toBe(sha256(token));
    expect(stored.token).not.toBe(token);
    expect(stored.tokenIssuedAt).toBeInstanceOf(Date);
  });

  it("re-syncs the Resend audience for an already-confirmed re-signup (fresh consent, no email)", async () => {
    vi.stubEnv("RESEND_API_KEY", "test-key");
    vi.stubEnv("RESEND_AUDIENCE_ID", "aud_1");
    const db = makeDb([
      { id: "s1", email: "a@example.com", name: "Ada", status: "confirmed" },
    ]);
    getDbMock.mockReturnValue(db);
    expect(await upsertPendingSubscriber("a@example.com")).toEqual({
      outcome: "already_confirmed",
    });
    expect(db.inserts).toHaveLength(0);
    expect(db.updates).toHaveLength(0);
    expect(contactCreateMock).toHaveBeenCalledWith(
      expect.objectContaining({ email: "a@example.com", unsubscribed: false }),
    );
  });

  it("re-issues a fresh hashed token (update, not insert) for a pending re-request", async () => {
    const db = makeDb([
      { id: "s1", email: "a@example.com", name: null, status: "pending" },
    ]);
    getDbMock.mockReturnValue(db);
    const result = await upsertPendingSubscriber("a@example.com");
    expect(result).toMatchObject({ outcome: "pending" });
    const update = db.updates[0] as { token: string; status: string };
    expect(update.status).toBe("pending");
    expect(update.token).toBe(sha256((result as { token: string }).token));
    expect(db.inserts).toHaveLength(0);
  });
});

describe("confirmSubscriber", () => {
  it("returns null for an unknown token", async () => {
    getDbMock.mockReturnValue(makeDb([]));
    expect(await confirmSubscriber("nope")).toBeNull();
  });

  it("rejects an expired token (issued past the TTL)", async () => {
    const db = makeDb([
      {
        id: "s1",
        email: "a@example.com",
        name: null,
        status: "pending",
        tokenIssuedAt: new Date(Date.now() - TOKEN_TTL_MS - 1000),
      },
    ]);
    getDbMock.mockReturnValue(db);
    expect(await confirmSubscriber("tok")).toBeNull();
    expect(db.updates).toHaveLength(0);
  });

  it("confirms a fresh pending subscriber: clears the token, records the event, syncs the audience", async () => {
    vi.stubEnv("RESEND_API_KEY", "test-key");
    vi.stubEnv("RESEND_AUDIENCE_ID", "aud_1");
    const db = makeDb([
      {
        id: "s1",
        email: "a@example.com",
        name: "Ada Lovelace",
        status: "pending",
        tokenIssuedAt: new Date(),
      },
    ]);
    getDbMock.mockReturnValue(db);

    const result = await confirmSubscriber("tok");
    expect(result).toEqual({ email: "a@example.com", name: "Ada Lovelace" });
    expect(db.updates[0]).toMatchObject({
      status: "confirmed",
      token: null,
      tokenIssuedAt: null,
    });
    // recordEvent writes the subscribed event through the same db.
    expect(
      db.inserts.some((v) => (v as { type?: string }).type === "subscribed"),
    ).toBe(true);
    expect(contactCreateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        audienceId: "aud_1",
        email: "a@example.com",
        firstName: "Ada",
        unsubscribed: false,
      }),
    );
  });

  it("still confirms (never throws) when the audience sync fails", async () => {
    vi.stubEnv("RESEND_API_KEY", "test-key");
    vi.stubEnv("RESEND_AUDIENCE_ID", "aud_1");
    contactCreateMock.mockRejectedValue(new Error("resend down"));
    const db = makeDb([
      {
        id: "s1",
        email: "a@example.com",
        name: null,
        status: "pending",
        tokenIssuedAt: new Date(),
      },
    ]);
    getDbMock.mockReturnValue(db);
    const error = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(await confirmSubscriber("tok")).toEqual({
      email: "a@example.com",
      name: null,
    });
    expect(db.updates[0]).toMatchObject({ status: "confirmed", token: null });
    // PII stays out of the failure log—the subscriber id is used instead.
    expect(String(error.mock.calls[0][0])).not.toContain("a@example.com");
    expect(String(error.mock.calls[0][0])).toContain("s1");
    error.mockRestore();
  });

  it("is idempotent for an already-confirmed row and skips the audience call", async () => {
    vi.stubEnv("RESEND_API_KEY", "test-key");
    vi.stubEnv("RESEND_AUDIENCE_ID", "aud_1");
    const db = makeDb([
      { id: "s1", email: "a@example.com", name: null, status: "confirmed" },
    ]);
    getDbMock.mockReturnValue(db);
    expect(await confirmSubscriber("tok")).toEqual({
      email: "a@example.com",
      name: null,
    });
    expect(db.updates).toHaveLength(0);
    expect(contactCreateMock).not.toHaveBeenCalled();
  });
});

describe("startSubscription", () => {
  it("returns unavailable when the database is off", async () => {
    getDbMock.mockReturnValue(null);
    expect(await startSubscription("a@example.com")).toBe("unavailable");
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("returns already_confirmed without sending email", async () => {
    getDbMock.mockReturnValue(
      makeDb([
        { id: "s1", email: "a@example.com", name: null, status: "confirmed" },
      ]),
    );
    expect(await startSubscription("a@example.com")).toBe("already_confirmed");
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("emails a click-to-confirm page link (canonical origin, no reader-supplied text)", async () => {
    vi.stubEnv("RESEND_API_KEY", "test-key");
    getDbMock.mockReturnValue(makeDb([]));
    expect(await startSubscription("a@example.com", "Eve<attacker>")).toBe(
      "pending",
    );
    const payload = sendMock.mock.calls[0][0];
    expect(payload.to).toBe("a@example.com");
    expect(payload.text).toMatch(
      /https:\/\/www\.kynigos\.law\/newsletter\/confirm\?token=[0-9a-f]{48}/,
    );
    // Nothing the subscriber typed appears in the outbound email.
    expect(payload.text).not.toContain("Eve");
    expect(payload.text).toContain("Hello,");
  });

  it("throws when email is not configured (caller maps to 502)", async () => {
    getDbMock.mockReturnValue(makeDb([]));
    await expect(startSubscription("a@example.com")).rejects.toThrow(
      /not configured/,
    );
  });
});
