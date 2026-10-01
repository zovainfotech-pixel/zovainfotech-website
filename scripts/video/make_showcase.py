"""
Builds the homepage product-showcase video from the project's own original 3D renders
(public/images/products/*.webp). No stock footage is used.

Output: public/video/zova-showcase.mp4 (H.264), .webm (VP9) and a poster image.
Run:  python3 scripts/video/make_showcase.py
"""
import math
import os
import subprocess

from PIL import Image, ImageDraw, ImageFilter

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
IMG = os.path.join(ROOT, "public", "images", "products")
OUT = os.path.join(ROOT, "public", "video")
W, H, FPS = 1280, 720, 30
SCENE = 3.2  # seconds per scene
FADE = 0.6

# (render, x-centre %, y-centre %, width %, depth) — depth drives parallax speed
SCENES = [
    [("monitor", 0.72, 0.42, 0.42, 0.3), ("laptop-hero", 0.46, 0.56, 0.62, 0.8), ("dock", 0.2, 0.8, 0.2, 1.2)],
    [("laptop-grey", 0.3, 0.56, 0.44, 0.6), ("smartphones", 0.62, 0.58, 0.3, 1.0), ("earbuds", 0.82, 0.74, 0.22, 1.3), ("smartwatch", 0.86, 0.34, 0.16, 0.9)],
    [("server", 0.3, 0.5, 0.4, 0.5), ("switch", 0.72, 0.3, 0.36, 0.8), ("router", 0.72, 0.7, 0.26, 1.2), ("firewall", 0.2, 0.86, 0.22, 1.1)],
    [("video-wall", 0.4, 0.44, 0.56, 0.4), ("conference", 0.74, 0.56, 0.36, 0.8), ("kiosk", 0.14, 0.62, 0.2, 1.1), ("cctv", 0.84, 0.82, 0.22, 1.3)],
]


def load(name):
    p = os.path.join(IMG, f"{name}.webp")
    if not os.path.exists(p):
        return None
    im = Image.open(p).convert("RGBA")
    bbox = im.getchannel("A").point(lambda a: 255 if a > 6 else 0).getbbox()
    return im.crop(bbox) if bbox else im


def background(t):
    """Dark navy ground with slowly drifting brand glow, fine grid and a light sweep."""
    bg = Image.new("RGB", (W, H), (7, 17, 31))
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    g = ImageDraw.Draw(glow)
    cx = W * (0.55 + 0.12 * math.sin(t * 0.35))
    cy = H * (0.45 + 0.06 * math.cos(t * 0.3))
    g.ellipse((cx - 520, cy - 320, cx + 520, cy + 320), fill=(10, 123, 193, 90))
    g.ellipse((W * 0.05 - 260, H * 0.95 - 180, W * 0.05 + 260, H * 0.95 + 180), fill=(2, 198, 220, 40))
    bg = Image.alpha_composite(bg.convert("RGBA"), glow.filter(ImageFilter.GaussianBlur(120)))
    return Image.alpha_composite(bg, GRID)


def _grid():
    g = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(g)
    for x in range(0, W, 56):
        d.line((x, 0, x, H), fill=(255, 255, 255, 10))
    for y in range(0, H, 56):
        d.line((0, y, W, y), fill=(255, 255, 255, 10))
    return g


GRID = _grid()


SPRITES = [[(load(n), x, y, w, dpt) for (n, x, y, w, dpt) in s] for s in SCENES]


def scene_frame(i, local_t):
    """Render scene i at local time local_t (0..SCENE) with push-in and parallax drift."""
    frame = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    k = local_t / SCENE
    zoom = 1.0 + 0.06 * k
    for spr, x, y, w, dpt in SPRITES[i]:
        if spr is None:
            continue
        tw = int(W * w * zoom)
        th = int(spr.height * tw / spr.width)
        im = spr.resize((tw, th), Image.LANCZOS)
        dx = (k - 0.5) * 60 * dpt
        dy = math.sin(local_t * 1.4 + dpt * 3) * 6 * dpt
        px = int(W * x - tw / 2 - dx)
        py = int(H * y - th / 2 + dy)
        layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        layer.paste(im, (px, py))
        frame = Image.alpha_composite(frame, layer)
    return frame


def sweep(frame, t):
    s = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(s)
    period = SCENE
    p = (t % period) / period
    x = -400 + p * (W + 800)
    d.polygon([(x, 0), (x + 180, 0), (x - 120, H), (x - 300, H)], fill=(255, 255, 255, 14))
    return Image.alpha_composite(frame, s.filter(ImageFilter.GaussianBlur(30)))


def main():
    os.makedirs(OUT, exist_ok=True)
    total = SCENE * len(SCENES)
    n = int(total * FPS)
    tmp = os.path.join(OUT, "_frames.raw")
    with open(tmp, "wb") as f:
        for fi in range(n):
            t = fi / FPS
            si = int(t // SCENE) % len(SCENES)
            lt = t - si * SCENE
            bg = background(t)
            cur = scene_frame(si, lt)
            # cross-fade into the next scene (wraps to the first for a seamless loop)
            if lt > SCENE - FADE:
                a = (lt - (SCENE - FADE)) / FADE
                nxt = scene_frame((si + 1) % len(SCENES), lt - SCENE)
                cur = Image.blend(cur, nxt, a)
            out = sweep(Image.alpha_composite(bg, cur), t).convert("RGB")
            if fi == int(0.9 * FPS):
                out.save(os.path.join(OUT, "zova-showcase-poster.jpg"), quality=82, optimize=True, progressive=True)
                out.save(os.path.join(OUT, "zova-showcase-poster.webp"), quality=80)
            f.write(out.tobytes())
    base = ["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", tmp]
    subprocess.run(base + ["-c:v", "libx264", "-preset", "slow", "-crf", "27", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an", os.path.join(OUT, "zova-showcase.mp4")], check=True)
    subprocess.run(base + ["-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "46", "-row-mt", "1", "-an", os.path.join(OUT, "zova-showcase.webm")], check=True)
    os.remove(tmp)
    for fn in sorted(os.listdir(OUT)):
        print(fn, os.path.getsize(os.path.join(OUT, fn)) // 1024, "KB")


if __name__ == "__main__":
    main()
