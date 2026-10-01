"""
Procedural studio-render helpers (Blender `bpy` module, Cycles).

Generates ORIGINAL, unbranded product renders for the website so every
category has a clean, consistent image without licensing issues.
Run:  python3 scripts/renders/render_all.py   (requires `pip install bpy`)
"""
import math
import os

import bpy
from mathutils import Vector

HERE = os.path.dirname(os.path.abspath(__file__))
TEX = os.path.join(HERE, "textures")

# Brand colours taken from the Zova logo (royal blue #0A7BC1 and aqua #02C6DC).
BLUE = (0.039, 0.482, 0.757)
VIOLET = (0.008, 0.776, 0.863)  # aqua rim/LED (kept name for compatibility)
CYAN = (0.137, 0.835, 1.0)


def srgb(c):
    """Convert sRGB 0-1 tuple to linear for Blender colour inputs."""
    def ch(v):
        return v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4
    return tuple(ch(v) for v in c[:3]) + (1.0,)


def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    s = bpy.context.scene
    s.render.engine = "CYCLES"
    s.cycles.device = "CPU"
    s.cycles.use_adaptive_sampling = True
    s.cycles.adaptive_threshold = 0.02
    s.cycles.use_denoising = True
    s.cycles.max_bounces = 6
    s.cycles.glossy_bounces = 3
    s.cycles.transmission_bounces = 3
    s.render.film_transparent = True
    s.view_settings.view_transform = "AgX"
    s.view_settings.look = "AgX - Medium High Contrast"
    s.render.image_settings.file_format = "PNG"
    s.render.image_settings.color_mode = "RGBA"
    return s


_mats = {}


def mat(name, color=(0.5, 0.5, 0.5), metal=0.0, rough=0.5, emit=None, estr=0.0, coat=0.0, alpha=1.0, trans=0.0, ior=1.45):
    key = name
    if key in _mats:
        return _mats[key]
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = srgb(color)
    b.inputs["Metallic"].default_value = metal
    b.inputs["Roughness"].default_value = rough
    b.inputs["Coat Weight"].default_value = coat
    b.inputs["Transmission Weight"].default_value = trans
    b.inputs["IOR"].default_value = ior
    if alpha < 1:
        b.inputs["Alpha"].default_value = alpha
    if emit:
        b.inputs["Emission Color"].default_value = srgb(emit)
        b.inputs["Emission Strength"].default_value = estr
    _mats[key] = m
    return m


def image_mat(name, path, estr=1.0, rough=0.15):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    b = nt.nodes["Principled BSDF"]
    tex = nt.nodes.new("ShaderNodeTexImage")
    tex.image = bpy.data.images.load(path)
    b.inputs["Base Color"].default_value = (0.004, 0.004, 0.006, 1)
    nt.links.new(tex.outputs["Color"], b.inputs["Emission Color"])
    b.inputs["Emission Strength"].default_value = estr
    b.inputs["Roughness"].default_value = rough
    b.inputs["Specular IOR Level"].default_value = 0.6
    return m


def _finish(o, material, bevel, segments):
    if material is not None:
        o.data.materials.append(material)
    if bevel > 0:
        md = o.modifiers.new("bevel", "BEVEL")
        md.width = bevel
        md.segments = segments
        md.limit_method = "ANGLE"
        md.harden_normals = True
    for p in o.data.polygons:
        p.use_smooth = True
    return o


def box(size, loc=(0, 0, 0), material=None, bevel=0.01, segments=4, rot=(0, 0, 0), name="box"):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc, rotation=rot)
    o = bpy.context.object
    o.name = name
    o.scale = size
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    return _finish(o, material, bevel, segments)


def cyl(r, depth, loc=(0, 0, 0), material=None, rot=(0, 0, 0), verts=64, bevel=0.0, segments=3, name="cyl"):
    bpy.ops.mesh.primitive_cylinder_add(radius=r, depth=depth, location=loc, rotation=rot, vertices=verts)
    o = bpy.context.object
    o.name = name
    return _finish(o, material, bevel, segments)


def sphere(r, loc=(0, 0, 0), material=None, scale=(1, 1, 1), name="sphere"):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=r, location=loc, segments=48, ring_count=24)
    o = bpy.context.object
    o.name = name
    o.scale = scale
    for p in o.data.polygons:
        p.use_smooth = True
    if material:
        o.data.materials.append(material)
    return o


def torus(major, minor, loc=(0, 0, 0), rot=(0, 0, 0), material=None, name="torus"):
    bpy.ops.mesh.primitive_torus_add(major_radius=major, minor_radius=minor, location=loc, rotation=rot, major_segments=64, minor_segments=24)
    o = bpy.context.object
    o.name = name
    for p in o.data.polygons:
        p.use_smooth = True
    if material:
        o.data.materials.append(material)
    return o


def plane(size, loc, material=None, rot=(0, 0, 0), name="plane"):
    bpy.ops.mesh.primitive_plane_add(size=1, location=loc, rotation=rot)
    o = bpy.context.object
    o.name = name
    o.scale = (size[0], size[1], 1)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if material:
        o.data.materials.append(material)
    return o


