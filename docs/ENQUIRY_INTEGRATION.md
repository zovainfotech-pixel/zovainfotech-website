# Enquiry email delivery — ZOVA INFOTECH

Every form on the site — **Request a Quote** (`/request-a-quote`, product "Get a Quote" buttons), **Request a specific model** (refurbished), **Headset quote**, **Corporate procurement**, **Contact Us** and **Vendor registration** — calls `submitEnquiry()` (`src/lib/enquiry.ts`), which POSTs to the bundled server function **`/api/enquiry`** (`api/enquiry.ts`). The function validates the submission and emails it to **zovainfotech@gmail.com** through **[Resend](https://resend.com)**.

- Subject: `New Quote Request | ZOVA INFOTECH | <product or service>` (vendor sign-ups: `New Vendor Registration | …`).
- Body: customer name, company, email, phone, product/service, quantity, budget, message, submission date/time (IST), form name, page URL — then every submitted field.
- **From** is your sender address; **Reply-To** is the customer's validated email, so "Reply" in Gmail goes straight to the customer. The customer's address is never used as the sender.
- The site shows "Thank you — received" **only** after Resend accepts the email (HTTP 200 with an email id). Otherwise it shows an error, keeps what the customer typed, and offers the phone number and email.
- Protection: hidden honeypot field, per-IP rate limit (8 per 10 minutes per server instance), server-side validation (required fields, email, Indian mobile number, quantity, lengths), JSON-only, duplicate-click guard in the browser plus a per-submission id sent as Resend's `Idempotency-Key`, so a retry can't send the same enquiry twice.
- Recovery: if email delivery fails the full enquiry is written to the function log, and — if configured — to the Google Sheet backup log below.
- **No secrets in the browser.** `RESEND_API_KEY` exists only in the server environment. Never put keys in `VITE_*` variables.

## Setup (about 15 minutes)

### Step 1 — Resend account
1. Go to <https://resend.com/signup> and sign up **with zovainfotech@gmail.com**, then confirm the email Resend sends you.
2. Resend dashboard → **API Keys** → **Create API key** → permission **Sending access** → copy the key (`re_…`). It is shown once.

> Why sign up with zovainfotech@gmail.com? Until you verify a domain, Resend only lets you send from its test address `onboarding@resend.dev`, and **only to the email address that owns the Resend account**. With the account registered to zovainfotech@gmail.com, enquiries reach that inbox with no DNS work. Free plan: 3,000 emails/month, 100/day.

### Step 2 — Vercel environment variables
Vercel → your project → **Settings → Environment Variables** (Production and Preview):

| Name | Value |
| --- | --- |
| `RESEND_API_KEY` | the `re_…` key from step 1 (**server-only**) |
| `ENQUIRY_TO_EMAIL` | `zovainfotech@gmail.com` (optional — this is the default) |
| `ALLOWED_ORIGINS` | `https://your-domain.com,https://www.your-domain.com` (optional, recommended) |

Leave `VITE_ENQUIRY_ENDPOINT` **unset** (the site uses `/api/enquiry` by default). Then **Redeploy**.

### Step 3 — Test on the live site
1. Submit the Contact Us form with your own details. You should see "Thank you — your enquiry has been received" with a `ZV-YYYYMMDD-XXXXXX` reference.
2. Check zovainfotech@gmail.com — **including Spam and Promotions**. If it landed in Spam, open it and click **Report not spam**, and add `onboarding@resend.dev` (or your own sender) to Contacts.
3. Resend dashboard → **Emails** shows each message and whether it was delivered, bounced or marked as spam.
4. If the site shows an error instead, open Vercel → **Logs**, filter by `/api/enquiry`: `[enquiry] delivery failed` lines contain the full enquiry and Resend's error message.

### Step 4 (recommended) — Your own sending domain
Once the website domain is live (e.g. `zovainfotech.com`):
1. Resend → **Domains → Add domain** → add the DNS records it shows (SPF/DKIM TXT records, MX for the bounce subdomain) at your domain registrar → wait for **Verified**.
2. Set `ENQUIRY_FROM_EMAIL` = `ZOVA INFOTECH Website <enquiries@your-domain.com>` and redeploy.

This improves inbox placement (fewer spam-folder deliveries) and removes the "account owner only" restriction.

### Step 5 (recommended) — Backup log in Google Sheets
So an enquiry is never lost even if email fails: follow the steps at the top of `docs/enquiry-log.gs`, then set `ENQUIRY_LOG_WEBHOOK_URL` (the Apps Script `/exec` URL) and `ENQUIRY_LOG_TOKEN` (the same random string saved as the script property `LOG_TOKEN`) in Vercel and redeploy. Each submission then adds a row with its reference and email status (`sent` / `failed`).

## Testing locally
`npm run test:enquiry` runs 21 integration tests of `api/enquiry.ts` against a local mock of the Resend API (no email is sent): every form type, subject/body/reply-to, validation, honeypot, duplicates, retries, provider errors, rate limiting.

## Static previews
Builds with `VITE_ENQUIRY_ENDPOINT=off` (used for the single-file preview, which has no server) run the forms in clearly labelled **demo mode**: they validate but send nothing and say so.

---

## Other hosts / options
## Option B — CRM / automation webhook

Set `CRM_WEBHOOK_URL` (and optionally `CRM_WEBHOOK_SECRET`). Each submission is POSTed as JSON:

```json
{ "reference": "ZV-…", "kind": "quote", "page": "/request-a-quote", "submittedAt": "…", "data": { … } }
```

With a secret, the body is signed: header `X-Zova-Signature` = hex HMAC-SHA256 of the raw body. Verify it on the receiving side.

Works with: **Zoho CRM / Zoho Flow**, **HubSpot** (via workflow webhook or Zapier), **Zapier / Make / n8n** (“Catch hook” trigger → create lead, send WhatsApp/Slack alert, append to Google Sheets), or your own backend. Email and webhook can run together — the request succeeds if at least one delivery succeeds.

## Option C — Other hosts

`handleEnquiry(request: Request): Promise<Response>` is a standard Web handler.

**Netlify Functions** — create `netlify/functions/enquiry.mts`:
```ts
import { handleEnquiry } from '../../api/enquiry'
export default (req: Request) => handleEnquiry(req)
export const config = { path: '/api/enquiry' }
```

**Cloudflare Pages Functions** — `functions/api/enquiry.ts`:
```ts
import { handleEnquiry } from '../../api/enquiry'
export const onRequest = ({ request, env }) => { Object.assign(process.env, env); return handleEnquiry(request) }
```
(enable `nodejs_compat`, or replace the `env()` helper with the Workers `env` binding).

**Express / Node server:**
```ts
app.post('/api/enquiry', async (req, res) => {
  const r = await handleEnquiry(new Request('http://local/api/enquiry', { method: 'POST', headers: req.headers as HeadersInit, body: JSON.stringify(req.body) }))
  res.status(r.status).type('json').send(await r.text())
})
```

## Hardening checklist

- Set `ALLOWED_ORIGINS` to your production domain(s).
- For strict rate limiting across instances, replace the in-memory limiter with a shared store (e.g. Upstash Redis) or add a CAPTCHA (Cloudflare Turnstile / hCaptcha) — verify the token server-side.
- Store submissions (database or CRM) as well as emailing them, so nothing is lost if an inbox rejects a message.
- Keep the privacy notice (`src/data/legal.ts`) in sync with where data is sent and how long it is kept.

## WhatsApp

Set `VITE_WHATSAPP_NUMBER` to a **verified** WhatsApp Business number (country code + number, digits only). This enables:
- a floating “Chat on WhatsApp” button, and
- a WhatsApp button on product pages that opens a pre-filled message with the product name and ID.

Leave it empty and those buttons are hidden; the standard enquiry forms remain.
