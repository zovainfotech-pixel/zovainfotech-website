import { site } from '../config/site'
/**
 * Policy page content. These are STARTING TEMPLATES written to match how the
 * business operates (enquiry-first, vendor-sourced fulfilment). They must be
 * reviewed and completed by the business and a qualified legal professional
 * before publication. Bracketed text marks information to be supplied.
 */

export interface LegalSection {
  id?: string
  heading: string
  paragraphs?: string[]
  bullets?: string[]
}

export interface LegalDoc {
  slug: 'privacy' | 'terms' | 'shipping' | 'returns' | 'warranty'
  title: string
  seoDescription: string
  intro: string
  sections: LegalSection[]
}

const company = 'ZOVA INFOTECH'
const email = site.contact.email ?? ''
const address = site.contact.addressFull.replace(/\.$/, '')

export const legalDocs: Record<LegalDoc['slug'], LegalDoc> = {
  privacy: {
    slug: 'privacy',
    title: 'Privacy Policy',
    seoDescription: `How ${company} collects, uses and protects personal information submitted through this website.`,
    intro: `This Privacy Policy explains how ${company} ("we", "us") handles personal information you share with us through this website, including enquiry, quotation, contact and vendor registration forms.`,
    sections: [
      {
        heading: 'Information we collect',
        bullets: [
          'Contact details you provide: name, company name, email address, mobile number and designation.',
          'Requirement details: products or services of interest, quantities, budget range, delivery city and PIN code, and any notes you add.',
          'Business details for vendors or corporate customers, such as GSTIN and website, where you choose to provide them.',
          'Basic technical information needed to operate the website securely, such as request logs kept by our hosting provider.',
        ],
      },
      {
        heading: 'How we use your information',
        bullets: [
          'To respond to your enquiry and prepare quotations.',
          'To source products from vendors on your behalf — we share only the details needed to check availability and pricing.',
          'To arrange delivery, installation or support when you place an order.',
          'To meet legal, tax and accounting obligations.',
        ],
      },
      {
        heading: 'Consent and your rights',
        paragraphs: [
          `We process personal data you submit on the basis of your consent, given when you tick the consent box on our forms, and where necessary to fulfil an order or meet legal obligations. You may request access to, correction of, or deletion of your personal data, or withdraw consent, by contacting us at ${email}. We aim to handle personal data in line with applicable Indian law, including the Digital Personal Data Protection Act, 2023.`,
        ],
      },
      {
        heading: 'Sharing and service providers',
        paragraphs: [
          'We do not sell personal information. We may use trusted service providers for website hosting, email delivery and customer relationship management. [List providers once selected.]',
        ],
      },
      {
        heading: 'Retention and security',
        paragraphs: [
          'We keep enquiry information for as long as needed to respond and for a reasonable period afterwards for follow-up and record keeping, unless a longer period is required by law. [Specify retention period.] We use reasonable technical and organisational measures to protect your information.',
        ],
      },
      {
        heading: 'Cookies and local storage',
        paragraphs: [
          'This website does not use advertising cookies. It may store small preferences in your browser (for example, grid or list view in the catalogue). [Update this section if analytics are added.]',
        ],
      },
      { heading: 'Contact', paragraphs: [`For privacy questions, contact ${company} at ${email} or ${address}.`] },
    ],
  },
  terms: {
    slug: 'terms',
    title: 'Terms and Conditions',
    seoDescription: `Terms governing use of the ${company} website, product listings and quotations.`,
    intro: `These Terms and Conditions govern your use of this website operated by ${company}. By using the website you agree to these terms.`,
    sections: [
      {
        heading: 'Enquiry-based catalogue',
        paragraphs: [
          'Products and services shown on this website are presented for information and enquiry. Listings do not constitute an offer to sell, and no order is placed by submitting a form. Many products are sourced from third-party vendors on request.',
        ],
      },
      {
        heading: 'Quotations',
        bullets: [
          'Prices, availability, specifications, warranty and delivery timelines are confirmed only in a written quotation.',
          'Quotations are valid for the period stated on them and may change if vendor pricing or availability changes before confirmation.',
          'An order is confirmed only when both parties agree in writing and any required advance payment is received. [Confirm payment terms.]',
        ],
      },
      {
        heading: 'Product information',
        paragraphs: [
          'We make every effort to describe products accurately. Images may be illustrations or representative photographs unless stated as actual photographs of the unit. Sample listings marked "Demonstration listing" are not offers of available stock.',
        ],
      },
      {
        heading: 'Trademarks',
        paragraphs: [
          'Brand names and product names are trademarks of their respective owners. Their use on this website is for identification only and does not imply endorsement or authorised-reseller status unless explicitly stated.',
        ],
      },
      {
        heading: 'Limitation of liability',
        paragraphs: ['[To be drafted with legal counsel.]'],
      },
      {
        heading: 'Governing law',
        paragraphs: ['These terms are governed by the laws of India. [Specify jurisdiction.]'],
      },
    ],
  },
  shipping: {
    slug: 'shipping',
    title: 'Shipping and Delivery Policy',
    seoDescription: `How ${company} arranges delivery of IT products across India.`,
    intro: 'We aim to serve customers across India. Delivery arrangements are confirmed individually for each order.',
    sections: [
      {
        heading: 'Coverage',
        paragraphs: [
          'Delivery is available Pan-India subject to serviceability of your PIN code by our logistics partners. We will confirm serviceability before you confirm an order.',
        ],
      },
      {
        heading: 'Timelines and charges',
        bullets: [
          'Delivery timelines depend on product sourcing, vendor lead times and your location, and are stated in your quotation.',
          'Delivery charges, if any, are stated in your quotation.',
          'For bulk or multi-location orders, a delivery schedule is agreed in advance.',
        ],
      },
      {
        heading: 'On receipt',
        paragraphs: [
          'Please inspect packages on delivery and report visible damage or missing items within [X] hours, with photographs where possible. [Confirm timeframe.]',
        ],
      },
    ],
  },
  returns: {
    slug: 'returns',
    title: 'Returns and Refunds Policy',
    seoDescription: `Returns, replacements and refunds for products purchased from ${company}.`,
    intro: 'Return eligibility depends on the product type, its condition (new, refurbished or used) and the terms of the source vendor. The terms applicable to your purchase are confirmed with your quotation.',
    sections: [
      {
        heading: 'Dead-on-arrival and transit damage',
        paragraphs: ['If a product arrives damaged or does not power on, contact us within [X] days of delivery. We will arrange inspection and, where confirmed, a repair, replacement or refund. [Confirm process.]'],
      },
      {
        heading: 'Non-returnable items',
        bullets: ['Software licences once activated or delivered.', 'Consumables once opened.', 'Items specially sourced to order, unless faulty. [Confirm list.]'],
      },
      {
        heading: 'Refunds',
        paragraphs: ['Approved refunds are issued to the original payment method within [X] business days of approval. [Confirm.]'],
      },
    ],
  },
  warranty: {
    slug: 'warranty',
    title: 'Warranty Policy',
    seoDescription: `How warranty works for new, refurbished and used products supplied by ${company}.`,
    intro: 'Warranty coverage depends on the product and its condition. The exact warranty — duration, coverage and who provides it — is stated in writing on your quotation and invoice.',
    sections: [
      {
        heading: 'New products',
        paragraphs: [
          'New products typically carry the manufacturer’s warranty, serviced through the manufacturer’s authorised service network. Coverage and duration vary by brand and model.',
        ],
      },
      {
        id: 'refurbished',
        heading: 'Refurbished and used products',
        paragraphs: [
          'Refurbished and used products may carry a seller warranty from Zova Infotech or the source vendor. Where offered, the duration and what it covers (for example, parts and labour, exclusions for batteries or physical damage) are stated per unit. We do not describe a product as "certified refurbished" unless there is a verifiable certification behind that claim.',
        ],
        bullets: [
          'Excellent — minimal to no visible signs of use; fully functional.',
          'Very Good — light cosmetic marks visible on close inspection; fully functional.',
          'Good — visible scuffs, scratches or wear from regular use; fully functional.',
          'Fair — heavy cosmetic wear; any functional limitation is disclosed on the listing.',
          'Grades are assigned only after inspection of the specific unit. Known defects, battery information and included accessories are listed where checked.',
        ],
      },
      {
        heading: 'Making a warranty claim',
        paragraphs: ['Contact us with your invoice number and a description of the issue. [Confirm claim process and contact.]'],
      },
    ],
  },
}
