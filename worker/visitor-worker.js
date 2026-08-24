/**
 * Visitor logger for yutianpang.com — Cloudflare Worker
 *
 * Endpoints:
 *   GET /hit     — called by the homepage on each page load; records the visit
 *                  (time, geolocation from Cloudflare, IP, network owner) into
 *                  D1. Skips bots and repeat hits from the same IP within 30
 *                  minutes. The network owner (Cloudflare's asOrganization)
 *                  explains most "unknown location" rows: VPNs, Apple Private
 *                  Relay, mobile carriers, and cloud hosts.
 *   GET /visits  — public JSON of recent visits (time, country, region, city,
 *                  lat/lon). NO IP addresses — this feeds the public map.
 *   GET /admin?key=YOUR_ADMIN_KEY
 *                — owner-only HTML table of the full log, including IPs.
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
 *      — paste it into VISITOR_API in _includes/visitor-map.html.
 *
 * The visits table is created automatically on first use.
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

// Columns added after the first deployment; the ALTER fails harmlessly when
// the column already exists.
const MIGRATIONS = [
  "ALTER TABLE visits ADD COLUMN asn INTEGER",
  "ALTER TABLE visits ADD COLUMN org TEXT",
];

async function ensureSchema(db) {
  await db.prepare(SCHEMA).run();
  for (const sql of MIGRATIONS) {
    try { await db.prepare(sql).run(); } catch (_) { /* already migrated */ }
  }
}

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET",
};

const BOT_RE = /bot|crawl|spider|slurp|preview|curl|wget|python|httpx|monitor|pingdom|lighthouse|headless/i;

function json(data, extra = {}) {
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json", ...CORS, ...extra },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
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
        .prepare("SELECT ts, country, region, city, lat, lon FROM visits ORDER BY id DESC LIMIT 2000")
        .all();
      return json({ visits: results }, { "Cache-Control": "public, max-age=120" });
    }

    if (url.pathname === "/admin") {
      if (!env.ADMIN_KEY || url.searchParams.get("key") !== env.ADMIN_KEY) {
        return new Response("Forbidden", { status: 403 });
      }
      const { results } = await env.DB
        .prepare("SELECT ts, ip, country, region, city, org, asn, ua FROM visits ORDER BY id DESC LIMIT 5000")
        .all();
      const esc = v => String(v == null ? "" : v).replace(/&/g, "&amp;").replace(/</g, "&lt;");
      const rows = results.map(r =>
        `<tr><td>${esc(r.ts)}</td><td>${esc(r.ip)}</td><td>${esc(r.country)}</td>` +
        `<td>${esc(r.region)}</td><td>${esc(r.city)}</td>` +
        `<td>${esc(r.org)}${r.asn ? " (AS" + r.asn + ")" : ""}</td><td>${esc(r.ua)}</td></tr>`
      ).join("");
      const html = `<!doctype html><meta charset="utf-8"><title>Visitor log</title>
<style>body{font:13px/1.5 monospace;margin:2rem;color:#182430}
table{border-collapse:collapse;width:100%}td,th{border:1px solid #ccc;padding:4px 8px;text-align:left}
th{background:#edf3f7}</style>
<h2>Visitor log — ${results.length} entries</h2>
<table><tr><th>Time (UTC)</th><th>IP</th><th>Country</th><th>Region</th><th>City</th><th>Network</th><th>User agent</th></tr>${rows}</table>`;
      return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
    }

    return json({ service: "visitor logger", endpoints: ["/hit", "/visits", "/admin?key=…"] });
  },
};
