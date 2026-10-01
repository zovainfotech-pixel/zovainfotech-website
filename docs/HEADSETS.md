# Professional Headsets & Meeting Room Solutions

Category slug `headsets-audio-solutions` → `/products/headsets-audio-solutions`.

## Where it appears
- **Mega menu / mobile drawer** – listed automatically from `src/data/categories.ts`.
- **Homepage** – `HeadsetsHomeSection` ("Professional Headsets for Every Workplace", 4 cards → `?subcategory=`).
- **Category page** – hero CTAs, workplace cards, HP Poly featured collection, catalogue (filters: Type, Brand, Connectivity, Workplace), brand cards, dark B2B band, headset quote form (`#headset-quote`).
- **Product pages** – connection / workplace badges, audio rows in the spec table, Compare toggle, related products (same sub-type first). "Get a Quote" opens the headset form pre-filled with the product.
- **Search** – matches name, brand, model, sub-type, connection and workplace.
- **Footer** – Solutions column. **Quote page** – "Headsets & Meeting Room Audio" requirement type.
- **Compare** – `/compare-headsets?ids=…` (noindex), up to 3 products; missing data shows "Not specified".

Friendly sub-URLs redirect to the filter: `/products/headsets-audio-solutions/usb-headsets`, `/wireless-bluetooth-headsets`, `/call-centre-headsets`, `/meeting-room-audio`, `/headset-accessories`.

## Data
- Listings: `src/data/products.headsets.ts` (all `isDemo: true`; no price, stock or warranty).
- Optional `audio` field on `Product` (`src/data/types.ts`): `connectivity`, `link`, `wearing`, `microphone`, `platforms`, `workplace`.
- Platform certification is variant-specific — listings say "Teams / UC variants available — confirm exact SKU". Do not state certification without the exact SKU's documentation.

## Enquiries
Form: `src/components/forms/HeadsetQuoteForm.tsx`, kind `headset` (added to `src/lib/enquiry.ts` and `api/enquiry.ts` with required fields and subject). Without an endpoint it shows the honest demo-mode result.

## Images
Original Blender renders (`scripts/renders/products.py`: `headset_stereo`, `headset_mono`, `headset_wireless`, `speakerphone`, `headset_accessories`, `headset_workstation`), labelled representative. Replace with licensed manufacturer images by setting `images` on each listing.
