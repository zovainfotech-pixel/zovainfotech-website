/**
 * CENTRAL SITE CONFIGURATION
 * ---------------------------------------------------------------------------
 * Every piece of business contact information lives here. Values left as
 * `null` are treated as "not yet supplied" and the UI shows a neutral
 * placeholder or hides the related control instead of inventing data.
 *
 * Replace the nulls with verified details before going live. Values can also
 * be provided at build time through the VITE_* environment variables listed
 * in `.env.example` (environment values take priority).
 */

const env = import.meta.env

function envOr(value: string | undefined, fallback: string | null): string | null {
  const v = value?.trim()
  return v ? v : fallback
}

export const site = {
  companyName: 'ZOVA INFOTECH',
  shortName: 'Zova Infotech',
  tagline: 'Complete IT Solutions & Procurement Partner',
  brandMessage: 'One Partner. Complete Technology Solutions.',
  country: 'India',
  coverage: 'Pan-India, subject to service availability',

  /**
   * Production origin, e.g. "https://zovainfotech.com".
   * Leave unset until the deployment/domain is confirmed; canonical URLs,
   * Open Graph URLs and the XML sitemap are only emitted when this is set.
   */
  siteUrl: envOr(env.VITE_SITE_URL, null),

  contact: {
    /** Display format, e.g. "+91 98xxx xxxxx". */
    phoneDisplay: envOr(env.VITE_CONTACT_PHONE, '+91 74608 54541'),
    /** E.164 format for tel: links, e.g. "+9198xxxxxxxx". */
    phoneE164: envOr(env.VITE_CONTACT_PHONE_E164, '+917460854541'),
    email: envOr(env.VITE_CONTACT_EMAIL, 'Zovainfotech@gmail.com'),
    /**
     * WhatsApp number in international format, digits only. Supplied by the business;
     * confirm it is registered on WhatsApp (ideally WhatsApp Business) before launch.
     */
    whatsappNumber: envOr(env.VITE_WHATSAPP_NUMBER, '917460854541'),
    whatsappGreeting: 'Hello ZOVA INFOTECH, I would like to enquire about your IT products and services.',
    addressLines: ['D Block, Sector 22', 'Noida, Uttar Pradesh – 201301', 'India'] as string[] | null,
    /** Single-line postal address used for display and the Google Maps search. */
    addressFull: 'D Block, Sector 22, Noida, Uttar Pradesh – 201301, India.',
    address: { locality: 'Noida', region: 'Uttar Pradesh', postalCode: '201301', street: 'D Block, Sector 22', country: 'IN' },
    businessHours: null as string | null,
  },

  /** Legal/registration details — only fill in with verified values. */
  legal: {
    gstin: null as string | null,
    cin: null as string | null,
  },

  social: {
    linkedin: null as string | null,
    instagram: null as string | null,
    facebook: null as string | null,
  },

  /**
   * Endpoint that receives enquiry form submissions (see /api/enquiry.ts, which
   * emails them to zovainfotech@gmail.com). Defaults to the bundled function.
   * Set VITE_ENQUIRY_ENDPOINT=off for a static preview with no backend: forms then
   * run in clearly labelled DEMO MODE and send nothing.
   */
  enquiryEndpoint: ((v) => (v === 'off' ? null : v))(envOr(env.VITE_ENQUIRY_ENDPOINT, '/api/enquiry')),
} as const

export const isDemoMode = !site.enquiryEndpoint

export const PLACEHOLDER = {
  phone: '[Phone number — to be added]',
  email: '[Business email — to be added]',
  address: '[Office address — to be added]',
} as const
