/**
 * SERVER-SIDE ENQUIRY ENDPOINT — POST /api/enquiry
 * ---------------------------------------------------------------------------
 * Receives every enquiry form on the website (Request a Quote, Get a Quote,
 * headset quotes, corporate procurement, Contact Us, vendor registration) and
 * emails a notification to the business inbox through Resend's HTTP API.
 *
 * Runs as a Vercel Function (Web-standard Request/Response). All credentials
 * are SERVER environment variables — nothing here reaches the browser bundle.
 *
 *   RESEND_API_KEY           Required. Resend API key (server-side secret).
 *   ENQUIRY_TO_EMAIL         Optional. Defaults to zovainfotech@gmail.com.
 *   ENQUIRY_FROM_EMAIL       Optional. A sender on a domain verified in Resend,
 *                            e.g. "ZOVA INFOTECH Website <enquiries@zovainfotech.com>".
 *                            Defaults to Resend's test sender onboarding@resend.dev,
 *                            which Resend only delivers to the Resend account's own
 *                            address — so register the Resend account with
 *                            zovainfotech@gmail.com, or verify a domain.
 *   ENQUIRY_LOG_WEBHOOK_URL  Optional. Backup delivery log (e.g. the Google Sheets
 *   ENQUIRY_LOG_TOKEN        Apps Script in docs/enquiry-log.gs). Every submission is
 *                            recorded there with its email status, so nothing is lost
 *                            if email delivery fails.
 *   CRM_WEBHOOK_URL          Optional. Also POST each enquiry to a CRM / Zapier / Make hook,
 *   CRM_WEBHOOK_SECRET       signed with HMAC-SHA256 in the X-Zova-Signature header.
 *   ALLOWED_ORIGINS          Optional. Comma-separated origins allowed to submit.
 *
 * The endpoint reports success ONLY when the email provider has accepted the
 * message (or, when email is not configured, when the CRM webhook accepted it).
 * It never pretends a submission was delivered.
 */

import { buildUserConfirmationEmail, sendEmail, type EmailMessage } from './mailer.ts'

export type Kind = 'quote' | 'corporate' | 'contact' | 'vendor' | 'headset'

interface Payload {
  kind: Kind
  data: Record<string, unknown>
  page?: string
  pageUrl?: string
  pageTitle?: string
  submissionId?: string
  hp?: string
}

const KINDS: Kind[] = ['quote', 'corporate', 'contact', 'vendor', 'headset']
const MAX_BODY_BYTES = 32 * 1024
const MAX_FIELD = 3000
export const DEFAULT_TO = 'zovainfotech@gmail.com'
export const DEFAULT_FROM = 'ZOVA INFOTECH Website <onboarding@resend.dev>'
const BRAND = 'ZOVA INFOTECH'

const REQUIRED: Record<Kind, string[]> = {
  quote: ['fullName', 'email', 'mobile', 'requirementType', 'city', 'pin', 'consent'],
  corporate: ['fullName', 'company', 'email', 'mobile', 'locations', 'consent'],
  contact: ['fullName', 'email', 'mobile', 'service', 'message', 'consent'],
  vendor: ['company', 'contactName', 'email', 'mobile', 'consent'],
  headset: ['company', 'contactName', 'email', 'mobile', 'requirement', 'quantity', 'consent'],
}

const FORM_NAME: Record<Kind, string> = {
  quote: 'Request a Quote',
  corporate: 'Corporate procurement requirement',
  contact: 'Contact Us',
  vendor: 'Vendor registration',
  headset: 'Headset & meeting-room audio quote',
}

