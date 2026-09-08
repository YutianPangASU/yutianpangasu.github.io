/**
 * Visitor logger + contact form backend for yutianpang.com — Cloudflare Worker
 *
 * Endpoints:
 *   GET  /hit     — called by the homepage on each page load; records the visit
 *                   (time, geolocation from Cloudflare, IP, network owner) into
 *                   D1. Skips bots and repeat hits from the same IP within 30
 *                   minutes. The network owner (Cloudflare's asOrganization)
 *                   explains most "unknown location" rows: VPNs, Apple Private
 *                   Relay, mobile carriers, and cloud hosts.
 *   GET  /visits  — public JSON of recent visits (time, country, region, city,
 *                   lat/lon). NO IP addresses — this feeds the public map.
 *   GET  /china   — owner-only breakdown of visits carrying a Chinese signal
 *                   (mainland IP, Chinese carrier or university network, or a
 *                   zh-CN browser on an Asia/Shanghai clock). Same key/cookie
 *                   as /admin. Read it as a floor: mainland networks that
 *                   cannot reach this worker leave no trace at all.
 *   GET  /admin?key=YOUR_ADMIN_KEY
 *                 — owner-only HTML table of the full log, including IPs.
 *                   A correct key sets a year-long cookie, after which plain
 *                   /admin opens directly in that browser; without key or
 *                   cookie the page shows a key prompt.
 *   POST /contact — receives messages from the site's reach-out panel
 *                   (_includes/contact-panel.html) as JSON {name, email,
 *                   topic, message}; topic is one of the TOPICS keys below.
 *                   Each message is stored in D1 and emailed to CONTACT_TO
 *                   through Resend with
 *                   Reply-To set to the sender, so replying from Outlook goes
 *                   straight back to them. Spam defences: a honeypot field, at
 *                   most 5 messages per IP per hour, at most 100 per day in
 *                   total, and Cloudflare Turnstile when TURNSTILE_SECRET is set.
 *   GET  /inbox   — owner-only list of received messages (same key/cookie as
 *                   /admin), newest first, with a "mark handled" toggle
 *                   (POST /inbox/toggle). Shows whether the email went out.
 *
 * Setup (Cloudflare dashboard, ~5 minutes):
 *   1. Workers & Pages → Create → Worker ("visitor-log"), paste this file,
 *      Deploy.
 *   2. Storage & Databases → D1 → Create database ("visitors").
 *   3. Worker → Settings → Bindings → Add → D1 database:
 *      variable name DB, database "visitors".
 *   4. Worker → Settings → Variables and Secrets → Add secret:
 *      name ADMIN_KEY, value = any long random string you keep private.
 *   5. Done. The worker URL looks like https://visitor-log.<account>.workers.dev
 *      — paste it into VISITOR_API in _includes/visitor-map.html and into
 *      contact.api in _config.yml.
 *
 * Contact form (same Variables and Secrets page):
 *   6. Secret RESEND_API_KEY — from https://resend.com → API Keys. The default
 *      sender onboarding@resend.dev can deliver only to the Resend account
 *      owner's own address, so no DNS changes are required to start.
 *   7. Variable CONTACT_TO — the receiving address. Must be the Resend account
 *      email (yutian.pang@outlook.com) until the domain is verified; after
 *      that it can be any address, e.g. the UT one.
 *   8. Optional variable MAIL_FROM — after verifying yutianpang.com in Resend
 *      (Domains → Add, then add the TXT records it shows at GoDaddy), e.g.
 *      "yutianpang.com <contact@yutianpang.com>". Defaults to
 *      onboarding@resend.dev.
 *   9. Optional secret TURNSTILE_SECRET — Cloudflare → Turnstile → Add widget
 *      (hostname yutianpang.com, mode Managed). Put the matching site key in
 *      _config.yml under contact.turnstile_site_key. Leave both unset to skip
 *      the captcha; the honeypot and rate limits still apply.
 *
 * Messages are stored in D1 even when the email fails to send, so nothing is
 * lost if a key is missing or wrong; /inbox flags undelivered ones.
 */

