// Env-gated Neon client, mirroring the Resend/Calendly pattern: absent env
// means the feature is off, never an error. Callers must handle `null`.

import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

export type Db = NeonHttpDatabase<typeof schema>;

export function getDb(): Db | null {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  // The neon-http driver is a stateless fetch wrapper—constructing per call
  // is cheap and keeps env changes (tests stub per-case) honest.
  return drizzle(neon(url), { schema });
}
