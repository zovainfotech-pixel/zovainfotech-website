# Audio & Video product showcase

Where it appears
- Home page: the Audio & Video Solutions section (`#av-solutions`), showing a featured product from each category plus a "View all" link.
- `/audio-video-solutions`: the full showcase (all categories, search, detail dialogs). `?cat=signage` (or any category id) opens a category directly.
- `/services/audio-visual-digital-signage`: the same section below "What's included".
- Header ("AV Solutions") and footer ("AV Products & Signage") link to the full page.

Source of content
- PeopleLink products: names, specifications and images are taken from the supplied `People_link.pptx` (slides 7–61). Images were cropped, trimmed of white margins and saved as WebP in `public/images/audio-video/` (`peoplelink-<product>.webp`, extra views `-2`, `-3`).
- Digital signage: the supplied "Driving Digital Engagement" slide provides the use cases. The seven signage entries are solution types (no brand/model) shown with original representative renders from `scripts/renders` (`kiosk`, `menu-board`, `media-player`, `signage`, `video-wall`, `conference`), labelled as such on every card.
- No prices, stock, warranties or authorised-partner claims are shown. Confirm you are permitted to use the manufacturer's images before launch.

Not included from the PPT
- iVision / iVision Pro-20x document cameras (slide 53): the embedded images are only ~100–190 px and would look broken. Add them once you have larger images.
- Overview/diagram slides (solutions wheel, room recommendations, automated-room bundles, classroom and OT layouts) were not turned into products.

Adding or editing a product
1. Save a WebP (≥ 800 px wide, white or transparent background) to `public/images/audio-video/`.
2. Add an entry to `avItems` in `src/data/avProducts.ts`: `slug`, `name`, `brand`, `category`, `kind: 'product'`, `summary`, `specs` (only confirmed values), optional `models`, `idealFor`, and `images` with the real pixel width/height.
3. New category: add it to `AvCategoryId`, `avCategories` and the colour map in `src/components/home/AvShowcase.tsx`.
4. Run `npm run typecheck && npm run build`.

Buttons
- "Request a quote" opens `/request-a-quote` with requirement type, brand and model pre-filled.
- "Enquire now" opens WhatsApp when a number is configured in `src/config/site.ts`, otherwise the contact form pre-filled with the product name.

Cut-outs used on dark backgrounds
- `public/images/audio-video/cutouts/` holds transparent versions of six dark PeopleLink products (soundbar, Quadro, UVC 15, i8 webcam, DSP-CM Pro, iCam 12X) used in the hero and the Boardroom AV card. Silver/white products were not cut out because automatic background removal altered their appearance.