const SCHEMA = `CREATE TABLE IF NOT EXISTS visits (
  id      INTEGER PRIMARY KEY AUTOINCREMENT,
  ts      TEXT NOT NULL,
  ip      TEXT,
  country TEXT,
  region  TEXT,
  city    TEXT,
  lat     REAL,
  lon     REAL,
  ua      TEXT,
  asn     INTEGER,
  org     TEXT
)`;

const MESSAGES_SCHEMA = `CREATE TABLE IF NOT EXISTS messages (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  ts        TEXT NOT NULL,
  name      TEXT NOT NULL,
  email     TEXT NOT NULL,
  topic     TEXT,
  message   TEXT NOT NULL,
  ip        TEXT,
  country   TEXT,
  city      TEXT,
  delivered INTEGER NOT NULL DEFAULT 0,
  handled   INTEGER NOT NULL DEFAULT 0
)`;

// Columns added after the first deployment; the ALTER fails harmlessly when
// the column already exists.
const MIGRATIONS = [
  "ALTER TABLE visits ADD COLUMN asn INTEGER",
  "ALTER TABLE visits ADD COLUMN org TEXT",
  "ALTER TABLE visits ADD COLUMN lang TEXT",
  "ALTER TABLE visits ADD COLUMN tz TEXT",
  "ALTER TABLE visits ADD COLUMN colo TEXT",
  "ALTER TABLE visits ADD COLUMN via TEXT",
];

async function ensureSchema(db) {
  await db.prepare(SCHEMA).run();
  await db.prepare(MESSAGES_SCHEMA).run();
  for (const sql of MIGRATIONS) {
    try { await db.prepare(sql).run(); } catch (_) { /* already migrated */ }
  }
}

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const BOT_RE = /bot|crawl|spider|slurp|preview|curl|wget|python|httpx|monitor|pingdom|lighthouse|headless/i;

// Contact-form topics; the key is what the page sends, the value is the label
// used in email subjects and the inbox.
const TOPICS = {
  meeting: "Meeting request",
  code: "Code request",
  other: "Other",
};
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_PER_IP_PER_HOUR = 5;
const MAX_PER_DAY = 100;

function json(data, extra = {}, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...CORS, ...extra },
  });
}

const esc = v => String(v == null ? "" : v)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// ---------------------------------------------------------------------------
// Owner login shared by /admin and /inbox
// ---------------------------------------------------------------------------

function adminKeys(request, url) {
  const qKey = url.searchParams.get("key") || "";
  const cookieKey = ((request.headers.get("Cookie") || "")
    .match(/(?:^|;\s*)adminkey=([^;]*)/) || [])[1] || "";
  return { qKey, cookieKey };
}

function isAdmin(env, { qKey, cookieKey }) {
  return !!env.ADMIN_KEY && (qKey === env.ADMIN_KEY || cookieKey === env.ADMIN_KEY);
}

