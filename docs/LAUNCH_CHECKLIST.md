# Launch checklist — information and setup still required

Everything below is either shown as a placeholder on the site or intentionally left out until it is verified.

## Business information (src/config/site.ts or VITE_* env vars)
- [ ] Phone number (display format + E.164)
- [ ] Business email address
- [ ] Verified WhatsApp Business number (optional)
- [ ] Registered office address and business hours
- [ ] GSTIN / CIN (only if you want them displayed)
- [ ] Social profile URLs (optional)
- [ ] Confirm production domain → set `VITE_SITE_URL=https://zovainfotech.com`

## Enquiry delivery
- [ ] Choose email (Resend) and/or CRM webhook — see `docs/ENQUIRY_INTEGRATION.md`
- [ ] Set server-only env vars in hosting dashboard; set `VITE_ENQUIRY_ENDPOINT=/api/enquiry`
- [ ] Set `ALLOWED_ORIGINS`
- [ ] Send one test submission from each form (quote, corporate, contact, vendor) and confirm receipt
- [ ] Optional: add CAPTCHA and a shared rate-limit store

## Products
- [ ] Add real products to `src/data/products.live.ts` with confirmed specs
- [ ] Real photographs for every refurbished/used unit (the site currently shows representative renders, labelled as such)
- [ ] Optional: replace category renders with licensed product photography via `src/data/media.ts`
- [ ] Condition grades from actual inspection; battery, defects, accessories per unit
- [ ] Prices, warranty and availability only where confirmed
- [ ] Set `SHOW_DEMO_PRODUCTS = false`

## Content
- [ ] About page: company story, founding year, team, verified registrations (placeholder block on `/about`)
- [ ] Confirm which services are operational and their coverage areas; adjust `src/data/services.ts`
- [ ] Brand list: keep text wordmarks only; do not add logos or “authorised” claims unless you hold the authorisation in writing
- [ ] Do not add testimonials, client logos, statistics or certifications until they are real and you have permission to publish them

## Legal (src/data/legal.ts) — review with a qualified professional
- [ ] Privacy Policy: privacy contact, retention period, processors (email/CRM/hosting), DPDP Act compliance
- [ ] Terms & Conditions: payment terms, liability, jurisdiction
- [ ] Shipping & Delivery: damage-reporting window, charges policy
- [ ] Returns & Refunds: DOA window, non-returnable list, refund timeline
- [ ] Warranty: seller-warranty terms for refurbished/used, claim process
- [ ] Remove the “Template policy” banner in `src/pages/LegalPage.tsx` once finalised; set “Last updated” dates

## SEO & analytics
- [ ] Verify domain in Google Search Console; submit `/sitemap.xml`
- [ ] Create a social share image (1200×630) and add `og:image` in `index.html`
- [ ] Optional: add privacy-friendly analytics and update the Privacy Policy accordingly
- [ ] Optional: add pre-rendering for richer social previews (see README)
- [ ] Google Business Profile with the same name, address and phone as the website

## Final QA
- [ ] Run `npm run build`, `npm run lint`, `npm run test:smoke`
- [ ] Manually test on a real Android phone and iPhone
- [ ] Run Lighthouse / PageSpeed Insights on the deployed URL
