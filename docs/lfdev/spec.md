# Spec: back9.website

## As built, 2026-10-02

**Architecture.** One Cloudflare Worker, `back9-website` (`wrangler.jsonc`), with static assets bound as `ASSETS` from `./dist`. `scripts/build-static.mjs` copies the HTML pages, `legal.css`, `b9.png` and the folders `images`, `fonts`, `archive`, `docs` and `structure` into `dist/`. The Worker runs first on every request (`run_worker_first: true`).

**Routes** (`worker/index.mjs`).
- Host `client.back9trades.com`, any path: 301 to the Jobber Client Hub sign-in URL.
- `POST /api/submit`: form handler in `worker/submit.mjs`.
- Any other `/api/*`: JSON 404.
- Everything else: static asset from `dist/`, with `X-Frame-Options`, `X-Content-Type-Options` and `Referrer-Policy` headers added.

**Data model.** None. The site stores nothing. Submissions are emailed and forwarded.

**Integrations.**
- Resend (email). Auth: secret `RESEND_API_KEY`. If the secret is missing the form returns an error telling the visitor to email `info@back9trades.com`. Tested in `worker/submit.test.mjs`.
- agent.back9 inquiry webhook. URL in var `B9_INQUIRY_WEBHOOK_URL`, shared secret `B9_INQUIRY_SECRET`. Best effort via `ctx.waitUntil`; it cannot fail the form.
- Jobber Client Hub: outbound links and the redirect only.

**Input handling.** Body capped at 64 KB while streaming; each field trimmed and length-capped; HTML-escaped in the email; honeypot field `website`; email pattern check.

**Environments.** Production only: custom domains `back9trades.com` and `client.back9trades.com`; `workers_dev` and preview URLs are off. Cloudflare Workers Builds deploys `main` on push (check run "Workers Builds: back9-website" on commit 1c007e2).

**Secrets (names only).** `RESEND_API_KEY` (required), `B9_INQUIRY_SECRET`. Vars: `B9_INQUIRY_WEBHOOK_URL`, `DEPLOYMENT_ENV`, `LEAD_INBOX`, `LEAD_FROM`.

**Security model.** Public site, no auth. Every file copied into `dist/` is publicly reachable. On 2026-10-02 that included the Structure Properties partnership proposal and partner rate sheet PDFs under `/structure/` (HTTP 200 checked live).

**Commands.** `npm run check` (syntax check plus `node --test`, 10 tests pass), `npm run build:static`, `npm run build:cloudflare` (wrangler dry run). No lint or typecheck configured (plain `.mjs`).
