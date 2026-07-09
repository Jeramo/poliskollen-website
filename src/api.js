// Data comes from the shared Cloudflare Worker, which serves police events from
// its D1 database (and community reports from ZONES_DB).
//
// Two layers keep D1 from being hammered:
//  1. localStorage cache with a TTL — a user mashing reload does NOT refetch;
//     they read the last response until it goes stale.
//  2. In production the page talks to same-origin Cloudflare Pages Functions
//     (/api/*, see functions/api/*), which edge-cache the worker response, so
//     the worker + D1 are hit ~once/minute per PoP no matter how many visitors.
// In local dev we hit the worker directly (no Pages Functions running).

const WORKER = 'https://poliskollen-api.jeanrobert-nino-layton.workers.dev'
const PROD = import.meta.env.PROD

// Serve from localStorage while fresh; otherwise load, store, return.
async function cached(key, ttlMs, loader) {
  try {
    const raw = localStorage.getItem(key)
    if (raw) {
      const { t, data } = JSON.parse(raw)
      if (Date.now() - t < ttlMs) return data
    }
  } catch { /* ignore quota / parse issues */ }
  const data = await loader()
  try { localStorage.setItem(key, JSON.stringify({ t: Date.now(), data })) } catch { /* ignore */ }
  return data
}

export async function fetchEvents({ days = 7, limit = 500 } = {}) {
  return cached('pk_events', 5 * 60_000, async () => {
    const url = PROD ? '/api/events' : `${WORKER}/events?days=${days}&limit=${limit}`
    const res = await fetch(url)
    if (!res.ok) throw new Error(`events ${res.status}`)
    const data = await res.json()
    const list = Array.isArray(data) ? data : data.events || []
    // Drop the daily "Sammanfattning" roll-ups, like the apps do.
    return list.filter((e) => !String(e.type || '').toLowerCase().includes('sammanfattning'))
  })
}

// Community reports are geo-gated (bbox around a point). We sample the big
// cities and merge — ephemeral, so usually empty, which is fine.
const CITIES = [
  { lat: 59.3293, lng: 18.0686 }, // Stockholm
  { lat: 57.7089, lng: 11.9746 }, // Göteborg
  { lat: 55.605, lng: 13.0038 }, // Malmö
]

export async function fetchReports() {
  return cached('pk_reports', 2 * 60_000, async () => {
    if (PROD) {
      // One same-origin request; the Pages Function does the 3-city merge + edge cache.
      try {
        const res = await fetch('/api/reports')
        if (res.ok) return (await res.json()).reports || []
      } catch { /* best effort */ }
      return []
    }
    const seen = new Map()
    await Promise.all(
      CITIES.map(async (c) => {
        try {
          const res = await fetch(`${WORKER}/reports?lat=${c.lat}&lng=${c.lng}&radius=50000`)
          if (!res.ok) return
          const data = await res.json()
          for (const r of data.reports || []) seen.set(r.id, r)
        } catch { /* best effort */ }
      }),
    )
    return [...seen.values()]
  })
}
