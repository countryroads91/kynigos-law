# Testing

100% test coverage is the key to great vibe coding. Tests let you move fast, trust your instincts, and ship with confidence—without them, vibe coding is just yolo coding. With tests, it's a superpower.

## Framework

- **Vitest 4** (`vitest.config.ts`), node environment by default, `@` aliased to `src/`. Component and page tests opt into jsdom with a per-file `// @vitest-environment jsdom` pragma and use React Testing Library.

## Running tests

```bash
npm test          # vitest run (single pass, CI mode)
npx vitest        # watch mode
```

CI runs a typecheck (`npx tsc --noEmit`) and `npm test` on every push to main and every pull request (`.github/workflows/test.yml`).

## Test layers

- **Unit/API tests** (`src/**/*.test.{ts,tsx}`)—colocated next to the code they cover. Currently 267 tests in 48 files: the `/api/contact`, `/api/lead`, `/api/paper/[slug]`, `/api/subscribe`, `/api/subscribe/confirm`, and `/api/digest` route handlers (validation, jurisdiction gate, Turnstile verification, rate limiting, persist-first ordering, signed downloads, double-opt-in tokens, cron bearer auth), the shared libraries in `src/lib` (`leads`, `newsletter`, `analytics`, `turnstile`, `ratelimit`, `paper-token`, `db`), the security headers and CSP config (`src/next.config.test.ts`), components (including `TurnstileWidget`, cross-form Turnstile gating, `ConsentModeBridge`, `NewsletterSignup`, and `ConfirmSubscription`), and every page.
- **Integration/E2E**—not yet configured. Browser-level verification happens via gstack `/qa` at mobile and desktop viewports.

## Conventions

- Test files are colocated: `route.ts` → `route.test.ts`.
- Import the handler directly and call it with a real `Request`—no server needed for App Router route handlers.
- Tests must never touch real services: `vi.mock` the SDK modules (`resend`, `@upstash/ratelimit`, `@upstash/redis`) and manage env with `vi.stubEnv` in `beforeEach` plus `vi.unstubAllEnvs()` in `afterEach`. Route tests stub the env-gated vars (`DATABASE_URL`, `TURNSTILE_SECRET_KEY`, `UPSTASH_REDIS_REST_URL`/`TOKEN`) to `""` so persistence, Turnstile, and rate limiting stay off in base cases and are enabled per test.
- Assert behavior (status codes, response bodies, error copy), not existence.
- When fixing a bug, add a regression test. When adding a conditional, test both paths.