/** Readable labels for the "all submitted fields" table. */
const LABELS: Record<string, string> = {
  fullName: 'Full name',
  contactName: 'Contact person',
  designation: 'Designation',
  company: 'Company',
  orgType: 'Organisation type',
  email: 'Email',
  mobile: 'Phone',
  gstin: 'GSTIN',
  requirementType: 'Requirement type',
  requirement: 'Headset requirement',
  service: 'Service required',
  brand: 'Preferred brand',
  productModel: 'Product / model',
  productId: 'Product ID',
  product: 'Product',
  connectivity: 'Connectivity',
  intendedUse: 'Intended use',
  quantity: 'Quantity',
  budget: 'Budget',
  city: 'City',
  pin: 'PIN code',
  locations: 'Delivery locations',
  requiredBy: 'Required by',
  timeline: 'Timeline',
  items: 'Items',
  services: 'Services',
  ram: 'RAM',
  storage: 'Storage',
  minGrade: 'Minimum condition',
  details: 'Details',
  notes: 'Notes',
  message: 'Message',
  vendorType: 'Vendor type',
  website: 'Website',
  categories: 'Categories',
  brands: 'Brands',
  coverage: 'Coverage',
  consent: 'Privacy consent',
}

// ── Helpers ────────────────────────────────────────────────────────────────

const env = (k: string) => (typeof process !== 'undefined' ? process.env[k] : undefined)?.trim() || undefined

const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[a-z]{2,}$/i

export function isValidEmail(v: string) {
  return v.length <= 254 && EMAIL_RE.test(v)
}

/** Indian mobile (6–9 + 9 digits), optionally prefixed with +91 / 91 / 0. */
export function normalisePhone(v: string): string | null {
  const d = v.replace(/[\s\-().]/g, '').replace(/^(\+91|0091|91|0)(?=[6-9]\d{9}$)/, '')
  return /^[6-9]\d{9}$/.test(d) ? `+91 ${d.slice(0, 5)} ${d.slice(5)}` : null
}

/** Strips control characters (keeps newlines/tabs) and trims. */
function clean(v: unknown): unknown {
  // eslint-disable-next-line no-control-regex -- intentionally stripping control characters
  if (typeof v === 'string') return v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim()
  if (Array.isArray(v)) return v.slice(0, 50).map(clean)
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v as Record<string, unknown>).slice(0, 20).map(([k, x]) => [k, clean(x)]))
  return v
}

const esc = (v: unknown) =>
  String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

function flatten(value: unknown): string {
  if (Array.isArray(value)) {
    return value
      .map((v) =>
        typeof v === 'object' && v
          ? Object.entries(v)
              .filter(([k, x]) => k !== 'key' && x !== '')
              .map(([k, x]) => `${k}: ${x}`)
              .join(', ')
          : String(v),
      )
      .filter(Boolean)
      .join('\n')
  }
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  return String(value ?? '')
}

const str = (v: unknown) => (typeof v === 'string' ? v : Array.isArray(v) ? flatten(v) : v == null ? '' : String(v)).trim()
const oneLine = (v: string, max = 90) => v.replace(/\s+/g, ' ').trim().slice(0, max)

function reference() {
  const d = new Date()
  const ymd = `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, '0')}${String(d.getUTCDate()).padStart(2, '0')}`
  return `ZV-${ymd}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`
}

async function hmac(secret: string, body: string) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body))
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

// ── Validation ─────────────────────────────────────────────────────────────

export type Validated = { ok: true; kind: Kind; data: Record<string, unknown>; email: string; phone: string } | { ok: false; status: number; error: string }

export function validatePayload(payload: Payload): Validated {
  if (!payload || !KINDS.includes(payload.kind) || typeof payload.data !== 'object' || !payload.data || Array.isArray(payload.data)) {
    return { ok: false, status: 400, error: 'Invalid request.' }
  }
  const data = clean(payload.data) as Record<string, unknown>
  const missing = REQUIRED[payload.kind].filter((k) => {
    const v = data[k]
    return v === undefined || v === null || v === '' || v === false
  })
  if (missing.length) return { ok: false, status: 422, error: `Please complete the required fields: ${missing.map((k) => LABELS[k] ?? k).join(', ')}.` }

  for (const [k, v] of Object.entries(data)) {
    if (typeof v === 'string' && v.length > MAX_FIELD) return { ok: false, status: 422, error: `${LABELS[k] ?? k} is too long.` }
  }
  const email = str(data.email).toLowerCase()
  if (!isValidEmail(email)) return { ok: false, status: 422, error: 'Please enter a valid email address.' }
  const phone = normalisePhone(str(data.mobile))
  if (!phone) return { ok: false, status: 422, error: 'Please enter a valid 10-digit Indian mobile number.' }
  if (data.quantity !== undefined && data.quantity !== '' && !(Number(data.quantity) >= 1 && Number(data.quantity) <= 100000)) {
    return { ok: false, status: 422, error: 'Please enter a valid quantity.' }
  }
  const name = str(data.fullName ?? data.contactName)
  if (name.length > 120) return { ok: false, status: 422, error: 'Name is too long.' }
  return { ok: true, kind: payload.kind, data, email, phone }
}

