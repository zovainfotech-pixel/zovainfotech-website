/**
 * Browser test of every enquiry form against tests/serve-with-api.mjs
 * (real api/enquiry.ts handler, mocked Resend). Run:
 *   npm run build && npm run serve:test   (in another terminal)
 *   node tests/forms.e2e.mjs
 */
import { chromium } from 'playwright'
const BASE = process.env.BASE ?? 'http://localhost:4174'
const results = []
const ok = (c, m) => {
  results.push(c)
  console.log((c ? 'ok   ' : 'FAIL ') + m)
}
const sent = async () => (await fetch(`${BASE}/__test/sent`)).json()
const setMode = (m) => fetch(`${BASE}/__test/mode`, { method: 'POST', body: m })

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' })
const errors = []

async function run(width, name, url, fill, submitName, expectSubject) {
  const page = await browser.newPage({ viewport: { width, height: 900 } })
  page.on('pageerror', (e) => errors.push(`${name}: ${e.message}`))
  await page.goto(BASE + url, { waitUntil: 'networkidle' })
  const form = await fill(page)
  const before = (await sent()).length
  const btn = form.getByRole('button', { name: submitName })
  // Double click: must produce exactly one email.
  await btn.dblclick()
  const loading = await form.getByRole('button', { name: 'Submitting…' }).isVisible().catch(() => false)
  const success = page.getByText(/has been received/)
  await success.waitFor({ timeout: 15000 }).catch(() => {})
  const done = await success.isVisible()
  const ref = (await page.locator('[role=status]', { hasText: 'has been received' }).innerText().catch(() => '')).match(/ZV-\d{8}-[A-F0-9]{6}/)?.[0]
  const mails = (await sent()).slice(before)
  ok(done && !!ref, `${name} @${width}: success shown only after API accepted (ref ${ref})${loading ? ', loading state shown' : ''}`)
  ok(mails.length === 1, `${name} @${width}: exactly one email for a double-click (${mails.length})`)
  if (mails[0]) {
    ok(mails[0].subject === expectSubject, `${name}: subject "${mails[0].subject}"`)
    ok(mails[0].to.join() === 'zovainfotech@gmail.com' && mails[0].reply_to === 'test.customer@example.com' && !mails[0].from.includes('example.com'), `${name}: to/from/reply-to correct`)
    ok(/Submitted<\/td>.*IST/.test(mails[0].html) && mails[0].html.includes(BASE), `${name}: body has IST timestamp and page URL`)
  }
  await page.close()
}

const common = async (f, { name = 'Full name', email = 'Email', phone = 'Mobile number' } = {}) => {
  await f.getByLabel(name, { exact: true }).fill('Test Customer')
  await f.getByLabel(email, { exact: true }).fill('test.customer@example.com')
  await f.getByLabel(phone, { exact: true }).fill('9876543210')
}
const consent = (f) => f.locator('input[type=checkbox]').last().check()

for (const width of [1440, 390]) {
  await run(width, 'Get a Quote (product)', '/product/dell-latitude-5450', async (p) => {
    await p.locator('#main').getByRole('link', { name: 'Get a Quote', exact: true }).click()
    await p.waitForURL(/request-a-quote/)
    const f = p.locator('form[aria-label="Request a quote"]')
    await common(f)
    await f.getByLabel('Delivery city').fill('Noida')
    await f.getByLabel('PIN code').fill('201301')
    await f.getByLabel('Quantity').fill('25')
    await consent(f)
    return f
  }, 'Submit quote request', 'New Quote Request | ZOVA INFOTECH | Dell Latitude 5450 (ZV-DEMO-N001)')
}

await run(1440, 'Request a specific model', '/products/refurbished-laptops#request-model', async (p) => {
  const f = p.locator('form[aria-label="Request a specific refurbished model"]')
  await f.scrollIntoViewIfNeeded()
  await common(f)
  await f.getByLabel('Model or specification').fill('ThinkPad T14 Gen 2')
  await f.getByLabel('Delivery city').fill('Noida')
  await f.getByLabel('PIN code').fill('201301')
  await consent(f)
  return f
}, 'Request this model', 'New Quote Request | ZOVA INFOTECH | ThinkPad T14 Gen 2')

await run(820, 'Headset quote', '/products/headsets-audio-solutions?product=poly-encorepro-500-series#headset-quote', async (p) => {
  const f = p.locator('form[aria-label*="Headset"]')
  await f.getByLabel('Company name').fill('Acme BPO')
  await f.getByLabel('Contact person').fill('Test Customer')
  await f.getByLabel('Business email').fill('test.customer@example.com')
  await f.getByLabel('Phone number').fill('9876543210')
  await f.getByLabel('Quantity').fill('50')
  await consent(f)
  return f
}, 'Submit Enquiry', 'New Quote Request | ZOVA INFOTECH | Poly EncorePro 500 Series (515 / 525) (ZV-DEMO-H003)')

await run(1440, 'Contact Us', '/contact', async (p) => {
  const f = p.locator('form[aria-label="Contact enquiry form"]')
  await common(f, { email: 'Business email', phone: 'Phone number' })
  await f.locator('select').selectOption('Cloud Solutions')
  await f.getByLabel(/Message/).fill('Please share Microsoft 365 Business Premium pricing for 30 users.')
  await consent(f)
  return f
}, 'Submit Enquiry', 'New Quote Request | ZOVA INFOTECH | Cloud Solutions')

