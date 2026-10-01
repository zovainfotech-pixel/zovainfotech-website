"""Procedural product models. Each builder creates geometry and returns camera settings."""
import math
import os

from lib import TEX, M, box, curve_tube, cyl, image_mat, mat, pivot, plane, sphere, torus

R = math.radians


def keyboard_keys(x0, x1, y0, y1, z, rows, cols, keymat, key_h=0.03, gap=0.028, space=True):
    kw = (x1 - x0 - gap * (cols - 1)) / cols
    kd = (y1 - y0 - gap * (rows - 1)) / rows
    for r in range(rows):
        y = y0 + r * (kd + gap) + kd / 2
        if space and r == 0:
            # bottom row: modifiers + wide space bar
            box((kw * 1.2, kd, key_h), (x0 + kw * 0.6, y, z), keymat, bevel=0.012)
            box((kw * 1.2, kd, key_h), (x1 - kw * 0.6, y, z), keymat, bevel=0.012)
            box((kw * 1.0, kd, key_h), (x0 + kw * 1.7 + gap, y, z), keymat, bevel=0.012)
            box((kw * 1.0, kd, key_h), (x1 - kw * 1.7 - gap, y, z), keymat, bevel=0.012)
            box((x1 - x0 - kw * 4.6 - gap * 4, kd, key_h), ((x0 + x1) / 2, y, z), keymat, bevel=0.012)
            continue
        for c in range(cols):
            x = x0 + c * (kw + gap) + kw / 2
            box((kw, kd, key_h), (x, y, z), keymat, bevel=0.012, segments=3)


def laptop(style="silver", tilt=-18, screen="screen_a.jpg", ports=True):
    m = M()
    body = {"silver": m["alu"], "grey": m["alu_dark"], "black": m["soft"], "gamer": m["black"]}[style]
    keym = m["key_light"] if style == "silver-light" else m["key"]
    W, D, T = 3.2, 2.2, 0.15
    box((W, D, T), (0, 0, T / 2), body, bevel=0.06, segments=6, name="base")
    # keyboard well
    box((W - 0.34, 1.0, 0.012), (0, 0.42, T + 0.001), m["port"], bevel=0.01)
    keyboard_keys(-1.36, 1.36, -0.06, 0.9, T + 0.018, 6, 14, keym, key_h=0.022, gap=0.03)
    # touchpad
    box((1.15, 0.7, 0.006), (0, -0.62, T + 0.001), {"silver": m["alu"], "grey": m["alu_dark"]}.get(style, m["black"]), bevel=0.03)
    if style == "gamer":
        box((W - 0.2, 0.02, 0.02), (0, -D / 2 + 0.01, T * 0.5), m["led_violet"], bevel=0.005)
    if ports:
        for i, x in enumerate((-0.9, -0.6, -0.35)):
            box((0.02, 0.16 if i else 0.1, 0.05), (-W / 2 - 0.001, -0.2 + i * 0.28, T / 2), m["port"], bevel=0.008, rot=(0, 0, 0))
        box((0.02, 0.2, 0.06), (W / 2 + 0.001, 0.0, T / 2), m["port"], bevel=0.008)
    # lid (built open at 90°, then tilted back about the hinge)
    lt = 0.07
    lid = box((W, lt, 2.1), (0, D / 2 - lt / 2, T + 1.05 + 0.02), body, bevel=0.05, segments=6, name="lid")
    bezel = box((W - 0.06, 0.004, 2.04), (0, D / 2 - lt - 0.001, T + 1.05 + 0.02), m["glass"], bevel=0.02, name="bezel")
    scr = plane((2.96, 1.82), (0, D / 2 - lt - 0.005, T + 1.1), image_mat("scr", os.path.join(TEX, screen), estr=1.0), rot=(R(90), 0, 0), name="screen")
    cam = cyl(0.018, 0.01, (0, D / 2 - lt - 0.006, T + 2.07), m["lens"], rot=(R(90), 0, 0))
    hinge = cyl(0.07, W - 0.6, (0, D / 2 - 0.06, T + 0.02), body, rot=(0, R(90), 0), bevel=0.02)
    pivot([lid, bezel, scr, cam], (0, D / 2 - 0.02, T + 0.02), (R(tilt), 0, 0))
    return dict(target=(0, 0.35, 0.95), dist=11, elev=20, azim=-32, lens=60), hinge