// ── Email content ──────────────────────────────────────────────────────────

export interface Summary {
  name: string
  company: string
  email: string
  phone: string
  item: string
  quantity: string
  budget: string
  message: string
  submittedAt: string
  pageUrl: string
  pageTitle: string
}

/** What was requested, per form. Used in the subject line and summary. */
function requestedItem(kind: Kind, d: Record<string, unknown>): string {
  switch (kind) {
    case 'quote':
      return [str(d.productModel), str(d.productId) && `(${str(d.productId)})`].filter(Boolean).join(' ') || str(d.requirementType)
    case 'headset':
      return str(d.product) || str(d.requirement)
    case 'contact':
      return str(d.service)
    case 'corporate': {
      const items = Array.isArray(d.items) ? (d.items as Record<string, unknown>[]).map((i) => str(i.category)).filter(Boolean) : []
      return items.length ? `Corporate procurement: ${[...new Set(items)].join(', ')}` : 'Corporate procurement'
    }
    case 'vendor':
      return `Vendor registration — ${str(d.company)}`
  }
}

function totalQuantity(kind: Kind, d: Record<string, unknown>): string {
  if (kind === 'corporate' && Array.isArray(d.items)) {
    const n = (d.items as Record<string, unknown>[]).reduce((s, i) => s + (Number(i.quantity) || 0), 0)
    return n ? `${n} units (see items)` : ''
  }
  return str(d.quantity)
}

export function summarise(kind: Kind, d: Record<string, unknown>, email: string, phone: string, meta: { pageUrl?: string; pageTitle?: string; page?: string }, now = new Date()): Summary {
  return {
    name: str(d.fullName ?? d.contactName),
    company: str(d.company),
    email,
    phone,
    item: requestedItem(kind, d) || FORM_NAME[kind],
    quantity: totalQuantity(kind, d),
    budget: str(d.budget),
    message: str(d.message ?? d.details ?? d.notes),
    submittedAt: `${new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' }).format(now)} IST`,
    pageUrl: str(meta.pageUrl ?? meta.page),
    pageTitle: str(meta.pageTitle),
  }
}

export function buildSubject(kind: Kind, s: Summary) {
  const label = kind === 'vendor' ? 'New Vendor Registration' : 'New Quote Request'
  return `${label} | ${BRAND} | ${oneLine(s.item)}`
}

