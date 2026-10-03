# Build: back9.website adopt fixes
Started: 2026-10-02  |  Status: COMPLETE

## Objective
Close the approved gaps in docs/lfdev/adopt-gaps.md (items 1 to 6): stop publishing internal and partner-confidential files, keep internal brand pages out of search, and add CI, tests and agent guardrails.

## DONE means
- [x] dist/ has no structure/, docs/ or archive/ — verified by `node --test scripts/build-static.test.mjs` → 4 pass
- [x] package, naming, logos pages carry noindex; robots.txt disallows them — same test
- [x] PR CI workflow — `.github/workflows/ci.yml` (npm ci, check, build:cloudflare); verified on the PR
- [x] CLAUDE.md present
- [x] SessionStart hook in .claude/settings.json — JSON parse check passes
- [x] Test suite — `npm run check` → 14 pass, 0 fail
- [x] Build — `npm run build:cloudflare` → dry run exits 0

## Explicitly NOT in scope
- Branch protection, homepage claim verification, real photos, DNS cleanup: owner items (adopt-gaps.md, Deferred to owner).

## Decision log
| # | Decision | Reasoning | Reversible? |
|---|----------|-----------|-------------|
| 1 | Exclude docs/ and archive/ along with structure/ | Nothing on the site links to them; they are internal records | Yes |
| 2 | Keep package/naming/logos/flyer served, add noindex | Owner may share these links; serving them at all is an owner decision | Yes |
| 3 | Homepage copy unchanged | Claims can only be confirmed by the owner | Yes |

## Blockers
_(none)_

## Session log
### 2026-10-02
- Test written first (3 of 4 red), build script, noindex and robots.txt changed, 14/14 green, wrangler dry run clean.
