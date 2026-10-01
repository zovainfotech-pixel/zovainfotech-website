import { chromium } from 'playwright'

const BASE = process.env.BASE ?? 'http://localhost:4174' // npm run serve:test (build + real /api/enquiry with mocked email)
const OUT = new URL('./shots/', import.meta.url).pathname
const routes = [
  '/', '/products', '/products/new-laptops', '/products/refurbished-laptops', '/products/desktops-workstations',
  '/products/apple-products', '/products/printers-scanners', '/products/it-accessories', '/products/components-parts',
  '/products/networking', '/products/monitors-displays', '/products/servers-storage',
  '/product/lenovo-thinkpad-t480-refurbished', '/product/dell-latitude-5450', '/services', '/services/it-amc', '/audio-video-solutions', '/audio-video-solutions?cat=signage', '/microsoft-security', '/services/cctv-surveillance', '/products/apple-products', '/product/apple-iphone-18-pro', '/#solutions', '/products/headsets-audio-solutions', '/products/headsets-audio-solutions?brand=Poly', '/products/headsets-audio-solutions/usb-headsets', '/product/poly-voyager-4300-uc-series', '/compare-headsets?ids=ZV-DEMO-H001,ZV-DEMO-H004,ZV-DEMO-H006',
  '/services/cybersecurity-dlp', '/services/software-licensing', '/services/audio-visual-digital-signage',
  '/corporate-it-procurement', '/about', '/contact', '/request-a-quote', '/become-a-vendor', '/privacy-policy',
  '/terms-and-conditions', '/shipping-and-delivery-policy', '/returns-and-refunds-policy', '/warranty-policy', '/does-not-exist',
]
const results = []
const fail = (m) => { results.push('FAIL ' + m); console.log('FAIL ' + m) }
const ok = (m) => { results.push('ok   ' + m) }

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' })

for (const vp of [{ name: 'mobile', width: 390, height: 844 }, { name: 'tablet', width: 820, height: 1180 }, { name: 'desktop', width: 1440, height: 900 }]) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } })
  const page = await ctx.newPage()
  const errors = []
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  page.on('pageerror', (e) => errors.push(e.message))
  for (const r of routes) {
    await page.goto(BASE + r, { waitUntil: 'networkidle' })
    const info = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      h1: document.querySelectorAll('h1').length,
      title: document.title,
      desc: document.querySelector('meta[name=description]')?.content?.length ?? 0,
    }))
    if (info.overflow > 1) fail(`${vp.name} ${r} horizontal overflow ${info.overflow}px`)
    if (info.h1 !== 1) fail(`${vp.name} ${r} has ${info.h1} h1`)
    if (!info.desc) fail(`${vp.name} ${r} missing description`)
  }
  if (errors.length) fail(`${vp.name} console errors: ${[...new Set(errors)].join(' | ')}`)
  else ok(`${vp.name}: ${routes.length} routes, no console errors`)
  await ctx.close()
}

// Screenshots
async function shot(path, vp, name, full = true, action) {
  const ctx = await browser.newContext({ viewport: vp })
  const page = await ctx.newPage()
  await page.goto(BASE + path, { waitUntil: 'networkidle' })
  // reveal scroll-triggered sections
  if (full) {
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)) }
      window.scrollTo(0, 0)
    })
    await page.waitForTimeout(700)
  }
  if (action) await action(page)
  await page.screenshot({ path: OUT + name + '.png', fullPage: full })
  await ctx.close()
}
const D = { width: 1440, height: 900 }, M = { width: 390, height: 844 }
await shot('/', D, 'home-desktop')
await shot('/', M, 'home-mobile')
await shot('/products/refurbished-laptops', D, 'refurb-desktop')
await shot('/product/lenovo-thinkpad-t480-refurbished', D, 'product-desktop')
await shot('/request-a-quote?product=lenovo-thinkpad-t480-refurbished', D, 'quote-desktop')
await shot('/', D, 'megamenu', false, async (p) => { await p.getByRole('button', { name: 'Products', exact: true }).click(); await p.waitForTimeout(400) })
await shot('/', M, 'drawer', false, async (p) => { await p.getByRole('button', { name: 'Open menu' }).click(); await p.waitForTimeout(600) })

