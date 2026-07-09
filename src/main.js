import './style.css'
import maplibregl from 'maplibre-gl'
import { gsap } from 'gsap'
import { fetchEvents, fetchReports } from './api.js'
import { typeColor, groupOf, GROUPS, timeAgo, coord } from './eventTypes.js'
import { iconName, ICON_PATHS } from './eventIcons.js'

// ---------- State ----------
let EVENTS = []
let REPORTS = []
const active = new Set() // active group filters; empty = all
let map

const EVT_GLOW = 'evt-glow', EVT_DOT = 'evt-pin', REP_LAYER = 'rep-dot'
const CLUSTER = 'evt-cluster', CLUSTER_COUNT = 'evt-cluster-count'
const NOT_CLUSTERED = ['!', ['has', 'point_count']]
const IS_CLUSTER = ['has', 'point_count']

// ---------- iOS-style pins: colored circle + white glyph ----------
const PIN_DPR = 2, PIN_PX = 46 * PIN_DPR
function pinKey(type) { return `${typeColor(type)}__${iconName(type)}` }

function makePinImage(colorHex, icon) {
  const c = document.createElement('canvas')
  c.width = c.height = PIN_PX
  const ctx = c.getContext('2d')
  const cx = PIN_PX / 2, cy = PIN_PX / 2, r = PIN_PX / 2 - 3 * PIN_DPR
  // drop shadow for depth on the dark map
  ctx.save()
  ctx.shadowColor = 'rgba(0,0,0,0.55)'; ctx.shadowBlur = 5 * PIN_DPR; ctx.shadowOffsetY = 1.5 * PIN_DPR
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fillStyle = colorHex; ctx.fill()
  ctx.restore()
  // white ring (matches the app pins)
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.lineWidth = 2.4 * PIN_DPR; ctx.strokeStyle = 'rgba(255,255,255,0.96)'; ctx.stroke()
  // white glyph, ~52% of the pin
  const g = PIN_PX * 0.52
  ctx.save()
  ctx.translate(cx - g / 2, cy - g / 2); ctx.scale(g / 24, g / 24)
  ctx.fillStyle = '#fff'; ctx.fill(new Path2D(ICON_PATHS[icon] || ICON_PATHS.shield))
  ctx.restore()
  return ctx.getImageData(0, 0, PIN_PX, PIN_PX)
}

function ensurePinImages(features) {
  const keys = new Set(features.map((f) => f.properties.iconKey))
  for (const k of keys) {
    if (map.hasImage(k)) continue
    const [color, icon] = k.split('__')
    map.addImage(k, makePinImage(color, icon), { pixelRatio: PIN_DPR })
  }
}

// ---------- GeoJSON ----------
function eventsGeoJSON(list) {
  return {
    type: 'FeatureCollection',
    features: list.map((e) => {
      const c = coord(e.location?.gps)
      if (!c) return null
      return {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: c },
        properties: {
          id: e.id, color: typeColor(e.type), group: groupOf(e.type), iconKey: pinKey(e.type),
          type: e.type, name: e.name, region: e.location?.region || '',
          place: e.location?.name || '', time: timeAgo(e.datetime),
          summary: e.summary || '',
        },
      }
    }).filter(Boolean),
  }
}
function reportsGeoJSON(list) {
  return {
    type: 'FeatureCollection',
    features: list.map((r) => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [r.longitude, r.latitude] },
      properties: { category: r.category, confirm: r.confirm_count || 0 },
    })),
  }
}

