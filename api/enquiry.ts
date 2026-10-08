/**
 * SERVER-SIDE ENQUIRY ENDPOINT — /api/enquiry
 * ---------------------------------------------------------------------------
 * Receives all enquiry forms on the website (Request a Quote, Corporate procurement,
 * Contact Us, Vendor registration, Headset quotes) and emails a notification to
 * the business inbox.
 *
 * Fully self-contained Serverless Function compatible with:
 * 1. Vercel Serverless Function (Node.js runtime via default export handler(req, res))
 * 2. Web standard runtimes (Next.js / Cloudflare / Vite dev server via Request/Response)
 *
 * Supported email providers:
 * - Gmail SMTP (via Nodemailer)
 * - Brevo (Sendinblue) REST API
 * - Resend REST API
 * - CRM / Webhooks (Zapier, Make, n8n, Google Sheets)
 */

import nodemailer from 'nodemailer'

export type Kind = 'quote' | 'corporate' | 'contact' | 'vendor' | 'headset'

export interface EmailMessage {
  from?: string
  to: string | string[]
  replyTo?: string
  subject: string
  html: string
  text: string
  tag?: string
  idempotencyKey?: string
}

export interface SendEmailResult {
  ok: boolean
  id?: string
  status?: number
  error?: string
  provider: 'smtp' | 'brevo' | 'resend' | 'dev-simulation'
  previewNotice?: string
}

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

export function normalisePhone(v: string): string | null {
  const d = v.replace(/[\s\-().]/g, '').replace(/^(\+91|0091|91|0)(?=[6-9]\d{9}$)/, '')
  return /^[6-9]\d{9}$/.test(d) ? `+91 ${d.slice(0, 5)} ${d.slice(5)}` : null
}

function reference(now = new Date()) {
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  const r = typeof crypto !== 'undefined' && 'getRandomValues' in crypto
    ? Array.from(crypto.getRandomValues(new Uint8Array(3)))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')
        .toUpperCase()
    : Math.random().toString(16).slice(2, 8).toUpperCase()
  return `ZV-${y}${m}${d}-${r}`
}

function esc(v: unknown): string {
  return String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function oneLine(v: string) {
  return v.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim()
}

function str(v: unknown): string {
  if (Array.isArray(v)) return v.join(', ')
  return String(v ?? '').trim()
}

/** Strips control characters (keeps newlines/tabs) and trims. */
function clean(v: unknown): unknown {
  if (typeof v === 'string') return v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim()
  if (Array.isArray(v)) return v.slice(0, 50).map(clean)
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v as Record<string, unknown>).slice(0, 20).map(([k, x]) => [k, clean(x)]))
  return v
}

function flatten(v: unknown): string {
  if (Array.isArray(v)) {
    if (v.every((item) => typeof item === 'object' && item !== null)) {
      return v
        .map((item, idx) => {
          const lines = Object.entries(item)
            .filter(([k]) => k !== 'key')
            .map(([k, val]) => `${k}: ${val}`)
            .join(', ')
          return `#${idx + 1}: ${lines}`
        })
        .join('\n')
    }
    return v.join(', ')
  }
  return String(v ?? '').trim()
}

async function hmac(secret: string, text: string) {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(text))
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

// ── Validation ─────────────────────────────────────────────────────────────

type Validated =
  | { ok: true; kind: Kind; data: Record<string, unknown>; email: string; phone: string }
  | { ok: false; status: number; error: string }

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

// ── Presentation & Templates ───────────────────────────────────────────────

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

function requestedItem(kind: Kind, d: Record<string, unknown>): string {
  if (kind === 'quote') {
    const model = str(d.productModel)
    const id = str(d.productId)
    if (model && id) return `${model} (${id})`
    if (model) return model
    return str(d.requirementType)
  }
  if (kind === 'headset') {
    const prod = str(d.product)
    if (prod) return prod
    const brand = str(d.brand)
    const req = str(d.requirement)
    return brand && req ? `${brand} — ${req}` : req || brand
  }
  if (kind === 'corporate') {
    const items = Array.isArray(d.items) ? d.items : []
    const cats = items.map((it) => (typeof it === 'object' && it && 'category' in it ? String((it as { category: unknown }).category) : '')).filter(Boolean)
    const unique = Array.from(new Set(cats))
    return unique.length ? `Corporate procurement: ${unique.join(', ')}` : 'Corporate procurement'
  }
  if (kind === 'contact') return str(d.service) || 'General enquiry'
  if (kind === 'vendor') return `Vendor registration — ${str(d.company)}`
  return ''
}

