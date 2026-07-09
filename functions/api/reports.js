// Cloudflare Pages Function: /api/reports
// Does the 3-city community-reports fetch + merge server-side and edge-caches
// the result, so the browser makes ONE request and the worker is hit at most
// ~once per 60s per PoP (instead of 3 requests per visitor).

const WORKER = 'https://poliskollen-api.jeanrobert-nino-layton.workers.dev'
const S_MAXAGE = 60
const BROWSER_MAXAGE = 30
const CITIES = [
  { lat: 59.3293, lng: 18.0686 }, // Stockholm
  { lat: 57.7089, lng: 11.9746 }, // Göteborg
  { lat: 55.605, lng: 13.0038 }, // Malmö
]

export async function onRequestGet(context) {
  const cache = caches.default
  const cacheKey = new Request(new URL('/api/reports', context.request.url).toString(), { method: 'GET' })

  const hit = await cache.match(cacheKey)
  if (hit) return hit

  const seen = new Map()
  await Promise.all(
    CITIES.map(async (c) => {
      try {
        const r = await fetch(`${WORKER}/reports?lat=${c.lat}&lng=${c.lng}&radius=50000`, {
          cf: { cacheTtl: S_MAXAGE, cacheEverything: true },
        })
        if (!r.ok) return
        const d = await r.json()
        for (const x of d.reports || []) seen.set(x.id, x)
      } catch { /* best effort */ }
    }),
  )

  const res = new Response(JSON.stringify({ reports: [...seen.values()] }), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': `public, max-age=${BROWSER_MAXAGE}, s-maxage=${S_MAXAGE}`,
      'Access-Control-Allow-Origin': '*',
    },
  })
  context.waitUntil(cache.put(cacheKey, res.clone()))
  return res
}