function loginPage(title, action) {
  return new Response(`<!doctype html><meta charset="utf-8"><title>${esc(title)}</title>
<style>body{font:14px/1.6 sans-serif;margin:4rem auto;max-width:22rem;color:#182430}
input{width:100%;padding:6px;margin:6px 0}button{padding:6px 16px}</style>
<h3>${esc(title)}</h3><p>This page is for the site owner.</p>
<form method="GET" action="${esc(action)}"><input type="password" name="key" placeholder="admin key" autofocus>
<button>Open</button></form>`, {
    status: 401, headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

function adminHeaders(env, { qKey }) {
  const headers = { "Content-Type": "text/html; charset=utf-8" };
  if (qKey && qKey === env.ADMIN_KEY) {
    headers["Set-Cookie"] =
      `adminkey=${qKey}; HttpOnly; Secure; Path=/; Max-Age=31536000; SameSite=Lax`;
  }
  return headers;
}

// ---------------------------------------------------------------------------
// China visibility
// ---------------------------------------------------------------------------
//
// Counting mainland readers is harder than counting anyone else, for two
// reasons. Much of the mainland cannot reach this worker at all, so an
// IP-based count undercounts by an unknown amount. And the Chinese academics
// most likely to find this site are the ones behind a VPN, whose IP says Los
// Angeles. So three independent signals are recorded and reported separately
// rather than merged into one number that would be wrong in both directions:
//
//   IP        cf.country === "CN". Certain, but blind to blocked networks.
//   Network   cf.asOrganization names a Chinese carrier or cloud. CERNET
//             (AS4538) is the university backbone, so a hit carried by it is
//             almost certainly an academic reader.
//   Browser   Accept-Language zh-CN and an Asia/Shanghai clock. Both are set
//             by the browser, not the network, so a VPN does not hide them.

const CN_NET_RE = /\b(china|chinanet|chinamobile|chinatelecom|cernet|unicom|tietong|aliyun|alibaba|tencent|baidu|huawei)\b/i;
const CN_TZ = ["Asia/Shanghai", "Asia/Urumqi", "Asia/Chongqing", "Asia/Harbin", "Asia/Kashgar", "PRC"];
// Research and education networks, called out because they are the visits that
// actually answer "are Chinese departments looking at me".
const CN_EDU_RE = /\b(cernet|cstnet|edu\.cn|university|universities)\b/i;

function isCnLang(lang) {
  const first = String(lang || "").split(",")[0].trim().toLowerCase();
  return /^zh(?:[-_](?:cn|hans(?:[-_]cn)?))?$/.test(first);
}

// Null for a row with no Chinese signal at all; otherwise the strongest tier
// the row qualifies for, plus every reason behind it.
function chinaTier(r) {
  const ipCn = r.country === "CN";
  const netCn = CN_NET_RE.test(r.org || "");
  const langCn = isCnLang(r.lang);
  const tzCn = CN_TZ.indexOf(r.tz) !== -1;
  const why = [];
  if (ipCn) why.push("Chinese IP");
  if (netCn) why.push("Chinese network");
  if (langCn) why.push("zh-CN browser");
  if (tzCn) why.push("China clock");
  if (!why.length) return null;
  if (ipCn) return { rank: 0, why };
  if (netCn || (langCn && tzCn)) return { rank: 1, why };
  return { rank: 2, why };
}

const CN_TIERS = [
  ["In mainland China",
   "Cloudflare placed the IP in CN. Certain, and an undercount: mainland networks that cannot reach this worker never appear here at all."],
  ["China-linked, VPN or overseas",
   "A Chinese carrier or cloud network, or a zh-CN browser running on a China clock. Mainland readers on a VPN land here, and so do Chinese academics working abroad."],
  ["Possibly China",
   "One weak signal only. Includes Chinese speakers anywhere in the world, so treat it as an upper bound."],
];

function tally(rows, key) {
  const m = new Map();
  for (const r of rows) {
    const k = key(r);
    if (!k) continue;
    m.set(k, (m.get(k) || 0) + 1);
  }
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
}

function tallyTable(title, pairs, empty) {
  if (!pairs.length) return `<h3>${esc(title)}</h3><p class="none">${esc(empty)}</p>`;
  const rows = pairs.map(([k, n]) =>
    `<tr><td>${esc(k)}${CN_EDU_RE.test(k) ? ' <span class="edu">education</span>' : ""}</td><td>${n}</td></tr>`
  ).join("");
  return `<h3>${esc(title)}</h3><table>${rows}</table>`;
}

function chinaPage(results) {
  const hits = [];
  for (const r of results) {
    const t = chinaTier(r);
    if (t) hits.push(Object.assign({}, r, t));
  }
  const byTier = [0, 1, 2].map(rank => hits.filter(h => h.rank === rank));
  const solid = byTier[0].length + byTier[1].length;
  // Visits that only got through on the second endpoint are a direct reading of
  // how much the primary one is being blocked.
  const rescued = hits.filter(h => h.via === "fallback").length;

  const cards = CN_TIERS.map(([label, blurb], i) =>
    `<div class="card r${i}"><div class="n">${byTier[i].length}</div><div class="lab">${esc(label)}</div>
<p>${esc(blurb)}</p></div>`).join("");

  const provinces = tallyTable("Province, for mainland IPs",
    tally(byTier[0], r => r.region || r.city || null),
    "No mainland IPs recorded yet.");
  const networks = tallyTable("Network carrying the visit",
    tally(byTier[0].concat(byTier[1]), r => r.org || null),
    "Nothing recorded yet.");
  const edge = tallyTable("Cloudflare edge that served it",
    tally(byTier[0].concat(byTier[1]), r => r.colo || null),
    "Nothing recorded yet.");

  const rows = hits.slice(0, 300).map(h =>
    `<tr class="r${h.rank}"><td>${esc(String(h.ts).replace("T", " ").slice(0, 16))}</td>
<td>${esc(CN_TIERS[h.rank][0])}</td>
<td>${esc([h.city, h.region, h.country].filter(Boolean).join(", ") || "unknown")}</td>
<td>${esc(h.org || "")}${h.asn ? " (AS" + h.asn + ")" : ""}</td>
<td>${esc(h.tz || "")}</td>
<td>${esc(h.why.join(", "))}</td></tr>`).join("");

  return `<!doctype html><meta charset="utf-8"><title>China visibility</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
body{font:14px/1.6 sans-serif;margin:2rem auto;max-width:60rem;padding:0 1rem;color:#182430}
h2{margin-bottom:.25rem}.nav{color:#6b7a8a;margin-bottom:1.5rem}
.cards{display:flex;flex-wrap:wrap;gap:1rem;margin:1.5rem 0}
.card{flex:1 1 14rem;border:1px solid #d6dde3;border-left-width:4px;border-radius:6px;padding:.75rem 1rem}
.card .n{font-size:2rem;font-weight:700;line-height:1.1}
.card .lab{font-weight:600;margin-bottom:.35rem}
.card p{color:#6b7a8a;font-size:12px;margin:0}
.r0{border-left-color:#A2346B}.r1{border-left-color:#e08a3c}.r2{border-left-color:#b6c2cc}
table{border-collapse:collapse;width:100%;margin-bottom:1.5rem}
td,th{border:1px solid #e3e8ec;padding:4px 8px;text-align:left;font-size:13px}
th{background:#edf3f7}
tr.r0 td:nth-child(2){color:#A2346B;font-weight:600}
tr.r1 td:nth-child(2){color:#b4661f}
tr.r2 td:nth-child(2){color:#6b7a8a}
.edu{font-size:10px;background:#e8f5e9;color:#1b5e20;padding:1px 6px;border-radius:8px;text-transform:uppercase;letter-spacing:.03em}
.none{color:#6b7a8a}
.caveat{background:#fbf7ed;border:1px solid #ecdfc4;border-radius:6px;padding:.75rem 1rem;font-size:13px;color:#5b4a2a}
</style>
<h2>China visibility — ${solid} solid, ${hits.length} with any signal</h2>
<div class="nav"><a href="/admin">Visitor log</a> · <a href="/inbox">Inbox</a> · <a href="https://yutianpang.com">yutianpang.com</a></div>
<div class="cards">${cards}</div>
<p class="caveat"><b>Read this as a floor, not a count.</b> A visit is only recorded if the browser reached this worker.
Mainland networks that cannot reach it leave no trace at all, so the true number of Chinese readers is higher than the
first card and the gap is not measurable from here. The middle card is the one to watch: it is where mainland academics
on a VPN show up, and it does not depend on the mainland being able to reach Cloudflare directly.</p>
<p class="caveat">${rescued
    ? esc(rescued + " of these arrived only on the fallback endpoint, meaning the primary one was blocked or unreachable for that visitor.")
    : "No visit has needed the fallback endpoint yet. Until a second endpoint on a custom domain is configured in _includes/visitor-map.html, that is expected rather than reassuring: a visitor who cannot reach the primary endpoint has nothing else to try."}</p>
${provinces}${networks}${edge}
<h3>Visits with a Chinese signal</h3>
<table><tr><th>Time (UTC)</th><th>Tier</th><th>IP location</th><th>Network</th><th>Browser clock</th><th>Signals</th></tr>${rows || '<tr><td colspan="6" class="none">Nothing yet.</td></tr>'}</table>`;
}

// ---------------------------------------------------------------------------
// Contact form
// ---------------------------------------------------------------------------

async function verifyTurnstile(secret, token, ip) {
  if (!token) return false;
  try {
    const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, response: token, remoteip: ip }),
    });
    const d = await r.json();
    return !!d.success;
  } catch (_) {
    return false;
  }
}

