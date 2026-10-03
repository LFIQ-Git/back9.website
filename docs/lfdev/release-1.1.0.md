# Release 1.1.0 (prepared, not deployed by this run)

**What ships.** See CHANGELOG.md 1.1.0. No copy, form or Worker routing changes beyond one added response header.

**How it deploys.** Merging the PR to `main` triggers Cloudflare Workers Builds for Worker `back9-website`. No secrets, DNS or routes change.

**Verify after deploy.**
1. `https://back9trades.com/` returns 200 and both forms render.
2. `https://back9trades.com/robots.txt` returns 200.
3. Any URL under `/structure/`, `/docs/` or `/archive/` returns 404.
4. `curl -sI https://back9trades.com/ | grep -i permissions-policy` shows the header.

**Rollback.** Revert the merge commit on `main`, or roll back to the previous version in Cloudflare dashboard, Workers, back9-website, Deployments.

**Note.** Search engines or anyone who already downloaded the rate sheet keep their copy. Removal from the site does not recall it.
