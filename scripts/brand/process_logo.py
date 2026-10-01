"""
Builds web-ready logo assets from the supplied artwork (scripts/brand/zova-logo-source.png):
transparent background, tight crops, a light variant for dark backgrounds, the Z mark,
favicons and a social-share image. Output: public/brand/*
"""
import os

import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.abspath(os.path.join(HERE, "..", "..", "public", "brand"))
os.makedirs(OUT, exist_ok=True)

src = Image.open(os.path.join(HERE, "zova-logo-source.png")).convert("RGB")
rgb = np.asarray(src).astype(np.float32)

# Colour-to-alpha against the near-white ground (treat >= 250 as pure white).
c = np.clip(rgb * (255.0 / 250.0), 0, 255)
alpha = np.max(255.0 - c, axis=2) / 255.0
alpha = np.clip((alpha - 0.02) / 0.98, 0, 1)  # drop faint JPEG-like noise in the ground
safe = np.maximum(alpha, 1e-4)[..., None]
col = np.clip((c - 255.0 * (1 - safe)) / safe, 0, 255)
rgba = np.dstack([col, alpha * 255.0]).astype(np.uint8)
base = Image.fromarray(rgba, "RGBA")

# Regions measured from the artwork
MARK = (92, 146, 456, 428)        # Z mark with orbit
WORDS = (92, 146, 1176, 428)      # mark + ZOVA + INFOTECH
FULL = (92, 146, 1176, 500)       # including tagline


def light_variant(img, word_x0):
    """Navy wordmark -> white and grey tagline -> light slate, for dark backgrounds. The mark keeps its gradient."""
    a = np.asarray(img).astype(np.float32).copy()
    h, w = a.shape[:2]
    r, g, b, al = a[..., 0], a[..., 1], a[..., 2], a[..., 3]
    lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
    xs = np.arange(w)[None, :].repeat(h, 0)
    navy = (lum < 95) & (b > r) & (xs >= word_x0) & (al > 0)
    grey = (np.abs(r - g) < 14) & (np.abs(g - b) < 14) & (lum < 140) & (al > 0)
    a[navy, 0:3] = 255
    a[grey, 0:3] = (214, 222, 235)
    return Image.fromarray(a.astype(np.uint8), "RGBA")


def save(img, name, width=None):
    if width and img.width > width:
        img = img.resize((width, round(img.height * width / img.width)), Image.LANCZOS)
    img.save(os.path.join(OUT, name + ".png"), optimize=True)
    img.save(os.path.join(OUT, name + ".webp"), "WEBP", quality=92, method=6)
    print(name, img.size)


words = base.crop(WORDS)
full = base.crop(FULL)
mark = base.crop(MARK)
word_x0 = 461 - WORDS[0]

save(words, "zova-logo", 720)
save(light_variant(words, word_x0), "zova-logo-light", 720)
save(full, "zova-logo-tagline", 900)
save(light_variant(full, word_x0), "zova-logo-tagline-light", 900)

# Square mark for favicons / app icons
side = max(mark.size)
sq = Image.new("RGBA", (side, side), (0, 0, 0, 0))
sq.alpha_composite(mark, ((side - mark.width) // 2, (side - mark.height) // 2))
save(sq, "zova-mark", 512)
root_public = os.path.dirname(OUT)
for s, n in ((32, "favicon-32.png"), (180, "apple-touch-icon.png"), (192, "icon-192.png"), (512, "icon-512.png")):
    tile = Image.new("RGBA", (s, s), (255, 255, 255, 0 if s == 32 else 255))
    pad = 0 if s == 32 else round(s * 0.1)
    m = sq.resize((s - 2 * pad, s - 2 * pad), Image.LANCZOS)
    tile.alpha_composite(m, (pad, pad))
    tile.save(os.path.join(root_public, n), optimize=True)
    print(n)

# Social share image (1200x630) on the brand's light ground
og = Image.new("RGBA", (1200, 630), (238, 246, 252, 255))
lg = full.resize((940, round(full.height * 940 / full.width)), Image.LANCZOS)
og.alpha_composite(lg, ((1200 - lg.width) // 2, (630 - lg.height) // 2))
og.convert("RGB").save(os.path.join(OUT, "og-image.jpg"), quality=90)
print("og-image.jpg")
