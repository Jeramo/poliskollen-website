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

{ const p = await page(); await p.screenshot({ path: `${OUT}/overview.png` }); console.log('shot overview'); await p.close() }

{
  const p = await page()
  await p.click('#search-input')
  await p.type('#search-input', 'Göteborg', { delay: 40 })
  await wait(1600) // debounce + Photon fetch
  await p.screenshot({ path: `${OUT}/search.png` })
  console.log('shot search')
  await p.close()
}

{ const p = await page(); await p.setViewport({ width: 390, height: 844 }); await p.reload({ waitUntil: 'networkidle2' }); await wait(4000); await p.screenshot({ path: `${OUT}/mob.png` }); console.log('shot mob'); await p.close() }

await browser.close()
