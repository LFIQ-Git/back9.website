# back9.website

Public marketing site for Back9 Trades LLC at back9trades.com. One Cloudflare Worker (`back9-website`) serves static files from `dist/` and handles `/api/submit`. README has setup and deploy detail; docs/lfdev/ has the as-built brief and spec.

## Rules

- Copy is factual. Do not add license numbers, insurance limits, phone numbers, testimonials, unit counts, prices or savings figures unless the owner supplies them. Existing operating claims on the homepage are pending owner confirmation (see docs/lfdev/adopt-gaps.md); do not add more.
- Photos in `images/` are Pexels stock placeholders. Never caption them as Back9 crews or buildings.
- Everything `scripts/build-static.mjs` copies into `dist/` is public. `archive/`, `docs/` and `structure/` hold internal and partner-confidential files and must never be added to the build. `scripts/build-static.test.mjs` enforces this.
- `package.html`, `naming.html` and `logos.html` are internal brand pages: keep their `noindex` meta and the `robots.txt` entries.
- Merging to `main` deploys to production through Cloudflare Workers Builds. Run `npm run check` and `npm run build:cloudflare` before every PR.
- Worker `back9-website` owns the apex and `client.back9trades.com` only. `home.back9trades.com` is Worker `back9-home`; never attach it here.
- Do not touch mail, Resend DKIM, Microsoft 365 or SES DNS records on this zone.
- Secrets (`RESEND_API_KEY`, `B9_INQUIRY_SECRET`) are Wrangler secrets. Never put values in `wrangler.jsonc`, `.dev.vars.example` or command arguments.
- The form must never drop a lead silently: if email fails, the visitor is told to write to info@back9trades.com.

## Commands

- `npm run check`: syntax check and all `node --test` tests.
- `npm run build:static`: build `dist/`.
- `npm run build:cloudflare`: build plus `wrangler deploy --dry-run`.
