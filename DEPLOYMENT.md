# Site operations — yutianpang.com

Live site: https://yutianpang.com — GitHub Pages (branch `main`, root),
built automatically with Jekyll from the Academic Pages template.
Domain: GoDaddy DNS → 4 GitHub Pages A records on `@`, `www` CNAME →
`yutianpangasu.github.io`. HTTPS enforced. The `CNAME` file keeps the
custom domain across pushes — do not delete it.

Previous custom single-page design: branch `custom-site`.

## Everyday updates

- **News / about**: `_pages/about.md`
- **Publications**: one Markdown file per paper in `_publications/`
  (front matter: title, category, venue, date, excerpt = the one-sentence
  intro shown in lists and on the paper's page, citation). Categories:
  manuscripts (Journal Articles), underreview, workingpapers, conferences,
  patents.
- **Talks**: `_talks/`
- **CV**: `_pages/cv.md` + replace `files/Yutian_Pang_CV.pdf`
- **Photo**: `images/profile.jpg` (square-cropped headshot; replace to update)
- **Footprint page** (`/footprint/`, travel log with maps and park photos):
  - Parks and photos: add the park to `_data/travel.yml`, drop resized photos
    (~1600px long edge) into `images/travel/<slug>/` (folders for all 63
    national parks already exist; see `images/travel/README.md`). States on
    the US map shade automatically from each park's `state` field; states
    visited without a park entry go in `_data/visited_states.yml`.
  - Everything is pickable at `/footprint/?edit`: click Interstates on the
    highway map (paste into `_data/highways.yml`), click states on the state
    map (paste into `_data/visited_states.yml`; park-derived states are
    locked), and tick national parks in the panel checklist (paste the
    generated entries into `_data/travel.yml`, then fill in visited dates).
- Push to deploy: `git add -A && git commit -m "update" && git push`
  (live in ~1 minute).

## Contact form (`/contact/`)

Visitors write a message (name, email, topic, text) on the Contact tab
(`_pages/contact.html`). The page POSTs it to the visitor worker
(`worker/visitor-worker.js`, endpoint `/contact`), which stores it in D1 and
emails it to you through Resend with Reply-To set to the sender, so replying
from Outlook goes straight back to them. Subjects look like
`[Website] [Code request] Jane Doe`, handy for an Outlook rule.

Private inbox with every message and a "mark handled" toggle:
`<worker-url>/inbox` (same admin key/cookie as the visit log; also linked from
the visit log header). Messages are kept there even if the email fails to send.

One-time setup (worker → Settings → Variables and Secrets):

1. https://resend.com account (created 2026-09-03 with `yutian.pang@outlook.com`)
   → API Keys. Add the key as secret `RESEND_API_KEY`.
2. Add variable `CONTACT_TO` = `yutian.pang@outlook.com`. It must be the
   Resend account's own address: the default sender `onboarding@resend.dev`
   delivers only there (a UT address would be rejected until the domain is
   verified, see below). No DNS change is required for this.
3. Paste the current `worker/visitor-worker.js` into the worker and Deploy.
4. Test: open https://yutianpang.com/contact/, send yourself a message, check
   Outlook (and spam) and `<worker-url>/inbox`.

Optional later:

- **Send from your own domain** (nicer sender, lets `CONTACT_TO` be any
  address such as the UT one, and needed before the worker could ever email
  visitors): Resend → Domains → Add `yutianpang.com`, add the TXT records it
  lists at GoDaddy, then set variable `MAIL_FROM` to
  `yutianpang.com <contact@yutianpang.com>`.
- **Captcha** if spam gets through the honeypot and rate limits (5 per IP per
  hour, 100 per day): Cloudflare → Turnstile → Add widget (hostname
  `yutianpang.com`, Managed). Put the secret key in the worker as
  `TURNSTILE_SECRET` and the site key in `_config.yml` under
  `contact.turnstile_site_key`, then push.

## Analytics (Google Analytics 4)

Create a GA4 property for https://yutianpang.com at
https://analytics.google.com, copy the Measurement ID (G-XXXXXXXXXX), then in
`_config.yml` set:

    analytics:
      provider: "google-analytics-4"
      google:
        tracking_id: "G-XXXXXXXXXX"

Geography reports (country / state / city): GA4 → Reports → User →
User attributes → Demographic details.

## Visitor map (bottom of the homepage)

`_includes/visitor-map.html` shows the MapMyVisitors widget
(dashboard with per-visitor IP/time/location: mapmyvisitors.com account).

Optional upgrade to a full interactive on-page map: deploy
`worker/visitor-worker.js` on Cloudflare (setup steps in that file), then set
`VISITOR_API` in `_includes/visitor-map.html` to the worker URL. Anyone can
then click dots to see visit time/city/state/country; your private IP log is
at `<worker-url>/admin?key=ADMIN_KEY`.