async function sendMail(env, m, origin) {
  if (!env.RESEND_API_KEY || !env.CONTACT_TO) return false;
  const label = TOPICS[m.topic] || TOPICS.other;
  const where = [m.city, m.country].filter(Boolean).join(", ");
  const text =
`${m.message}

---
From: ${m.name} <${m.email}>
Topic: ${label}
Sent: ${m.ts.replace("T", " ").slice(0, 16)} UTC${where ? "\nLocation: " + where : ""}
Reply to this email to answer ${m.name} directly.
All messages: ${origin}/inbox`;
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env.MAIL_FROM || "yutianpang.com <onboarding@resend.dev>",
        to: [env.CONTACT_TO],
        reply_to: m.email,
        subject: `[Website] [${label}] ${m.name}`,
        text,
      }),
    });
    return r.ok;
  } catch (_) {
    return false;
  }
}

async function handleContact(request, env, url) {
  let body;
  try { body = await request.json(); } catch (_) {
    return json({ ok: false, error: "Bad request." }, {}, 400);
  }
  const str = (v, max) => String(v == null ? "" : v).trim().slice(0, max);
  const name = str(body.name, 100);
  const email = str(body.email, 200);
  const topic = TOPICS[body.topic] ? String(body.topic) : "other";
  const message = str(body.message, 5000);
  const honeypot = str(body.website, 100);

  // Bots fill the hidden field; pretend success so they move on.
  if (honeypot) return json({ ok: true });

  if (!name || !EMAIL_RE.test(email) || message.length < 10) {
    return json({ ok: false, error: "Please fill in your name, a valid email address, and a message." }, {}, 400);
  }

  const ip = request.headers.get("CF-Connecting-IP") || "";
  const cf = request.cf || {};

  // Rate limits: per IP per hour, plus a global daily cap to protect the
  // email quota.
  const hourAgo = new Date(Date.now() - 3600 * 1000).toISOString();
  const dayAgo = new Date(Date.now() - 86400 * 1000).toISOString();
  const perIp = await env.DB
    .prepare("SELECT COUNT(*) AS n FROM messages WHERE ip = ? AND ts > ?")
    .bind(ip, hourAgo).first();
  const perDay = await env.DB
    .prepare("SELECT COUNT(*) AS n FROM messages WHERE ts > ?")
    .bind(dayAgo).first();
  if ((perIp && perIp.n >= MAX_PER_IP_PER_HOUR) || (perDay && perDay.n >= MAX_PER_DAY)) {
    return json({ ok: false, error: "Too many messages right now. Please try again later." }, {}, 429);
  }

  if (env.TURNSTILE_SECRET) {
    const ok = await verifyTurnstile(env.TURNSTILE_SECRET, str(body.turnstile, 5000), ip);
    if (!ok) return json({ ok: false, error: "Verification failed. Please try again." }, {}, 400);
  }

  const ts = new Date().toISOString();
  const m = { ts, name, email, topic, message, ip, country: cf.country || null, city: cf.city || null };
  const ins = await env.DB
    .prepare("INSERT INTO messages (ts, name, email, topic, message, ip, country, city) VALUES (?,?,?,?,?,?,?,?)")
    .bind(m.ts, m.name, m.email, m.topic, m.message, m.ip, m.country, m.city).run();
  const id = ins.meta && ins.meta.last_row_id;

  const delivered = await sendMail(env, m, url.origin);
  if (delivered && id) {
    await env.DB.prepare("UPDATE messages SET delivered = 1 WHERE id = ?").bind(id).run();
  }
  return json({ ok: true });
}

