# Testing summary

Latest run: 28 Sep 2026, after the visual upgrade, against the production build (`vite preview`) in headless Chromium.

| Check | Command | Result |
| --- | --- | --- |
| TypeScript (app + Vite config + API function) | `npm run typecheck` | Pass, 0 errors |
| Lint (Oxlint) | `npm run lint` | Pass, 0 warnings / 0 errors |
| Production build | `npm run build` | Pass. Main JS 502 kB (154 kB gzip); pages code-split; CSS 132 kB (33 kB gzip); 30 product renders ≈ 2 MB total, lazy-loaded |
| Route smoke test — 30 URLs at 390 px, 820 px and 1440 px | `npm run test:smoke` | Pass: no console errors, no horizontal overflow, one `<h1>` and a meta description per page |
| Catalogue | smoke suite | Pass: condition filter (47 → 5) synced to URL, search, empty state, clear filters, grid/list, sorting |
| Product → quote pre-fill | smoke suite | Pass |
| Form validation and focus | smoke suite | Pass: 6 inline errors on empty submit; focus moves to first invalid field |
| Demo-mode submission | smoke suite | Pass: “Demo mode — not sent”, no delivery claimed |
| Images | smoke suite (7 key pages, scrolled) | Pass: no failed image requests or broken images |
| Image fallback | Playwright with image requests blocked | Pass: illustrated fallbacks render in place of failed images |
| Reduced motion | smoke suite with `prefers-reduced-motion: reduce` | Pass: no errors; hero heading fully visible immediately |
| Mega-menu (hover, click, Esc), search dialog, FAQ, corporate line items, skip link | smoke suite / scripts | Pass |
| Live enquiry mode and API handler | Earlier run (unchanged code) | Pass: reference returned from mock API; 503/422/405/200 handler paths |
| Visual review | Full-page screenshots, desktop and mobile | Reviewed. Fixed: headline/circuit overlap, image edge halos, wrapping card buttons, orphaned solution card |

## AV showcase (29 Sep 2026)
| Check | Result |
| --- | --- |
| Typecheck, lint, production build | Pass (0 errors, 0 warnings) |
| Smoke suite, now 32 routes incl. `/audio-video-solutions` and `?cat=signage`, at 3 widths | Pass: no console errors, no horizontal overflow |
| Category filters (43 items, 8 categories), search, empty state | Pass |
| Detail dialog (gallery, Esc, focus return), quote pre-fill (brand + model), contact pre-fill | Pass |
| All 69 AV images load (dev and single-file preview) | Pass |
| Header with added "AV Solutions" item at 1408–1920 px (desktop nav breakpoint moved to 88rem) | Pass: no overflow |

## Homepage upgrade (29 Sep 2026)
| Check | Result |
| --- | --- |
| Typecheck, lint, build | Pass |
| Smoke suite, 33 routes incl. `/microsoft-security`, 3 widths | Pass: no console errors, no overflow |
| All 108 internal links on the home page (header + main) resolve to real pages | Pass |
| Header fits without overflow from 1280 px to 1920 px (condensed labels 1280–1535 px, full labels from 1536 px); drawer below 1280 px | Pass |
| "Explore Solutions" scrolls to the four solution cards; Digital Signage nav item highlights on `?cat=signage` | Pass |
| Reduced motion: hero readable immediately, CSS loops disabled | Pass |

## Not yet tested
- Real email delivery (needs Resend key and verified domain).
- Safari, Firefox and physical devices (automated runs used Chromium).
- Lighthouse / Core Web Vitals on a deployed URL.
- A manual screen-reader pass.

## Enquiry email delivery (30 Sep 2026)
| Check | Command | Result |
| --- | --- | --- |
| API handler integration tests (mock Resend, no real email) | `npm run test:enquiry` | Pass, 21/21: all 5 form kinds emailed to zovainfotech@gmail.com with subject `New Quote Request \| ZOVA INFOTECH \| …`, reply-to = customer, sender never the customer; 503 when unconfigured; 422 validation (email, Indian mobile, required fields, quantity); HTML escaping; no subject header injection; honeypot; duplicate submission id; 5xx retry with same Idempotency-Key then 502; 403 no retry; backup-log record on failure; rate limit 429; 415 non-JSON |
| Browser test of every form through the real handler | `npm run serve:test` + `node tests/forms.e2e.mjs` | Pass, 38/38: Get a Quote (desktop + mobile), request-a-model, headset quote (tablet), Contact Us (desktop + mobile), corporate, vendor. Success only after API acceptance, reference shown, double-click sends one email, outage shows error + keeps data + offers phone/email, retry succeeds |
| Route smoke test (now against `serve:test`) | `npm run test:smoke` | Pass |
| **Real delivery to zovainfotech@gmail.com** | live site after setup | **Not yet verified** — requires the Resend account and `RESEND_API_KEY` on the deployment (docs/ENQUIRY_INTEGRATION.md) |
