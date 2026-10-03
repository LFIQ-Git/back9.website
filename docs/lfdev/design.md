# Design: back9.website

## As built, 2026-10-02

**Navigation.** Single-page homepage with anchor navigation (`#services` and other sections), a mobile menu button, and a footer with Services, Contact, Terms, Privacy and staff sign-in links. Legal pages share `legal.css`.

**Tokens** (`:root` in `index.html`). Navy scale `--navy-900 #06223F` to `--navy-300 #6B8AAC`; ivory `--ivory #FBF6E4`, `--ivory-warm`, `--ivory-deep`; accent peach `--peach #E3A074`, `--peach-deep #BE6F44`; `--surface #FFFDF6`; text `--fg`, `--fg-muted #54616E`, `--fg-faint`; `--danger #B3402F`, `--success #3F7A53`. Type: `--display` Arvo, `--sans` Montserrat (self-hosted in `fonts/`). Three shadow levels plus `--shadow-navy`.

**Screen states.**
| Screen | Empty | Loading | Error | Success | No permission |
|---|---|---|---|---|---|
| Homepage | n/a (static) | n/a | n/a | n/a | n/a |
| Work-order and proposal forms | Field-level `required` | Submit in flight (inline script) | Error message with the email fallback | Thank-you panel `#thanks` | n/a (public) |
| Terms, Privacy | n/a | n/a | n/a | n/a | n/a |
| Internal brand pages | n/a | n/a | n/a | n/a | Not gated; public and indexable |
