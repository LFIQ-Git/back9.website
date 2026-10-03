# Brief: back9.website

## As built, 2026-10-02

**What it is.** The public marketing site for Back9 Trades LLC at back9trades.com. It presents repair and maintenance services to multifamily owners and property managers in the San Francisco Bay Area and takes work-order and proposal requests through two web forms (`index.html`, `worker/submit.mjs`).

**Users.**
- Prospective clients: property managers and owners evaluating a maintenance vendor (inferred from page copy and the proposal form fields `company`, `units`, `requestType`).
- Existing clients: submit work orders on the site or sign in to the Jobber Client Hub (footer link in `index.html`; `client.back9trades.com` redirect in `worker/index.mjs`).
- Back9 staff: receive form submissions by email at `info@back9trades.com` and in the agent.back9 inquiry queue (`wrangler.jsonc` vars).
- Internal readers of the brand package pages `package.html`, `flyer.html`, `naming.html`, `logos.html` (README calls these internal).

**Critical journeys.**
1. A visitor reads the homepage and requests a proposal through the proposal form.
2. A client submits a work order through the work-order form.
3. A client with an old `client.back9trades.com` link lands on the Jobber Client Hub sign-in.
4. A visitor reads the Terms and Privacy pages (`/terms`, `/privacy`).

**Out of scope.** Accounts, payments, scheduling and job tracking. Those live in Jobber and in back9.operations (agent.back9trades.com).
