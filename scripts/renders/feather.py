"""Fades each render's alpha to zero near the frame edges so soft floor shadows never show a hard border."""
import glob
import os
import sys

import numpy as np
from PIL import Image

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))


def feather(path, margin=0.14):
    im = Image.open(path).convert("RGBA")
    a = np.asarray(im).astype(np.float32)
    h, w = a.shape[:2]
    ys = np.minimum(np.arange(h), np.arange(h)[::-1]) / (h * margin)
    xs = np.minimum(np.arange(w), np.arange(w)[::-1]) / (w * margin)
    m = np.clip(np.minimum.outer(ys, xs), 0, 1)
    m = m * m * (3 - 2 * m)  # smoothstep
    a[..., 3] *= m
    Image.fromarray(a.astype(np.uint8), "RGBA").save(path, "WEBP", quality=84, method=6)


if __name__ == "__main__":
    files = sys.argv[1:] or glob.glob(os.path.join(ROOT, "public", "images", "products", "*.webp"))
    for f in files:
        feather(f)
        print("feathered", os.path.basename(f))
