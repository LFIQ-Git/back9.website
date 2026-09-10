# Backnine Trades — back9trades.com

Client-facing marketing site for Backnine Trades, a third-party R&M operating company serving SF Bay Area multifamily, plus the internal brand package.

This site is a Cloudflare Worker (`back9-website`) with static assets. There is no Vercel, Clerk, or Next.js path.

## Contents

| File | Purpose |
|------|---------|
| `index.html` | Client-facing marketing homepage: services, team, process, compliance, client portal (work order + proposal forms), FAQ |
| `worker/` | Cloudflare Worker — serves static files and handles `/api/submit` |
| `package.html` | Internal brand package index (formerly the homepage) |
| `flyer.html` | One-page sales flyer for prospective 3rd-party PMs |
| `naming.html` | Naming decision record — shortlist, domains, risk assessment |
| `logos.html` | Logo lockup options (selected mark + alternates) |
| `images/` | Site photography (SF cityscape + in-unit trade work) |

The homepage was rebuilt 2026-06-12 against the competitive survey in `../docs/Competitive_Survey_SF_Handyman_CM_2026-06-12.md`. Portal forms POST to `/api/submit`, which emails each submission to the dispatch inbox via Resend (see **Portal forms backend** below). Do not add license numbers, insurance limits, phone numbers, or testimonials until they are real.

**Photos are licensed stock placeholders, not Back9's own work.** The images in `images/` are from Pexels (Pexels License — free for commercial use, no attribution required) and are used as representative atmosphere, not captioned as our crew or buildings. Swap them for real Back9 job-site and team photos when available. Sourced 2026-06-26: `sf-skyline-dusk` (hero), `sf-street` (about), `sf-skyline-day` (compliance banner), `work-plumbing` / `work-outlet` / `work-painting` (Services trade strip).

## Local preview

Open `index.html` in any browser. No build step required — pure static HTML/CSS/SVG.

```bash
open index.html
```

For the Cloudflare Worker path:

```bash
npm install
cp .dev.vars.example .dev.vars
# Add local-only values to .dev.vars, then:
npm run dev
```

The Worker serves the static site and handles `/api/submit`.

## Deploy to Cloudflare Workers

`wrangler.jsonc` deploys Worker `back9-website` on `back9trades.com`. That apex Worker record already exists in DNS. `home.back9trades.com` is a different Worker (`back9-home`) — do not attach it here.

Mail, Resend DKIM, Microsoft 365, and SES records on this zone must stay untouched.

1. Validate without deploying:
   ```bash
   npm install
   npm run check
   npm run build:cloudflare
   ```
2. Confirm Worker `back9-website` and custom domain `back9trades.com` in the Cloudflare account. Do not deploy over a different Worker.
3. Add encrypted secrets (names only; never put values in `wrangler.jsonc` or command arguments):
   ```bash
   npx wrangler secret put RESEND_API_KEY
   ```
   If inquiry forwarding is enabled, also add `B9_INQUIRY_WEBHOOK_URL` and `B9_INQUIRY_SECRET`.
4. Deploy:
   ```bash
   npm run deploy:cloudflare
   ```
5. Verify `https://back9trades.com/`, a static image, and a safe portal form submission.

Wrangler reads local secrets from `.dev.vars` (gitignored).

### DNS notes for `back9trades.com`

Keep: CAA, Outlook MX/autodiscover, SPF, Microsoft/Google verification, Resend DKIM, `send.back9trades.com` SES records, Worker `back9-website` at apex, Worker `back9-home` at `home.back9trades.com`.

Fix in the dashboard (not in this repo):

- Delete `_domainconnect` CNAME to `_domainconnect.vercel-dns.com` (Vercel leftover).
- Set `autodiscover.back9trades.com` to **DNS only**. Proxying Outlook autodiscover breaks Microsoft 365.

Internal apps use Cloudflare Access. This public marketing site is not behind Access and does not use Clerk.

## Portal forms backend

Work-order and proposal forms POST JSON to `/api/submit`. The Worker emails each submission via [Resend](https://resend.com).

### One-time setup

1. Create a Resend account and API key.
2. Verify `back9trades.com` in Resend → Domains and keep the existing DKIM/SPF records in Cloudflare DNS.
3. Store Worker secrets / vars:
   - `RESEND_API_KEY` — encrypted secret
   - `LEAD_INBOX` — default `info@back9trades.com` (Wrangler var)
   - `LEAD_FROM` — verified sender, e.g. `Back9 Trades Portal <portal@back9trades.com>` (Wrangler var)

Each email's `reply_to` is the submitter. A hidden honeypot blocks basic spam. If `RESEND_API_KEY` is missing, the form tells the visitor to email `info@back9trades.com` — it never silently drops a lead.

### Optional: forward inquiries to back9.home

Set these encrypted Worker secrets to also POST to the back9.home inquiry webhook:

- `B9_INQUIRY_WEBHOOK_URL`
- `B9_INQUIRY_SECRET`

If either is unset, forwarding is skipped. Email still sends. Forwarding is best-effort and cannot fail the form. A `200` from the form does not prove the webhook ran — confirm a test proposal in the app inquiry queue.

## Print to PDF

The brand-package documents are letter-size and print clean. From any open file: `Cmd+P` → **Save as PDF**.
