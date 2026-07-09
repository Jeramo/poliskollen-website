# Poliskollen.nu — web

A local, dark-only web page for **poliskollen.nu** showing the same police-event
data as the Poliskollen iOS/Android apps: a live crime map, a live feed, and the
app's feature highlights. Police-blue palette, GSAP animations, Lenis smooth
scroll, MapLibre GL JS with free CARTO dark tiles (no API key).

## Run locally

```bash
npm install        # first time (approve esbuild's post-install if prompted)
npm run dev         # http://localhost:5173
```

Production build / local preview:

```bash
npm run build
npm run preview     # serves dist/ on http://localhost:4173
```

## How it works

- **Data**: fetched live from the same Cloudflare worker the apps use
  (`poliskollen-api…workers.dev`, open CORS). `/events` for police events,
  `/reports` for community reports (sampled around the big cities). No key, no
  backend of our own.
- **Map**: MapLibre GL JS + CARTO `dark-matter` vector tiles (free). Event pins
  are color-coded by type using the exact palette from the app
  (`src/eventTypes.js`, a 1:1 port of `EventTypeMapping.color()`).
- **Animations**: GSAP + ScrollTrigger (reveals, count-up stats) and Lenis
  (smooth scroll). Respects `prefers-reduced-motion`.
- **Dark only**, mobile-first responsive.

## Files

- `index.html` — page shell + sections (hero, map, feed, features).
- `src/style.css` — the whole dark police-blue design system.
- `src/eventTypes.js` — type → colour/group, Swedish relative time, coord parse.
- `src/api.js` — worker fetch helpers.
- `src/main.js` — map, filters, feed, features, stats, animation wiring.
- `shot.mjs` — dev-only puppeteer screenshot script (not shipped).

Not officially affiliated with Polismyndigheten. Data from Polisen's open API.