function inboxPage(results, topicFilter) {
  const open = results.filter(r => !r.handled).length;
  const filters = [["", "All"], ...Object.entries(TOPICS)].map(([k, label]) =>
    k === topicFilter
      ? `<b>${esc(label)}</b>`
      : `<a href="/inbox${k ? "?topic=" + k : ""}">${esc(label)}</a>`
  ).join(" · ");
  const cards = results.map(r => {
    const label = TOPICS[r.topic] || TOPICS.other;
    const where = [r.city, r.country].filter(Boolean).join(", ");
    const when = String(r.ts).replace("T", " ").slice(0, 16);
    const reply = `mailto:${esc(r.email)}?subject=${encodeURIComponent("Re: your message on yutianpang.com")}`;
    return `<article class="msg${r.handled ? " done" : ""}">
<header>
  <span class="tag t-${esc(r.topic)}">${esc(label)}</span>
  <b>${esc(r.name)}</b> &lt;<a href="${reply}">${esc(r.email)}</a>&gt;
  <span class="meta">${esc(when)} UTC${where ? " · " + esc(where) : ""} · ${esc(r.ip)}${r.delivered ? "" : " · <em>email not delivered</em>"}</span>
  <form method="POST" action="/inbox/toggle"><input type="hidden" name="id" value="${Number(r.id)}"><button>${r.handled ? "Reopen" : "Mark handled"}</button></form>
</header>
<pre>${esc(r.message)}</pre>
</article>`;
  }).join("");
  return `<!doctype html><meta charset="utf-8"><title>Inbox (${open} open)</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
body{font:14px/1.5 sans-serif;margin:2rem auto;max-width:56rem;padding:0 1rem;color:#182430}
h2{margin-bottom:.25rem}.nav{color:#6b7a8a;margin-bottom:1.5rem}
.msg{border:1px solid #d6dde3;border-radius:6px;padding:.75rem 1rem;margin-bottom:1rem;background:#fff}
.msg.done{opacity:.55}
.msg header{display:flex;flex-wrap:wrap;gap:.5rem .75rem;align-items:center}
.msg header form{margin:0 0 0 auto}.msg header button{padding:2px 10px;font-size:12px}
.meta{color:#6b7a8a;font-size:12px;flex-basis:100%}
.tag{font-size:11px;padding:1px 8px;border-radius:10px;background:#edf3f7;color:#3b4b5c;text-transform:uppercase;letter-spacing:.03em}
.t-meeting{background:#e8f5e9;color:#1b5e20}.t-code{background:#e3f2fd;color:#0d47a1}
pre{white-space:pre-wrap;word-wrap:break-word;font:inherit;margin:.75rem 0 0;padding-top:.75rem;border-top:1px solid #eef1f4}
</style>
<h2>Inbox — ${results.length} message${results.length === 1 ? "" : "s"}, ${open} open</h2>
<div class="nav">${filters} · <a href="/admin">Visitor log</a> · <a href="https://yutianpang.com/#contact">Reach-out panel</a></div>
${cards || "<p>No messages yet.</p>"}`;
}

