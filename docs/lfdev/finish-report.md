# Finish report: back9.website

| # | Step | Status | Fixed | Left (with reason) | Needs a decision | Gates after |
|---|---|---|---|---|---|---|
| 0 | lfdev-audit | done (condensed, in adopt-gaps.md) | n/a | n/a | n/a | 14/14 |
| 1 | lfdev-clean | done | 0 | No dead code or unused dependencies found; only dependency is wrangler | none | 14/14 |
| 2 | lfdev-test | done | Build-output test (4 cases) | No browser e2e; form script is small and covered by Worker tests | none | 14/14 |
| 3 | lfdev-harden | done | Confidential PDFs unpublished; Permissions-Policy header | CSP not added (inline scripts and styles would need nonces); no form rate limit (Cloudflare rule, infra) | Rate limiting on /api/submit | 15/15 |
| 4 | lfdev-perf | done | 0 | Images 128 to 468 KB JPEG, sized and lazy-loaded; WebP conversion is optional | none | 15/15 |
| 5 | lfdev-polish | done | 0 | Forms have labels, error and success states, alt text on images | none | 15/15 |
| 6 | lfdev-copy | skipped | 0 | Homepage operating claims need owner confirmation; no copy changed | Confirm claims | 15/15 |
| 7 | lfdev-docs | done | README "What gets published" section, CLAUDE.md | none | none | 15/15 |
| 8 | lfdev-release | prepared, not deployed | Version 1.1.0, CHANGELOG, release-1.1.0.md | Deploy happens on merge via Workers Builds | none | 15/15 |

## Gate evidence (clean install, 2026-10-02)
- `npm ci` exit 0
- `npm run check` exit 0, 15 tests, 15 pass, 0 fail
- `npm run build:cloudflare` exit 0 (Wrangler dry run)
- No lint or typecheck configured (plain `.mjs`, syntax-checked by `npm run check`).

## Final report
**back9.website, version 1.1.0, 2026-10-02.**
The public website for Back9 Trades, presenting repair and maintenance services to Bay Area multifamily owners and taking work-order and proposal requests. Submissions go by email to info@back9trades.com and to the Back9 dispatch agent.

**State.** All 15 automated tests and the production build pass. Prepared for release; it deploys when the pull request merges to `main`.

**What this round improved.**
- Removed a partner rate sheet, a partnership proposal and four other internal files from public access; they had been served at back9trades.com.
- Added a test that fails the build if internal folders are published again.
- Kept three internal brand pages out of search engines.
- Added CI on every pull request, up from none.
- Tests rose from 10 to 15.

**Risks and open decisions.** (Owner: Justin)
- Homepage claims (18+ technicians, 5 to 15% savings, 60-minute emergency target, PMS integrations, background screening) need confirmation.
- The rate sheet was public until this deploy; copies may already exist outside the site.
- Branch protection on `main` is off.
- The forms have no rate limit beyond a honeypot.

**How it is run.** Runbook: README.md. Rollback: revert the merge on `main` or roll back in Cloudflare Workers Deployments. Monitoring: Cloudflare Workers observability (enabled in `wrangler.jsonc`).

Next: /lfdev-ship
