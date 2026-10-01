import { isDemoMode, site } from '../config/site'

export type EnquiryKind = 'quote' | 'corporate' | 'contact' | 'vendor' | 'headset'

export type EnquiryResult =
  | { status: 'sent'; reference?: string; emailSentTo?: string }
  | { status: 'demo' }
  | { status: 'error'; message: string }

/**
 * Sends an enquiry to the configured server-side endpoint.
 *
 * - No secrets live in the browser: the endpoint (see /api/enquiry.ts) holds
 *   the email/CRM credentials as server environment variables.
 * - When VITE_ENQUIRY_ENDPOINT is not configured the site runs in DEMO MODE:
 *   the payload is validated but NOT sent anywhere, and the UI says so.
 */
export interface SubmitOptions {
  /** Stable per form attempt; lets the server drop accidental duplicate submissions. */
  submissionId?: string
  /** Honeypot value (should always be empty for real visitors). */
  hp?: string
}

export async function submitEnquiry(kind: EnquiryKind, data: Record<string, unknown>, opts: SubmitOptions = {}): Promise<EnquiryResult> {
  if (isDemoMode || !site.enquiryEndpoint) {
    await new Promise((r) => setTimeout(r, 650))
    if (import.meta.env.DEV) console.info('[demo mode] enquiry not sent', { kind, data })
    return { status: 'demo' }
  }

  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 25000)
    const res = await fetch(site.enquiryEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        kind,
        data,
        page: window.location.pathname,
        pageUrl: window.location.href,
        pageTitle: document.title,
        submittedAt: new Date().toISOString(),
        submissionId: opts.submissionId,
        hp: opts.hp ?? '',
      }),
      signal: controller.signal,
    })
    clearTimeout(timer)
    const body = (await res.json().catch(() => ({}))) as { ok?: boolean; reference?: string; emailSentTo?: string; error?: string }
    if (!res.ok || !body.ok) {
      return { status: 'error', message: body.error ?? 'We could not send your enquiry. Please try again or contact us directly.' }
    }
    return { status: 'sent', reference: body.reference, emailSentTo: body.emailSentTo }
  } catch {
    return { status: 'error', message: 'Network error — your enquiry was not sent. Your details are still in the form; please check your connection and try again.' }
  }
}
