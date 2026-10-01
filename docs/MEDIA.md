# Images and video

All product imagery is either
- **PeopleLink photographs** from the supplied presentation (`public/images/audio-video/`), or
- **original 3D renders** made with Blender from `scripts/renders` (`public/images/products/`), labelled on the site as representative — they are not photographs of stock.

No stock photos, AI image services or third-party video are used, so there are no licences to track.

## Homepage showcase video
- Files: `public/video/zova-showcase.webm` (VP9, ~0.3 MB), `zova-showcase.mp4` (H.264, ~0.8 MB), poster `zova-showcase-poster.{webp,jpg}`.
- Built from the renders by `python3 scripts/video/make_showcase.py` (13 s loop, 1280×720, no audio). Re-run after changing renders.
- Plays muted, looped and inline, only while on screen. Visitors with reduced motion, data-saver/2G connections or screens under 640 px get the poster image instead.
- To use a licensed stock or brand video instead, replace the files with the same names (keep them under ~2 MB).

## Adding renders
Add a function in `scripts/renders/products.py`, register it in `render_all.py`, run `python3 scripts/renders/render_all.py <name>`, then add the key to `src/data/media.ts`.