def curve_tube(points, radius, material=None, name="cable"):
    cd = bpy.data.curves.new(name, "CURVE")
    cd.dimensions = "3D"
    cd.bevel_depth = radius
    cd.bevel_resolution = 6
    sp = cd.splines.new("BEZIER")
    sp.bezier_points.add(len(points) - 1)
    for bp, p in zip(sp.bezier_points, points):
        bp.co = p
        bp.handle_left_type = bp.handle_right_type = "AUTO"
    o = bpy.data.objects.new(name, cd)
    bpy.context.collection.objects.link(o)
    if material:
        o.data.materials.append(material)
    return o


def pivot(objs, loc, rot):
    """Parent objects to an empty at `loc` and rotate it (used for hinged lids)."""
    e = bpy.data.objects.new("pivot", None)
    e.location = loc
    bpy.context.collection.objects.link(e)
    bpy.context.view_layer.update()
    for o in objs:
        mw = o.matrix_world.copy()
        o.parent = e
        o.matrix_parent_inverse = e.matrix_world.inverted()
        o.matrix_world = mw
    e.rotation_euler = rot
    return e


def studio(key=1.0, rim=1.0, floor=True, world=0.08):
    s = bpy.context.scene
    w = bpy.data.worlds.new("w")
    w.use_nodes = True
    bg = w.node_tree.nodes["Background"]
    bg.inputs["Color"].default_value = srgb((0.55, 0.6, 0.8))
    bg.inputs["Strength"].default_value = world
    s.world = w

    def area(name, loc, energy, size, color=(1, 1, 1), target=(0, 0, 0.5)):
        ld = bpy.data.lights.new(name, "AREA")
        ld.energy = energy
        ld.size = size
        ld.color = color[:3]
        o = bpy.data.objects.new(name, ld)
        o.location = loc
        bpy.context.collection.objects.link(o)
        d = Vector(target) - Vector(loc)
        o.rotation_euler = d.to_track_quat("-Z", "Y").to_euler()
        return o

    area("key", (-4, -5, 6), 1400 * key, 5)
    area("fill", (6, -3, 3), 450 * key, 5)
    area("top", (0, 0, 8), 300 * key, 6)
    area("rimL", (-5, 5, 3), 900 * rim, 3, color=srgb(BLUE))
    area("rimR", (5, 5, 3), 900 * rim, 3, color=srgb(VIOLET))
    if floor:
        f = plane((60, 60), (0, 0, 0), name="floor")
        f.is_shadow_catcher = True


def camera(target, dist, elev=22, azim=-35, lens=70):
    s = bpy.context.scene
    cd = bpy.data.cameras.new("cam")
    cd.lens = lens
    c = bpy.data.objects.new("cam", cd)
    bpy.context.collection.objects.link(c)
    t = Vector(target)
    a, e = math.radians(azim), math.radians(elev)
    c.location = t + Vector((math.sin(a) * math.cos(e), -math.cos(a) * math.cos(e), math.sin(e))) * dist
    c.rotation_euler = (t - c.location).to_track_quat("-Z", "Y").to_euler()
    s.camera = c
    return c


def render(path, res=(1200, 900), samples=64):
    s = bpy.context.scene
    s.render.resolution_x, s.render.resolution_y = res
    s.render.resolution_percentage = 100
    s.cycles.samples = samples
    s.render.filepath = path
    bpy.ops.render.render(write_still=True)


# ── Shared materials ───────────────────────────────────────────────────────
def M():
    return {
        "alu": mat("alu", (0.78, 0.8, 0.83), metal=1.0, rough=0.3),
        "alu_dark": mat("alu_dark", (0.3, 0.31, 0.34), metal=1.0, rough=0.32),
        "black": mat("black", (0.03, 0.032, 0.038), rough=0.45, coat=0.2),
        "soft": mat("soft", (0.022, 0.024, 0.03), rough=0.75),
        "key": mat("key", (0.035, 0.037, 0.045), rough=0.55),
        "key_light": mat("key_light", (0.9, 0.91, 0.93), rough=0.45),
        "glass": mat("glass", (0.01, 0.01, 0.015), rough=0.05, coat=1.0),
        "white": mat("white", (0.92, 0.93, 0.95), rough=0.35, coat=0.3),
        "grey": mat("grey", (0.45, 0.47, 0.52), rough=0.4),
        "rubber": mat("rubber", (0.02, 0.02, 0.02), rough=0.85),
        "port": mat("port", (0.005, 0.005, 0.006), rough=0.6),
        "gold": mat("gold", (1.0, 0.78, 0.35), metal=1.0, rough=0.25),
        "pcb": mat("pcb", (0.02, 0.18, 0.12), rough=0.4, coat=0.5),
        "chip": mat("chip", (0.03, 0.03, 0.035), rough=0.3),
        "led_blue": mat("led_blue", (0.2, 0.5, 1), emit=CYAN, estr=12),
        "led_green": mat("led_green", (0.2, 1, 0.5), emit=(0.3, 1, 0.55), estr=8),
        "led_violet": mat("led_violet", VIOLET, emit=VIOLET, estr=10),
        "cable": mat("cable", (0.04, 0.04, 0.05), rough=0.55),
        "fabric": mat("fabric", (0.08, 0.085, 0.1), rough=0.95),
        "lens": mat("lens", (0.01, 0.015, 0.03), rough=0.02, coat=1.0, metal=0.3),
        "paper": mat("paper", (0.97, 0.97, 0.96), rough=0.8),
        "mesh": mat("mesh", (0.12, 0.13, 0.15), metal=0.6, rough=0.5),
    }
