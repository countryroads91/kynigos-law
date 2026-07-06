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

- **Unit/API tests** (`src/**/*.test.{ts,tsx}`)—colocated next to the code they cover. Currently 40 tests in 6 files: the `/api/contact` and `/api/lead` route handlers (validation, jurisdiction gate, malformed input), the `Nav`, `ContactForm`, and `WhitePaperGate` components, and the homepage (`src/app/page.test.tsx`—hero anchor, `#how-it-works` section, services ticker band).
- **Integration/E2E**—not yet configured. Browser-level verification happens via gstack `/qa` at mobile and desktop viewports.

## Conventions

- Test files are colocated: `route.ts` → `route.test.ts`.
- Import the handler directly and call it with a real `Request`—no server needed for App Router route handlers.
- Tests must never send real email: delete `RESEND_API_KEY`/`LEAD_NOTIFY_EMAIL` in `beforeEach`.
- Assert behavior (status codes, response bodies, error copy), not existence.
- When fixing a bug, add a regression test. When adding a conditional, test both paths.