// ---------- Map ----------
function initMap() {
  map = new maplibregl.Map({
    container: 'map',
    style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
    center: [16.2, 63.5],
    zoom: 3.5,
    attributionControl: { compact: true },
    dragRotate: false,
  })
  map.touchZoomRotate.disableRotation()
  map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right')

  map.on('load', () => {
    // Cluster nearby events into a count bubble (like iOS/the app). Clusters
    // break apart past zoom 11; radius 50px groups overlapping pins.
    map.addSource('events', {
      type: 'geojson', data: eventsGeoJSON(EVENTS),
      cluster: true, clusterMaxZoom: 11, clusterRadius: 48,
    })
    map.addSource('reports', { type: 'geojson', data: reportsGeoJSON(REPORTS) })

    map.addLayer({
      id: EVT_GLOW, type: 'circle', source: 'events', filter: NOT_CLUSTERED,
      paint: {
        'circle-color': ['get', 'color'],
        'circle-radius': ['interpolate', ['linear'], ['zoom'], 3, 9, 8, 18, 12, 30],
        'circle-blur': 1, 'circle-opacity': 0.28,
      },
    })
    // iOS-style pin: colored circle + white SF-Symbol-like glyph.
    map.addLayer({
      id: EVT_DOT, type: 'symbol', source: 'events', filter: NOT_CLUSTERED,
      layout: {
        'icon-image': ['get', 'iconKey'],
        'icon-allow-overlap': true,
        'icon-ignore-placement': true,
        'icon-size': ['interpolate', ['linear'], ['zoom'], 3, 0.42, 7, 0.62, 11, 0.9, 14, 1.05],
      },
    })
    // Cluster bubble: police-blue circle + white ring + count (mirrors the app).
    map.addLayer({
      id: CLUSTER, type: 'circle', source: 'events', filter: IS_CLUSTER,
      paint: {
        'circle-color': '#5b9eff',
        'circle-radius': ['step', ['get', 'point_count'], 16, 10, 20, 50, 26, 200, 32],
        'circle-stroke-color': '#ffffff', 'circle-stroke-width': 2.5,
        'circle-stroke-opacity': 0.95,
      },
    })
    map.addLayer({
      id: CLUSTER_COUNT, type: 'symbol', source: 'events', filter: IS_CLUSTER,
      layout: {
        'text-field': ['get', 'point_count_abbreviated'],
        'text-font': ['Open Sans Bold'],
        'text-size': ['step', ['get', 'point_count'], 13, 50, 15, 200, 17],
        'text-allow-overlap': true, 'text-ignore-placement': true,
      },
      paint: { 'text-color': '#ffffff' },
    })
    map.addLayer({
      id: REP_LAYER, type: 'circle', source: 'reports',
      paint: {
        'circle-color': 'rgba(91,158,255,0.15)', 'circle-radius': 8,
        'circle-stroke-color': '#5b9eff', 'circle-stroke-width': 2,
      },
    })

    const pop = new maplibregl.Popup({ closeButton: true, maxWidth: '300px', offset: 12 })
    map.on('click', EVT_DOT, (e) => {
      const p = e.features[0].properties
      pop.setLngLat(e.features[0].geometry.coordinates).setHTML(`
        <div class="pop">
          <span class="pop-type" style="color:${p.color}"><span class="dot" style="background:${p.color}"></span>${esc(p.type)}</span>
          <h4>${esc(p.name)}</h4>
          ${p.summary ? `<p>${esc(p.summary)}</p>` : ''}
          <div class="meta">${esc([p.place, p.region].filter(Boolean).join(', '))} · ${esc(p.time)}</div>
        </div>`).addTo(map)
    })
    map.on('click', REP_LAYER, (e) => {
      const p = e.features[0].properties
      pop.setLngLat(e.features[0].geometry.coordinates).setHTML(`
        <div class="pop">
          <span class="pop-type" style="color:#5b9eff"><span class="dot" style="background:#5b9eff"></span>Community-rapport</span>
          <h4>${esc(p.category)}</h4>
          <div class="meta">${p.confirm} bekräftelser · anonym</div>
        </div>`).addTo(map)
    })
    // Tap a cluster → zoom in until it breaks apart (iOS behaviour).
    map.on('click', CLUSTER, async (e) => {
      const f = map.queryRenderedFeatures(e.point, { layers: [CLUSTER] })[0]
      if (!f) return
      try {
        const zoom = await map.getSource('events').getClusterExpansionZoom(f.properties.cluster_id)
        map.easeTo({ center: f.geometry.coordinates, zoom: zoom + 0.35, duration: 800 })
      } catch { /* ignore */ }
    })
    for (const l of [EVT_DOT, REP_LAYER, CLUSTER]) {
      map.on('mouseenter', l, () => (map.getCanvas().style.cursor = 'pointer'))
      map.on('mouseleave', l, () => (map.getCanvas().style.cursor = ''))
    }

    if (EVENTS.length) pushData()
    flyToUserOrDefault()
  })
}