// Interactions
{
  const ctx = await browser.newContext({ viewport: D })
  const page = await ctx.newPage()
  // Catalogue filtering
  await page.goto(BASE + '/products', { waitUntil: 'networkidle' })
  const count = async () => Number((await page.locator('[aria-live=polite] strong').first().textContent()) ?? 0)
  const all = await count()
  await page.locator('aside').getByRole('checkbox', { name: /^Refurbished \d+$/ }).click()
  await page.waitForTimeout(300)
  const refurb = await count()
  if (refurb > 0 && refurb < all) ok(`filter condition: ${all} -> ${refurb}`)
  else fail(`filter condition ${all} -> ${refurb}`)
  if (!page.url().includes('condition=refurbished')) fail('filter not synced to URL'); else ok('filter synced to URL')
  await page.getByLabel('Search by product name or model').first().fill('zzzz-nothing')
  await page.waitForTimeout(500)
  if (await page.getByText('No products match').count()) ok('empty state shown')
  else fail('empty state missing')
  await page.getByRole('button', { name: 'Clear filters' }).click()
  await page.waitForTimeout(400)
  if ((await count()) === all) ok('clear filters restores all')
  else fail('clear filters')
  await page.getByLabel('Search by product name or model').first().fill('thinkpad')
  await page.waitForTimeout(500)
  const tp = await count()
  if (tp >= 2) ok(`search thinkpad -> ${tp}`)
  else fail(`search thinkpad -> ${tp}`)
  await page.getByRole('button', { name: 'List view' }).click()
  ok('list view toggled')
  await page.selectOption('select', 'name-desc')
  const first = await page.locator('article h3').first().textContent()
  ok(`sorted Z-A first: ${first}`)

  // Product -> quote prefill
  await page.goto(BASE + '/product/dell-latitude-7490-refurbished', { waitUntil: 'networkidle' })
  await page.locator('#main').getByRole('link', { name: 'Get a Quote', exact: true }).click()
  await page.waitForURL(/request-a-quote/)
  const prefill = await page.getByText('ZV-DEMO-R002').count()
  if (prefill) ok('quote prefilled with product id')
  else fail('quote prefill missing')
  // Validation
  await page.getByRole('button', { name: 'Submit quote request' }).click()
  const errs = await page.locator('[aria-invalid=true]').count()
  if (errs >= 4) ok(`validation errors shown: ${errs}`)
  else fail(`validation errors ${errs}`)
  await page.waitForTimeout(250)
  const focused = await page.evaluate(() => document.activeElement?.getAttribute('aria-invalid'))
  if (focused === 'true') ok('focus moved to first invalid field')
  else fail('focus not moved')
  await page.getByLabel('Full name').fill('Test User')
  await page.locator('#main form').getByLabel('Email', { exact: false }).first().fill('test@example.com')
  await page.getByLabel('Mobile number').fill('9876543210')
  await page.getByLabel('Delivery city').fill('Pune')
  await page.getByLabel('PIN code').fill('411001')
  await page.getByRole('checkbox').click()
  await page.getByRole('button', { name: 'Submit quote request' }).click()
  await page
    .getByText(/quote request has been received|Demo mode — quote request not sent/)
    .waitFor({ timeout: 15000 })
    .then(() => ok('submission confirmed by the API (or labelled demo mode)'), () => fail('no confirmed submission state'))

  // FAQ accordion
  await page.goto(BASE + '/', { waitUntil: 'networkidle' })
  const q = page.getByRole('button', { name: 'What warranty is available?' })
  await q.scrollIntoViewIfNeeded()
  await q.click()
  if ((await q.getAttribute('aria-expanded')) === 'true') ok('FAQ expands')
  else fail('FAQ')
  // Search dialog
  await page.getByRole('button', { name: /^Search products/ }).click()
  await page.keyboard.type('latitude')
  await page.waitForTimeout(300)
  const hits = await page.getByRole('dialog').getByRole('button').filter({ hasText: 'Latitude' }).count()
  if (hits > 0) ok(`search dialog results: ${hits}`)
  else fail('search dialog')
  await page.keyboard.press('Escape')

  // Corporate form add row
  await page.goto(BASE + '/corporate-it-procurement', { waitUntil: 'networkidle' })
  const before = await page.getByText(/^Item \d+ · Category$/).count()
  await page.getByRole('button', { name: 'Add another item' }).click()
  await page.waitForTimeout(400)
  const after = await page.getByText(/^Item \d+ · Category$/).count()
  if (after === before + 1) ok('corporate line item added')
  else fail(`line items ${before}->${after}`)
  // Keyboard: skip link
  await page.goto(BASE + '/', { waitUntil: 'networkidle' })
  await page.keyboard.press('Tab')
  const skip = await page.evaluate(() => document.activeElement?.textContent)
  if (skip?.includes('Skip')) ok('skip link first in tab order')
  else fail('skip link')
  await ctx.close()
}

// robots
const robots = await (await fetch(BASE + '/robots.txt')).text()
if (robots.includes('User-agent')) ok('robots.txt served')
else fail('robots')

await browser.close()
console.log(results.join('\n'))
