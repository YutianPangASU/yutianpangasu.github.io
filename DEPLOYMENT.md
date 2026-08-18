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
- Push to deploy: `git add -A && git commit -m "update" && git push`
  (live in ~1 minute).

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
