// Event type → color, ported 1:1 from the app's EventTypeMapping.color().
export function typeColor(type) {
  const t = (type || '').toLowerCase()
  if (t.includes('trafik')) return '#ff9500'
  if (t.includes('mord') || t.includes('dråp') || t.includes('skottlossning') || t.includes('rån') || t.includes('brand')) return '#ff3b30'
  if (t.includes('misshandel') || t.includes('olaga hot')) return '#af52de'
  if (t.includes('inbrott') || t.includes('stöld')) return '#ffcc00'
  if (t.includes('narkotika')) return '#34c759'
  if (t.includes('rattfylleri')) return '#ff2d55'
  if (t.includes('försvunnen') || t.includes('räddning')) return '#007aff'
  return '#8e8e93'
}

// Coarse group so the map filter stays short (mirrors the color buckets).
export const GROUPS = [
  { key: 'trafik', label: 'Trafik', color: '#ff9500', match: (t) => t.includes('trafik') },
  { key: 'vald', label: 'Grovt våld', color: '#ff3b30', match: (t) => t.includes('mord') || t.includes('dråp') || t.includes('skottlossning') || t.includes('rån') || t.includes('brand') },
  { key: 'misshandel', label: 'Misshandel/hot', color: '#af52de', match: (t) => t.includes('misshandel') || t.includes('olaga hot') },
  { key: 'stold', label: 'Stöld/inbrott', color: '#ffcc00', match: (t) => t.includes('inbrott') || t.includes('stöld') },
  { key: 'narkotika', label: 'Narkotika', color: '#34c759', match: (t) => t.includes('narkotika') },
  { key: 'rattfylleri', label: 'Rattfylleri', color: '#ff2d55', match: (t) => t.includes('rattfylleri') },
  { key: 'savnad', label: 'Försvunnen', color: '#007aff', match: (t) => t.includes('försvunnen') || t.includes('räddning') },
  { key: 'ovrigt', label: 'Övrigt', color: '#8e8e93', match: () => true },
]

export function groupOf(type) {
  const t = (type || '').toLowerCase()
  return (GROUPS.find((g) => g.match(t)) || GROUPS[GROUPS.length - 1]).key
}

// The worker sends "2026-07-09 22:00:34 +02:00" — normalise to ISO before Date().
export function parseDate(dt) {
  if (!dt) return null
  const iso = String(dt)
    .replace(/^(\d{4}-\d{2}-\d{2}) (\d):/, '$1T0$2:')
    .replace(/^(\d{4}-\d{2}-\d{2}) /, '$1T')
    .replace(/\s(?=[+-]\d{2}:\d{2}$)/, '')
  const d = new Date(iso)
  return isNaN(d) ? null : d
}

export function timeAgo(dt) {
  const d = parseDate(dt)
  if (!d) return ''
  const s = Math.max(0, (Date.now() - d.getTime()) / 1000)
  if (s < 60) return 'nyss'
  const m = Math.floor(s / 60)
  if (m < 60) return `${m} min sedan`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} tim sedan`
  const days = Math.floor(h / 24)
  if (days === 1) return 'igår'
  if (days < 7) return `${days} dagar sedan`
  return d.toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' })
}

export function coord(gps) {
  if (!gps) return null
  const p = String(gps).split(',')
  if (p.length !== 2) return null
  const lat = parseFloat(p[0]), lng = parseFloat(p[1])
  if (isNaN(lat) || isNaN(lng)) return null
  return [lng, lat] // GeoJSON order
}

// Rough per-län bounding boxes [latMin, latMax, lngMin, lngMax] (margin baked in).
// Used to drop events whose source coordinate clearly doesn't match their region
// (Polisen occasionally returns a wrong point — e.g. a Pajala event at a
// Stockholm coordinate).
const REGION_BBOX = {
  norrbotten: [64.8, 69.2, 15.3, 24.3],
  västerbotten: [63.0, 66.3, 14.3, 21.6],
  jämtland: [61.3, 65.2, 11.9, 16.7],
  västernorrland: [62.0, 64.5, 14.8, 19.2],
  gävleborg: [60.0, 62.6, 14.3, 17.7],
  dalarna: [59.7, 62.5, 11.8, 16.8],
  värmland: [58.3, 60.8, 11.3, 14.7],
  örebro: [58.5, 60.1, 13.8, 16.1],
  västmanland: [59.1, 60.4, 14.8, 17.1],
  uppsala: [59.4, 60.9, 16.3, 18.8],
  stockholm: [58.7, 60.4, 16.8, 19.4],
  södermanland: [58.5, 59.9, 15.5, 18.1],
  östergötland: [57.5, 59.2, 14.4, 17.4],
  'västra götaland': [56.9, 59.4, 10.7, 14.9],
  jönköping: [56.7, 58.4, 12.8, 16.1],
  kalmar: [56.0, 58.3, 15.2, 17.5],
  kronoberg: [56.1, 57.5, 13.0, 16.1],
  halland: [56.1, 57.8, 11.8, 13.8],
  blekinge: [55.7, 56.7, 14.1, 16.2],
  skåne: [55.1, 56.7, 12.2, 14.8],
  gotland: [56.7, 58.2, 17.9, 19.6],
}

export function regionPlausible(lat, lng, region) {
  if (!region) return true
  const r = String(region).toLowerCase()
  for (const key in REGION_BBOX) {
    if (r.includes(key)) {
      const [laMin, laMax, loMin, loMax] = REGION_BBOX[key]
      return lat >= laMin && lat <= laMax && lng >= loMin && lng <= loMax
    }
  }
  return true // unknown region → keep
}
