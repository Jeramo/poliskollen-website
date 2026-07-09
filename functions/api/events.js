// Cloudflare Pages Function: /api/events
// Edge-caches the shared worker's /events (which reads D1) so that no matter how
// many visitors or how much refresh-spam, the worker + D1 are hit at most once
// per ~60s per Cloudflare PoP. This is the main shield for D1 against traffic.

const WORKER = 'https://poliskollen-api.jeanrobert-nino-layton.workers.dev'
const S_MAXAGE = 60 // edge cache seconds
const BROWSER_MAXAGE = 30

export async function onRequestGet(context) {
  const cache = caches.default
  const cacheKey = new Request(new URL('/api/events', context.request.url).toString(), { method: 'GET' })

  const hit = await cache.match(cacheKey)
  if (hit) return hit

  const upstream = await fetch(`${WORKER}/events?days=7&limit=500`, {
    cf: { cacheTtl: S_MAXAGE, cacheEverything: true },
  })
  const res = new Response(upstream.body, upstream)
  res.headers.set('Cache-Control', `public, max-age=${BROWSER_MAXAGE}, s-maxage=${S_MAXAGE}`)
  res.headers.set('Access-Control-Allow-Origin', '*')
  res.headers.delete('set-cookie')
  context.waitUntil(cache.put(cacheKey, res.clone()))
  return res
}