function totalQuantity(kind: Kind, d: Record<string, unknown>): string {
  if (kind === 'corporate' && Array.isArray(d.items)) {
    const total = d.items.reduce((sum, it) => {
      const q = typeof it === 'object' && it && 'quantity' in it ? Number((it as { quantity: unknown }).quantity) : 0
      return sum + (Number.isFinite(q) && q > 0 ? q : 0)
    }, 0)
    return total > 0 ? `${total} units across line items` : str(d.quantity)
  }
  return str(d.quantity)
}

function summarise(
  kind: Kind,
  d: Record<string, unknown>,
  email: string,
  phone: string,
  meta: { pageUrl?: string; pageTitle?: string; page?: string },
  now = new Date(),
): Summary {
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

export function buildUserConfirmationEmail(
  data: Record<string, unknown>,
  summary: Summary,
  ref: string,
) {
  const subject = `Quote Request Received — ${ref} | ${BRAND}`

  const detailsRows: [string, string][] = [
    ['Reference ID', ref],
    ['Requirement', summary.item],
    ['Quantity', summary.quantity || '1 unit'],
    ['Target budget', summary.budget || 'To be confirmed'],
    ['Delivery city', str(data.city) ? `${str(data.city)}${str(data.pin) ? ` – ${str(data.pin)}` : ''}` : '—'],
    ['Required by', str(data.requiredBy) || 'Standard timeline'],
    ['Submitted on', summary.submittedAt],
  ]

  if (summary.company) {
    detailsRows.splice(1, 0, ['Company', summary.company])
  }

  if (summary.message) {
    detailsRows.push(['Specifications / Notes', summary.message])
  }

  const td = 'padding:10px 14px;border-bottom:1px solid #eef2f7;vertical-align:top;font-size:14px'
  const rowHtml = detailsRows
    .map(
      ([k, v]) =>
        `<tr><td style="${td};color:#64748b;width:180px;font-weight:500">${esc(k)}</td><td style="${td};color:#0f172a;font-weight:600;white-space:pre-wrap">${esc(v)}</td></tr>`,
    )
    .join('')

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(subject)}</title>
</head>
<body style="margin:0;padding:24px 12px;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1e293b">
  <table role="presentation" width="100%" style="max-width:620px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 10px 25px -5px rgba(0,0,0,0.05)">
    <tr>
      <td style="background:linear-gradient(135deg, #080D1F 0%, #123b73 100%);padding:32px 28px;color:#ffffff">
        <div style="font-size:12px;letter-spacing:2px;color:#23D5FF;font-weight:800;text-transform:uppercase">${BRAND}</div>
        <h1 style="margin:10px 0 0 0;font-size:24px;font-weight:700;line-height:1.2;color:#ffffff">Quotation Request Received</h1>
        <div style="margin-top:8px;display:inline-block;padding:4px 12px;background:rgba(35,213,255,0.15);border:1px solid rgba(35,213,255,0.3);border-radius:20px;font-size:13px;color:#23D5FF;font-family:monospace">Ref: ${esc(ref)}</div>
      </td>
    </tr>
    <tr>
      <td style="padding:28px">
        <p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;color:#334155">
          Dear <strong>${esc(summary.name)}</strong>,
        </p>
        <p style="margin:0 0 20px 0;font-size:15px;line-height:1.6;color:#334155">
          Thank you for reaching out to <strong>ZOVA INFOTECH</strong>. We have successfully received your quotation request for <strong>${esc(summary.item)}</strong>.
        </p>
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;margin-bottom:24px">
          <div style="background:#f1f5f9;padding:10px 16px;font-size:12px;font-weight:700;letter-spacing:0.5px;color:#475569;text-transform:uppercase">
            Request Details
          </div>
          <table role="presentation" width="100%" style="border-collapse:collapse">
            ${rowHtml}
          </table>
        </div>
        <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;padding:18px 20px;margin-bottom:24px">
          <div style="font-size:14px;font-weight:700;color:#1e40af;margin-bottom:8px">What happens next?</div>
          <ol style="margin:0;padding-left:20px;font-size:13px;line-height:1.6;color:#1e3a8a">
            <li style="margin-bottom:6px"><strong>Requirement Analysis:</strong> Our enterprise procurement team verifies models, specifications, and warranty options.</li>
            <li style="margin-bottom:6px"><strong>Partner Sourcing:</strong> We check pricing across our authorized distributor network to secure the best rates.</li>
            <li><strong>Official Quotation:</strong> An itemised quotation with availability and delivery schedule will be dispatched to this email address.</li>
          </ol>
        </div>
        <p style="margin:0 0 8px 0;font-size:14px;font-weight:600;color:#0f172a">Need immediate assistance or have urgent timelines?</p>
        <p style="margin:0;font-size:13px;line-height:1.6;color:#64748b">
          📞 Call / WhatsApp: <a href="tel:+917460854541" style="color:#2563eb;text-decoration:none;font-weight:600">+91 74608 54541</a><br>
          ✉️ Email: <a href="mailto:Zovainfotech@gmail.com" style="color:#2563eb;text-decoration:none;font-weight:600">Zovainfotech@gmail.com</a>
        </p>
      </td>
    </tr>
    <tr>
      <td style="background:#f8fafc;padding:20px 28px;border-top:1px solid #e2e8f0;text-align:center;font-size:12px;color:#94a3b8;line-height:1.5">
        <strong>${BRAND} Pvt. Ltd.</strong> · Complete IT Solutions &amp; Procurement Partner<br>
        D Block, Sector 22, Noida, Uttar Pradesh – 201301, India
      </td>
    </tr>
  </table>
</body>
</html>`

  const text = [
    `Quotation Request Received — ${BRAND}`,
    `Reference: ${ref}`,
    '',
    `Dear ${summary.name},`,
    '',
    `Thank you for reaching out to ZOVA INFOTECH. We have safely received your quotation request for: ${summary.item}.`,
    '',
    'REQUEST SUMMARY:',
    ...detailsRows.map(([k, v]) => `• ${k}: ${v}`),
    '',
    'WHAT HAPPENS NEXT:',
    '1. Our enterprise procurement specialists analyze your specifications.',
    '2. We source options across our authorized partner network.',
    '3. An itemised quotation will be emailed to you shortly.',
    '',
    'NEED IMMEDIATE HELP?',
    'Phone / WhatsApp: +91 74608 54541',
    'Email: Zovainfotech@gmail.com',
    '',
    `${BRAND} Pvt. Ltd. · D Block, Sector 22, Noida, Uttar Pradesh – 201301`,
  ].join('\n')

  return { subject, html, text }
}

// ── Email Providers ────────────────────────────────────────────────────────

async function sendWithSmtp(msg: EmailMessage): Promise<SendEmailResult> {
  const host = env('SMTP_HOST')
  const user = env('SMTP_USER') || env('GMAIL_USER')
  const pass = (env('SMTP_PASS') || env('GMAIL_APP_PASSWORD'))?.replace(/\s+/g, '')

  if (!user || !pass) {
    return { ok: false, provider: 'smtp', error: 'SMTP credentials missing' }
  }

  const isGmail = !host || host === 'smtp.gmail.com' || Boolean(env('GMAIL_USER'))
  const port = Number(env('SMTP_PORT') || (env('SMTP_SECURE') === 'true' ? 465 : (isGmail ? 465 : 587)))
  const secure = env('SMTP_SECURE') === 'true' || port === 465

  const isResendPlaceholder = msg.from?.includes('onboarding@resend.dev')
  const defaultFrom = `"ZOVA INFOTECH" <${user}>`
  const from = (!isResendPlaceholder && msg.from) || env('SMTP_FROM') || env('ENQUIRY_FROM_EMAIL') || defaultFrom

  try {
    const transportConfig = isGmail && !env('SMTP_HOST')
      ? {
          service: 'gmail',
          auth: { user, pass },
          connectionTimeout: 10000,
          greetingTimeout: 10000,
          socketTimeout: 15000,
        }
      : {
          host: host || 'smtp.gmail.com',
          port,
          secure,
          auth: { user, pass },
          tls: {
            rejectUnauthorized: false,
          },
          connectionTimeout: 10000,
          greetingTimeout: 10000,
          socketTimeout: 15000,
        }

    const transporter = nodemailer.createTransport(transportConfig)

    const info = await transporter.sendMail({
      from,
      to: Array.isArray(msg.to) ? msg.to.join(', ') : msg.to,
      replyTo: msg.replyTo,
      subject: msg.subject,
      html: msg.html,
      text: msg.text,
    })

    return {
      ok: true,
      provider: 'smtp',
      id: info.messageId,
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err)
    return {
      ok: false,
      provider: 'smtp',
      error: errorMsg,
    }
  }
}

async function sendWithBrevo(key: string, msg: EmailMessage): Promise<SendEmailResult> {
  const fromEmail = env('BREVO_FROM_EMAIL') || env('ENQUIRY_FROM_EMAIL') || 'zovainfotech@gmail.com'
  const toList = (Array.isArray(msg.to) ? msg.to : [msg.to]).map((email) => ({ email: email.trim() }))

  try {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': key,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: BRAND, email: fromEmail },
        to: toList,
        replyTo: msg.replyTo ? { email: msg.replyTo } : undefined,
        subject: msg.subject,
        htmlContent: msg.html,
        textContent: msg.text,
        tags: msg.tag ? [msg.tag] : undefined,
      }),
      signal: AbortSignal.timeout(10000),
    })

    const data = (await res.json().catch(() => ({}))) as { messageId?: string; message?: string }
    if (res.ok && data.messageId) {
      return { ok: true, provider: 'brevo', id: data.messageId }
    }
    return { ok: false, provider: 'brevo', status: res.status, error: data.message || `HTTP ${res.status}` }
  } catch (err) {
    return { ok: false, provider: 'brevo', error: err instanceof Error ? err.message : 'Brevo network error' }
  }
}

async function sendWithResend(key: string, msg: EmailMessage): Promise<SendEmailResult> {
  const base = env('RESEND_API_BASE') ?? 'https://api.resend.com'
  const from = msg.from || env('ENQUIRY_FROM_EMAIL') || DEFAULT_FROM
  const to = Array.isArray(msg.to) ? msg.to : [msg.to]

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(`${base}/emails`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
          ...(msg.idempotencyKey ? { 'Idempotency-Key': msg.idempotencyKey } : {}),
        },
        body: JSON.stringify({
          from,
          to,
          reply_to: msg.replyTo,
          subject: msg.subject,
          html: msg.html,
          text: msg.text,
          tags: msg.tag ? [{ name: 'form', value: msg.tag }] : undefined,
        }),
        signal: AbortSignal.timeout(10000),
      })
      const json = (await res.json().catch(() => ({}))) as { id?: string; message?: string; name?: string }
      if (res.ok && json.id) return { ok: true, provider: 'resend', id: json.id }
      if (res.status !== 429 && res.status < 500) {
        return { ok: false, provider: 'resend', status: res.status, error: json.message ?? json.name ?? `HTTP ${res.status}` }
      }
    } catch (e) {
      if (attempt === 1) {
        return { ok: false, provider: 'resend', error: e instanceof Error ? e.message : 'network error' }
      }
    }
    await new Promise((r) => setTimeout(r, 600))
  }
  return { ok: false, provider: 'resend', error: 'Resend delivery failed' }
}

export async function sendEmail(msg: EmailMessage): Promise<SendEmailResult> {
  const isSmtp = Boolean(env('SMTP_USER') || env('GMAIL_USER'))
  const isBrevo = Boolean(env('BREVO_API_KEY'))
  const isResend = Boolean(env('RESEND_API_KEY'))

  if (isSmtp) {
    return sendWithSmtp(msg)
  }

  if (isBrevo) {
    return sendWithBrevo(env('BREVO_API_KEY')!, msg)
  }

  if (isResend) {
    return sendWithResend(env('RESEND_API_KEY')!, msg)
  }

  const isDev = (env('NODE_ENV') === 'development' || env('DEV_MAILER') === 'true') && !env('RESEND_API_BASE')
  if (isDev) {
    const toStr = Array.isArray(msg.to) ? msg.to.join(', ') : msg.to
    console.info(`\n📧 [DEV MAILER SIMULATION] Email to: ${toStr}`)
    console.info(`   Subject: ${msg.subject}`)
    return {
      ok: true,
      provider: 'dev-simulation',
      id: `dev-${Date.now()}`,
    }
  }

  return {
    ok: false,
    provider: 'dev-simulation',
    error: 'No email provider configured. Please set GMAIL_USER/GMAIL_APP_PASSWORD, BREVO_API_KEY, or RESEND_API_KEY.',
  }
}

// ── Main Enquiry Handlers ──────────────────────────────────────────────────

async function postJson(url: string, body: string, headers: Record<string, string> = {}) {
  try {
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body, signal: AbortSignal.timeout(8000), redirect: 'follow' })
    return res.ok
  } catch {
    return false
  }
}

// In-memory protections (per warm instance)
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

/** Configuration status without revealing secrets: GET /api/enquiry */
function health(corsOrigin?: string | null) {
  const smtpConfigured = Boolean(env('SMTP_USER') || env('GMAIL_USER'))
  const brevoConfigured = Boolean(env('BREVO_API_KEY'))
  const resendKey = env('RESEND_API_KEY')
  const provider = smtpConfigured ? 'gmail-smtp' : brevoConfigured ? 'brevo' : resendKey ? 'resend' : 'none'

  return json(
    200,
    {
      ok: true,
      service: 'ZOVA INFOTECH enquiry endpoint',
      emailProvider: provider,
      configured: Boolean(smtpConfigured || brevoConfigured || resendKey),
      to: (env('ENQUIRY_TO_EMAIL') ?? DEFAULT_TO).split(',').map((s) => s.trim()),
      from: env('ENQUIRY_FROM_EMAIL') || (smtpConfigured ? `"ZOVA INFOTECH" <${env('GMAIL_USER') || env('SMTP_USER')}>` : DEFAULT_FROM),
      backupLog: env('ENQUIRY_LOG_WEBHOOK_URL') ? 'set' : 'not set',
    },
    corsOrigin,
  )
}

export async function handleEnquiry(request: Request): Promise<Response> {
  const origin = request.headers.get('origin')
  const allowed = (env('ALLOWED_ORIGINS') ?? '').split(',').map((s) => s.trim()).filter(Boolean)
  const corsOrigin = allowed.length ? (origin && allowed.includes(origin) ? origin : null) : (origin || '*')

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsOrigin
        ? {
            'Access-Control-Allow-Origin': corsOrigin,
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        : {},
    })
  }

  if (request.method === 'GET') {
    return health(corsOrigin)
  }

  if (request.method !== 'POST') return json(405, { ok: false, error: 'Method not allowed' }, corsOrigin)
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
  const defaultFrom = (env('GMAIL_USER') || env('SMTP_USER'))
    ? `"ZOVA INFOTECH" <${env('GMAIL_USER') || env('SMTP_USER')}>`
    : DEFAULT_FROM
  const from = env('ENQUIRY_FROM_EMAIL') ?? defaultFrom
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
        adminMsg,
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

/**
 * Universal Serverless Function Handler
 * Compatible with both:
 * 1. Node.js runtime (Vercel Serverless Functions on `@vercel/node` passing `(req, res)`)
 * 2. Web Standard runtime (passing `Request`)
 */
export default async function handler(req: any, res?: any) {
  // If called by Node runtime (Vercel Serverless Function passing req and res)
  if (res && (typeof res.status === 'function' || typeof res.statusCode === 'number')) {
    try {
      const host = req.headers?.['x-forwarded-host'] || req.headers?.host || 'localhost'
      const proto = (req.headers?.['x-forwarded-proto'] as string) || 'https'
      const fullUrl = `${proto}://${host}${req.url || '/api/enquiry'}`

      const headers = new Headers()
      if (req.headers) {
        for (const [key, value] of Object.entries(req.headers)) {
          if (value !== undefined) {
            if (Array.isArray(value)) {
              for (const v of value) headers.append(key, v)
            } else {
              headers.set(key, String(value))
            }
          }
        }
      }

      let bodyString: string | undefined = undefined
      const method = (req.method || 'POST').toUpperCase()
      if (!['GET', 'HEAD'].includes(method)) {
        if (req.body !== undefined && req.body !== null) {
          bodyString = typeof req.body === 'string' ? req.body : JSON.stringify(req.body)
        } else {
          const chunks: Buffer[] = []
          for await (const chunk of req) {
            chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
          }
          bodyString = Buffer.concat(chunks).toString('utf-8')
        }
      }

      const webReq = new Request(fullUrl, {
        method,
        headers,
        body: bodyString,
      })

      const webRes = await handleEnquiry(webReq)

      if (typeof res.status === 'function') {
        res.status(webRes.status)
      } else {
        res.statusCode = webRes.status
      }

      webRes.headers.forEach((value, key) => {
        res.setHeader(key, value)
      })

      const resText = await webRes.text()
      if (typeof res.send === 'function') {
        res.send(resText)
      } else {
        res.end(resText)
      }
      return
    } catch (err) {
      console.error('[enquiry] Node handler error:', err)
      if (typeof res.status === 'function') {
        res.status(500)
      } else {
        res.statusCode = 500
      }
      res.setHeader('Content-Type', 'application/json')
      const text = JSON.stringify({ ok: false, error: FAIL_MSG })
      if (typeof res.send === 'function') {
        res.send(text)
      } else {
        res.end(text)
      }
      return
    }
  }

  // If called as a Web standard Request handler (no res object provided)
  return handleEnquiry(req)
}

// Named exports for Web standard handlers
export function GET(request: Request) {
  return handleEnquiry(request)
}
export function POST(request: Request) {
  return handleEnquiry(request)
}
export function OPTIONS(request: Request) {
  return handleEnquiry(request)
}
