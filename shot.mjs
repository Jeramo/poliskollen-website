import puppeteer from 'puppeteer-core'
const OUT = process.argv[2] || '/tmp'
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const browser = await puppeteer.launch({
  executablePath: CHROME, headless: 'new',
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox', '--hide-scrollbars'],
})
const p = await browser.newPage()
await p.setViewport({ width: 402, height: 874, deviceScaleFactor: 2 })
await p.goto('http://localhost:5173/', { waitUntil: 'networkidle2' })
await wait(4500)
await p.click('#dl-open')
await wait(700)
await p.screenshot({ path: `${OUT}/modal-mob.png` })
console.log('shot modal-mob')
await browser.close()