def desktop_tower():
    m = M()
    box((0.9, 2.0, 2.1), (0, 0, 1.05), m["black"], bevel=0.05, segments=5)
    box((0.02, 1.6, 1.7), (-0.451, 0.05, 1.1), m["glass"], bevel=0.01)
    box((0.005, 0.08, 1.2), (-0.462, -0.8, 1.1), m["led_blue"], bevel=0.002)
    cyl(0.05, 0.02, (-0.42, -0.95, 1.9), m["alu"], rot=(0, R(90), 0))
    for i in range(3):
        box((0.3, 0.02, 0.04), (0.3 - i * 0.02, -1.001, 1.85 - i * 0.1), m["port"], bevel=0.005)
    for i in range(4):
        cyl(0.04, 0.1, ((-0.3, 0.3)[i % 2], (-0.8, 0.8)[i // 2], 0.02), m["rubber"])
    return dict(target=(0, 0, 1.05), dist=8.5, elev=16, azim=-40, lens=60)


def monitor(w=4.2, h=2.45, screen="screen_b.jpg", stand=True, x=0.0, y=0.0):
    m = M()
    zc = 1.45 + h / 2 if stand else h / 2
    box((w, 0.08, h), (x, y, zc), m["black"], bevel=0.03, name="panel")
    box((w - 0.06, 0.004, h - 0.06), (x, y - 0.041, zc), m["glass"], bevel=0.01)
    plane((w - 0.14, h - 0.24), (x, y - 0.046, zc + 0.04), image_mat("mon" + screen, os.path.join(TEX, screen), estr=1.0), rot=(R(90), 0, 0))
    if stand:
        box((0.35, 0.1, 1.6), (x, y + 0.2, 0.95), m["alu"], bevel=0.04, rot=(R(-8), 0, 0))
        box((1.4, 0.95, 0.06), (x, y + 0.12, 0.03), m["alu"], bevel=0.03, segments=6)
    return dict(target=(x, y, zc - 0.3), dist=12, elev=12, azim=-30, lens=60)


def all_in_one():
    m = M()
    w, h = 4.2, 2.6
    box((w, 0.07, h + 0.45), (0, 0, 1.2 + h / 2 - 0.2), m["alu"], bevel=0.05, segments=6)
    box((w - 0.08, 0.004, h - 0.06), (0, -0.036, 1.2 + h / 2), m["glass"], bevel=0.01)
    plane((w - 0.2, h - 0.2), (0, -0.04, 1.2 + h / 2), image_mat("aio", os.path.join(TEX, "screen_c.jpg"), estr=1.0), rot=(R(90), 0, 0))
    box((0.9, 0.08, 1.4), (0, 0.45, 0.72), m["alu"], bevel=0.03, rot=(R(-22), 0, 0))
    box((1.3, 1.1, 0.05), (0, 0.4, 0.025), m["alu"], bevel=0.025)
    return dict(target=(0, 0, 1.9), dist=11.5, elev=12, azim=-28, lens=60)


def mini_pc():
    m = M()
    box((1.9, 1.9, 0.55), (0, 0, 0.3), m["black"], bevel=0.12, segments=8)
    box((1.7, 1.7, 0.02), (0, 0, 0.58), m["alu_dark"], bevel=0.06)
    cyl(0.05, 0.02, (-0.7, -0.951, 0.3), m["led_blue"], rot=(R(90), 0, 0))
    for i in range(3):
        box((0.18, 0.02, 0.07), (-0.3 + i * 0.28, -0.951, 0.3), m["port"], bevel=0.01)
    return dict(target=(0, 0, 0.3), dist=6.2, elev=28, azim=-35, lens=60)


def server_rack():
    m = M()
    for i in range(3):
        z = 0.25 + i * 0.52
        box((4.2, 2.8, 0.46), (0, 0, z), m["black"], bevel=0.02)
        box((4.1, 0.02, 0.38), (0, -1.41, z), m["mesh"], bevel=0.01)
        for j in range(8):
            box((0.4, 0.03, 0.12), (-1.6 + j * 0.46, -1.43, z + 0.08), m["alu_dark"], bevel=0.01)
        for j in range(4):
            cyl(0.025, 0.02, (1.8 - j * 0.1, -1.43, z - 0.1), m["led_blue"] if j % 2 else m["led_green"], rot=(R(90), 0, 0))
        box((0.12, 0.05, 0.4), (-2.12, -1.4, z), m["alu"], bevel=0.01)
        box((0.12, 0.05, 0.4), (2.12, -1.4, z), m["alu"], bevel=0.01)
    return dict(target=(0, 0, 0.8), dist=11, elev=20, azim=-30, lens=60)


def keyboard_mouse():
    m = M()
    box((4.4, 1.45, 0.12), (0, 0, 0.06), m["alu_dark"], bevel=0.05, segments=5, rot=(R(3), 0, 0))
    keyboard_keys(-2.05, 2.05, -0.6, 0.62, 0.15, 5, 15, m["key"], key_h=0.05, gap=0.035)
    mouse(x=3.1, y=-0.1)
    return dict(target=(0.5, 0, 0.1), dist=10, elev=34, azim=-18, lens=60)


def mouse(x=0.0, y=0.0):
    m = M()
    sphere(0.5, (x, y, 0.0), m["black"], scale=(0.62, 1.0, 0.36))
    cyl(0.03, 0.035, (x, y + 0.22, 0.15), m["rubber"], rot=(0, R(90), 0))
    return dict(target=(x, y, 0.1), dist=3.2, elev=30, azim=-35, lens=60)


def headset():
    m = M()
    torus(1.0, 0.07, (0, 0, 1.2), (R(90), 0, 0), m["black"])
    for s in (-1, 1):
        cyl(0.42, 0.32, (s * 1.0, 0, 0.55), m["black"], rot=(0, R(90), 0), bevel=0.08, segments=5)
        cyl(0.36, 0.14, (s * 0.8, 0, 0.55), m["fabric"], rot=(0, R(90), 0), bevel=0.06, segments=5)
        cyl(0.2, 0.02, (s * 1.17, 0, 0.55), m["alu"], rot=(0, R(90), 0))
    curve_tube([(-1.1, -0.1, 0.4), (-1.4, -0.7, 0.3), (-0.9, -1.2, 0.12)], 0.03, m["black"])
    sphere(0.06, (-0.9, -1.2, 0.12), m["black"])
    # cut away the lower half of the torus band visually by a floor overlap
    return dict(target=(0, 0, 0.9), dist=7.5, elev=12, azim=-25, lens=60)


def webcam():
    m = M()
    box((1.5, 0.45, 0.45), (0, 0, 0.9), m["black"], bevel=0.2, segments=8)
    cyl(0.16, 0.05, (0, -0.225, 0.9), m["alu"], rot=(R(90), 0, 0), bevel=0.02)
    cyl(0.12, 0.06, (0, -0.24, 0.9), m["lens"], rot=(R(90), 0, 0))
    cyl(0.025, 0.02, (0.45, -0.23, 0.95), m["led_blue"], rot=(R(90), 0, 0))
    box((0.3, 0.3, 0.6), (0, 0.05, 0.45), m["black"], bevel=0.05)
    box((0.9, 0.7, 0.06), (0, 0.05, 0.03), m["black"], bevel=0.03)
    return dict(target=(0, 0, 0.7), dist=5.2, elev=14, azim=-28, lens=60)


def ssd_ram():
    m = M()
    # 2.5" SSD
    box((1.4, 2.0, 0.14), (-0.95, 0.1, 0.07), m["alu_dark"], bevel=0.04, segments=5)
    box((1.1, 1.2, 0.002), (-0.95, 0.15, 0.141), m["black"], bevel=0.01)
    box((0.5, 0.06, 0.01), (-0.95, 0.5, 0.143), m["led_blue"], bevel=0.003)
    # M.2 stick
    box((0.45, 1.6, 0.02), (0.35, -0.15, 0.03), m["pcb"], bevel=0.005)
    for i in range(3):
        box((0.3, 0.32, 0.04), (0.35, 0.35 - i * 0.42, 0.06), m["chip"], bevel=0.005)
    for i in range(10):
        box((0.02, 0.08, 0.021), (0.19 + i * 0.035, -0.92, 0.03), m["gold"])
    # RAM stick
    box((0.35, 2.2, 0.03), (1.15, 0.05, 0.035), m["pcb"], bevel=0.004)
    for i in range(6):
        box((0.22, 0.26, 0.04), (1.15, 0.9 - i * 0.34, 0.07), m["chip"], bevel=0.005)
    for i in range(24):
        box((0.06, 0.02, 0.031), (1.29, -0.96 + i * 0.085, 0.035), m["gold"])
    return dict(target=(0.1, 0, 0.1), dist=6.8, elev=46, azim=-22, lens=60)


def dock():
    m = M()
    box((2.4, 0.9, 0.28), (0, 0, 0.14), m["alu_dark"], bevel=0.12, segments=8)
    for i, w in enumerate((0.12, 0.12, 0.16, 0.16, 0.2, 0.24)):
        box((w, 0.02, 0.07), (-0.85 + i * 0.33, -0.451, 0.14), m["port"], bevel=0.01)
    cyl(0.03, 0.02, (1.0, -0.452, 0.14), m["led_blue"], rot=(R(90), 0, 0))
    curve_tube([(1.2, 0.2, 0.14), (1.8, 0.4, 0.05), (2.3, -0.3, 0.05), (2.6, -0.8, 0.05)], 0.035, m["cable"])
    box((0.18, 0.3, 0.08), (2.65, -0.95, 0.05), m["alu_dark"], bevel=0.03)
    return dict(target=(0.5, -0.2, 0.15), dist=6.5, elev=30, azim=-22, lens=60)


def charger():
    m = M()
    box((0.9, 1.5, 0.35), (0, 0, 0.18), m["black"], bevel=0.1, segments=6)
    box((0.5, 0.02, 0.03), (0, -0.751, 0.2), m["led_green"], bevel=0.005)
    pts = [(0, 0.75, 0.15), (0.3, 1.4, 0.05), (1.3, 1.3, 0.05), (1.6, 0.4, 0.05), (1.2, -0.4, 0.05), (1.8, -1.0, 0.05)]
    curve_tube(pts, 0.04, m["cable"])
    box((0.16, 0.36, 0.1), (1.85, -1.15, 0.06), m["black"], bevel=0.04, rot=(0, 0, R(-30)))
    box((0.08, 0.14, 0.05), (1.95, -1.36, 0.06), m["alu"], bevel=0.02, rot=(0, 0, R(-30)))
    return dict(target=(0.8, 0, 0.2), dist=6.8, elev=40, azim=-18, lens=60)


def stand():
    m = M()
    box((2.4, 0.08, 1.8), (0, 0.2, 0.75), m["alu"], bevel=0.03, rot=(R(-62), 0, 0))
    box((2.4, 0.3, 0.12), (0, -0.55, 0.06), m["alu"], bevel=0.04)
    box((0.12, 1.6, 0.1), (-1.0, 0.1, 0.4), m["alu"], bevel=0.03, rot=(R(30), 0, 0))
    box((0.12, 1.6, 0.1), (1.0, 0.1, 0.4), m["alu"], bevel=0.03, rot=(R(30), 0, 0))
    box((2.2, 0.08, 0.1), (0, -0.25, 0.52), m["rubber"], bevel=0.03, rot=(R(-62), 0, 0))
    return dict(target=(0, 0, 0.6), dist=7.5, elev=18, azim=-38, lens=60)


def printer():
    m = M()
    box((4.0, 3.0, 1.8), (0, 0, 0.9), m["white"], bevel=0.1, segments=6)
    box((3.4, 2.6, 0.35), (0, 0.1, 1.97), m["grey"], bevel=0.06)
    box((3.0, 0.9, 0.02), (0, -1.2, 1.3), m["paper"], bevel=0.01, rot=(R(-8), 0, 0))
    box((1.3, 0.6, 0.06), (1.1, -1.35, 1.72), m["black"], bevel=0.03, rot=(R(-25), 0, 0))
    box((1.0, 0.4, 0.01), (1.1, -1.37, 1.76), m["led_blue"], bevel=0.02, rot=(R(-25), 0, 0))
    box((3.2, 0.06, 0.5), (0, -1.51, 0.5), m["grey"], bevel=0.02)
    box((0.8, 0.04, 0.06), (0, -1.55, 0.5), m["black"], bevel=0.02)
    return dict(target=(0, 0, 1.0), dist=13, elev=24, azim=-32, lens=60)


def router():
    m = M()
    box((2.6, 1.7, 0.3), (0, 0, 0.2), m["black"], bevel=0.1, segments=6)
    box((2.2, 1.3, 0.01), (0, 0, 0.35), m["mesh"], bevel=0.05)
    for i in range(6):
        cyl(0.025, 0.02, (-0.75 + i * 0.3, -0.851, 0.2), m["led_blue"] if i < 4 else m["led_green"], rot=(R(90), 0, 0))
    for x, rz in ((-1.1, 10), (-0.4, 4), (0.4, -4), (1.1, -10)):
        box((0.13, 0.05, 1.5), (x, 0.8, 0.9), m["black"], bevel=0.04, rot=(R(-8), R(rz), 0))
    return dict(target=(0, 0.2, 0.7), dist=8, elev=18, azim=-28, lens=60)


def switch():
    m = M()
    box((4.8, 1.6, 0.3), (0, 0, 0.15), m["alu_dark"], bevel=0.03)
    for r in range(2):
        for c in range(12):
            box((0.26, 0.03, 0.1), (-2.0 + c * 0.3 + (c // 6) * 0.15, -0.8, 0.09 + r * 0.12), m["port"], bevel=0.01)
            cyl(0.012, 0.01, (-2.07 + c * 0.3 + (c // 6) * 0.15, -0.81, 0.155 + r * 0.12 - 0.01), m["led_green"] if (c + r) % 3 else m["led_blue"], rot=(R(90), 0, 0))
    box((0.1, 0.05, 0.26), (-2.43, -0.8, 0.15), m["alu"], bevel=0.01)
    box((0.1, 0.05, 0.26), (2.43, -0.8, 0.15), m["alu"], bevel=0.01)
    return dict(target=(0, 0, 0.15), dist=8.5, elev=24, azim=-24, lens=60)


def access_point():
    m = M()
    cyl(1.1, 0.22, (0, 0, 0.12), m["white"], bevel=0.1, segments=6, verts=96)
    torus(0.45, 0.012, (0, 0, 0.235), (0, 0, 0), m["led_blue"])
    return dict(target=(0, 0, 0.1), dist=5.8, elev=38, azim=-20, lens=60)


def external_drive():
    m = M()
    box((1.2, 1.8, 0.22), (0, 0, 0.11), m["black"], bevel=0.1, segments=6)
    box((1.0, 1.0, 0.004), (0, -0.2, 0.221), m["alu_dark"], bevel=0.05)
    cyl(0.02, 0.01, (0.4, 0.75, 0.222), m["led_blue"])
    curve_tube([(0, 0.9, 0.1), (0.2, 1.4, 0.03), (0.9, 1.3, 0.03), (1.2, 0.6, 0.03)], 0.03, m["cable"])
    box((0.14, 0.3, 0.08), (1.25, 0.4, 0.04), m["alu"], bevel=0.02)
    return dict(target=(0.3, 0.3, 0.1), dist=5.5, elev=38, azim=-25, lens=60)


def tablet():
    m = M()
    box((1.7, 0.06, 2.4), (0, 0.4, 1.25), m["alu_dark"], bevel=0.1, segments=8, rot=(R(-18), 0, 0))
    box((1.62, 0.004, 2.32), (0, 0.37, 1.25), m["glass"], bevel=0.08, rot=(R(-18), 0, 0))
    plane((1.5, 2.2), (0, 0.365, 1.26), image_mat("tab", os.path.join(TEX, "screen_c.jpg"), estr=1.0), rot=(R(72), 0, 0))
    box((1.8, 0.8, 0.05), (0, 0.8, 0.03), m["alu_dark"], bevel=0.02)
    return dict(target=(0, 0.4, 1.2), dist=7.8, elev=14, azim=-30, lens=60)


def signage_display():
    m = M()
    box((1.9, 0.12, 3.4), (0, 0, 2.2), m["black"], bevel=0.04)
    plane((1.8, 3.3), (0, -0.065, 2.2), image_mat("sig", os.path.join(TEX, "signage.jpg"), estr=1.05), rot=(R(90), 0, 0))
    box((0.3, 0.3, 0.6), (0, 0.05, 0.3), m["alu"], bevel=0.05)
    box((1.2, 0.8, 0.06), (0, 0.05, 0.03), m["alu"], bevel=0.03)
    return dict(target=(0, 0, 2.0), dist=11, elev=10, azim=-30, lens=60)


def conference():
    m = M()
    monitor(w=4.6, h=2.6, screen="meeting.jpg")
    box((2.2, 0.35, 0.3), (0, -0.1, 1.45 + 2.6 + 0.25), m["black"], bevel=0.1, segments=6)
    for x in (-0.4, 0.0, 0.4):
        cyl(0.09, 0.04, (x, -0.28, 1.45 + 2.6 + 0.25), m["lens"], rot=(R(90), 0, 0))
    box((1.9, 0.02, 0.18), (0, -0.281, 1.45 + 2.6 + 0.19), m["mesh"], bevel=0.02)
    return dict(target=(0, 0, 2.6), dist=13.5, elev=10, azim=-26, lens=60)


def firewall():
    m = M()
    box((3.2, 2.0, 0.42), (0, 0, 0.21), m["black"], bevel=0.04)
    box((3.1, 0.02, 0.34), (0, -1.0, 0.21), m["mesh"], bevel=0.01)
    for c in range(8):
        box((0.22, 0.03, 0.12), (-1.1 + c * 0.28, -1.02, 0.21), m["port"], bevel=0.01)
    for c in range(3):
        cyl(0.025, 0.02, (1.2 + c * 0.1, -1.02, 0.3), m["led_violet"] if c == 0 else m["led_green"], rot=(R(90), 0, 0))
    return dict(target=(0, 0, 0.2), dist=7.5, elev=26, azim=-26, lens=60)


def battery_parts():
    m = M()
    box((2.4, 0.7, 0.22), (0, 0.4, 0.11), m["black"], bevel=0.05)
    for i in range(3):
        box((0.1, 0.06, 0.06), (-0.2 + i * 0.12, 0.05, 0.12), m["gold"], bevel=0.01)
    box((1.8, 1.0, 0.03), (0.2, -0.7, 0.02), m["pcb"], bevel=0.01)
    for i in range(5):
        box((0.25, 0.25, 0.05), (-0.5 + i * 0.35, -0.7, 0.06), m["chip"], bevel=0.01)
    cyl(0.28, 0.08, (1.6, 0.2, 0.05), m["black"], bevel=0.02)
    for i in range(9):
        a = i / 9 * math.tau
        box((0.2, 0.03, 0.05), (1.6 + math.cos(a) * 0.14, 0.2 + math.sin(a) * 0.14, 0.1), m["grey"], rot=(0, 0, a))
    return dict(target=(0.3, -0.1, 0.1), dist=6.5, elev=44, azim=-20, lens=60)


def cables():
    m = M()
    for k, (col, r0) in enumerate(((m["cable"], 0.8), (m["grey"], 0.55))):
        pts = []
        for i in range(34):
            a = i * 0.55
            rr = r0 * (1 - 0.012 * i)
            pts.append((math.cos(a) * rr + k * 1.4 - 0.6, math.sin(a) * rr, 0.04 + i * 0.004))
        curve_tube(pts, 0.035, col)
    box((0.18, 0.4, 0.1), (-0.3, -1.05, 0.05), m["alu"], bevel=0.03)
    box((0.18, 0.4, 0.1), (1.4, -0.9, 0.05), m["black"], bevel=0.03)
    return dict(target=(0.2, -0.1, 0.1), dist=6.0, elev=48, azim=-15, lens=60)


def ports_closeup():
    """Macro of a laptop's side ports and keyboard edge."""
    m = M()
    laptop("grey", tilt=-20)
    return dict(target=(-1.45, -0.2, 0.2), dist=3.6, elev=14, azim=-72, lens=70)


def projector():
    m = M()
    box((2.4, 2.0, 0.7), (0, 0, 0.4), m["white"], bevel=0.14, segments=6)
    cyl(0.36, 0.2, (-0.6, -1.02, 0.42), m["grey"], rot=(R(90), 0, 0), bevel=0.04)
    cyl(0.27, 0.22, (-0.6, -1.06, 0.42), m["lens"], rot=(R(90), 0, 0))
    for i in range(6):
        box((0.06, 0.02, 0.3), (0.3 + i * 0.12, -1.0, 0.42), m["grey"], bevel=0.01)
    cyl(0.03, 0.02, (0.95, -0.2, 0.76), m["led_blue"])
    for x, y in ((-0.9, -0.7), (0.9, -0.7), (-0.9, 0.7), (0.9, 0.7)):
        cyl(0.08, 0.1, (x, y, 0.03), m["rubber"])
    return dict(target=(0, 0, 0.4), dist=8.4, elev=22, azim=-30, lens=60)


def speakers():
    m = M()
    for x in (-0.9, 0.9):
        box((1.0, 1.0, 2.0), (x, 0, 1.0), m["black"], bevel=0.08, segments=5)
        cyl(0.36, 0.06, (x, -0.51, 0.72), m["mesh"], rot=(R(90), 0, 0), bevel=0.03)
        cyl(0.14, 0.05, (x, -0.52, 0.72), m["alu_dark"], rot=(R(90), 0, 0))
        cyl(0.16, 0.06, (x, -0.51, 1.55), m["mesh"], rot=(R(90), 0, 0), bevel=0.02)
        cyl(0.07, 0.05, (x, -0.52, 1.55), m["alu"], rot=(R(90), 0, 0))
    return dict(target=(0, 0, 1.0), dist=9.2, elev=14, azim=-26, lens=60)


def video_wall():
    m = M()
    for r in range(2):
        for c in range(3):
            x, z = (c - 1) * 1.62, 1.1 + r * 0.93
            box((1.6, 0.08, 0.91), (x, 0, z), m["black"], bevel=0.01)
    plane((4.8, 1.8), (0, -0.045, 1.565), image_mat("wall", os.path.join(TEX, "screen_c.jpg"), estr=1.0), rot=(R(90), 0, 0))
    box((0.2, 0.2, 0.7), (-1.8, 0.2, 0.35), m["alu"], bevel=0.03)
    box((0.2, 0.2, 0.7), (1.8, 0.2, 0.35), m["alu"], bevel=0.03)
    return dict(target=(0, 0, 1.4), dist=12.5, elev=10, azim=-24, lens=60)


def kiosk():
    """Free-standing touch kiosk: slim portrait screen on a pedestal."""
    m = M()
    box((1.5, 0.22, 2.6), (0, 0, 2.55), m["black"], bevel=0.06, segments=6)
    plane((1.36, 2.42), (0, -0.115, 2.55), image_mat("kiosk", os.path.join(TEX, "kiosk.jpg"), estr=1.05), rot=(R(90), 0, 0))
    box((1.1, 0.5, 1.3), (0, 0.1, 0.65), m["alu"], bevel=0.12, segments=6)
    box((1.6, 0.9, 0.06), (0, 0.1, 0.03), m["alu_dark"], bevel=0.03)
    cyl(0.03, 0.02, (0, -0.16, 0.9), m["led_blue"], rot=(R(90), 0, 0))
    return dict(target=(0, 0, 1.9), dist=11.5, elev=10, azim=-32, lens=60)


def menu_board():
    """Three landscape displays mounted side by side, showing a generic menu layout."""
    m = M()
    for i, x in enumerate((-1.72, 0.0, 1.72)):
        box((1.68, 0.08, 0.96), (x, 0, 1.6), m["black"], bevel=0.015)
        tex = "menu.jpg" if i != 1 else "menu_b.jpg"
        plane((1.6, 0.9), (x, -0.045, 1.6), image_mat(f"menu{i}", os.path.join(TEX, tex), estr=1.0), rot=(R(90), 0, 0))
    box((5.3, 0.06, 0.06), (0, 0.08, 1.6), m["alu"], bevel=0.02)
    return dict(target=(0, 0, 1.6), dist=7.6, elev=8, azim=-22, lens=60)


def media_player():
    """Compact signage media player with ports and a status LED."""
    m = M()
    box((2.2, 1.5, 0.32), (0, 0, 0.17), m["black"], bevel=0.08, segments=6)
    box((2.0, 1.3, 0.02), (0, 0, 0.335), m["alu_dark"], bevel=0.05)
    for i in range(2):
        box((0.26, 0.03, 0.1), (-0.5 + i * 0.36, -0.751, 0.17), m["port"], bevel=0.01)
    box((0.18, 0.03, 0.09), (0.25, -0.751, 0.17), m["port"], bevel=0.01)
    cyl(0.03, 0.02, (0.8, -0.751, 0.2), m["led_green"], rot=(R(90), 0, 0))
    cyl(0.03, 0.02, (-0.85, -0.751, 0.2), m["led_blue"], rot=(R(90), 0, 0))
    return dict(target=(0, 0, 0.2), dist=6.8, elev=26, azim=-32, lens=60)


def smartphones():
    """Two generic smartphones: one showing the screen, one showing the camera side. No logos."""
    m = M()
    back = mat("phone_back", (0.13, 0.16, 0.22), metal=0.6, rough=0.25, coat=0.6)
    frame = mat("phone_frame", (0.55, 0.58, 0.63), metal=1.0, rough=0.25)
    # Front phone
    box((0.78, 0.08, 1.62), (-0.55, 0, 0.85), frame, bevel=0.12, segments=10, rot=(R(-8), 0, R(8)))
    plane((0.7, 1.54), (-0.55 + 0.006, -0.046, 0.85), image_mat("phone", os.path.join(TEX, "phone.jpg"), estr=1.05), rot=(R(82), 0, R(8)))
    # Back phone with camera plateau
    box((0.78, 0.08, 1.62), (0.55, 0.35, 0.85), back, bevel=0.12, segments=10, rot=(R(-8), 0, R(-14)))
    plat = box((0.34, 0.03, 0.34), (0.44, 0.285, 1.42), back, bevel=0.08, segments=8, rot=(R(-8), 0, R(-14)))
    for dx, dz in ((-0.07, 0.07), (0.07, 0.07), (-0.07, -0.07)):
        cyl(0.055, 0.03, (0.44 + dx, 0.265, 1.42 + dz), m["lens"], rot=(R(82), 0, R(-14)))
    return dict(target=(0, 0.1, 0.85), dist=6.4, elev=10, azim=-18, lens=60)


def earbuds():
    """Generic wireless earbuds with a charging case."""
    m = M()
    white = m["white"]
    box((0.9, 0.38, 0.7), (-0.25, 0, 0.36), white, bevel=0.17, segments=12)
    box((0.9, 0.39, 0.02), (-0.25, 0, 0.5), mat("seam", (0.7, 0.72, 0.75), rough=0.4), bevel=0.01)
    cyl(0.025, 0.02, (-0.25, -0.2, 0.3), m["led_green"], rot=(R(90), 0, 0))
    for i, (x, y, rz) in enumerate(((0.55, -0.4, 25), (1.0, -0.05, -35))):
        sphere(0.13, (x, y, 0.13), white, scale=(1, 0.9, 0.85))
        cyl(0.045, 0.34, (x + 0.12 * (1 if i == 0 else -1), y - 0.02, 0.06), white, rot=(R(90), 0, R(rz)), bevel=0.02)
        sphere(0.06, (x - 0.06, y - 0.08, 0.16), mat("tip", (0.25, 0.27, 0.3), rough=0.6), scale=(1, 1, 0.8))
    return dict(target=(0.3, -0.1, 0.25), dist=4.6, elev=26, azim=-24, lens=60)


def smartwatch():
    """Generic smartwatch with a sport band."""
    m = M()
    case = mat("watch_case", (0.12, 0.14, 0.18), metal=0.9, rough=0.28)
    band = mat("band", (0.05, 0.12, 0.25), rough=0.7)
    box((0.8, 0.26, 0.95), (0, 0, 1.0), case, bevel=0.16, segments=12, rot=(R(-12), 0, 0))
    plane((0.7, 0.84), (0, -0.14, 1.0), image_mat("watch", os.path.join(TEX, "watch.jpg"), estr=1.1), rot=(R(78), 0, 0))
    cyl(0.06, 0.08, (0.43, -0.02, 1.12), m["alu"], rot=(0, R(90), 0), bevel=0.01)
    box((0.62, 0.12, 0.9), (0, 0.06, 1.85), band, bevel=0.05, rot=(R(-20), 0, 0))
    box((0.62, 0.12, 0.9), (0, 0.12, 0.2), band, bevel=0.05, rot=(R(6), 0, 0))
    return dict(target=(0, 0, 1.0), dist=7.4, elev=8, azim=-24, lens=60)


def wireless_charger():
    """Magnetic wireless charging puck with cable and USB-C power adapter."""
    m = M()
    white = m["white"]
    cyl(0.5, 0.1, (-0.5, 0, 0.05), white, bevel=0.03, segments=4)
    cyl(0.42, 0.012, (-0.5, 0, 0.105), mat("puck_top", (0.8, 0.82, 0.85), rough=0.25))
    box((0.55, 0.55, 0.5), (0.9, 0.3, 0.25), white, bevel=0.07, segments=8)
    box((0.14, 0.02, 0.06), (0.9, 0.02, 0.3), m["port"], bevel=0.01)
    curve_tube([(-0.5, 0.5, 0.05), (-0.3, 1.0, 0.02), (0.4, 0.9, 0.02), (0.9, 0.0, 0.3)], 0.025, mat("wcable", (0.9, 0.91, 0.93), rough=0.4))
    return dict(target=(0.2, 0.3, 0.2), dist=4.8, elev=30, azim=-20, lens=60)


def cctv():
    """Generic CCTV set: a dome camera and a bullet camera on a wall bracket. No logos."""
    m = M()
    white = m["white"]
    # Dome camera
    cyl(0.55, 0.12, (-0.7, 0, 0.06), white, bevel=0.04, segments=4)
    sphere(0.42, (-0.7, 0, 0.12), mat("dome", (0.03, 0.035, 0.05), rough=0.05, coat=1.0), scale=(1, 1, 0.75))
    cyl(0.12, 0.05, (-0.7, -0.26, 0.28), m["lens"], rot=(math.radians(60), 0, 0))
    # Bullet camera on bracket
    box((0.3, 0.3, 0.06), (0.9, 0.55, 0.03), white, bevel=0.02)
    cyl(0.06, 0.55, (0.9, 0.55, 0.3), white)
    body = cyl(0.26, 1.1, (0.9, 0.05, 0.6), white, rot=(math.radians(80), 0, 0), bevel=0.05, segments=4)
    box((0.62, 0.9, 0.06), (0.9, -0.05, 0.9), white, bevel=0.02, rot=(math.radians(-10), 0, 0))
    cyl(0.17, 0.04, (0.9, -0.5, 0.55), m["lens"], rot=(math.radians(80), 0, 0))
    for i in range(6):
        a = i / 6 * math.tau
        cyl(0.018, 0.02, (0.9 + 0.22 * math.cos(a), -0.505, 0.55 + 0.22 * math.sin(a)), m["led_violet"], rot=(math.radians(80), 0, 0))
    return dict(target=(0.1, 0, 0.4), dist=5.4, elev=22, azim=-28, lens=60)


# ——— Professional headsets (generic, unbranded) ———

def _band(m, width=1.0, top=1.55, z0=0.62, col=None):
    """Padded headband arc from ear cup to ear cup."""
    pts = []
    for i in range(9):
        a = math.pi * i / 8
        pts.append((-width * math.cos(a), 0.0, z0 + (top - z0) * math.sin(a)))
    curve_tube(pts, 0.055, col or m["black"], name="band")
    inner = [(x * 0.93, y, z - 0.07) for (x, y, z) in pts[2:7]]
    curve_tube(inner, 0.07, m["soft"], name="pad")


def _cup(m, side, z=0.55, shell=None, ring=None):
    s = side
    cyl(0.4, 0.2, (s * 1.02, 0, z), shell or m["black"], rot=(0, R(90), 0), bevel=0.08, segments=6)
    torus(0.33, 0.1, (s * 0.88, 0, z), (0, R(90), 0), m["soft"])
    cyl(0.22, 0.02, (s * 1.13, 0, z), ring or m["alu"], rot=(0, R(90), 0))


def _boom(m, z=0.55):
    curve_tube([(-1.08, -0.18, z - 0.05), (-1.05, -0.6, z - 0.2), (-0.8, -1.05, z - 0.28), (-0.52, -1.2, z - 0.28)], 0.035, m["black"], name="boom")
    sphere(0.085, (-0.5, -1.21, z - 0.28), m["mesh"], scale=(1.3, 1, 1))


def _usb_cable(m, plug="usb-a"):
    end = (1.2, 0.3, 0.04) if plug == "usb-a" else (1.27, 0.2, 0.05)
    curve_tube([(-1.02, 0.1, 0.3), (-1.2, 0.5, 0.05), (-0.4, 1.2, 0.03), (0.6, 1.0, 0.03), end], 0.025, m["cable"], name="cord")
    if plug == "usb-a":
        box((0.34, 0.16, 0.08), (1.4, 0.1, 0.05), m["black"], bevel=0.02, rot=(0, 0, R(-35)))
        box((0.16, 0.12, 0.05), (1.62, -0.05, 0.05), m["alu"], bevel=0.005, rot=(0, 0, R(-35)))
    else:
        box((0.28, 0.12, 0.07), (1.38, 0.12, 0.05), m["black"], bevel=0.03, rot=(0, 0, R(-35)))
        box((0.1, 0.08, 0.03), (1.55, 0.0, 0.05), m["alu"], bevel=0.012, rot=(0, 0, R(-35)))


def headset_stereo():
    """Wired stereo USB headset with boom microphone and inline cable."""
    m = M()
    _band(m)
    for s in (-1, 1):
        _cup(m, s)
    _boom(m)
    _usb_cable(m, "usb-a")
    box((0.12, 0.3, 0.1), (-0.7, 1.12, 0.06), m["black"], bevel=0.04, rot=(0, 0, R(20)))  # inline control
    return dict(target=(0.1, 0.1, 0.7), dist=7.4, elev=16, azim=-30, lens=60)


def headset_mono():
    """Contact-centre mono headset: single ear cup, T-bar stabiliser, flexible boom."""
    m = M()
    _band(m)
    _cup(m, -1)
    box((0.5, 0.12, 0.1), (1.0, 0, 0.62), m["black"], bevel=0.05, rot=(0, R(90), 0))  # T-bar
    box((0.12, 0.42, 0.14), (1.02, 0, 0.62), m["soft"], bevel=0.06)
    _boom(m)
    _usb_cable(m, "usb-c")
    return dict(target=(0.1, 0.1, 0.7), dist=7.4, elev=16, azim=-30, lens=60)


def headset_wireless():
    """Wireless stereo office headset on a charging stand, with a USB Bluetooth adapter."""
    m = M()
    stand_mat = mat("stand", (0.12, 0.13, 0.15), metal=0.5, rough=0.35)
    box((1.3, 0.9, 0.08), (0, 0, 0.04), stand_mat, bevel=0.04)
    box((0.14, 0.14, 1.9), (0, 0.1, 1.0), stand_mat, bevel=0.05)
    box((0.9, 0.3, 0.1), (0, 0.1, 1.95), m["soft"], bevel=0.05)
    cyl(0.03, 0.02, (0.4, -0.45, 0.085), m["led_blue"])
    shell = mat("shell_w", (0.16, 0.18, 0.22), metal=0.4, rough=0.3, coat=0.4)
    pts = []
    for i in range(9):
        a = math.pi * i / 8
        pts.append((-0.95 * math.cos(a), 0.1, 1.05 + 0.95 * math.sin(a)))
    curve_tube(pts, 0.055, shell, name="band")
    for s in (-1, 1):
        cyl(0.38, 0.2, (s * 0.97, 0.1, 1.0), shell, rot=(0, R(90), 0), bevel=0.08, segments=6)
        torus(0.31, 0.1, (s * 0.83, 0.1, 1.0), (0, R(90), 0), m["soft"])
        cyl(0.2, 0.02, (s * 1.08, 0.1, 1.0), m["alu"], rot=(0, R(90), 0))
    curve_tube([(-1.03, -0.05, 0.95), (-1.0, -0.5, 0.82), (-0.75, -0.85, 0.76)], 0.03, shell, name="boom")
    sphere(0.07, (-0.72, -0.87, 0.76), m["mesh"], scale=(1.3, 1, 1))
    # USB Bluetooth adapter lying in front
    box((0.34, 0.14, 0.06), (0.95, -0.9, 0.03), m["black"], bevel=0.025)
    box((0.16, 0.1, 0.035), (1.18, -0.9, 0.03), m["alu"], bevel=0.006)
    cyl(0.02, 0.01, (0.85, -0.9, 0.065), m["led_blue"])
    return dict(target=(0.1, -0.1, 1.0), dist=8.2, elev=12, azim=-28, lens=60)


def speakerphone():
    """Conference speakerphone puck with a status light ring and USB cable."""
    m = M()
    body = mat("puck", (0.1, 0.11, 0.13), metal=0.2, rough=0.4, coat=0.3)
    cyl(1.0, 0.22, (0, 0, 0.11), body, bevel=0.08, segments=6)
    cyl(0.86, 0.02, (0, 0, 0.225), m["mesh"])
    torus(0.9, 0.018, (0, 0, 0.225), material=m["led_blue"])
    for i in range(4):
        a = i / 4 * math.tau + 0.4
        cyl(0.07, 0.015, (0.55 * math.cos(a), 0.55 * math.sin(a), 0.235), m["alu"])
    curve_tube([(0.9, 0.3, 0.06), (1.4, 0.7, 0.03), (2.0, 0.4, 0.03)], 0.03, m["cable"])
    box((0.26, 0.12, 0.07), (2.15, 0.36, 0.04), m["black"], bevel=0.03)
    return dict(target=(0.4, 0.1, 0.1), dist=7.0, elev=30, azim=-24, lens=60)


def headset_accessories():
    """Replacement ear cushions, a USB-C to USB-A adapter and a coiled headset cable."""
    m = M()
    for i, x in enumerate((-1.1, -0.35)):
        torus(0.3, 0.12, (x, 0.2 - i * 0.1, 0.12), material=m["soft"])
    box((0.4, 0.2, 0.1), (0.6, -0.4, 0.05), m["black"], bevel=0.04)
    box((0.16, 0.12, 0.05), (0.86, -0.4, 0.05), m["alu"], bevel=0.008)
    box((0.1, 0.08, 0.03), (0.35, -0.4, 0.05), m["alu"], bevel=0.012)
    curve_tube([(0.2, 0.7, 0.03), (0.7, 0.9, 0.03), (1.2, 0.6, 0.03), (1.0, 0.2, 0.03), (1.5, 0.0, 0.03)], 0.025, m["cable"], name="lead")
    box((0.28, 0.12, 0.07), (1.68, -0.05, 0.04), m["black"], bevel=0.03)
    return dict(target=(0.25, 0.1, 0.1), dist=6.7, elev=34, azim=-18, lens=60)


def headset_workstation():
    """Contact-centre desk: laptop with headset on a stand and a speakerphone."""
    laptop("silver")
    m = M()
    # small headset stand to the left
    stand_mat = mat("stand2", (0.12, 0.13, 0.15), metal=0.5, rough=0.35)
    box((0.7, 0.6, 0.05), (-2.6, 0.2, 0.025), stand_mat, bevel=0.03)
    box((0.08, 0.08, 1.2), (-2.6, 0.3, 0.62), stand_mat, bevel=0.03)
    pts = []
    for i in range(9):
        a = math.pi * i / 8
        pts.append((-2.6 - 0.55 * math.cos(a), 0.3, 0.62 + 0.62 * math.sin(a)))
    curve_tube(pts, 0.04, m["black"], name="band")
    for s in (-1, 1):
        cyl(0.24, 0.13, (-2.6 + s * 0.57, 0.3, 0.6), m["black"], rot=(0, R(90), 0), bevel=0.05, segments=5)
        torus(0.2, 0.06, (-2.6 + s * 0.48, 0.3, 0.6), (0, R(90), 0), m["soft"])
    body = mat("puck2", (0.1, 0.11, 0.13), metal=0.2, rough=0.4, coat=0.3)
    cyl(0.5, 0.12, (2.4, -0.4, 0.06), body, bevel=0.04, segments=5)
    torus(0.45, 0.012, (2.4, -0.4, 0.121), material=m["led_blue"])
    return dict(target=(-0.2, 0, 0.7), dist=13.8, elev=16, azim=-22, lens=60)
