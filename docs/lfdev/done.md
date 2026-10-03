# DONE contract: back9.website adopt fixes (2026-10-02)

1. `npm run build:static` produces a `dist/` with no `structure/`, `docs/` or `archive/` folder. Proof: `test -d dist/structure || test -d dist/docs || test -d dist/archive` exits non-zero; `scripts/build-static.test.mjs` passes.
2. `package.html`, `naming.html` and `logos.html` carry `<meta name="robots" content="noindex, nofollow">`, and `dist/robots.txt` disallows them. Proof: `grep -l noindex` lists all three; build test checks robots.txt.
3. `.github/workflows/ci.yml` runs `npm ci`, `npm run check` and `npm run build:static` on pull requests and pushes to main. Proof: the workflow passes on the PR.
4. `CLAUDE.md` exists with the site rules. Proof: file present.
5. `.claude/settings.json` defines a SessionStart hook. Proof: `node -e` JSON parse succeeds and the hook key is present.
6. `npm run check` passes with the new test included.
