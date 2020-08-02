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

test('topPage', async () => {
  await page.goto('http://localhost:3000/')
  await page.click('text=Today')
  await page.click('text=This week')
  await qawolf.scroll(page, 'html', { x: 0, y: 407 })
  await page.click('[href="/projects?sort=weekly"]')
  await qawolf.scroll(page, 'html', { x: 0, y: 25 })
  await page.click('text=Typography')
  await page.click('[href="/"]')
  await qawolf.scroll(page, 'html', { x: 0, y: 321 })
  await page.click('[href="/featured"]')
  await qawolf.scroll(page, 'html', { x: 0, y: 21 })
  await page.click('text=Dev tool')
  await page.click('[href="/"]')
  await qawolf.scroll(page, 'html', { x: 0, y: 952 })
  await page.click('[href="/projects?sort=newest"]')
  await qawolf.scroll(page, 'html', { x: 0, y: 209 })
  await page.click('text=Icon set')
  await page.click('[href="/"]')
  await qawolf.scroll(page, 'html', { x: 0, y: 2557 })
})
