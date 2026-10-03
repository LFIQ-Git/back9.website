# Changelog

## 1.1.0 (2026-10-02)

### Security
- The Structure Properties partnership proposal and partner rate sheet, the internal naming and brand PDFs, and the old homepage copies are no longer published. They were reachable under `/structure/`, `/docs/` and `/archive/`. A build test keeps them out.
- Responses now send a `Permissions-Policy` header that turns off camera, microphone, location and payment access.

### Changed
- The internal brand pages (`/package`, `/naming`, `/logos`) are marked `noindex` and listed in a new `robots.txt`.

### Added
- GitHub Actions CI on pull requests and on `main`: tests and a Wrangler dry-run build.
- `CLAUDE.md`, a Claude Code SessionStart hook, and as-built project documents in `docs/lfdev/`.

## 1.0.0
- Site as of commit 1c007e2 (2026-09-27), before versioning.
