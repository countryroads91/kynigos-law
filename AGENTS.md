<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Testing

- Framework: Vitest 4 (`vitest.config.ts`). Run with `npm test`. See TESTING.md.
- Test files are colocated (`src/**/*.test.ts`); API route handlers are tested by importing `POST` and calling it with a real `Request`.
- Expectations: when writing new functions add a test; when fixing a bug add a regression test; when adding error handling or a conditional, test every path. Never commit code that makes existing tests fail.
- Tests must never send real email—delete `RESEND_API_KEY`/`LEAD_NOTIFY_EMAIL` in `beforeEach`.
