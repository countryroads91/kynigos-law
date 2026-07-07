# TODOS

## Contact & Lead Capture

### Verify Resend env vars in Vercel production for /api/contact
**Priority:** P1
The contact route now returns 502 when RESEND_API_KEY/LEAD_NOTIFY_EMAIL are missing. Confirm all three vars (including LEAD_FROM_EMAIL with a verified domain sender—the onboarding@resend.dev fallback only delivers to the Resend account owner) are set in production, then submit a live test inquiry.

### Provision Phase 1 services and set env vars in Vercel
**Priority:** P1
The code shipped in v0.7.0.0 is env-gated and inert until configured: Neon Postgres (`DATABASE_URL`, then `npm run db:migrate`), Cloudflare Turnstile (`NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY`), Upstash Redis (`UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`), and a random `PAPER_TOKEN_SECRET` (e.g. `openssl rand -hex 32`). Until then: leads are email-only (not persisted), forms have honeypot-only protection, and white-paper links are unsigned.

Turnstile ops notes (from adversarial review): set BOTH keys, then **redeploy**—the site key is inlined at build time, so setting keys without a redeploy makes the server fail closed (403) while no widget renders. Decide the preview-deployment policy in the Turnstile dashboard (add `*.vercel.app` to the allowed hostnames or accept that previews show a widget error). Once `DATABASE_URL` is live, downgrade the success-path PII logging in the routes to lead id + source only.

v0.8.0.0 additions (all optional, all free): `NEXT_PUBLIC_GA4_MEASUREMENT_ID` (create a GA4 property; loads only after analytics consent), `NEXT_PUBLIC_NEWSLETTER_ENABLED=1` + `RESEND_AUDIENCE_ID` (create an Audience in Resend; requires `DATABASE_URL`), and `CRON_SECRET` (weekly Monday digest email; Vercel wires the cron automatically from vercel.json). Both `NEXT_PUBLIC_*` vars are inlined at build time—**redeploy after setting them** or nothing changes. Before the first newsletter broadcast: send via Resend Broadcasts to the Audience (Resend manages unsubscribes/suppression); the site re-adds a subscriber to the Audience only when they explicitly sign up again.

## Mobile & Accessibility

### Verify the mobile menu fix on a real iPhone
**Priority:** P1
The ISSUE-001 stacking-context fix (menu could not be closed) was verified in Chromium emulation at 390x844. Do a 30-second check on a physical iPhone after v0.2.0.0 deploys: open menu, close via X, navigate via menu links. (v0.3.0.0 replaced the menu with a flat sheet—re-check on device: open, tap outside to close, tap a link, tap How It Works on the homepage.)

### iOS Safari can scroll the page behind the open mobile menu
**Priority:** P3
`body { overflow: hidden }` does not block touch scrolling on iOS Safari. With the v0.3.0.0 translucent scrim the background page is visible, so a determined swipe scrolls it behind the open menu (cosmetic only—menu still works). Robust fix is the position:fixed body-lock pattern or touchmove prevention on the scrim. Flagged by /ship adversarial review 2026-07-06.

## Code Health

### Decide fate of public/kynigos-alt-hero.html
**Priority:** P3
Untracked draft mockup sitting in public/. If ever committed it deploys as a live URL on the production domain. Move to Website Source/Mockups/ or delete. (May belong to a concurrent working session—check before removing.)

## Completed

### Turnstile + rate limiting on /api/contact and /api/lead
**Completed:** v0.7.0.0 (2026-07-07)—env-gated Cloudflare Turnstile (fails closed once configured) plus Upstash per-IP sliding-window rate limiting (fails open on infra errors). Honeypot and content-length cap added to /api/lead.

### Extract shared email/validation helpers for the two API routes
**Completed:** v0.7.0.0 (2026-07-07)—src/lib/leads.ts holds EMAIL_RE, clean(), Resend glue, and persist-first Postgres writes (leads + events via Drizzle/Neon). White-paper PDFs moved out of public/ and served by /api/paper/[slug] behind short-lived HMAC tokens.

### Focus trap for the mobile nav overlay
**Completed:** v0.2.1.0 (2026-07-01)

### Component regression tests for Nav, ContactForm, WhitePaperGate
**Completed:** v0.2.1.0 (2026-07-01)

### Fix 8 pre-existing lint errors
**Completed:** v0.2.1.0 (2026-07-01)
