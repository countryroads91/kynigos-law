// First-party lead/event store. Postgres (Neon) is the source of truth for
// every visitor action; email notifications and CRM sync are projections of
// these rows, never the only record. Keep the surface small—four tables.

import {
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const LEAD_SOURCES = [
  "contact",
  "first_move",
  "white_paper",
  "checkout",
  "scheduler",
] as const;
export type LeadSource = (typeof LEAD_SOURCES)[number];

export const EVENT_TYPES = [
  "lead_created",
  "paper_downloaded",
  "booking",
  "checkout_started",
  "payment_succeeded",
  "upload_received",
  "subscribed",
  "crm_sync_failed",
] as const;
export type EventType = (typeof EVENT_TYPES)[number];

export const leads = pgTable("leads", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  jurisdiction: text("jurisdiction"),
  message: text("message"),
  source: text("source", { enum: LEAD_SOURCES }).notNull(),
  paperSlug: text("paper_slug"),
  status: text("status", { enum: ["new", "paid", "closed"] })
    .notNull()
    .default("new"),
});

// The conversion/analytics spine and CRM-sync audit trail. `leadId` is
// nullable: some events (anonymous downloads, webhook noise) have no lead.
export const events = pgTable("events", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  leadId: uuid("lead_id").references(() => leads.id),
  type: text("type", { enum: EVENT_TYPES }).notNull(),
  payload: jsonb("payload"),
});

// Newsletter list (Phase 5). Double opt-in: rows start `pending` and flip to
// `confirmed` only when the emailed token is presented back. `token` holds a
// SHA-256 HASH of the emailed token (a leaked table never yields usable
// confirmation links); `tokenIssuedAt` bounds its lifetime.
export const subscribers = pgTable(
  "subscribers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    email: text("email").notNull().unique(),
    name: text("name"),
    status: text("status", { enum: ["pending", "confirmed", "unsubscribed"] })
      .notNull()
      .default("pending"),
    token: text("token"),
    tokenIssuedAt: timestamp("token_issued_at", { withTimezone: true }),
    confirmedAt: timestamp("confirmed_at", { withTimezone: true }),
  },
  (table) => [uniqueIndex("subscribers_token_idx").on(table.token)],
);

// Idempotency ledger for provider webhooks (Phase 3: Stripe). A duplicate
// delivery fails the unique insert and is acknowledged as a no-op.
export const webhookEvents = pgTable(
  "webhook_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    provider: text("provider").notNull(),
    externalId: text("external_id").notNull(),
    processedAt: timestamp("processed_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("webhook_events_provider_external_id").on(
      table.provider,
      table.externalId,
    ),
  ],
);
