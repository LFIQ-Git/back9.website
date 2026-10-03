# Adopt gaps: back9.website (2026-10-02)

## Risk
1. Confidential partner documents are public. `scripts/build-static.mjs` copies `structure/` into `dist/`, so the Structure Properties partnership proposal and founding partner rate sheet are served at back9trades.com/structure/ (HTTP 200 live). Fix: stop publishing `structure/`, `docs/` and `archive/`.

## Broken promise
2. README calls `package.html`, `naming.html` and `logos.html` internal, but they are public and indexable. Fix: add `noindex` to those pages and a `robots.txt` that disallows them.

## Missing guardrail
3. No CI gate on pull requests. Fix: GitHub Actions workflow running `npm ci`, `npm run check` and `npm run build:static`.
4. No test that the build output excludes internal folders. Fix: a `node --test` test over `scripts/build-static.mjs`.
5. No `CLAUDE.md`. Fix: add one carrying the README rules (no invented figures, DNS and Worker boundaries, secrets).
6. No SessionStart hook. Fix: `.claude/settings.json` hook that prints branch and runs nothing destructive.
7. Branch protection off on `main`. Needs repo settings (owner).

## Improvement
8. Homepage claims that only the owner can confirm: "18+ field technicians and supervisors", "typical savings of 5 to 15%", "target response under 60 minutes", Yardi, AppFolio and Buildium workflow support, background screening, 24/7 dispatch.
9. Photos are Pexels stock placeholders (README). Replace with real job-site photos.
10. No sitemap.xml.
11. DNS cleanup from README (`_domainconnect` CNAME, `autodiscover` proxy) is dashboard work.

## Decisions (unattended fleet run, owner asleep)
Approved now: 1, 2, 3, 4, 5, 6.

## Deferred to owner
- 7: turn on branch protection for `main` (repo settings).
- 8: confirm or correct each homepage operating claim; copy was left unchanged.
- 9: supply real Back9 photos.
- 11: DNS dashboard fixes listed in README.
- Decide whether `package.html`, `naming.html`, `logos.html` and `flyer.html` should be served at all, or moved behind Cloudflare Access.
