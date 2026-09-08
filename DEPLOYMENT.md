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

## Bilingual content (中文 / ENG)

Every page ships in both languages and a toggle in the upper right of the
masthead switches between them. English is the default; the choice is kept in
`localStorage` under `site-lang` and applied by a snippet in
`_includes/head/custom.html` before the first paint, so there is no flash of
the wrong language. Nothing is server-side and no URLs change.

How it works: both languages sit in the HTML, each copy wrapped in a bare
`.i18n-en` / `.i18n-zh` element, and `_sass/layout/_i18n.scss` reveals one
based on `data-lang` on `<html>`. Chinese text renders in SimSun, with the
nearest Song faces as fallbacks on machines that lack it.

Adding a translation:

- **Short strings in a template**: `{% include t.html en="Research" zh="科研" %}`.
  Leave `zh` off and it falls back to the English.
- **Prose in a Markdown page**: two sibling blocks —
  `<div class="i18n-en" markdown="1"> … </div>` and
  `<div class="i18n-zh" lang="zh-Hans" markdown="1"> … </div>`. Section headings
  become raw `<h1 id="...">` with a `t.html` include so their anchors survive.
- **Front matter**: `title_zh` next to `title` translates a page title;
  `title_zh` in `_data/navigation.yml` translates a nav label; `title_zh`,
  `description_zh` and `topics_zh` under `publication_area` in `_config.yml`
  translate the research areas.
- **Strings that live in an attribute or in JavaScript** (placeholders,
  `<option>` labels, an SVG `<title>`): put `data-en` and `data-zh` on the
  element, plus `data-i18n-attr="placeholder"` when writing an attribute rather
  than the text. `_includes/lang-toggle.html` applies these and fires a
  `langchange` event that the contact panel and the visitor map listen for.

Only put `.i18n-en` / `.i18n-zh` on plain `<span>`/`<div>`/`<p>` wrappers: the
CSS uses `display: revert`, so an element that carries its own display (a
`.btn`, a grid cell) must hold the wrapper inside it rather than on it.

Deliberately left in English: paper titles, author lists, journal names, and
the publication pages' abstracts, which are the papers' own language; the US
state names in the Footprint map tooltips; and the owner-only edit panel at
`/footprint/?edit`.

Shared material — the homepage overview figure, the selected-publications list,
the visitor map — sits outside the language wrappers so it is not duplicated in
the DOM.

## Reach-out panel (message form)

A folded "Reach out" tab sits on the right edge of every page
(`_includes/contact-panel.html`, included from `_layouts/default.html`).
Clicking it slides out a panel with name, email, a category (meeting
request, code request, other) and a message. Any link to `#contact`,
`#contact-code` or `#contact-meeting` also opens it with that category
preselected (the Software tab's "reach out" link does this), and
`/contact/` redirects to the homepage with the panel open. The panel POSTs
to the visitor worker (`worker/visitor-worker.js`, endpoint `/contact`),
which stores the message in D1 and emails it to you through Resend with
Reply-To set to the sender, so replying from Outlook goes straight back to
them. Subjects look like `[Website] [Code request] Jane Doe`, handy for an
Outlook rule. To change the categories, edit the `<select>` and `hints` in
the include and the `TOPICS` table in the worker (then re-paste the worker).

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
4. Test: open https://yutianpang.com/#contact, send yourself a message, check
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
`visitor.api` in `_config.yml` to the worker URL. Anyone can
then click dots to see visit time/city/state/country; your private IP log is
at `<worker-url>/admin?key=ADMIN_KEY`.

The per-page beacon itself lives in `_includes/visit-beacon.html` and is pulled
in sitewide from `_includes/scripts.html`, so every page counts, not only the
homepage. The worker drops repeat hits from the same IP inside 30 minutes, so
one reader browsing several pages is still one visit.

## Counting readers in mainland China

Visitors in mainland China load the site normally, because GitHub Pages is
reachable there, and then vanish: the beacon they send goes to
`visitor-log.yutian-pang.workers.dev`, and the `*.workers.dev` domain is
blocked. The request dies with no error anywhere on the page, so a blocked
visit and no visit look identical. Confirmed on both ends: friends in China
report reaching the site without a VPN, and the log holds zero CN rows out of
532 while showing Hong Kong, which sits outside the firewall.

The fix is to give the worker a custom domain. The site's own hosting does not
change at all, so the reachability your Chinese readers already have is
untouched. **Done 2026-09-08**; the steps below are kept as a record.
`visits.yutianpang.com` is a proxied AAAA record at `100::` plus the worker
route `visits.yutianpang.com/*`, because the Add-domain dialog would not
register the hostname. The apex stays DNS-only on GitHub Pages.

1. Cloudflare → Add a site → `yutianpang.com`, free plan. Let it import the
   existing records, then change the nameservers at GoDaddy to the two
   Cloudflare gives you.
2. In Cloudflare DNS, leave the four GitHub Pages A records
   (185.199.108–111.153) set to **DNS only**, the grey cloud. This is what
   keeps the site byte-for-byte as reachable as it is today. Do not proxy the
   apex; Cloudflare's free edge is slower from China than GitHub Pages is.
3. Worker → Settings → Domains & Routes → Add → Custom domain →
   `visits.yutianpang.com`. Cloudflare creates the proxied record and the
   certificate on its own.
4. In `_config.yml`, swap the two `visitor` lines:

       visitor:
         api          : "https://visits.yutianpang.com"
         api_fallback : "https://visitor-log.yutian-pang.workers.dev"

   The fallback is only tried when the primary fails, and the worker tags the
   visits that needed it, so `/china` shows how much blocking is still
   happening.
5. Set `contact.api` to `https://visits.yutianpang.com` as well. The reach-out
   panel POSTs to the same worker, so today a Chinese reader cannot send you a
   message either. Do this step only after the custom domain resolves: the
   contact form has no fallback.

### Reading `/china`

`<worker-url>/china` (same admin key as `/admin`) splits visits into three
tiers, deliberately kept separate rather than summed:

- **In mainland China** — Cloudflare placed the IP in CN. Certain, and a
  floor: networks that cannot reach the worker never appear.
- **China-linked, VPN or overseas** — a Chinese carrier or cloud network, or a
  `zh-CN` browser running on an `Asia/Shanghai` clock. Language and timezone
  are set by the browser rather than the network, so a VPN does not hide them.
  This is the tier that matters most: mainland academics reaching an overseas
  site are usually on a VPN, and their IP says Los Angeles.
- **Possibly China** — one weak signal only. An upper bound; includes Chinese
  speakers anywhere.

The network table flags education networks. A hit carried by CERNET (AS4538),
the Chinese university backbone, is almost certainly an academic reader, which
is the signal worth watching on the faculty market.

No self-hosted tracker can give complete mainland numbers. Only analytics
hosted inside China (Baidu Tongji) would, at the cost of handing the visitor
log to Baidu.
