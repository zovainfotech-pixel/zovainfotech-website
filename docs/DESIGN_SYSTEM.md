# Zova Infotech design system

The logo (`scripts/brand/zova-logo-source.png`) is the source of truth. Colours were sampled from it:

| Logo element | Sampled | Token |
| --- | --- | --- |
| "ZOVA" wordmark | `#062F65` | `--brand-dark` |
| Z, deep side | `#0D509F` | `--brand-primary-deep` |
| Z, mid-tone | `#0A7BC1` | `--brand-secondary` |
| Z highlight / orbit ring | `#02C6DC` | `--brand-accent` |
| "INFOTECH" | ≈ `#10A5E6` | `--brand-azure` |
| Tagline | `#3C3C3C` | informs `--text-secondary` |

## Tokens (`src/index.css`, `:root`)

| Token | Value | Use |
| --- | --- | --- |
| `--brand-primary` | `#0C5DAE` | Buttons, links, active states (6.3:1 on white) |
| `--brand-secondary` | `#0A7BC1` | Gradient mid, icons |
| `--brand-accent` | `#02C6DC` | Highlights and glows (dark grounds) |
| `--brand-dark` | `#062F65` | Deep accents |
| `--brand-light` | `#EEF6FC` | Icon tiles, chips |
| `--background-primary` | `#F7F9FC` | Main page ground |
| `--background-card` | `#FFFFFF` | Cards |
| `--background-dark` | `#0B1220` | Footer, dark UI |
| `--background-hero` | `#07111F` | Hero, Microsoft & security, header at top |
| `--text-primary` | `#111827` | Headings, product names |
| `--text-secondary` | `#5B6472` | Body copy |
| `--text-muted` | `#7A8494` | Metadata |
| `--text-on-dark` | `#AAB4C3` | Supporting text on dark / footer |
| `--border` | `#E5EAF1` | Card borders |
| `--shadow-card` | `0 8px 30px rgb(11 18 32 / .06)` | Cards; hover adds a soft brand ring |
| `--gradient-primary` | `#0D509F → #0A7BC1 → #02C6DC` | CTA band, icon tiles |

## Light / dark rhythm (≈70 / 30)
Homepage (`src/pages/HomePage.tsx`, sections in `src/components/home/Premium.tsx`):
dark hero (ecosystem visual, trust marquee) → light value strip, "One Partner" ecosystem → dark product showcase (video + category carousel) → light communication (headsets), "Your Technology Partner", requirement-to-deployment journey → dark "Secure. Connected. Productive." → light procurement, new & refurbished, industries tabs, FAQ → dark requirement CTA → dark footer.

Navigation: Home · Products (grouped mega menu) · Solutions (mega menu) · Services · Cybersecurity · About Us · Contact · Request a Quote. Menu data lives in `src/components/layout/nav.ts`; global search also returns solutions and services.

## Typography
- One family site-wide: **Plus Jakarta Sans** (variable). H1 50–58 px / bold / −0.04em; H2 32–44 px extra-bold; H3 17–26 px; body 15–17 px, 1.6 line-height; labels 12 px uppercase with 0.14em tracking.

## Surfaces
- Dark sections (hero, Microsoft & data security, footer): `--background-hero` / `--background-dark` with soft brand radial light and a barely visible grid.
- Light sections alternate `--background-primary` and white; products sit in white or soft-grey containers with `object-fit: contain`.
- Small dark "technology" panels (solution-card visuals, the boardroom display) are the only dark elements inside light sections.
- Glass is limited to floating chips and the header.

## Motion (levels)
1. Background — slow gradient drift, faint grid, a few particles.
2. Sections — fade/slide on scroll with stagger (`Reveal`, `RevealGroup`); a safety net reveals content that was scrolled past quickly.
3. Cards — lift, subtle 3D tilt, glow border, image zoom on hover.
4. CTAs — gradient shift and small arrow nudge.
5. Product visuals — pointer parallax, gentle float, light sweep.

All CSS loops stop and motion is reduced under `prefers-reduced-motion`.

## Icons
lucide-react only, 1.5–2 px stroke, placed in rounded tiles using `--gradient-primary` (light) or aqua-tinted glass (dark).

## Product imagery
- PeopleLink photos from the supplied PPT: `public/images/audio-video/` (white-background, shown in consistent 4:3 containers with a soft brand-tinted base) and `public/images/audio-video/cutouts/` (transparent, dark products only, used on dark grounds).
- Original 3D renders (`scripts/renders`) were re-lit and re-textured in the logo palette (royal blue key, aqua rim, navy/blue/aqua screens).
