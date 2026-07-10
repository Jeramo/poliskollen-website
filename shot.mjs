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

// Grant geolocation + mock a Stockholm position, click locate, capture the puck.
{
  const ctx = browser.defaultBrowserContext()
  await ctx.overridePermissions(URL, ['geolocation'])
  const p = await browser.newPage()
  await p.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 })
  await p.setGeolocation({ latitude: 59.3326, longitude: 18.0649 })
  await p.goto(URL, { waitUntil: 'networkidle2' })
  await wait(6000)
  await p.click('#locate-btn')
  await wait(2200) // flyTo + puck
  await p.screenshot({ path: `${OUT}/locate.png` })
  console.log('shot locate')
  await p.close()
}

await browser.close()
