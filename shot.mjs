import puppeteer from 'puppeteer-core'

const OUT = process.argv[2] || '/tmp'
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const BASE = 'http://localhost:5173'
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

const browser = await puppeteer.launch({
  executablePath: CHROME, headless: 'new',
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox', '--hide-scrollbars'],
})

async function grab(name, path, { click = null, wait: w = 4000, width = 1280, height = 900 } = {}) {
  const p = await browser.newPage()
  await p.setViewport({ width, height, deviceScaleFactor: 1 })
  await p.goto(BASE + path, { waitUntil: 'networkidle2' })
  await wait(w)
  if (click) { await p.click(click); await wait(600) }
  await p.screenshot({ path: `${OUT}/${name}.png` })
  console.log('shot', name)
  await p.close()
}

await grab('modal', '/', { click: '#dl-open' })
await grab('privacy', '/privacy.html', { w: 3500 })
await grab('support', '/support.html', { w: 1500 })

await browser.close()