// ---------------------------------------------------------------------------

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS });
    }
    await ensureSchema(env.DB);

    if (url.pathname === "/hit") {
      const ua = request.headers.get("User-Agent") || "";
      if (BOT_RE.test(ua)) return json({ ok: true, skipped: "bot" });

      const ip = request.headers.get("CF-Connecting-IP") || "";
      const cf = request.cf || {};
      // Language rides along on the request; the clock is read by the page and
      // handed back on the query string. Both describe the browser rather than
      // the network, so a VPN does not hide either one. "via" says which of the
      // page's two endpoints got through, which is how blocking gets measured.
      const lang = (request.headers.get("Accept-Language") || "").slice(0, 100);
      const tz = (url.searchParams.get("tz") || "").slice(0, 60);
      const via = url.searchParams.get("via") === "fallback" ? "fallback" : "primary";

      // Skip repeat hits from the same IP within 30 minutes
      const last = await env.DB
        .prepare("SELECT ts FROM visits WHERE ip = ? ORDER BY id DESC LIMIT 1")
        .bind(ip).first();
      if (last && Date.now() - Date.parse(last.ts) < 30 * 60 * 1000) {
        return json({ ok: true, skipped: "recent" });
      }

      await env.DB
        .prepare("INSERT INTO visits (ts, ip, country, region, city, lat, lon, ua, asn, org, lang, tz, colo, via) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)")
        .bind(
          new Date().toISOString(),
          ip,
          cf.country || null,
          cf.region || cf.regionCode || null,
          cf.city || null,
          cf.latitude ? Number(cf.latitude) : null,
          cf.longitude ? Number(cf.longitude) : null,
          ua.slice(0, 200),
          cf.asn ? Number(cf.asn) : null,   // network owner, e.g. a university, a mobile
          cf.asOrganization || null,        // carrier, Apple Private Relay, or a cloud host
          lang || null,
          tz || null,
          cf.colo || null,                  // edge that served it; mainland traffic lands in LAX, SJC, HKG or NRT
          via
        ).run();
      return json({ ok: true });
    }

    if (url.pathname === "/visits") {
      const { results } = await env.DB
        .prepare("SELECT ts, country, region, city, lat, lon FROM visits ORDER BY ts DESC, id DESC LIMIT 2000")
        .all();
      return json({ visits: results }, { "Cache-Control": "public, max-age=120" });
    }

    if (url.pathname === "/contact" && request.method === "POST") {
      return handleContact(request, env, url);
    }

    if (url.pathname === "/inbox") {
      const keys = adminKeys(request, url);
      if (!isAdmin(env, keys)) return loginPage("Inbox", "/inbox");
      const topic = url.searchParams.get("topic") || "";
      const stmt = TOPICS[topic]
        ? env.DB.prepare("SELECT * FROM messages WHERE topic = ? ORDER BY id DESC LIMIT 1000").bind(topic)
        : env.DB.prepare("SELECT * FROM messages ORDER BY id DESC LIMIT 1000");
      const { results } = await stmt.all();
      return new Response(inboxPage(results, TOPICS[topic] ? topic : ""), { headers: adminHeaders(env, keys) });
    }

    if (url.pathname === "/inbox/toggle" && request.method === "POST") {
      const keys = adminKeys(request, url);
      if (!isAdmin(env, keys)) return loginPage("Inbox", "/inbox");
      const form = await request.formData();
      const id = Number(form.get("id"));
      if (id) {
        await env.DB.prepare("UPDATE messages SET handled = 1 - handled WHERE id = ?").bind(id).run();
      }
      return Response.redirect(url.origin + "/inbox", 303);
    }

    if (url.pathname === "/china") {
      const keys = adminKeys(request, url);
      if (!isAdmin(env, keys)) return loginPage("China visibility", "/china");
      const { results } = await env.DB
        .prepare("SELECT ts, country, region, city, org, asn, lang, tz, colo, via FROM visits ORDER BY ts DESC, id DESC LIMIT 5000")
        .all();
      return new Response(chinaPage(results), { headers: adminHeaders(env, keys) });
    }

    if (url.pathname === "/admin") {
      const keys = adminKeys(request, url);
      if (!isAdmin(env, keys)) return loginPage("Visitor log", "/admin");
      const { results } = await env.DB
        .prepare("SELECT ts, ip, country, region, city, org, asn, ua FROM visits ORDER BY ts DESC, id DESC LIMIT 5000")
        .all();
      const rows = results.map(r =>
        `<tr><td>${esc(r.ts)}</td><td>${esc(r.ip)}</td><td>${esc(r.country)}</td>` +
        `<td>${esc(r.region)}</td><td>${esc(r.city)}</td>` +
        `<td>${esc(r.org)}${r.asn ? " (AS" + r.asn + ")" : ""}</td><td>${esc(r.ua)}</td></tr>`
      ).join("");
      const html = `<!doctype html><meta charset="utf-8"><title>Visitor log</title>
<style>body{font:13px/1.5 monospace;margin:2rem;color:#182430}
table{border-collapse:collapse;width:100%}td,th{border:1px solid #ccc;padding:4px 8px;text-align:left}
th{background:#edf3f7}</style>
<h2>Visitor log — ${results.length} entries · <a href="https://yutianpang.com">yutianpang.com</a> · <a href="/china">China</a> · <a href="/inbox">Inbox</a></h2>
<table><tr><th>Time (UTC)</th><th>IP</th><th>Country</th><th>Region</th><th>City</th><th>Network</th><th>User agent</th></tr>${rows}</table>`;
      return new Response(html, { headers: adminHeaders(env, keys) });
    }

    return json({ service: "visitor logger", endpoints: ["/hit", "/visits", "/admin?key=…", "/china", "POST /contact", "/inbox"] });
  },
};
