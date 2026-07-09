import puppeteer from 'puppeteer-core'

const OUT = process.argv[2] || '/tmp'
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const URL = 'http://localhost:5173/'

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox', '--hide-scrollbars'],
})

async function grab(name, { width = 1280, height = 800, wait = 5000, click = null } = {}) {
  const page = await browser.newPage()
  await page.setViewport({ width, height, deviceScaleFactor: 1 })
  await page.goto(URL, { waitUntil: 'networkidle2' })
  await new Promise((r) => setTimeout(r, wait))
  if (click) { await page.click(click); await new Promise((r) => setTimeout(r, 700)) }
  await page.screenshot({ path: `${OUT}/${name}.png` })
  await page.close()
  console.log('shot', name)
}

await grab('desk', {})
await grab('modal', { click: '#dl-open' })
await grab('modal-mob', { width: 390, height: 844, click: '#dl-open' })

await browser.close()
