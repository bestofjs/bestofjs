import { Browser, Page } from 'playwright'
import qawolf from 'qawolf'

let browser: Browser
let page: Page

beforeAll(async () => {
  browser = await qawolf.launch()
  const context = await browser.newContext()
  await qawolf.register(context)
  page = await context.newPage()
})

afterAll(async () => {
  await qawolf.stopVideos()
  await browser.close()
})

test('tagSearch', async () => {
  await page.goto('http://localhost:3000')
  await page.click('#main')
  await page.click('text=Pick tags or enter keywords...')
  await page.fill('#react-select-2-input', 'frame')
  await page.click('div:nth-of-type(2) div:nth-of-type(4)')
  await qawolf.scroll(page, 'html', { x: 0, y: 78 })
  await page.click('[href="/projects/react"]')
  await qawolf.scroll(page, 'html', { x: 0, y: 536 })
  await page.click('text=3 dependencies')
  await qawolf.scroll(page, 'html', { x: 0, y: 0 })
  await page.press('body', 'ArrowUp')
})
