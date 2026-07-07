import { defineConfig } from "drizzle-kit";

// `npm run db:generate` emits SQL migrations to ./drizzle (no DB needed);
// `npm run db:migrate` applies them and requires DATABASE_URL.
export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
});
