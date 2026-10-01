/**
 * Integration tests for api/enquiry.ts against a local mock of the Resend API.
 * Run: npm run test:enquiry   (Node 22+; no real email is sent)
 */
import http from 'node:http'
import assert from 'node:assert/strict'

const sent = []
const logs = []
let mode = 'ok' // ok | fail500 | fail403
const mock = http.createServer((req, res) => {
  let body = ''
  req.on('data', (c) => (body += c))
  req.on('end', () => {
    if (req.url === '/log') {
      logs.push(JSON.parse(body))
      res.writeHead(200).end('{}')
      return
    }
    const entry = { headers: req.headers, body: JSON.parse(body) }
    sent.push(entry)
    if (mode === 'fail500') return res.writeHead(500, { 'Content-Type': 'application/json' }).end('{"message":"internal"}')
    if (mode === 'fail403')
      return res.writeHead(403, { 'Content-Type': 'application/json' }).end('{"name":"validation_error","message":"You can only send testing emails to your own email address"}')
    res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify({ id: `mock-${sent.length}` }))
  })
})
await new Promise((r) => mock.listen(0, r))
const base = `http://127.0.0.1:${mock.address().port}`

const { handleEnquiry, DEFAULT_TO, normalisePhone } = await import('../api/enquiry.ts')
let ipN = 0
const post = (payload, ip = `10.0.0.${++ipN}`) =>
  handleEnquiry(new Request('http://x/api/enquiry', { method: 'POST', headers: { 'content-type': 'application/json', 'x-forwarded-for': ip }, body: JSON.stringify(payload) }))
const call = async (payload, ip) => {
  const r = await post(payload, ip)
  return { status: r.status, body: await r.json() }
}
let passed = 0
const t = async (name, fn) => {
  await fn()
  passed++
  console.log('ok  ', name)
}

const base_ = { email: 'test.customer@example.com', mobile: '98765 43210', consent: true }
const forms = {
  quote: { ...base_, fullName: 'Test Customer', company: 'Acme Pvt Ltd', requirementType: 'New Laptop', productModel: 'Dell Latitude 5450', productId: 'ZV-DEMO-N001', quantity: '25', budget: '₹50,000 – ₹1,00,000', city: 'Noida', pin: '201301', details: '16 GB RAM, 512 GB SSD' },
  corporate: { ...base_, fullName: 'Test Customer', company: 'Acme Pvt Ltd', orgType: 'Company / enterprise', locations: 'Noida, Pune', timeline: '2–4 weeks', budget: '₹5–8 lakh', items: [{ key: 'li-1', category: 'Laptops (new)', description: 'i5 16GB', quantity: '20', condition: 'New' }, { key: 'li-2', category: 'Monitors & displays', description: '24 inch', quantity: '20', condition: 'New' }], notes: 'Imaging required' },
  contact: { ...base_, fullName: 'Test Customer', company: '', service: 'Headsets and Meeting Room Solutions', message: 'Need 40 USB-C headsets for our support team.' },
  vendor: { ...base_, company: 'Supplier Co', contactName: 'Test Vendor', vendorType: 'Distributor', categories: ['Laptops', 'Networking'] },
  headset: { ...base_, company: 'Acme BPO', contactName: 'Test Customer', requirement: 'Call centre / contact centre headsets', brand: 'Poly (HP Poly)', connectivity: ['USB-C'], intendedUse: ['Call Centre'], quantity: '50', budget: '₹2,000–5,000 per unit', notes: 'Teams', product: 'Poly EncorePro 500 Series (515 / 525) (ZV-DEMO-H003)' },
}

await t('503 when no email provider is configured (never fakes success)', async () => {
  delete process.env.RESEND_API_KEY
  const r = await call({ kind: 'contact', data: forms.contact })
  assert.equal(r.status, 503)
  assert.equal(r.body.ok, false)
})

process.env.RESEND_API_KEY = 're_test_dummy'
process.env.RESEND_API_BASE = base
process.env.ENQUIRY_LOG_WEBHOOK_URL = `${base}/log`
process.env.ENQUIRY_LOG_TOKEN = 'log-token'

await t('default destination is zovainfotech@gmail.com', async () => assert.equal(DEFAULT_TO, 'zovainfotech@gmail.com'))

const expectedItem = {
  quote: 'Dell Latitude 5450 (ZV-DEMO-N001)',
  corporate: 'Corporate procurement: Laptops (new), Monitors & displays',
  contact: 'Headsets and Meeting Room Solutions',
  vendor: 'Vendor registration — Supplier Co',
  headset: 'Poly EncorePro 500 Series (515 / 525) (ZV-DEMO-H003)',
}
for (const [kind, data] of Object.entries(forms)) {
  await t(`${kind}: accepted, emailed with correct headers and content`, async () => {
    const before = sent.length
    const r = await call({ kind, data, pageUrl: 'https://zovainfotech.com/request-a-quote?product=dell', pageTitle: 'Request a Quote', submissionId: `sub-${kind}-0001` })
    assert.equal(r.status, 200, JSON.stringify(r.body))
    assert.match(r.body.reference, /^ZV-\d{8}-[A-F0-9]{6}$/)
    assert.equal(sent.length, before + 1)
    const { headers, body } = sent.at(-1)
    assert.deepEqual(body.to, ['zovainfotech@gmail.com'])
    assert.equal(body.from, 'ZOVA INFOTECH Website <onboarding@resend.dev>')
    assert.equal(body.reply_to, 'test.customer@example.com')
    assert.equal(headers.authorization, 'Bearer re_test_dummy')
    assert.equal(headers['idempotency-key'], `zova-enquiry-sub-${kind}-0001`)
    const label = kind === 'vendor' ? 'New Vendor Registration' : 'New Quote Request'
    assert.equal(body.subject, `${label} | ZOVA INFOTECH | ${expectedItem[kind]}`.slice(0, label.length + 17 + 90))
    for (const s of ['+91 98765 43210', 'test.customer@example.com', 'IST', 'https://zovainfotech.com/request-a-quote?product=dell']) assert.ok(body.html.includes(s) || body.html.includes(s.replace(/&/g, '&amp;')), `html has ${s}`)
    assert.ok(body.text.includes('Customer name:'))
    if (data.quantity) assert.ok(body.text.includes(`Quantity: ${data.quantity}`))
    if (data.budget) assert.ok(body.text.includes(`Budget: ${data.budget}`))
    if (data.company) assert.ok(body.text.includes(`Company: ${data.company}`))
    assert.equal(logs.at(-1).emailStatus, 'sent')
    assert.equal(logs.at(-1).token, 'log-token')
  })
}

