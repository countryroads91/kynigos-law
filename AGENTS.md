<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes—APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Testing

- Framework: Vitest 4 (`vitest.config.ts`). Run with `npm test`. See TESTING.md.
- Test files are colocated (`src/**/*.test.{ts,tsx}`); API route handlers are tested by importing `POST` and calling it with a real `Request`. Component and page tests (`.tsx`) use React Testing Library with a per-file `// @vitest-environment jsdom` pragma.
- Expectations: when writing new functions add a test; when fixing a bug add a regression test; when adding error handling or a conditional, test every path. Never commit code that makes existing tests fail.
- Tests must never touch real services—`vi.mock` the SDK modules (`resend`, `@upstash/ratelimit`, `@upstash/redis`) and manage env via `vi.stubEnv` in `beforeEach` with `vi.unstubAllEnvs()` in `afterEach`. Stub the env-gated vars (`DATABASE_URL`, `TURNSTILE_SECRET_KEY`, `UPSTASH_REDIS_REST_URL`/`TOKEN`) to `""` unless the test exercises that feature.