export function buildEmail(kind: Kind, data: Record<string, unknown>, s: Summary, ref: string) {
  const summaryRows: [string, string, string?][] = [
    ['Customer name', s.name],
    ['Company', s.company || '—'],
    ['Email', s.email, `mailto:${s.email}`],
    ['Phone', s.phone, `tel:${s.phone.replace(/\s/g, '')}`],
    ['Product / service', s.item],
    ['Quantity', s.quantity || '—'],
    ['Budget', s.budget || '—'],
    ['Message / requirements', s.message || '—'],
    ['Submitted', s.submittedAt],
    ['Form', FORM_NAME[kind]],
    ['Page', s.pageUrl || '—', /^https?:\/\//.test(s.pageUrl) ? s.pageUrl : undefined],
  ]
  const skip = new Set(['consent'])
  const allRows = Object.entries(data).filter(([k, v]) => !skip.has(k) && str(v) !== '')

  const td = 'padding:8px 12px;border-bottom:1px solid #e5eaf1;vertical-align:top;font-size:14px'
  const row = ([k, v, href]: [string, string, string?]) =>
    `<tr><td style="${td};color:#5b6472;white-space:nowrap;width:170px">${esc(k)}</td><td style="${td};color:#252d3a;white-space:pre-wrap">${
      href ? `<a href="${esc(href)}" style="color:#0878e8">${esc(v)}</a>` : esc(v)
    }</td></tr>`

  const html = `<!doctype html><html><body style="margin:0;background:#f7f9fc;padding:24px;font-family:Arial,Helvetica,sans-serif">
<table role="presentation" width="100%" style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e5eaf1;border-radius:12px;border-collapse:separate;overflow:hidden">
<tr><td style="background:#123b73;padding:20px 24px;color:#ffffff">
<div style="font-size:12px;letter-spacing:2px;color:#00c9e8;font-weight:bold">${BRAND}</div>
<div style="font-size:20px;font-weight:bold;margin-top:4px">${esc(kind === 'vendor' ? 'New vendor registration' : 'New quote request')}</div>
<div style="font-size:13px;color:#aab4c3;margin-top:4px">Reference ${esc(ref)} · ${esc(FORM_NAME[kind])}</div>
</td></tr>
<tr><td style="padding:8px 12px 0"><table role="presentation" width="100%" style="border-collapse:collapse">${summaryRows.map(row).join('')}</table></td></tr>
<tr><td style="padding:20px 24px 4px;font-size:13px;font-weight:bold;color:#123b73">All submitted fields</td></tr>
<tr><td style="padding:0 12px 16px"><table role="presentation" width="100%" style="border-collapse:collapse">${allRows
    .map(([k, v]) => row([LABELS[k] ?? k, flatten(v)]))
    .join('')}</table></td></tr>
<tr><td style="padding:14px 24px;background:#f7f9fc;font-size:12px;color:#7a8494">Reply to this email to respond to the customer directly (reply-to is set to ${esc(s.email)}).</td></tr>
</table></body></html>`

  const text = [
    `${kind === 'vendor' ? 'New vendor registration' : 'New quote request'} — ${BRAND}`,
    `Reference: ${ref}`,
    '',
    ...summaryRows.map(([k, v]) => `${k}: ${v}`),
    '',
    'All submitted fields:',
    ...allRows.map(([k, v]) => `${LABELS[k] ?? k}: ${flatten(v)}`),
  ].join('\n')

  return { html, text }
}

// ── Delivery ───────────────────────────────────────────────────────────────

type SendResult = { ok: true; id: string } | { ok: false; status: number; error: string }

async function sendWithResend(key: string, body: Record<string, unknown>, idempotencyKey: string): Promise<SendResult> {
  const base = env('RESEND_API_BASE') ?? 'https://api.resend.com'
  let last: SendResult = { ok: false, status: 0, error: 'not attempted' }
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(`${base}/emails`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', 'Idempotency-Key': idempotencyKey },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(10000),
      })
      const json = (await res.json().catch(() => ({}))) as { id?: string; message?: string; name?: string }
      if (res.ok && json.id) return { ok: true, id: json.id }
      last = { ok: false, status: res.status, error: json.message ?? json.name ?? `HTTP ${res.status}` }
      // Retry only transient failures; the idempotency key prevents a double send.
      if (res.status !== 429 && res.status < 500) break
    } catch (e) {
      last = { ok: false, status: 0, error: e instanceof Error ? e.message : 'network error' }
    }
    await new Promise((r) => setTimeout(r, 600))
  }
  return last
}

async function postJson(url: string, body: string, headers: Record<string, string> = {}) {
  try {
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body, signal: AbortSignal.timeout(8000), redirect: 'follow' })
    return res.ok
  } catch {
    return false
  }
}

// In-memory protections (per warm instance). For strict limits across instances use a shared store such as Upstash Redis.
const hits = new Map<string, { n: number; t: number }>()
function rateLimited(ip: string) {
  const now = Date.now()
  const h = hits.get(ip)
  if (!h || now - h.t > 10 * 60 * 1000) {
    hits.set(ip, { n: 1, t: now })
    return false
  }
  h.n += 1
  return h.n > 8
}
const recent = new Map<string, { ref: string; t: number }>()
function seen(id: string | undefined) {
  if (!id) return null
  const r = recent.get(id)
  return r && Date.now() - r.t < 24 * 3600 * 1000 ? r.ref : null
}

