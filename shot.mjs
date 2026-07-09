import puppeteer from 'puppeteer-core'

const OUT = process.argv[2] || '/tmp'
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const URL = 'http://localhost:5173/'

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox', '--hide-scrollbars'],
})

async function grab(name, { width = 1280, height = 800, geo = null } = {}) {
  const ctx = browser.defaultBrowserContext()
  if (geo) await ctx.overridePermissions(URL, ['geolocation'])
  else await ctx.clearPermissionOverrides()
  const page = await browser.newPage()
  await page.setViewport({ width, height, deviceScaleFactor: 1 })
  if (geo) await page.setGeolocation(geo) // {latitude, longitude}
  await page.goto(URL, { waitUntil: 'networkidle2' })
  await new Promise((r) => setTimeout(r, 5500)) // let the fly-to animation finish
  await page.screenshot({ path: `${OUT}/${name}.png` })
  await page.close()
  console.log('shot', name)
}

// Default (no geolocation granted) → should settle on Stockholm län.
await grab('geo-default', {})
// Granted at Göteborg → should fly to Göteborg.
await grab('geo-granted', { geo: { latitude: 57.7089, longitude: 11.9746 } })
await grab('mob', { width: 390, height: 844 })

await browser.close()
