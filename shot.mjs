import puppeteer from 'puppeteer-core'

const OUT = process.argv[2] || '/tmp'
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const URL = 'http://localhost:5173/'
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox', '--hide-scrollbars'],
})

async function page() {
  const p = await browser.newPage()
  await p.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 })
  await p.goto(URL, { waitUntil: 'networkidle2' })
  await wait(5000)
  return p
}

// Inject mock community reports near Stockholm, screenshot the pins + a popup.
{
  const p = await page()
  await p.evaluate(() => {
    window.__map.jumpTo({ center: [18.07, 59.33], zoom: 11.6 })
    const now = new Date().toISOString()
    const ago = new Date(Date.now() - 15 * 60000).toISOString()
    window.__mockReports([
      { id: 'm1', category: 'police', latitude: 59.336, longitude: 18.060, confirm_count: 3, trusted: true, created_at: ago },
      { id: 'm2', category: 'accident', latitude: 59.325, longitude: 18.085, confirm_count: 1, trusted: false, created_at: now },
      { id: 'm3', category: 'fire', latitude: 59.343, longitude: 18.045, confirm_count: 0, trusted: false, created_at: ago },
      { id: 'm4', category: 'sirens', latitude: 59.318, longitude: 18.095, confirm_count: 5, trusted: false, created_at: now },
      { id: 'm5', category: 'crowd', latitude: 59.332, longitude: 18.110, confirm_count: 2, trusted: false, created_at: ago },
      { id: 'm6', category: 'hazard', latitude: 59.350, longitude: 18.075, confirm_count: 1, trusted: false, created_at: now },
    ])
  })
  await wait(1500)
  await p.screenshot({ path: `${OUT}/reports.png` })
  console.log('shot reports')
  // click the trusted police report pin
  const pt = await p.evaluate(() => {
    const m = window.__map
    const f = m.queryRenderedFeatures({ layers: ['rep-dot'] }).find((x) => x.properties.trusted)
      || m.queryRenderedFeatures({ layers: ['rep-dot'] })[0]
    if (!f) return null
    const q = m.project(f.geometry.coordinates)
    return { x: Math.round(q.x), y: Math.round(q.y) }
  })
  if (pt) { await p.mouse.click(pt.x, pt.y); await wait(1400) }
  await p.screenshot({ path: `${OUT}/report-popup.png` })
  console.log('shot report-popup', pt)
  await p.close()
}

await browser.close()
