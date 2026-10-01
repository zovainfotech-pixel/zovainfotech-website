"""Generates generic, brand-free screen textures used on rendered displays."""
import os
import random

from PIL import Image, ImageDraw, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "textures")


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def gradient(w, h, c1, c2, c3):
    img = Image.new("RGB", (w, h))
    px = img.load()
    for y in range(h):
        for x in range(w):
            t = (x / w * 0.65 + y / h * 0.35)
            px[x, y] = lerp(c1, c2, t * 2) if t < 0.5 else lerp(c2, c3, (t - 0.5) * 2)
    return img


def dashboard(name, w=1600, h=1000, seed=1, palette=((6, 26, 62), (13, 80, 159), (10, 123, 193))):
    random.seed(seed)
    img = gradient(w // 4, h // 4, *palette).resize((w, h), Image.BICUBIC)
    glow = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    g = ImageDraw.Draw(glow)
    g.ellipse((w * 0.55, -h * 0.3, w * 1.2, h * 0.6), fill=(2, 198, 220, 70))
    img = Image.alpha_composite(img.convert("RGBA"), glow.filter(ImageFilter.GaussianBlur(120))).convert("RGB")
    d = ImageDraw.Draw(img, "RGBA")  # RGB base + RGBA draw = alpha blending
    r = int(h * 0.018)
    # sidebar
    d.rounded_rectangle((w * 0.03, h * 0.06, w * 0.19, h * 0.94), r * 2, fill=(255, 255, 255, 26))
    for i in range(7):
        y = h * (0.16 + i * 0.08)
        d.rounded_rectangle((w * 0.05, y, w * (0.12 + (i % 3) * 0.02), y + h * 0.022), r, fill=(255, 255, 255, 90 if i == 1 else 45))
    # top chart card
    d.rounded_rectangle((w * 0.22, h * 0.06, w * 0.97, h * 0.5), r * 2, fill=(255, 255, 255, 30))
    pts, x = [], w * 0.25
    val = 0.4
    while x < w * 0.94:
        val = min(0.9, max(0.1, val + random.uniform(-0.18, 0.2)))
        pts.append((x, h * 0.46 - val * h * 0.3))
        x += w * 0.045
    d.polygon(pts + [(pts[-1][0], h * 0.47), (pts[0][0], h * 0.47)], fill=(2, 198, 220, 40))
    d.line(pts, fill=(120, 235, 255, 255), width=int(h * 0.008), joint="curve")
    # tiles
    cols = [(2, 198, 220, 70), (90, 170, 240, 70), (10, 123, 193, 80)]
    for i in range(3):
        x0 = w * (0.22 + i * 0.255)
        d.rounded_rectangle((x0, h * 0.54, x0 + w * 0.235, h * 0.94), r * 2, fill=(255, 255, 255, 26))
        d.rounded_rectangle((x0 + w * 0.02, h * 0.6, x0 + w * 0.09, h * 0.64), r, fill=(255, 255, 255, 120))
        for j in range(4):
            bh = random.uniform(0.08, 0.22)
            d.rounded_rectangle((x0 + w * (0.025 + j * 0.05), h * (0.9 - bh), x0 + w * (0.055 + j * 0.05), h * 0.9), r // 2, fill=cols[i])
    os.makedirs(OUT, exist_ok=True)
    img.convert("RGB").save(os.path.join(OUT, name), quality=92)


def signage(name, w=1080, h=1920):
    img = gradient(w // 4, h // 4, (4, 22, 52), (13, 80, 159), (2, 198, 220)).resize((w, h), Image.BICUBIC).convert("RGB")
    d = ImageDraw.Draw(img, "RGBA")
    d.rounded_rectangle((w * 0.08, h * 0.08, w * 0.92, h * 0.5), 40, fill=(255, 255, 255, 36))
    d.ellipse((w * 0.25, h * 0.15, w * 0.75, h * 0.43), fill=(2, 198, 220, 90))
    for i in range(3):
        d.rounded_rectangle((w * 0.1, h * (0.58 + i * 0.1), w * (0.9 - i * 0.18), h * (0.62 + i * 0.1)), 20, fill=(255, 255, 255, 140 - i * 30))
    d.rounded_rectangle((w * 0.1, h * 0.86, w * 0.5, h * 0.92), 30, fill=(2, 198, 220, 220))
    img.convert("RGB").save(os.path.join(OUT, name), quality=92)


def meeting(name, w=1920, h=1080):
    img = gradient(w // 4, h // 4, (6, 24, 58), (13, 70, 140), (10, 123, 193)).resize((w, h), Image.BICUBIC).convert("RGB")
    d = ImageDraw.Draw(img, "RGBA")
    tints = [(13, 80, 159), (10, 123, 193), (2, 170, 200), (40, 140, 220)]
    for i in range(4):
        x0 = w * (0.04 + (i % 2) * 0.48)
        y0 = h * (0.06 + (i // 2) * 0.46)
        d.rounded_rectangle((x0, y0, x0 + w * 0.44, y0 + h * 0.42), 24, fill=tints[i] + (90,))
        cx, cy = x0 + w * 0.22, y0 + h * 0.2
        d.ellipse((cx - 55, cy - 80, cx + 55, cy + 30), fill=(255, 255, 255, 110))
        d.pieslice((cx - 130, cy + 30, cx + 130, cy + 230), 180, 360, fill=(255, 255, 255, 90))
    img.convert("RGB").save(os.path.join(OUT, name), quality=92)


def menu(name, w=1920, h=1080, seed=5):
    """Generic menu-board layout: title bar, item rows with price pills, a hero tile. No text."""
    random.seed(seed)
    img = gradient(w // 4, h // 4, (6, 30, 70), (13, 80, 159), (2, 170, 210)).resize((w, h), Image.BICUBIC).convert("RGB")
    d = ImageDraw.Draw(img, "RGBA")
    d.rounded_rectangle((w * 0.04, h * 0.06, w * 0.4, h * 0.16), 24, fill=(255, 255, 255, 200))
    for i in range(6):
        y = h * (0.24 + i * 0.115)
        d.rounded_rectangle((w * 0.04, y, w * random.uniform(0.3, 0.44), y + h * 0.045), 16, fill=(255, 255, 255, 150))
        d.rounded_rectangle((w * 0.48, y, w * 0.56, y + h * 0.045), 22, fill=(2, 198, 220, 235))
    d.rounded_rectangle((w * 0.62, h * 0.06, w * 0.96, h * 0.94), 36, fill=(255, 255, 255, 40))
    d.ellipse((w * 0.66, h * 0.16, w * 0.92, h * 0.62), fill=(120, 220, 240, 200))
    d.rounded_rectangle((w * 0.66, h * 0.72, w * 0.92, h * 0.84), 30, fill=(255, 255, 255, 210))
    img.save(os.path.join(OUT, name), quality=92)


def phone(name, w=900, h=1950):
    img = gradient(w // 4, h // 4, (4, 22, 52), (13, 80, 159), (2, 198, 220)).resize((w, h), Image.BICUBIC).convert("RGB")
    d = ImageDraw.Draw(img, "RGBA")
    d.rounded_rectangle((w * 0.36, h * 0.02, w * 0.64, h * 0.045), 30, fill=(0, 0, 0, 255))
    for r in range(4):
        for c in range(4):
            x0, y0 = w * (0.08 + c * 0.22), h * (0.14 + r * 0.1)
            d.rounded_rectangle((x0, y0, x0 + w * 0.16, y0 + w * 0.16), 36, fill=(255, 255, 255, 60 + ((r + c) % 3) * 40))
    d.rounded_rectangle((w * 0.08, h * 0.58, w * 0.92, h * 0.78), 50, fill=(255, 255, 255, 50))
    d.ellipse((w * 0.14, h * 0.61, w * 0.34, h * 0.61 + w * 0.2), fill=(2, 198, 220, 200))
    d.rounded_rectangle((w * 0.08, h * 0.88, w * 0.92, h * 0.95), 50, fill=(255, 255, 255, 70))
    img.save(os.path.join(OUT, name), quality=92)


def watch(name, w=800, h=960):
    img = Image.new("RGB", (w, h), (0, 0, 0))
    d = ImageDraw.Draw(img, "RGBA")
    cx, cy = w / 2, h / 2
    for i, (col, r) in enumerate([((2, 198, 220), 320), ((16, 165, 230), 250), ((120, 220, 240), 180)]):
        d.arc((cx - r, cy - r, cx + r, cy + r), -90, 180 - i * 60, fill=col + (255,), width=46)
    img.save(os.path.join(OUT, name), quality=92)


if __name__ == "__main__":
    phone("phone.jpg")
    watch("watch.jpg")
    menu("menu.jpg")
    menu("menu_b.jpg", seed=9)
    signage("kiosk.jpg")
    dashboard("screen_a.jpg", seed=3)
    dashboard("screen_b.jpg", seed=7, palette=((4, 30, 60), (8, 110, 170), (2, 180, 210)))
    dashboard("screen_c.jpg", seed=11, palette=((6, 24, 70), (20, 75, 160), (10, 150, 210)))
    signage("signage.jpg")
    meeting("meeting.jpg")
    print("textures ok")
