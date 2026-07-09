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

// Pulsing ring shown at a tapped pin (removed when its popup closes).
let pulseMarker = null
function showPulse(lngLat) {
  removePulse()
  const el = document.createElement('div')
  el.className = 'pin-pulse'
  pulseMarker = new maplibregl.Marker({ element: el, pitchAlignment: 'map' }).setLngLat(lngLat).addTo(map)
}
function removePulse() {
  if (pulseMarker) { pulseMarker.remove(); pulseMarker = null }
}

const EVT_GLOW = 'evt-glow', EVT_DOT = 'evt-pin', REP_LAYER = 'rep-dot'
const CLUSTER = 'evt-cluster', CLUSTER_COUNT = 'evt-cluster-count'
const NOT_CLUSTERED = ['!', ['has', 'point_count']]
const IS_CLUSTER = ['has', 'point_count']

// ---------- iOS-style pins: colored circle + white glyph ----------
const PIN_DPR = 3, PIN_PX = 46 * PIN_DPR
function pinKey(type) { return `${typeColor(type)}__${iconName(type)}` }

function makePinImage(colorHex, icon) {
  const c = document.createElement('canvas')
  c.width = c.height = PIN_PX
  const ctx = c.getContext('2d')
  const cx = PIN_PX / 2, cy = PIN_PX / 2, r = PIN_PX / 2 - 3.5 * PIN_DPR
  const ring = (rr) => { ctx.beginPath(); ctx.arc(cx, cy, rr, 0, Math.PI * 2) }

  // 1. base fill with a soft drop shadow (depth on the dark map)
  ctx.save()
  ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 6 * PIN_DPR; ctx.shadowOffsetY = 2 * PIN_DPR
  ring(r); ctx.fillStyle = colorHex; ctx.fill()
  ctx.restore()

  // 2. vertical gradient for a dimensional "coin" look (lit top, shaded base)
  const grad = ctx.createLinearGradient(0, cy - r, 0, cy + r)
  grad.addColorStop(0, 'rgba(255,255,255,0.30)')
  grad.addColorStop(0.48, 'rgba(255,255,255,0)')
  grad.addColorStop(1, 'rgba(0,0,0,0.24)')
  ring(r); ctx.fillStyle = grad; ctx.fill()

  // 3. glossy top highlight
  ctx.save()
  ctx.beginPath()
  ctx.ellipse(cx, cy - r * 0.40, r * 0.60, r * 0.34, 0, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(255,255,255,0.22)'; ctx.fill()
  ctx.restore()

  // 4. crisp white ring + faint inner edge for definition
  ring(r); ctx.lineWidth = 2.6 * PIN_DPR; ctx.strokeStyle = 'rgba(255,255,255,0.98)'; ctx.stroke()
  ring(r - 2.6 * PIN_DPR); ctx.lineWidth = 1 * PIN_DPR; ctx.strokeStyle = 'rgba(0,0,0,0.12)'; ctx.stroke()

  // 5. white glyph with a subtle shadow for legibility
  const g = PIN_PX * 0.5
  ctx.save()
  ctx.shadowColor = 'rgba(0,0,0,0.28)'; ctx.shadowBlur = 1.4 * PIN_DPR; ctx.shadowOffsetY = 0.6 * PIN_DPR
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
  if (import.meta.env.DEV) window.__map = map // dev-only handle for verification

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
    // Soft glow beneath each cluster bubble.
    map.addLayer({
      id: 'evt-cluster-glow', type: 'circle', source: 'events', filter: IS_CLUSTER,
      paint: {
        'circle-color': '#5b9eff',
        'circle-radius': ['step', ['get', 'point_count'], 23, 10, 28, 50, 35, 200, 42],
        'circle-blur': 1, 'circle-opacity': 0.3,
      },
    })
    // Cluster bubble: police-blue circle + white ring + count (mirrors the app).
    map.addLayer({
      id: CLUSTER, type: 'circle', source: 'events', filter: IS_CLUSTER,
      paint: {
        'circle-color': '#5b9eff',
        'circle-radius': ['step', ['get', 'point_count'], 16, 10, 20, 50, 26, 200, 32],
        'circle-stroke-color': '#ffffff', 'circle-stroke-width': 2.5,
        'circle-stroke-opacity': 0.96,
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

    const pop = new maplibregl.Popup({ closeButton: true, maxWidth: '300px', offset: 16 })
    pop.on('close', removePulse)

    // Smoothly focus a tapped pin: ease the map to it + a pulsing ring, then
    // the popup animates in (CSS).
    function focusPin(lngLat, html) {
      const easeCubic = (t) => 1 - Math.pow(1 - t, 3)
      map.easeTo({
        center: lngLat,
        zoom: Math.max(map.getZoom(), 9.5),
        duration: 620, easing: easeCubic, offset: [0, 60],
      })
      showPulse(lngLat)
      pop.setLngLat(lngLat).setHTML(html).addTo(map)
    }

    map.on('click', EVT_DOT, (e) => {
      const p = e.features[0].properties
      focusPin(e.features[0].geometry.coordinates, `
        <div class="pop">
          <span class="pop-type" style="color:${p.color}">${esc(p.type)}</span>
          <h4>${esc(p.name)}</h4>
          ${p.summary ? `<p>${esc(p.summary)}</p>` : ''}
          <div class="meta">${esc([p.place, p.region].filter(Boolean).join(', '))} · ${esc(p.time)}</div>
        </div>`)
    })
    map.on('click', REP_LAYER, (e) => {
      const p = e.features[0].properties
      focusPin(e.features[0].geometry.coordinates, `
        <div class="pop">
          <span class="pop-type" style="color:#5b9eff">Community-rapport</span>
          <h4>${esc(p.category)}</h4>
          <div class="meta">${p.confirm} bekräftelser · anonym</div>
        </div>`)
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
  updateFilterBadge()
}

// ---------- Download modal ----------
function initDownloadModal() {
  const modal = document.getElementById('dl-modal')
  const open = () => { modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false') }
  const close = () => { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true') }
  document.getElementById('dl-open').addEventListener('click', open)
  modal.querySelectorAll('[data-close]').forEach((el) => el.addEventListener('click', close))
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close() })
}

// ---------- Overlays ----------
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
}

function updateFilterBadge() {
  const btn = document.getElementById('filter-btn')
  const badge = document.getElementById('filter-badge')
  const n = active.size
  btn.classList.toggle('on', n > 0)
  badge.textContent = String(n)
  badge.hidden = n === 0
}

function initFilterUI() {
  const btn = document.getElementById('filter-btn')
  const panel = document.getElementById('filter-panel')
  const wrap = document.querySelector('.filter-wrap')
  const setOpen = (open) => { panel.hidden = !open; btn.setAttribute('aria-expanded', String(open)) }
  btn.addEventListener('click', (e) => { e.stopPropagation(); setOpen(panel.hidden) })
  document.getElementById('filter-clear').addEventListener('click', () => {
    active.clear()
    document.querySelectorAll('#filters .chip.active').forEach((c) => c.classList.remove('active'))
    applyFilter()
  })
  document.addEventListener('click', (e) => { if (!panel.hidden && !wrap.contains(e.target)) setOpen(false) })
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !panel.hidden) setOpen(false) })
}

// "Till min position" — fly to the user's live location.
function initLocateButton() {
  const btn = document.getElementById('locate-btn')
  btn.addEventListener('click', () => {
    if (!('geolocation' in navigator) || btn.classList.contains('locating')) return
    btn.classList.add('locating')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        btn.classList.remove('locating')
        map.flyTo({ center: [pos.coords.longitude, pos.coords.latitude], zoom: 12, duration: 1500, essential: true })
      },
      () => btn.classList.remove('locating'),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 30000 },
    )
  })
}

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
}

// ---------- Boot ----------
async function boot() {
  initMap()
  initDownloadModal()
  initFilterUI()
  initLocateButton()
  gsap.from('.brand', { opacity: 0, x: -12, duration: 0.6, ease: 'power2.out' })
  // Events are the page — load and show them immediately.
  try {
    EVENTS = await fetchEvents({ days: 7, limit: 500 })
  } catch (err) {
    console.error(err)
    document.getElementById('map-loading').innerHTML = 'Kunde inte ladda data just nu.'
    return
  }
  renderFilters()
  if (map.getSource('events')) pushData()
  else map.on('load', pushData)
  // Community reports are a soft overlay — fetch after, never block the map.
  fetchReports()
    .then((r) => { REPORTS = r; map.getSource('reports')?.setData(reportsGeoJSON(REPORTS)) })
    .catch(() => {})
}
boot()
