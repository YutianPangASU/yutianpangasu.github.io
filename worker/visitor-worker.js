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
 *   GET  /admin?key=YOUR_ADMIN_KEY
 *                 — owner-only HTML table of the full log, including IPs.
 *                   A correct key sets a year-long cookie, after which plain
 *                   /admin opens directly in that browser; without key or
 *                   cookie the page shows a key prompt.
 *   POST /contact — receives messages from the site's Contact page (/contact/)
 *                   as JSON {name, email, topic, message}. Each message is
 *                   stored in D1 and emailed to CONTACT_TO through Resend with
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
  code: "Code request",
  collaboration: "Collaboration",
  other: "General",
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
.t-code{background:#e3f2fd;color:#0d47a1}.t-collaboration{background:#e8f5e9;color:#1b5e20}
pre{white-space:pre-wrap;word-wrap:break-word;font:inherit;margin:.75rem 0 0;padding-top:.75rem;border-top:1px solid #eef1f4}
</style>
<h2>Inbox — ${results.length} message${results.length === 1 ? "" : "s"}, ${open} open</h2>
<div class="nav">${filters} · <a href="/admin">Visitor log</a> · <a href="https://yutianpang.com/contact/">Contact page</a></div>
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

      // Skip repeat hits from the same IP within 30 minutes
      const last = await env.DB
        .prepare("SELECT ts FROM visits WHERE ip = ? ORDER BY id DESC LIMIT 1")
        .bind(ip).first();
      if (last && Date.now() - Date.parse(last.ts) < 30 * 60 * 1000) {
        return json({ ok: true, skipped: "recent" });
      }

      await env.DB
        .prepare("INSERT INTO visits (ts, ip, country, region, city, lat, lon, ua, asn, org) VALUES (?,?,?,?,?,?,?,?,?,?)")
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
          cf.asOrganization || null         // carrier, Apple Private Relay, or a cloud host
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
<h2>Visitor log — ${results.length} entries · <a href="https://yutianpang.com">yutianpang.com</a> · <a href="/inbox">Inbox</a></h2>
<table><tr><th>Time (UTC)</th><th>IP</th><th>Country</th><th>Region</th><th>City</th><th>Network</th><th>User agent</th></tr>${rows}</table>`;
      return new Response(html, { headers: adminHeaders(env, keys) });
    }

    return json({ service: "visitor logger", endpoints: ["/hit", "/visits", "/admin?key=…", "POST /contact", "/inbox"] });
  },
};