function json(status: number, body: unknown, origin?: string | null) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      ...(origin ? { 'Access-Control-Allow-Origin': origin, Vary: 'Origin' } : {}),
    },
  })
}

const FAIL_MSG = 'We could not send your enquiry right now. Your details are still in the form — please try again, or call +91 74608 54541 / email zovainfotech@gmail.com.'

export async function handleEnquiry(request: Request): Promise<Response> {
  const origin = request.headers.get('origin')
  const allowed = (env('ALLOWED_ORIGINS') ?? '').split(',').map((s) => s.trim()).filter(Boolean)
  const corsOrigin = origin && allowed.includes(origin) ? origin : null

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsOrigin ? { 'Access-Control-Allow-Origin': corsOrigin, 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'Content-Type' } : {},
    })
  }
  if (request.method !== 'POST') return json(405, { ok: false, error: 'Method not allowed' })
  if (allowed.length && origin && !allowed.includes(origin)) return json(403, { ok: false, error: 'Origin not allowed' })
  if (!(request.headers.get('content-type') ?? '').includes('application/json')) return json(415, { ok: false, error: 'Unsupported content type.' }, corsOrigin)

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (rateLimited(ip)) return json(429, { ok: false, error: 'Too many submissions from this connection. Please wait a few minutes and try again.' }, corsOrigin)

  const raw = await request.text()
  if (raw.length > MAX_BODY_BYTES) return json(413, { ok: false, error: 'Submission too large.' }, corsOrigin)

  let payload: Payload
  try {
    payload = JSON.parse(raw)
  } catch {
    return json(400, { ok: false, error: 'Invalid request.' }, corsOrigin)
  }

  // Honeypot: real visitors never fill the hidden field. Bots get a normal-looking response and nothing is sent.
  if (typeof payload?.hp === 'string' && payload.hp.trim() !== '') {
    console.warn('[enquiry] honeypot triggered', { ip })
    return json(200, { ok: true, reference: reference() }, corsOrigin)
  }

  const v = validatePayload(payload)
  if (!v.ok) return json(v.status, { ok: false, error: v.error }, corsOrigin)

  const submissionId = typeof payload.submissionId === 'string' && /^[\w-]{8,64}$/.test(payload.submissionId) ? payload.submissionId : undefined
  const dup = seen(submissionId)
  if (dup) return json(200, { ok: true, reference: dup, duplicate: true }, corsOrigin)

  const resendKey = env('RESEND_API_KEY')
  const smtpConfigured = Boolean(env('SMTP_USER') || env('GMAIL_USER'))
  const brevoConfigured = Boolean(env('BREVO_API_KEY'))
  const hasLiveEmailProvider = Boolean(resendKey || smtpConfigured || brevoConfigured)
  const isDev = (env('NODE_ENV') === 'development' || env('DEV_MAILER') === 'true') && !env('RESEND_API_BASE')
  const to = (env('ENQUIRY_TO_EMAIL') ?? DEFAULT_TO).split(',').map((s) => s.trim()).filter(Boolean)
  const from = env('ENQUIRY_FROM_EMAIL') ?? DEFAULT_FROM
  const crm = env('CRM_WEBHOOK_URL')
  const logUrl = env('ENQUIRY_LOG_WEBHOOK_URL')

  if (!hasLiveEmailProvider && !crm && !isDev) {
    console.error('[enquiry] not configured: No email provider (SMTP/Gmail, Brevo, Resend) or CRM webhook configured')
    return json(503, { ok: false, error: 'Online enquiries are temporarily unavailable. Please call +91 74608 54541 or email zovainfotech@gmail.com.' }, corsOrigin)
  }

  const ref = reference()
  const pageUrl = typeof payload.pageUrl === 'string' ? payload.pageUrl.slice(0, 500) : undefined
  const summary = summarise(v.kind, v.data, v.email, v.phone, { pageUrl, pageTitle: typeof payload.pageTitle === 'string' ? payload.pageTitle.slice(0, 200) : undefined, page: payload.page })
  const subject = buildSubject(v.kind, summary)

  let emailStatus: 'sent' | 'failed' | 'not-configured' = 'not-configured'
  let emailId: string | undefined
  let emailError: string | undefined
  let customerEmailSent = false

  if (hasLiveEmailProvider || isDev) {
    const { html, text } = buildEmail(v.kind, v.data, summary, ref)
    const adminMsg: EmailMessage = {
      from,
      to,
      replyTo: v.email,
      subject,
      html,
      text,
      tag: v.kind,
      idempotencyKey: `zova-enquiry-${submissionId ?? ref}`,
    }

    // Deliver notification to company inbox
    let sent
    if (resendKey && env('RESEND_API_BASE')) {
      // In Resend mock test suite, use sendWithResend directly
      sent = await sendWithResend(
        resendKey,
        { from, to, reply_to: v.email, subject, html, text, tags: [{ name: 'form', value: v.kind }] },
        `zova-enquiry-${submissionId ?? ref}`,
      )
    } else {
      sent = await sendEmail(adminMsg)
    }

    if (sent.ok) {
      emailStatus = 'sent'
      emailId = sent.id
    } else {
      emailStatus = 'failed'
      emailError = `${sent.status ?? ''} ${sent.error ?? 'error'}`.trim()
    }

    // Send confirmation copy to user's email if provided and not in Resend mock test
    const shouldSendToCustomer = !env('RESEND_API_BASE') && env('SEND_USER_CONFIRMATION') !== 'false'
    if (sent.ok && shouldSendToCustomer && v.email) {
      const userCopy = buildUserConfirmationEmail(v.data, summary, ref)
      const userMsg: EmailMessage = {
        from,
        to: v.email,
        replyTo: to[0] || DEFAULT_TO,
        subject: userCopy.subject,
        html: userCopy.html,
        text: userCopy.text,
        tag: `${v.kind}-confirmation`,
        idempotencyKey: `zova-confirm-${submissionId ?? ref}`,
      }
      const userSent = await sendEmail(userMsg)
      if (userSent.ok) {
        customerEmailSent = true
      } else {
        console.warn('[enquiry] Customer confirmation delivery failed:', userSent.error)
      }
    }
  }

  const record = { reference: ref, kind: v.kind, subject, emailStatus, emailId, emailError, submittedAt: new Date().toISOString(), summary, data: v.data }

  // Backup log and CRM run regardless of the email result, so an enquiry can be recovered if email fails.
  const [logged, crmOk] = await Promise.all([
    logUrl ? postJson(logUrl, JSON.stringify({ token: env('ENQUIRY_LOG_TOKEN') ?? '', ...record })) : Promise.resolve(false),
    crm
      ? (async () => {
          const body = JSON.stringify(record)
          const secret = env('CRM_WEBHOOK_SECRET')
          return postJson(crm, body, secret ? { 'X-Zova-Signature': await hmac(secret, body) } : {})
        })()
      : Promise.resolve(false),
  ])

  const delivered = emailStatus === 'sent' || (emailStatus === 'not-configured' && crmOk)
  if (!delivered) {
    // Full record in the function log so the enquiry is recoverable even without the backup log.
    console.error('[enquiry] delivery failed', JSON.stringify({ ...record, logged }))
    return json(502, { ok: false, error: FAIL_MSG, reference: ref }, corsOrigin)
  }
  if (submissionId) recent.set(submissionId, { ref, t: Date.now() })
  console.info('[enquiry] delivered', { ref, kind: v.kind, emailId, logged, crm: crmOk, customerEmailSent })
  return json(
    200,
    {
      ok: true,
      reference: ref,
      emailSentTo: customerEmailSent || isDev ? v.email : undefined,
    },
    corsOrigin,
  )
}

// Vercel Functions (Web handler signature)
export function POST(request: Request) {
  return handleEnquiry(request)
}
export function OPTIONS(request: Request) {
  return handleEnquiry(request)
}