await run(390, 'Contact Us (mobile)', '/contact', async (p) => {
  const f = p.locator('form[aria-label="Contact enquiry form"]')
  await common(f, { email: 'Business email', phone: 'Phone number' })
  await f.locator('select').selectOption('AMC and IT Support')
  await f.getByLabel(/Message/).fill('AMC for 40 desktops at our Noida office.')
  await consent(f)
  return f
}, 'Submit Enquiry', 'New Quote Request | ZOVA INFOTECH | AMC and IT Support')

// Error handling: provider outage → clear error, data kept, retry succeeds.
{
  const p = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await p.goto(BASE + '/contact', { waitUntil: 'networkidle' })
  const f = p.locator('form[aria-label="Contact enquiry form"]')
  await common(f, { email: 'Business email', phone: 'Phone number' })
  await f.locator('select').selectOption('Software and Licensing')
  await f.getByLabel(/Message/).fill('Error-path test: licensing for 10 users.')
  await consent(f)
  await setMode('fail500')
  await f.getByRole('button', { name: 'Submit Enquiry' }).click()
  await p.getByText('Your enquiry was not sent.').waitFor({ timeout: 15000 }).catch(() => {})
  ok(await p.getByText('Your enquiry was not sent.').isVisible(), 'provider outage: clear error shown, no success message')
  ok((await p.getByText(/has been received/).count()) === 0, 'provider outage: no false success')
  ok((await f.getByLabel('Full name').inputValue()) === 'Test Customer' && (await f.getByLabel(/Message/).inputValue()).startsWith('Error-path'), 'provider outage: entered data kept')
  ok((await p.locator('[role=alert] a[href="tel:+917460854541"]').count()) === 1, 'provider outage: phone/email fallback offered')
  await setMode('ok')
  await f.getByRole('button', { name: 'Submit Enquiry' }).click()
  await p.getByText(/has been received/).waitFor({ timeout: 15000 }).catch(() => {})
  ok(await p.getByText(/has been received/).isVisible(), 'retry after outage succeeds')
  await p.close()
}

// Corporate + vendor via API path in the browser (long forms: fill only required fields).
{
  const p = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await p.goto(BASE + '/corporate-it-procurement#requirement', { waitUntil: 'networkidle' })
  const f = p.locator('form[aria-label="Corporate procurement requirement"]')
  await common(f, { email: 'Business email' })
  await f.getByLabel('Organisation name').fill('Acme Pvt Ltd')
  await f.getByLabel('Organisation type').selectOption({ index: 1 })
  const rows = f.locator('select[id$="-c"]')
  await rows.first().selectOption({ index: 1 })
  await f.locator('input[id$="-d"]').first().fill('14-inch business laptop, i5, 16 GB')
  await f.locator('input[id$="-q"]').first().fill('20')
  await f.getByLabel('Delivery location(s)').fill('Noida')
  await f.getByLabel('Timeline').selectOption({ index: 1 })
  await consent(f)
  const before = (await sent()).length
  await f.getByRole('button', { name: 'Submit requirement' }).click()
  await p.getByText(/has been received/).waitFor({ timeout: 15000 }).catch(() => {})
  const m = (await sent()).slice(before)[0]
  ok((await p.getByText(/has been received/).isVisible()) && m?.subject === 'New Quote Request | ZOVA INFOTECH | Corporate procurement: Laptops (new)', `Corporate procurement: ${m?.subject}`)
  await p.close()
}
{
  const p = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await p.goto(BASE + '/become-a-vendor', { waitUntil: 'networkidle' })
  const f = p.locator('form[aria-label="Vendor registration"]')
  await f.getByLabel('Company name').fill('Supplier Co')
  await f.getByLabel('Contact person').fill('Test Customer')
  await f.getByLabel('Business email').fill('test.customer@example.com')
  await f.getByLabel('Mobile number').fill('9876543210')
  await f.getByRole('button', { name: 'Register as a vendor' }).click()
  const inv = await f.locator('[aria-invalid=true]').evaluateAll((els) => els.map((e) => e.id || e.getAttribute('name')))
  // Fill anything else the form requires.
  if (await f.getByLabel('Vendor type').count()) await f.getByLabel('Vendor type').selectOption({ index: 1 }).catch(() => {})
  if (await f.getByLabel('City').count()) await f.getByLabel('City').fill('Delhi')
  const cats = f.locator('fieldset input[type=checkbox]')
  if (await cats.count()) await cats.first().check({ force: true })
  await consent(f)
  const before = (await sent()).length
  await f.getByRole('button', { name: 'Register as a vendor' }).click()
  await p.getByText(/has been received/).waitFor({ timeout: 15000 }).catch(() => {})
  const m = (await sent()).slice(before)[0]
  ok((await p.getByText(/has been received/).isVisible()) && m?.subject === 'New Vendor Registration | ZOVA INFOTECH | Vendor registration — Supplier Co', `Vendor registration: ${m?.subject} (first-pass invalid: ${inv.length})`)
  await p.close()
}

ok(errors.length === 0, `no page errors ${errors.join(' | ')}`)
await browser.close()
console.log(`\n${results.filter(Boolean).length}/${results.length} passed`)
process.exit(results.every(Boolean) ? 0 : 1)
