# poliskollen.nu — data source & abuse protection

## Where the data comes from

The page shows **live police events from the shared Cloudflare Worker**
(`poliskollen-api…workers.dev`), which serves them from its **D1 database**
(`GET /events` → `SELECT … FROM events`). The worker ingests polisen.se into D1
on a cron; the page only reads. Community reports come from the same worker
(`/reports`, ZONES_DB). So: **browser → worker → D1**.

The worker is shared with the iOS/Android apps, so the web must **not** be able
to hammer it. That's what the layers below are for.

## The problem

Without protection, every page load = 1 `/events` + (3→1) `/reports` requests,
each a D1 read. A single user mashing F5, a scraper, or an L7 flood would turn
into linear D1 reads → cost + possible D1 throttling → degraded apps.

## The layers (defense in depth)

1. **Browser cache (localStorage TTL)** — `src/api.js`.
   Events cached 5 min, reports 2 min. Reloading the page reads the last
   response instead of refetching. One user **cannot** refresh-spam the origin.
   No polling / no auto-refresh anywhere.

2. **Edge cache via Pages Functions** — `functions/api/events.js`, `functions/api/reports.js`.
   In production the page calls same-origin `/api/events` and `/api/reports`.
   Those Functions fetch the worker **once**, then serve the response from the
   Cloudflare edge cache (`s-maxage=60`, `caches.default`). So **however many
   visitors hit the site, the worker + D1 are hit at most ~once per 60s per
   Cloudflare PoP** — request volume is decoupled from D1 load. `/api/reports`
   also does the 3-city merge server-side, so the browser makes 1 request, not 3.

3. **Cloudflare platform protections** (enable in the dashboard — free tier):
   - **Automatic DDoS protection** (L3/4/7) — on by default for any Cloudflare
     domain/Pages. Nothing to do.
   - **Bot Fight Mode** (Security → Bots) — blocks known bad bots for free.
   - **Rate Limiting rule** (Security → WAF → Rate limiting rules), e.g.
     *"If URI path starts with `/api/` and requests from the same IP > 60 in 1
     minute → Block for 10 min."* Legit users never hit this (client + edge
     cache mean a real user makes only a couple of `/api` calls per visit).
   - Optionally **Browser Integrity Check** / a Managed Challenge on `/api/*`.

## Deploying so the protection is active

Deploy as **Cloudflare Pages** (`npm run build` → `dist/`, plus the `functions/`
dir is picked up automatically). The site then serves `/api/*` from the edge
cache. In local dev (`npm run dev`) there are no Functions, so it hits the
worker directly — fine for one developer.

## What is NOT changed

The shared worker and D1 are untouched — all caching lives in the web project
(browser + Pages Functions), so the apps are unaffected. If you later want the
worker itself to be edge-cacheable for the apps too, add
`Cache-Control: public, s-maxage=60` to its `/events` response (safe, additive)
— but the Pages proxy already fully protects D1 from web traffic without it.
