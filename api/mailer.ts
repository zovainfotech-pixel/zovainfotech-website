/**
 * FREE MAILER SERVICE — ZOVA INFOTECH
 * ---------------------------------------------------------------------------
 * Multi-provider email delivery engine supporting:
 * 1. Free Gmail SMTP / Standard SMTP via Nodemailer
 *    (Zero-cost, 500 emails/day to any recipient using a free Gmail account + App Password)
 * 2. Brevo (Sendinblue) Free REST API
 *    (Zero-cost, 300 emails/day to any recipient with free API key)
 * 3. Resend Free REST API
 *    (Zero-cost, 3,000 emails/month)
 * 4. Local Development Fallback
 *    (When no credentials are configured yet, safely simulates delivery, logs the full
 *     formatted email to the console, and returns success so local testing works out of the box)
 */

import nodemailer from 'nodemailer'

const env = (k: string) => (typeof process !== 'undefined' ? process.env[k] : undefined)?.trim() || undefined

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

const BRAND = 'ZOVA INFOTECH'
export const DEFAULT_FROM = 'ZOVA INFOTECH <onboarding@resend.dev>'
export const DEFAULT_TO = 'zovainfotech@gmail.com'

/**
 * Escapes HTML entities for safe template insertion.
 */
function esc(v: unknown): string {
  return String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function str(v: unknown): string {
  if (Array.isArray(v)) return v.join(', ')
  return String(v ?? '').trim()
}

/**
 * Builds the customer-facing confirmation email for quote requests.
 */
export function buildUserConfirmationEmail(
  data: Record<string, unknown>,
  summary: {
    name: string
    company: string
    email: string
    phone: string
    item: string
    quantity: string
    budget: string
    message: string
    submittedAt: string
  },
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
    <!-- Header -->
    <tr>
      <td style="background:linear-gradient(135deg, #080D1F 0%, #123b73 100%);padding:32px 28px;color:#ffffff">
        <div style="font-size:12px;letter-spacing:2px;color:#23D5FF;font-weight:800;text-transform:uppercase">${BRAND}</div>
        <h1 style="margin:10px 0 0 0;font-size:24px;font-weight:700;line-height:1.2;color:#ffffff">Quotation Request Received</h1>
        <div style="margin-top:8px;display:inline-block;padding:4px 12px;background:rgba(35,213,255,0.15);border:1px solid rgba(35,213,255,0.3);border-radius:20px;font-size:13px;color:#23D5FF;font-family:monospace">Ref: ${esc(ref)}</div>
      </td>
    </tr>

    <!-- Body -->
    <tr>
      <td style="padding:28px">
        <p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;color:#334155">
          Dear <strong>${esc(summary.name)}</strong>,
        </p>
        <p style="margin:0 0 20px 0;font-size:15px;line-height:1.6;color:#334155">
          Thank you for reaching out to <strong>ZOVA INFOTECH</strong>. We have successfully received your quotation request for <strong>${esc(summary.item)}</strong>.
        </p>

        <!-- Summary Box -->
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;margin-bottom:24px">
          <div style="background:#f1f5f9;padding:10px 16px;font-size:12px;font-weight:700;letter-spacing:0.5px;color:#475569;text-transform:uppercase">
            Request Details
          </div>
          <table role="presentation" width="100%" style="border-collapse:collapse">
            ${rowHtml}
          </table>
        </div>

        <!-- Next Steps -->
        <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;padding:18px 20px;margin-bottom:24px">
          <div style="font-size:14px;font-weight:700;color:#1e40af;margin-bottom:8px">What happens next?</div>
          <ol style="margin:0;padding-left:20px;font-size:13px;line-height:1.6;color:#1e3a8a">
            <li style="margin-bottom:6px"><strong>Requirement Analysis:</strong> Our enterprise procurement team verifies models, specifications, and warranty options.</li>
            <li style="margin-bottom:6px"><strong>Partner Sourcing:</strong> We check pricing across our authorized distributor network to secure the best rates.</li>
            <li><strong>Official Quotation:</strong> An itemised quotation with availability and delivery schedule will be dispatched to this email address.</li>
          </ol>
        </div>

        <!-- Contact Box -->
        <p style="margin:0 0 8px 0;font-size:14px;font-weight:600;color:#0f172a">Need immediate assistance or have urgent timelines?</p>
        <p style="margin:0;font-size:13px;line-height:1.6;color:#64748b">
          📞 Call / WhatsApp: <a href="tel:+917460854541" style="color:#2563eb;text-decoration:none;font-weight:600">+91 74608 54541</a><br>
          ✉️ Email: <a href="mailto:Zovainfotech@gmail.com" style="color:#2563eb;text-decoration:none;font-weight:600">Zovainfotech@gmail.com</a>
        </p>
      </td>
    </tr>

    <!-- Footer -->
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

/**
 * Sends an email using Nodemailer (Gmail SMTP or custom SMTP).
 */
async function sendWithSmtp(msg: EmailMessage): Promise<SendEmailResult> {
  const host = env('SMTP_HOST') || 'smtp.gmail.com'
  const port = Number(env('SMTP_PORT') || (env('SMTP_SECURE') === 'true' ? 465 : 587))
  const secure = env('SMTP_SECURE') === 'true' || port === 465
  const user = env('SMTP_USER') || env('GMAIL_USER')
  const pass = (env('SMTP_PASS') || env('GMAIL_APP_PASSWORD'))?.replace(/\s+/g, '')

  if (!user || !pass) {
    return { ok: false, provider: 'smtp', error: 'SMTP credentials missing' }
  }

  const from = msg.from || env('SMTP_FROM') || env('ENQUIRY_FROM_EMAIL') || `"ZOVA INFOTECH" <${user}>`

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
      tls: {
        rejectUnauthorized: false,
      },
    })

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

/**
 * Sends an email using Brevo (Sendinblue) Free REST API.
 * Free tier provides 300 emails/day to any recipient with no domain verification required.
 */
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

    const data = (await res.json().catch(() => ({}))) as { messageId?: string; message?: string; code?: string }
    if (res.ok && data.messageId) {
      return { ok: true, provider: 'brevo', id: data.messageId }
    }
    return { ok: false, provider: 'brevo', status: res.status, error: data.message || `HTTP ${res.status}` }
  } catch (err) {
    return { ok: false, provider: 'brevo', error: err instanceof Error ? err.message : 'Brevo network error' }
  }
}

