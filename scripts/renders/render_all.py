"""
Render product images into public/images/products/*.webp
Usage: python3 scripts/renders/render_all.py [name ...] [--fast]
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import lib  # noqa: E402
import products as P  # noqa: E402
from feather import feather  # noqa: E402
from PIL import Image  # noqa: E402

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
OUT = os.path.join(ROOT, "public", "images", "products")

JOBS = {
    "laptop-silver": lambda: P.laptop("silver")[0],
    "laptop-black": lambda: P.laptop("black", screen="screen_b.jpg")[0],
    "laptop-grey": lambda: P.laptop("grey", screen="screen_c.jpg")[0],
    "laptop-performance": lambda: P.laptop("gamer", screen="screen_c.jpg")[0],
    "laptop-hero": lambda: {**P.laptop("grey", tilt=-16)[0], "azim": -24, "elev": 17, "dist": 10.5},
    "desktop-tower": P.desktop_tower,
    "monitor": P.monitor,
    "all-in-one": P.all_in_one,
    "mini-pc": P.mini_pc,
    "server": P.server_rack,
    "keyboard-mouse": P.keyboard_mouse,
    "mouse": P.mouse,
    "headset": P.headset,
    "webcam": P.webcam,
    "ssd-ram": P.ssd_ram,
    "dock": P.dock,
    "charger": P.charger,
    "laptop-stand": P.stand,
    "printer": P.printer,
    "router": P.router,
    "switch": P.switch,
    "access-point": P.access_point,
    "external-drive": P.external_drive,
    "tablet": P.tablet,
    "signage": P.signage_display,
    "conference": P.conference,
    "firewall": P.firewall,
    "battery-parts": P.battery_parts,
    "cables": P.cables,
    "laptop-ports": P.ports_closeup,
    "projector": P.projector,
    "speakers": P.speakers,
    "video-wall": P.video_wall,
    "kiosk": P.kiosk,
    "menu-board": P.menu_board,
    "media-player": P.media_player,
    "smartphones": P.smartphones,
    "earbuds": P.earbuds,
    "smartwatch": P.smartwatch,
    "wireless-charger": P.wireless_charger,
    "cctv": P.cctv,
    "headset-stereo": P.headset_stereo,
    "headset-mono": P.headset_mono,
    "headset-wireless": P.headset_wireless,
    "speakerphone": P.speakerphone,
    "headset-accessories": P.headset_accessories,
    "headset-workstation": P.headset_workstation,
}


def run(name, fast=False):
    lib._mats.clear()
    lib.reset()
    lib.studio(key=1.15, rim=0.45, world=0.12)
    cam = JOBS[name]()
    lib.camera(cam["target"], cam["dist"], cam["elev"], cam["azim"], cam["lens"])
    tmp = f"/tmp/render_{name}.png"
    res = (1500, 1125) if name == "laptop-hero" else (1000, 750)
    if fast:
        res = (480, 360)
    lib.render(tmp, res=res, samples=24 if fast else 40)
    os.makedirs(OUT, exist_ok=True)
    im = Image.open(tmp)
    bbox = im.getchannel("A").point(lambda a: 255 if a > 8 else 0).getbbox()
    out = os.path.join(OUT, f"{name}.webp")
    im.save(out, "WEBP", quality=84, method=6)
    feather(out)
    print(name, "ok", im.size, "bbox", bbox, flush=True)


if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    fast = "--fast" in sys.argv
    for n in args or JOBS:
        run(n, fast)
