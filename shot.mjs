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

// Improved pin frames — zoom in so the gloss/ring is visible.
{
  const p = await page()
  await p.evaluate(() => window.__map.jumpTo({ center: [18.05, 59.33], zoom: 10.5 }))
  await wait(1500)
  await p.screenshot({ path: `${OUT}/pins.png` })
  console.log('shot pins')
  await p.close()
}

// Pin press → focus animation + pulse + popup.
{
  const p = await page()
  await p.evaluate(() => window.__map.jumpTo({ center: [18.05, 59.33], zoom: 10 }))
  await wait(1500)
  const pt = await p.evaluate(() => {
    const m = window.__map
    const f = m.queryRenderedFeatures({ layers: ['evt-pin'] })[0]
    if (!f) return null
    const q = m.project(f.geometry.coordinates)
    return { x: Math.round(q.x), y: Math.round(q.y) }
  })
  if (pt) { await p.mouse.click(pt.x, pt.y); await wait(1400) }
  await p.screenshot({ path: `${OUT}/press.png` })
  console.log('shot press', pt)
  await p.close()
}

await browser.close()
