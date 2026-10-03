# Scaffold check: back9.website (2026-10-02)

| Item | State |
|---|---|
| CI gate on pull requests (tests, build) | Missing. Only CodeQL, Copilot review and Cloudflare Workers Builds run. |
| Environment manifest and check | Partial. `.dev.vars.example` and `secrets.required` in `wrangler.jsonc`. |
| Migrations tooling | Not applicable (no database). |
| Agent guardrails (`CLAUDE.md`) | Missing. Rules live only in README. |
| Claude Code SessionStart hook | Missing. `.claude/launch.json` exists. |
| README sections (run, deploy, secrets) | Present. |
| Branch protection on `main` | Missing (API returns "Branch not protected"). Repo settings are owner-only. |
| robots.txt / sitemap | Missing (404 live). |
