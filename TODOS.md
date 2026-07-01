# TODOS

## Contact & Lead Capture

### Add Turnstile (or equivalent) bot protection to /api/contact and /api/lead
**Priority:** P1
CEO-PLAN specifies Resend + Turnstile for the contact form. The honeypot shipped in v0.2.0.0 stops naive bots, but both endpoints remain unauthenticated public email triggers with no rate limiting. Needs Cloudflare Turnstile keys (user must provision) or a per-IP rate limit (Upstash/Vercel WAF). Flagged by /ship security review 2026-07-01.

### Verify Resend env vars in Vercel production for /api/contact
**Priority:** P1
The contact route now returns 502 when RESEND_API_KEY/LEAD_NOTIFY_EMAIL are missing. Confirm all three vars (including LEAD_FROM_EMAIL with a verified domain sender—the onboarding@resend.dev fallback only delivers to the Resend account owner) are set in production, then submit a live test inquiry.

### Extract shared email/validation helpers for the two API routes
**Priority:** P2
/api/contact and /api/lead duplicate EMAIL_RE, control-char sanitization, env reads, and the Resend send/catch structure; the DC referral copy is duplicated between ContactForm and the route. Extract src/lib helpers (flagged by /ship maintainability review 2026-07-01).

## Mobile & Accessibility

### Verify the mobile menu fix on a real iPhone
**Priority:** P1
The ISSUE-001 stacking-context fix (menu could not be closed) was verified in Chromium emulation at 390x844. Do a 30-second check on a physical iPhone after v0.2.0.0 deploys: open menu, close via X, navigate via menu links.

### Focus trap for the mobile nav overlay
**Priority:** P2
Design system §16 requires the full-screen mobile menu to trap Tab focus while open and return focus to the burger on close. Currently Tab can reach page content behind the panel. Flagged by /ship design review 2026-07-01.

### Component regression tests for Nav, ContactForm, WhitePaperGate
**Priority:** P2
The vitest suite covers API routes only (node env). Add jsdom + @testing-library/react to regression-test the menu route-change close, the jurisdiction gate UI, and the useId label fix.

## Code Health

### Fix 8 pre-existing lint errors
**Priority:** P2
6 react/no-unescaped-entities in src/app/white-papers/page.tsx; 2 react-hooks errors in src/components/HeadlineReel.tsx (setState-in-effect, use-before-declare). Pre-date the v0.2.0.0 branch; `npm run lint` is red until fixed.

### Decide fate of public/kynigos-alt-hero.html
**Priority:** P3
Untracked draft mockup sitting in public/. If ever committed it deploys as a live URL on the production domain. Move to Website Source/Mockups/ or delete. (May belong to a concurrent working session—check before removing.)

## Completed