/**
 * Sends an email using Resend REST API.
 */
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

/**
 * Master email dispatcher: automatically determines the active provider.
 * Priority order:
 * 1. SMTP / Gmail (Nodemailer) — if SMTP_USER or GMAIL_USER is set
 * 2. Brevo API — if BREVO_API_KEY is set
 * 3. Resend API — if RESEND_API_KEY is set
 * 4. Dev Simulation — if in development and no live credentials are set yet
 */
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

  // If in development mode and no provider is configured, log the email for preview
  const isDev = (env('NODE_ENV') === 'development' || env('DEV_MAILER') === 'true') && !env('RESEND_API_BASE')
  if (isDev) {
    const toStr = Array.isArray(msg.to) ? msg.to.join(', ') : msg.to
    console.info(`\n📧 [DEV MAILER SIMULATION] Email to: ${toStr}`)
    console.info(`   Subject: ${msg.subject}`)
    console.info(`   Preview text:\n${msg.text.split('\n').map((l) => '     ' + l).join('\n')}\n`)
    return {
      ok: true,
      provider: 'dev-simulation',
      id: `dev-${Date.now()}`,
      previewNotice: 'Simulated in development mode. Add GMAIL_USER/GMAIL_APP_PASSWORD, BREVO_API_KEY, or RESEND_API_KEY to .env.local to send live emails.',
    }
  }

  return {
    ok: false,
    provider: 'dev-simulation',
    error: 'No email provider configured. Please set GMAIL_USER/GMAIL_APP_PASSWORD, BREVO_API_KEY, or RESEND_API_KEY.',
  }
}