await t('corporate quantity totals line items', async () => assert.ok(sent.find((s) => s.body.subject.includes('Corporate')).body.text.includes('Quantity: 40 units')))

await t('HTML is escaped (no injection)', async () => {
  const r = await call({ kind: 'contact', data: { ...forms.contact, message: '<script>alert(1)</script> hello there' } })
  assert.equal(r.status, 200)
  assert.ok(!sent.at(-1).body.html.includes('<script>'))
})

await t('subject cannot carry header injection (newlines collapsed)', async () => {
  await call({ kind: 'contact', data: { ...forms.contact, service: 'Cloud Solutions\r\nBcc: evil@example.com' } })
  assert.ok(!/[\r\n]/.test(sent.at(-1).body.subject))
})

await t('invalid email rejected (422), nothing sent', async () => {
  const n = sent.length
  const r = await call({ kind: 'contact', data: { ...forms.contact, email: 'not-an-email' } })
  assert.equal(r.status, 422)
  assert.equal(sent.length, n)
})

await t('invalid phone rejected (422)', async () => assert.equal((await call({ kind: 'contact', data: { ...forms.contact, mobile: '12345' } })).status, 422))
await t('phone normalisation', async () => {
  assert.equal(normalisePhone('+91 74608 54541'), '+91 74608 54541')
  assert.equal(normalisePhone('07460854541'), '+91 74608 54541')
  assert.equal(normalisePhone('5460854541'), null)
})
await t('missing required fields rejected (422)', async () => {
  const r = await call({ kind: 'quote', data: { ...forms.quote, pin: '' } })
  assert.equal(r.status, 422)
  assert.match(r.body.error, /PIN code/)
})
await t('unknown form kind rejected (400)', async () => assert.equal((await call({ kind: 'spam', data: forms.contact })).status, 400))

await t('honeypot: bot gets 200 but nothing is sent or logged', async () => {
  const n = sent.length
  const l = logs.length
  const r = await call({ kind: 'contact', data: forms.contact, hp: 'http://spam' })
  assert.equal(r.status, 200)
  assert.equal(sent.length, n)
  assert.equal(logs.length, l)
})

await t('duplicate submission (same submissionId) is not emailed twice', async () => {
  const n = sent.length
  const a = await call({ kind: 'contact', data: forms.contact, submissionId: 'dup-test-123456' })
  const b = await call({ kind: 'contact', data: forms.contact, submissionId: 'dup-test-123456' })
  assert.equal(a.status, 200)
  assert.equal(b.status, 200)
  assert.equal(b.body.reference, a.body.reference)
  assert.equal(sent.length, n + 1)
})

await t('provider 5xx: retried once with same idempotency key, then 502 + logged as failed', async () => {
  mode = 'fail500'
  const n = sent.length
  const r = await call({ kind: 'contact', data: forms.contact, submissionId: 'fail-500-abcdef' })
  mode = 'ok'
  assert.equal(r.status, 502)
  assert.equal(r.body.ok, false)
  assert.equal(sent.length, n + 2)
  assert.equal(sent.at(-1).headers['idempotency-key'], sent.at(-2).headers['idempotency-key'])
  assert.equal(logs.at(-1).emailStatus, 'failed')
  assert.equal(logs.at(-1).summary.name, 'Test Customer')
})

await t('provider 403 (e.g. unverified sender): no retry, 502, recoverable in log', async () => {
  mode = 'fail403'
  const n = sent.length
  const r = await call({ kind: 'contact', data: forms.contact })
  mode = 'ok'
  assert.equal(r.status, 502)
  assert.equal(sent.length, n + 1)
  assert.match(logs.at(-1).emailError, /own email address/)
})

await t('rate limit: 9th submission from one IP within 10 minutes gets 429', async () => {
  let last
  for (let i = 0; i < 9; i++) last = await call({ kind: 'contact', data: forms.contact }, '203.0.113.9')
  assert.equal(last.status, 429)
})

await t('non-JSON content type rejected (415)', async () => {
  const r = await handleEnquiry(new Request('http://x/api/enquiry', { method: 'POST', headers: { 'content-type': 'text/plain' }, body: 'x' }))
  assert.equal(r.status, 415)
})

console.log(`\n${passed} enquiry tests passed`)
mock.close()