// Ask for the user's position and fly there; otherwise default to Stockholm län.
function flyToUserOrDefault() {
  const easeCubic = (t) => 1 - Math.pow(1 - t, 3)
  const STOCKHOLM = { center: [18.0686, 59.3293], zoom: 8.5 } // Stockholm län
  const fallback = () => map.easeTo({ ...STOCKHOLM, duration: 2200, easing: easeCubic })
  if (!('geolocation' in navigator)) return fallback()
  navigator.geolocation.getCurrentPosition(
    (pos) => map.easeTo({
      center: [pos.coords.longitude, pos.coords.latitude], zoom: 10.5,
      duration: 2600, easing: easeCubic,
    }),
    fallback, // denied / error → Stockholm län
    { enableHighAccuracy: false, timeout: 6000, maximumAge: 60000 },
  )
}

function pushData() {
  const geo = eventsGeoJSON(EVENTS)
  ensurePinImages(geo.features) // add pin images before the layer references them
  map.getSource('events')?.setData(geo)
  map.getSource('reports')?.setData(reportsGeoJSON(REPORTS))
  document.getElementById('map-loading').classList.add('hidden')
}

function applyFilter() {
  const src = map && map.getSource('events')
  if (!src) return
  // Rebuild the source from the filtered set so the CLUSTERS recount too
  // (clusters aggregate the whole source; a layer filter can't shrink them).
  const list = active.size === 0 ? EVENTS : EVENTS.filter((e) => active.has(groupOf(e.type)))
  const geo = eventsGeoJSON(list)
  ensurePinImages(geo.features)
  src.setData(geo)
}

// ---------- Overlays ----------
function renderLiveCount() {
  const el = document.getElementById('live-count')
  const n = EVENTS.filter((e) => coord(e.location?.gps)).length
  const obj = { v: 0 }
  gsap.to(obj, { v: n, duration: 1.4, ease: 'power2.out', onUpdate: () => (el.textContent = Math.round(obj.v).toLocaleString('sv-SE')) })
}

function renderFilters() {
  const counts = {}
  for (const e of EVENTS) if (coord(e.location?.gps)) counts[groupOf(e.type)] = (counts[groupOf(e.type)] || 0) + 1
  const el = document.getElementById('filters')
  el.innerHTML = ''
  GROUPS.filter((g) => counts[g.key]).forEach((g) => {
    const chip = document.createElement('button')
    chip.className = 'chip'
    chip.style.setProperty('--chip-color', g.color)
    chip.innerHTML = `<span class="dot"></span>${g.label} <span class="count">${counts[g.key]}</span>`
    chip.onclick = () => {
      active.has(g.key) ? active.delete(g.key) : active.add(g.key)
      chip.classList.toggle('active', active.has(g.key))
      applyFilter()
    }
    el.appendChild(chip)
  })
  gsap.from('.filterbar', { opacity: 0, y: -8, duration: 0.5, ease: 'power2.out' })
}

function renderLegend() {
  document.getElementById('legend').innerHTML = GROUPS
    .filter((g) => EVENTS.some((e) => groupOf(e.type) === g.key && coord(e.location?.gps)))
    .map((g) => `<div class="row"><span class="dot" style="background:${g.color}"></span>${g.label}</div>`)
    .join('')
  gsap.from('.legend', { opacity: 0, x: -12, duration: 0.6, ease: 'power2.out' })
}

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
}

// ---------- Boot ----------
async function boot() {
  initMap()
  gsap.from('.brand', { opacity: 0, x: -12, duration: 0.6, ease: 'power2.out' })
  // Events are the page — load and show them immediately.
  try {
    EVENTS = await fetchEvents({ days: 7, limit: 500 })
  } catch (err) {
    console.error(err)
    document.getElementById('map-loading').innerHTML = 'Kunde inte ladda data just nu.'
    return
  }
  renderLiveCount()
  renderFilters()
  renderLegend()
  if (map.getSource('events')) pushData()
  else map.on('load', pushData)
  // Community reports are a soft overlay — fetch after, never block the map.
  fetchReports()
    .then((r) => { REPORTS = r; map.getSource('reports')?.setData(reportsGeoJSON(REPORTS)) })
    .catch(() => {})
}
boot()
