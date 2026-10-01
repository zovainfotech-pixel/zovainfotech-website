# Adding, updating and removing products

Products are plain TypeScript objects — no database or admin panel is implemented yet. Edit, commit, redeploy.

## 1. Add a product

Open `src/data/products.live.ts` and add an entry:

```ts
{
  id: 'ZV-R-0001',                       // unique, shown to customers and sent with quote requests
  slug: 'lenovo-thinkpad-t14-gen2-i5-16-512',   // URL: /product/<slug> — lowercase, hyphens, unique
  name: 'Lenovo ThinkPad T14 Gen 2',
  brand: 'Lenovo',
  model: 'ThinkPad T14 Gen 2',
  category: 'refurbished-laptops',       // one of the slugs in categories.ts
  subcategory: 'Business-class refurbished',
  condition: 'refurbished',              // 'new' | 'refurbished' | 'used'
  grade: 'very-good',                    // ONLY after inspecting this unit
  description: 'One or two plain sentences about the product.',
  specs: {
    processor: 'Intel Core i5-1135G7 (11th Gen)',
    processorFamily: 'Intel Core i5',    // used by the Processor filter
    ramGb: 16,
    storageGb: 512,
    storageDetail: '512 GB NVMe SSD',
    displayInches: 14,
    displayDetail: '14" Full HD IPS',
    os: 'Windows 11 Pro',
    other: [{ label: 'Ports', value: 'USB-C, 2× USB-A, HDMI' }],
  },
  refurb: {                              // refurbished/used only — list only what you checked
    batteryHealth: '84% of design capacity (measured 12 Mar 2026)',
    cosmeticNotes: 'Light scratches on lid; palm rest clean',
    knownDefects: [],                    // [] = none known; omit the field if not yet checked
    inspection: 'Keyboard, touchpad, ports, display, Wi-Fi, webcam, speakers tested',
    accessoriesIncluded: ['65 W USB-C charger'],
    returnEligibility: '7-day return if not as described',
  },
  useCases: ['business', 'student'],
  images: [
    { src: '/products/lenovo-thinkpad-t14-gen2-i5-16-512/front.webp', alt: 'Lenovo ThinkPad T14 Gen 2, front view, lid open', width: 1200, height: 900 },
  ],
  price: { amount: 38500, currency: 'INR', gstInclusive: true },   // omit unless confirmed
  warranty: '6 months seller warranty (parts & labour, excludes battery)',  // omit unless confirmed
  availability: 'in-stock',              // 'in-stock' | 'on-order' | 'enquire' — omit unless confirmed
  enquiry: { quote: true, whatsapp: true },
  isDemo: false,
}
```

### Rules that protect trust
- **Missing = unknown.** If a field is not confirmed, leave it out. The site shows “Request price”, “Warranty on enquiry” or “To be confirmed for this unit”.
- **Grades** (`excellent`, `very-good`, `good`, `fair`) only after inspecting the specific unit. Their meanings are defined in `src/data/products.ts` (`gradeInfo`).
- **Refurbished vs used:** refurbished = inspected, cleaned and restored to working order; used = sold as-is with condition disclosed.
- Never describe an item as “certified refurbished” without a verifiable certification.
- Product structured data (JSON-LD) is emitted only for non-demo products, and price “offers” only when both `price` and `availability` are set.

## 2. Photos
- Put images in `public/products/<slug>/` (WebP or AVIF, ~1200×900, under ~200 KB each).
- Use actual photographs of refurbished/used units. Write descriptive `alt` text.
- Without images the site shows an original illustration labelled “Illustration — product photos to be added”.

## 3. Update or remove
- Update: edit the object and redeploy. Keep the `slug` stable (it is the URL).
- Remove: delete the object. Its URL will show the 404 page with links to the catalogue and quote form.

## 4. Turn off demo data
Set `SHOW_DEMO_PRODUCTS = false` in `src/data/products.ts` once real products are in place. Demo products carry `isDemo: true`, are labelled on every card and page, are set to `noindex`, and are excluded from the sitemap.

## 5. Categories, services and content
- Categories: `src/data/categories.ts` (name, description, subcategories, SEO title/description).
- Services: `src/data/services.ts`.
- FAQs, brands, industries, form options: `src/data/content.ts`.
- Policies: `src/data/legal.ts`.

## Moving to a CMS later
The `Product` type in `src/data/types.ts` maps cleanly to a CMS schema (Sanity, Strapi, Contentful, Supabase). Replace the arrays in `products.ts` with a fetch at build time or runtime; the UI components do not need to change.
