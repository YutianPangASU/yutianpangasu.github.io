# yutianpang.com — academic homepage

Single-file static site (`index.html` contains all markup, styles, and scripts).
No build step, no dependencies.

## Preview locally

```bash
cd ~/research/webpage
python3 -m http.server 8000
# open http://localhost:8000
```

(If you're working over VSCode Remote-SSH, the port forwards automatically —
just Ctrl+click the URL in the terminal.)

## Deploy to GitHub Pages (free, custom domain supported)

The local git repo is already initialized and committed. To publish:

1. On github.com (account **YutianPangASU**), create a new **public** repo named
   `yutianpangasu.github.io` (any name works, but this one also gives you a
   fallback URL). Do **not** initialize it with a README.
2. Push:

   ```bash
   cd ~/research/webpage
   git remote add origin git@github.com:YutianPangASU/yutianpangasu.github.io.git
   git push -u origin main
   ```

   (Use `https://github.com/...` for the remote URL if you don't have SSH keys
   set up with GitHub.)
3. On GitHub: **Settings → Pages** → Source: *Deploy from a branch* →
   Branch: `main`, folder `/ (root)` → Save.
4. Still in **Settings → Pages**, under *Custom domain* enter `yutianpang.com`
   and save. The `CNAME` file in this repo keeps that setting across pushes.
5. After DNS is set up (below) and the check passes, tick **Enforce HTTPS**.

## GoDaddy DNS setup

In GoDaddy: **My Products → yutianpang.com → DNS → Manage DNS**. Remove any
default "Parked" / forwarding records, then add:

| Type  | Name | Value                       | TTL     |
|-------|------|-----------------------------|---------|
| A     | @    | 185.199.108.153             | default |
| A     | @    | 185.199.109.153             | default |
| A     | @    | 185.199.110.153             | default |
| A     | @    | 185.199.111.153             | default |
| CNAME | www  | yutianpangasu.github.io     | default |

DNS changes typically take a few minutes but can take up to an hour or two.
Check with: `dig yutianpang.com +short` (should return the four A records).

## Visitor tracking

The site ships with a Google Analytics 4 hook that is **inactive until you add
your ID**:

1. Go to <https://analytics.google.com> → Admin → **Create property** →
   add a *Web* data stream for `https://yutianpang.com`.
2. Copy the Measurement ID (`G-XXXXXXXXXX`).
3. In `index.html`, near the bottom, set:

   ```js
   var GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';
   ```

4. Commit and push. Visits, referrers, geography, and per-section traffic will
   appear in the GA4 dashboard (real-time within seconds; reports within ~24h).

Privacy-friendlier alternative: [GoatCounter](https://www.goatcounter.com)
(free, no cookies, shows a simple visit counter). Sign up, then replace the GA
block in `index.html` with their one-line script tag.

## Visitor map (on-page widget)

A prepared-but-inactive "Visitors" section sits just above the footer in
`index.html` — a world map showing a dot per visitor, with click-through to
per-visitor detail (IP, time, country, state/province, city).

1. Sign up free at <https://clustrmaps.com> ("Get your free map"), register
   `https://yutianpang.com`, and choose the **Map** widget. Colors that match
   the site: background `#D9E2E9`, dots `#A2346B`, text `#14538F`.
2. Copy the `<script>` embed snippet.
3. In `index.html`, find the `VISITOR MAP` comment block above the footer:
   delete the comment markers so the `<section id="visitors">` becomes live,
   and paste the snippet in place of `PASTE YOUR CLUSTRMAPS <script> SNIPPET
   HERE`. Optionally add `<li><a href="#visitors">Visitors</a></li>` to the
   sidebar nav.
4. Commit and push.

Per-visitor IP detail lives in your ClustrMaps account dashboard (the public
map click shows locations only). If you want fully private per-visitor logs
instead of an on-page map, [StatCounter](https://statcounter.com) offers the
same detail with an invisible tracker. GA4 (above) coexists fine with either.

## Updating content

Everything lives in `index.html`, in clearly marked sections:

- **Photo** — drop a headshot at `assets/img/profile.jpg`, then replace the
  `<svg class="avatar">…</svg>` block with
  `<img class="avatar" src="assets/img/profile.jpg" alt="Yutian Pang">`
  (a comment in the file marks the spot).
- **News** — add a `<li>` at the top of the `<ul class="news">` list.
- **Publications** — each group (`Under review`, `Journal articles`, …) is an
  `<ol class="pubs">`; copy an existing `<li>` as a template.
- **CV PDF** — overwrite `assets/cv/Yutian_Pang_CV.pdf` with a fresh export.
- **LinkedIn / GitHub links** — uncomment the placeholders in the
  `<div class="links">` block in the sidebar.

After any edit: `git add -A && git commit -m "update" && git push` — the live
site refreshes in about a minute.
