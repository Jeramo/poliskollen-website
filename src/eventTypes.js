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
  const iso = String(dt).replace(' ', 'T').replace(/\s(?=[+-]\d{2}:\d{2}$)/, '')
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
