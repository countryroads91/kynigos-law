// Shared plumbing for the lead-capture API routes (/api/contact, /api/lead).
// Persistence is FIRST-CLASS: a lead is written to Postgres before any email
// is attempted, so a Resend outage can never lose one. Both persistence and
// email are env-gated—the site degrades feature by feature, never crashes.

import { Resend } from "resend";
import { getDb } from "./db";
import { events, leads, type EventType, type LeadSource } from "./db/schema";

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Strip control characters so user input cannot forge log lines or reach the
// email subject header un-neutralized.
export function clean(value: string): string {
  return value.replace(/[\r\n\t\x00-\x1f]+/g, " ").trim();
}

function notifyEnv() {
  return {
    apiKey: process.env.RESEND_API_KEY,
    to: process.env.LEAD_NOTIFY_EMAIL,
    from:
      process.env.LEAD_FROM_EMAIL || "Kynigos Law Firm <onboarding@resend.dev>",
  };
}

export type NewLead = {
  name: string;
  email: string;
  phone?: string;
  jurisdiction?: string;
  message?: string;
  source: LeadSource;
  paperSlug?: string;
};

// Writes the lead and its lead_created event. Returns the lead id, or null
// when the database is not configured or the write fails—callers continue
// either way (persistence must never block a prospective client), but a
// failure with the DB configured is logged loudly.
export async function persistLead(lead: NewLead): Promise<string | null> {
  const db = getDb();
  if (!db) {
    console.warn("[db] DATABASE_URL not set—lead not persisted.");
    return null;
  }
  let leadId: string;
  try {
    const [row] = await db
      .insert(leads)
      .values({
        name: lead.name,
        email: lead.email,
        phone: lead.phone || null,
        jurisdiction: lead.jurisdiction || null,
        message: lead.message || null,
        source: lead.source,
        paperSlug: lead.paperSlug || null,
      })
      .returning({ id: leads.id });
    leadId = row.id;
  } catch (err) {
    console.error(
      `[db] LEAD NOT PERSISTED source="${lead.source}" email="${lead.email}"`,
      err,
    );
    return null;
  }
  // Separate catch: the lead row exists at this point, so an event-insert
  // failure must not report the lead itself as lost (neon-http has no
  // transactions—these are two independent writes).
  try {
    await db.insert(events).values({
      leadId,
      type: "lead_created",
      payload: { source: lead.source, paperSlug: lead.paperSlug },
    });
  } catch (err) {
    console.error(`[db] lead_created event not recorded for lead ${leadId}`, err);
  }
  return leadId;
}

// Best-effort event write for non-lead moments (downloads, payments, sync
// failures). Silent no-op when the database is not configured.
export async function recordEvent(
  type: EventType,
  payload?: Record<string, unknown>,
  leadId?: string | null,
): Promise<void> {
  const db = getDb();
  if (!db) return;
  try {
    await db.insert(events).values({
      leadId: leadId ?? null,
      type,
      payload: payload ?? null,
    });
  } catch (err) {
    console.error(`[db] event not recorded type="${type}"`, err);
  }
}

export async function sendNotification(options: {
  subject: string;
  text: string;
  replyTo: string;
}): Promise<boolean> {
  const { apiKey, to, from } = notifyEnv();
  if (!apiKey || !to) return false;
  const resend = new Resend(apiKey);
  const result = await resend.emails.send({
    from,
    to,
    replyTo: options.replyTo,
    subject: options.subject,
    text: options.text,
  });
  // Resend v6 reports API failures in the result rather than throwing;
  // normalize both shapes to a throw so callers have one failure path.
  if (result?.error) {
    throw new Error(result.error.message ?? "Resend send failed");
  }
  return true;
}
