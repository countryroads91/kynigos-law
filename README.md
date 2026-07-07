This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Environment & database

Third-party services are optional and env-gated—unset means off, no code changes needed. See [.env.example](.env.example) for the full list: Resend (lead email + newsletter), Neon Postgres (lead/event persistence), Cloudflare Turnstile (bot protection), Upstash Redis (rate limiting), `PAPER_TOKEN_SECRET` (signed white-paper downloads), GA4 (consent-gated analytics), `NEXT_PUBLIC_NEWSLETTER_ENABLED`/`RESEND_AUDIENCE_ID` (research-notes signup), and `CRON_SECRET` (weekly digest cron). Once `DATABASE_URL` is set, apply the Drizzle migrations in `drizzle/`:

```bash
npm run db:migrate    # apply migrations
npm run db:generate   # regenerate after editing src/lib/db/schema.ts
```

## Automation ownership

One rule prevents double-sending: each surface owns its lane and nothing else sends there.

- **Site/Resend transactional**—immediate emails only: lead notifications to the attorney, white-paper delivery links, newsletter double-opt-in confirmations, and the Monday digest (`/api/digest`, Vercel Cron).
- **Clio Grow** (Phase 2, once provisioned)—all 1:1 lifecycle email/SMS after a lead syncs: consult reminders, no-show follow-ups, engagement-letter nudges.
- **Resend Broadcasts**—the opted-in research-notes newsletter, sent manually to the Resend Audience that the confirm flow maintains. Resend also owns unsubscribes and suppression for broadcasts; the site re-adds a contact to the Audience only when that person explicitly signs up again.

## Testing

```bash
npm test
```

Vitest tests—API routes, shared libraries (`src/lib`), components, and pages—live next to the code they cover (`src/**/*.test.{ts,tsx}`). CI runs a typecheck and the test suite on every pull request. See [TESTING.md](TESTING.md) for conventions.

## Project docs

- [CHANGELOG.md](CHANGELOG.md)—release history (versions follow MAJOR.MINOR.PATCH.MICRO, current version in [VERSION](VERSION))
- [TESTING.md](TESTING.md)—test framework, layers, and conventions
- [TODOS.md](TODOS.md)—deferred work and priorities
- [AGENTS.md](AGENTS.md)—instructions for coding agents (imported by CLAUDE.md)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
