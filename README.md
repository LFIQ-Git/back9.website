# Backnine Trades — backninetrades.com

Client-facing marketing site for Backnine Trades, a third-party R&M operating company serving SF Bay Area multifamily, plus the internal brand package.

## Contents

| File | Purpose |
|------|---------|
| `index.html` | Client-facing marketing homepage: services, team, process, compliance, client portal (work order + proposal forms), FAQ |
| `api/submit.js` | Vercel serverless function — receives portal form submissions and emails them to the dispatch inbox via Resend (zero dependencies, REST call) |
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

## Deploy to Vercel

This is a zero-config static site with one serverless function (`api/submit.js`). No `package.json`, no framework — Vercel serves the static files directly and runs the function on demand.

### One-time setup

1. **Push to GitHub** (or GitLab/Bitbucket):
   ```bash
   git init
   git add .
   git commit -m "Initial Backnine brand package"
   gh repo create backnine-site --public --source=. --push
   ```

2. **Connect to Vercel**:
   - Go to https://vercel.com/new
   - Import the `backnine-site` repo
   - Framework preset: **Other** (static)
   - Output directory: leave blank (root)
   - Click **Deploy**

3. **Custom domain** (optional):
   - In Vercel project settings → Domains, add `backninetrades.com`
   - Update DNS at your registrar to point to Vercel

### Subsequent updates

```bash
git add .
git commit -m "Update flyer copy"
git push
```

Vercel auto-deploys on every push to `main`.

## Portal forms backend

The work-order and proposal forms POST JSON to `/api/submit`, which sends each submission as an email via [Resend](https://resend.com). The function is dependency-free (a single REST call), so the site stays zero-config.

### One-time setup (required for forms to send)

1. **Create a Resend account** at https://resend.com and generate an API key.
2. **Verify the domain** `back9trades.com` in Resend → Domains (this is the email domain; the marketing site is served from backninetrades.com — the two can differ). Resend gives you DKIM/SPF DNS records to add at the registrar (or in Vercel DNS if the domain is managed there). Until the domain is verified, Resend will only deliver mail sent from `onboarding@resend.dev`, and only to the Resend account owner's address — fine for a first test, not for production.
3. **Set environment variables** in Vercel → Project → Settings → Environment Variables (Production + Preview):
   - `RESEND_API_KEY` — the Resend API key (`re_...`)
   - `LEAD_INBOX` — where submissions land (default `info@back9trades.com`)
   - `LEAD_FROM` — verified sender, e.g. `Back9 Trades Portal <portal@back9trades.com>` (use `Back9 Trades Portal <onboarding@resend.dev>` for the pre-verification test)
4. **Redeploy** so the function picks up the env vars.

Each email's `reply_to` is set to the submitter, so replying from the inbox goes straight back to the prospect. A hidden honeypot field blocks basic spam bots. If `RESEND_API_KEY` is missing, the form shows an error telling the visitor to email `info@back9trades.com` directly — it never silently drops a lead.

### Optional: forward inquiries to back9.home

`/api/submit` can also forward the same submission to the back9.home app's inquiry intake webhook, in addition to the Resend email above (which remains the fallback record regardless). Set these in Vercel (Production + Preview) to enable it:

- `B9_INQUIRY_WEBHOOK_URL` — back9.home's inquiry webhook endpoint
- `B9_INQUIRY_SECRET` — shared bearer secret for that endpoint

If either var is unset, forwarding is skipped silently and the site works exactly as before. The forward call is best-effort — it can never fail the form submission; failures are logged to the Vercel function log only.

## Print to PDF

The brand-package documents are letter-size and print clean. From any open file: `Cmd+P` → **Save as PDF**.
