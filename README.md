# Zova Infotech — Website

Production-oriented, enquiry-first website for **Zova Infotech Pvt. Ltd.** — *Complete IT Solutions & Procurement Partner*.
New and refurbished laptops, IT accessories, business hardware, corporate procurement and IT services.

**Stack:** React 19 · TypeScript · Vite 8 · Tailwind CSS 4 · React Router 7 · Motion (Framer Motion) · Lucide icons · self-hosted fonts (Sora display, Plus Jakarta Sans body, JetBrains Mono labels).

**Design system — “Neon Circuit”:** midnight navy `#080D1F`, electric blue `#3563FF`, neon cyan `#23D5FF`, violet `#8B5CF6`, purple `#A855F7`, teal `#14B8A6` (refurbished value), light `#F6F8FF`, ink `#111827`. Tokens live in `src/index.css` (`@theme`).

---

## Quick start

```bash
npm install
cp .env.example .env.local      # optional — the site runs without it (demo mode)
npm run dev                     # http://localhost:5173
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Local dev server with hot reload |
| `npm run build` | Type-checks (app, config, API) then builds to `dist/` (+ `robots.txt`, and `sitemap.xml` when `VITE_SITE_URL` is set) |
| `npm run preview` | Serves the production build on http://localhost:4173 |
| `npm run typecheck` | `tsc -b` across app, Vite config and `/api` |
| `npm run lint` | Oxlint (React, hooks and correctness rules) |
| `npm run test:smoke` | Playwright smoke tests against the preview server (see `tests/smoke.mjs`) |
| `VITE_HASH_ROUTER=1 VITE_IMAGE_BASE=./ npx vite build --mode preview-single` | Single-file preview build (hash routing) for sharing a clickable demo |

---

## Project structure

```
api/enquiry.ts            Server-side enquiry endpoint (Vercel Function; portable Web handler)
src/
  config/site.ts          ★ ALL company/contact settings live here (phone, email, WhatsApp, endpoint, domain)
  data/
    types.ts              Product / category data model
    categories.ts         10 product categories (names, SEO copy, subcategories)
    products.ts           Product helpers + SHOW_DEMO_PRODUCTS switch
    products.demo.ts      ⚠ Demonstration products (clearly labelled on-site)
    products.live.ts      ★ Put real products here
    services.ts           8 service pages + home service cards
    content.ts            FAQs, brands, industries, process steps, form options
    legal.ts              Policy page templates (need legal review)
    routes.ts             Clean URL map (shared by router, nav, sitemap)
  components/
    ui/                   Button, Badges, Accordion, Toast, Reveal (scroll animations), Skeleton…
    layout/               Header (mega-menu, search, mobile drawer), Footer, PageHero, Layout
    product/              ProductCard, Catalogue (search/filter/sort/grid-list), filtering logic
    forms/                Shared fields + Quote, Corporate, Contact, Vendor forms, submit state machine
    home/                 Hero and homepage sections
    brand/                Logo, original device illustrations, icon maps
  pages/                  One file per page (route-level code-split)
  lib/                    SEO meta hook, validation, enquiry client, contact links
tests/smoke.mjs           Playwright smoke suite
```

### Pages & URLs

| Page | URL |
| --- | --- |
| Home | `/` |
| All products | `/products` (supports `?q=`, `?brand=`, `?condition=`, `?sort=`… — shareable) |
| Category pages | `/products/new-laptops`, `/products/refurbished-laptops`, `/products/desktops-workstations`, `/products/apple-products`, `/products/monitors-displays`, `/products/printers-scanners`, `/products/it-accessories`, `/products/components-parts`, `/products/networking`, `/products/servers-storage` |
| Product detail | `/product/:slug` |
| IT services | `/services` |
| Service pages | `/services/it-amc`, `/services/cybersecurity-dlp`, `/services/software-licensing`, `/services/audio-visual-digital-signage`, `/services/desktop-laptop-support`, `/services/computer-repair`, `/services/network-setup`, `/services/installation-configuration` |
| Corporate IT procurement | `/corporate-it-procurement` |
| About / Contact | `/about`, `/contact` |
| Request a quote | `/request-a-quote` (`?product=<slug>` pre-fills the product, `?type=` / `?model=` also supported) |
| Become a vendor | `/become-a-vendor` |
| Policies | `/privacy-policy`, `/terms-and-conditions`, `/shipping-and-delivery-policy`, `/returns-and-refunds-policy`, `/warranty-policy` |

---

## Configuration

All public settings are in **`src/config/site.ts`** and can be overridden with `VITE_*` variables (see `.env.example`).
Anything left empty shows a neutral placeholder (e.g. “[Phone number — to be added]”) or is hidden — the site never invents contact details.

| Variable | Purpose |
| --- | --- |
| `VITE_SITE_URL` | Production origin. Enables canonical URLs, `og:url`, and `sitemap.xml`. Leave empty until the domain is confirmed. |
| `VITE_CONTACT_PHONE` / `VITE_CONTACT_PHONE_E164` | Display phone and `tel:` link number |
| `VITE_CONTACT_EMAIL` | Business email (`mailto:` links) |
| `VITE_WHATSAPP_NUMBER` | Verified WhatsApp Business number (digits, with country code). Enables the floating chat button and pre-filled product enquiries. |
| `VITE_ENQUIRY_ENDPOINT` | Where forms POST. Empty = **demo mode**. With the bundled function: `/api/enquiry`. |

Server-only variables (`RESEND_API_KEY`, `ENQUIRY_TO_EMAIL`, `ENQUIRY_FROM_EMAIL`, `CRM_WEBHOOK_URL`, `CRM_WEBHOOK_SECRET`, `ALLOWED_ORIGINS`) are read only by `api/enquiry.ts` and must be set in your hosting dashboard — never in a `VITE_` variable.

---

## Enquiry forms — demo mode vs live

* **Demo mode (default).** Forms validate input and show a clearly labelled “Demo mode — not sent” result. Nothing is transmitted, and the UI never claims delivery.
* **Live mode.** Set `VITE_ENQUIRY_ENDPOINT` and configure the server function. Successful submissions show a reference number returned by the server (e.g. `ZV-20260928-8F3A1C`). Errors are shown inline; nothing is faked.

See **[docs/ENQUIRY_INTEGRATION.md](docs/ENQUIRY_INTEGRATION.md)** for email (Resend), CRM/webhook (Zoho, HubSpot, Zapier, Make, n8n, Google Sheets) and alternative hosts.

Forms included: Request a Quote (with product pre-fill), Corporate Procurement (multi-line items, services, GSTIN), Contact, Vendor Registration. All have labels, inline errors, focus-to-first-error, loading states, a privacy consent checkbox and a honeypot spam field.

---

## Imagery

All product and category images are **original, unbranded 3D studio renders** in `public/images/products/` (30 WebP files, ~2 MB total, transparent backgrounds). They were generated for this project with Blender, so there are no stock-photo licensing restrictions.

* Every image is referenced by key from **`src/data/media.ts`** — change a `src` there to swap in real photography site-wide.
* Products without their own photos show a representative render chosen by `productMediaKey()` and are labelled “Representative render” on the product page. Photos added to a product’s `images` array always take priority.
* `SmartImage` sets width/height (no layout shift), lazy-loads below the fold, fades in, and falls back to an illustration if a file fails to load.
* To regenerate or add renders: `pip install bpy`, then `python3 scripts/renders/textures.py && python3 scripts/renders/render_all.py [name…]`.

Real photos of each refurbished or used unit are still strongly recommended before launch (see the launch checklist).

## Managing products

See **[docs/PRODUCTS.md](docs/PRODUCTS.md)** (AV showcase: **[docs/AV_PRODUCTS.md](docs/AV_PRODUCTS.md)**; headsets: **[docs/HEADSETS.md](docs/HEADSETS.md)**; images and video: **[docs/MEDIA.md](docs/MEDIA.md)**). In short:

1. Add real products to `src/data/products.live.ts` (same shape as the demo file, `isDemo: false`).
2. Put photos in `public/products/<slug>/` and reference them in `images`.
3. Only fill `price`, `warranty`, `availability`, `grade` and `refurb` details once confirmed for that exact item.
4. When ready, set `SHOW_DEMO_PRODUCTS = false` in `src/data/products.ts`.

Filters appear automatically from the data (condition, grade, brand, processor, RAM, storage, display size, intended use; price filter and price sorting appear only when products have confirmed prices).

---

## Deployment

**Vercel (recommended — includes the enquiry function):**

1. Push the repo to GitHub and import it in Vercel (framework: Vite — `vercel.json` is included with SPA rewrites and security headers).
2. Set environment variables (Production): `VITE_SITE_URL`, contact `VITE_*` values, `VITE_ENQUIRY_ENDPOINT=/api/enquiry`, and the server-only email/CRM variables.
3. Deploy. Visit `/robots.txt` and `/sitemap.xml` to confirm, then submit the sitemap in Google Search Console.

**Netlify / Cloudflare Pages / any static host:** build with `npm run build` and publish `dist/`. `public/_redirects` provides the Netlify SPA fallback; other hosts need an equivalent “serve `index.html` for unknown paths” rule. Deploy the enquiry handler as a function on that platform (see the integration doc).

> SEO note: this is a client-rendered SPA with per-page titles, descriptions, canonical/OG tags and FAQ/Product structured data set at runtime (Google renders JavaScript). If you need fully pre-rendered HTML for other crawlers or social previews, add a pre-render step (e.g. `vite-plugin-prerender`) or migrate the same components to a React Router framework-mode / Next.js app.

---

## Future e-commerce readiness

The data model and components are prepared for — but do **not** yet implement — cart, payments, inventory, orders, accounts, admin, GST invoicing, shipping integrations, reviews and warranty tracking. There is no checkout and no admin dashboard; products are managed in code. Suggested path: move product data to a headless CMS or database (Sanity, Strapi, Supabase), then add a cart/checkout (e.g. Razorpay for India) behind the existing “Get a Quote” actions.

---

See also: **[docs/LAUNCH_CHECKLIST.md](docs/LAUNCH_CHECKLIST.md)** (information still needed) and **[docs/TESTING.md](docs/TESTING.md)** (what was tested and results).
