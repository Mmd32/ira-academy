#!/usr/bin/env python3
"""
Builds the 3D emblem from the flat logo.

    python3 scripts/build-emblem.py --out /tmp/emblem-clean.glb

The model that shipped first was a photogrammetry scan: its edges and sides are
wavy, and its colour was uneven where the scan's lighting leaked into the
surface. The mark itself is five flat shapes, so this builds it as exactly
that — each shape taken from public/media/logo-mark.png, extruded to a fixed
depth, with a small bevel so the edges catch light. Sides are truly flat and
take the colour of the face they belong to.

Corners are not read off the raw pixels (anti-aliasing rounds them). Each edge
is fitted with a straight line and neighbouring lines are intersected.
"""
import argparse
import json
import math
import struct
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage
from skimage import measure

ROOT = Path(__file__).resolve().parent.parent

# Same base colours (linear) and surface as the model being replaced, so the
# mark reads as the same object.
MATERIALS = {
    'ira-green': ([0.017641954488384078, 0.07421356838014963, 0.06662593864377289, 1.0]),
    'ira-navy': ([0.016807375752887384, 0.0595112381629812, 0.2232279573168085, 1.0]),
    'ira-grey': ([0.07036009569659588, 0.07036009569659588, 0.07036009569659588, 1.0]),
}

# Height of the mark in model units, depth of the extrusion, and the bevel.
HEIGHT = 1.636
DEPTH = 0.226
BEVEL = 0.011
# How glossy the surface is. The scan used 0.25 everywhere, which turns any face
# that looks up at the light white. Making everything rougher cures that but
# washes the blue out, so the two are separated: the faces you look at keep a
# glossy, saturated finish, and the sides and bevels — where the white came
# from — are matte.
FACE_ROUGHNESS = 0.25
RIM_ROUGHNESS = 0.6


# --------------------------------------------------------------------------
# 1. The five shapes, from the logo
# --------------------------------------------------------------------------

def fit_line(points):
    """Total-least-squares line through points: (point on line, unit direction)."""
    c = points.mean(axis=0)
    _, _, vt = np.linalg.svd(points - c)
    return c, vt[0]


def intersect(l1, l2):
    (p1, d1), (p2, d2) = l1, l2
    a = np.array([d1, -d2]).T
    t = np.linalg.solve(a, p2 - p1)
    return p1 + t[0] * d1


def drop_collinear(poly, degrees=8):
    """Removes corners where the outline barely turns.

    The rough outline can split one straight edge in two; fitting a line to
    each half and intersecting them is numerically wild, so they are merged.
    """
    poly = [np.array(p) for p in poly]
    changed = True
    while changed and len(poly) > 3:
        changed = False
        for i in range(len(poly)):
            a, b, c = poly[i - 1], poly[i], poly[(i + 1) % len(poly)]
            u, v = b - a, c - b
            cosang = np.dot(u, v) / (np.linalg.norm(u) * np.linalg.norm(v))
            if math.degrees(math.acos(max(-1, min(1, cosang)))) < degrees:
                del poly[i]
                changed = True
                break
    return np.array(poly)


def shapes_from_logo(path):
    """Returns [(colour_name, [(x, y), ...]), ...] in image pixels, y down."""
    im = np.array(Image.open(path).convert('RGBA'))
    mask = im[..., 3] > 128
    # Pad, so a shape touching the image border still has a closed contour.
    padded = np.pad(mask, 3)
    labels, n = ndimage.label(padded)
    out = []
    for i in range(1, n + 1):
        m = labels == i
        if m.sum() < 500:
            continue
        rgb = im[mask & (labels[3:-3, 3:-3] == i)][:, :3].mean(axis=0)
        contour = max(measure.find_contours(m.astype(float), 0.5), key=len)
        contour = contour[:, ::-1] - 3                  # (x, y), undo the padding
        rough = measure.approximate_polygon(contour, tolerance=7)[:-1]
        rough = drop_collinear(rough)

        # One straight line per edge, from contour points along its middle.
        lines = []
        for a, b in zip(rough, np.roll(rough, -1, axis=0)):
            seg = b - a
            length = np.linalg.norm(seg)
            if length < 25:                              # a rounded corner, not an edge
                continue
            u = seg / length
            rel = contour - a
            along = rel @ u
            across = np.abs(rel @ np.array([-u[1], u[0]]))
            sel = (along > 0.12 * length) & (along < 0.88 * length) & (across < 3)
            if sel.sum() >= 6:
                lines.append(fit_line(contour[sel]))
        poly = [intersect(lines[k], lines[(k + 1) % len(lines)]) for k in range(len(lines))]

        r, g, b = rgb
        name = 'ira-green' if g > r + 25 and g > b - 5 and r < 70 and b < 110 and g > 70 \
            else 'ira-grey' if abs(r - g) < 12 and abs(g - b) < 12 \
            else 'ira-navy'
        out.append((name, [tuple(map(float, p)) for p in poly]))
    return out


# --------------------------------------------------------------------------
# 2. Extrusion with a bevel
# --------------------------------------------------------------------------

def ccw(poly):
    area = sum(x1 * y2 - x2 * y1 for (x1, y1), (x2, y2) in zip(poly, poly[1:] + poly[:1]))
    return poly if area > 0 else poly[::-1]


def inset(poly, d):
    """Convex polygon moved inward by d (mitred)."""
    n = len(poly)
    lines = []
    for i in range(n):
        p, q = np.array(poly[i]), np.array(poly[(i + 1) % n])
        u = (q - p) / np.linalg.norm(q - p)
        left = np.array([-u[1], u[0]])                   # inward for a CCW polygon
        lines.append((p + left * d, u))
    return [tuple(intersect(lines[(i - 1) % n], lines[i])) for i in range(n)]


class Builder:
    def __init__(self):
        self.pos, self.nor, self.idx = [], [], []

    def tri(self, a, b, c, want):
        """Adds a triangle, flipped if its winding disagrees with `want`."""
        a, b, c = map(np.array, (a, b, c))
        n = np.cross(b - a, c - a)
        if np.dot(n, want) < 0:
            b, c = c, b
        base = len(self.pos)
        for v in (a, b, c):
            self.pos.append(v)
            self.nor.append(want / np.linalg.norm(want))
        self.idx += [base, base + 1, base + 2]

    def quad(self, a, b, c, d, want):
        self.tri(a, b, c, want)
        self.tri(a, c, d, want)

    def fan(self, ring, want):
        for i in range(1, len(ring) - 1):
            self.tri(ring[0], ring[i], ring[i + 1], want)


def extrude(faces, rims, poly, depth, bevel):
    poly = ccw(poly)
    n = len(poly)
    h = depth / 2
    zb = h - bevel
    inn = inset(poly, bevel)

    def at(p, z):
        return (p[0], p[1], z)

    faces.fan([at(p, h) for p in inn], np.array([0, 0, 1.0]))
    faces.fan([at(p, -h) for p in inn], np.array([0, 0, -1.0]))

    for i in range(n):
        j = (i + 1) % n
        d = np.array(poly[j]) - np.array(poly[i])
        out = np.array([d[1], -d[0]]) / np.linalg.norm(d)          # outward for CCW
        o3 = np.array([out[0], out[1], 0.0])
        # flat side wall
        rims.quad(at(poly[i], -zb), at(poly[j], -zb), at(poly[j], zb), at(poly[i], zb), o3)
        # front and back chamfers
        rims.quad(at(poly[i], zb), at(poly[j], zb), at(inn[j], h), at(inn[i], h), o3 + np.array([0, 0, 1.0]))
        rims.quad(at(poly[i], -zb), at(poly[j], -zb), at(inn[j], -h), at(inn[i], -h), o3 + np.array([0, 0, -1.0]))


# --------------------------------------------------------------------------
# 3. Checks and the .glb
# --------------------------------------------------------------------------

def verify(builder, label):
    """Every triangle of a convex solid must face away from its centre."""
    pos = np.array(builder.pos)
    centre = pos.mean(axis=0)
    idx = np.array(builder.idx).reshape(-1, 3)
    bad = 0
    for a, b, c in idx:
        n = np.cross(pos[b] - pos[a], pos[c] - pos[a])
        if np.dot(n, (pos[a] + pos[b] + pos[c]) / 3 - centre) <= 0:
            bad += 1
    return bad


def pack_glb(groups, face_rough=FACE_ROUGHNESS, rim_rough=RIM_ROUGHNESS):
    chunks, views, accessors, prims = bytearray(), [], [], []

    def add(data, target):
        while len(chunks) % 4:
            chunks.append(0)
        start = len(chunks)
        chunks.extend(data)
        views.append({'buffer': 0, 'byteOffset': start, 'byteLength': len(data), 'target': target})
        return len(views) - 1

    for mat_index, (name, b) in enumerate(groups):
        pos = np.array(b.pos, dtype='<f4')
        nor = np.array(b.nor, dtype='<f4')
        idx = np.array(b.idx, dtype='<u2')
        pv = add(pos.tobytes(), 34962)
        nv = add(nor.tobytes(), 34962)
        iv = add(idx.tobytes(), 34963)
        accessors += [
            {'bufferView': pv, 'componentType': 5126, 'count': len(pos), 'type': 'VEC3',
             'min': pos.min(axis=0).tolist(), 'max': pos.max(axis=0).tolist()},
            {'bufferView': nv, 'componentType': 5126, 'count': len(nor), 'type': 'VEC3'},
            {'bufferView': iv, 'componentType': 5123, 'count': len(idx), 'type': 'SCALAR'},
        ]
        base = len(accessors) - 3
        prims.append({'attributes': {'POSITION': base, 'NORMAL': base + 1}, 'indices': base + 2,
                      'material': mat_index})

    doc = {
        'asset': {'version': '2.0', 'generator': 'scripts/build-emblem.py'},
        'scene': 0,
        'scenes': [{'nodes': [0]}],
        'nodes': [{'name': 'emblem', 'mesh': 0}],
        'meshes': [{'name': 'emblem', 'primitives': prims}],
        'materials': [
            {'name': name, 'pbrMetallicRoughness': {
                'baseColorFactor': MATERIALS[name.replace('-rim', '')],
                'metallicFactor': 0.0,
                'roughnessFactor': rim_rough if name.endswith('-rim') else face_rough}}
            for name, _ in groups
        ],
        'accessors': accessors,
        'bufferViews': views,
        'buffers': [{'byteLength': len(chunks)}],
    }
    js = json.dumps(doc, separators=(',', ':')).encode()
    js += b' ' * (-len(js) % 4)
    bin_ = bytes(chunks) + b'\0' * (-len(chunks) % 4)
    total = 12 + 8 + len(js) + 8 + len(bin_)
    return (struct.pack('<III', 0x46546C67, 2, total)
            + struct.pack('<II', len(js), 0x4E4F534A) + js
            + struct.pack('<II', len(bin_), 0x004E4942) + bin_)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--logo', default=str(ROOT / 'public/media/logo-mark.png'))
    ap.add_argument('--out', required=True)
    ap.add_argument('--depth', type=float, default=DEPTH)
    ap.add_argument('--bevel', type=float, default=BEVEL)
    ap.add_argument('--face-roughness', type=float, default=FACE_ROUGHNESS)
    ap.add_argument('--rim-roughness', type=float, default=RIM_ROUGHNESS)
    args = ap.parse_args()

    shapes = shapes_from_logo(args.logo)
    xs = [p[0] for _, poly in shapes for p in poly]
    ys = [p[1] for _, poly in shapes for p in poly]
    cx, cy = (min(xs) + max(xs)) / 2, (min(ys) + max(ys)) / 2
    scale = HEIGHT / (max(ys) - min(ys))

    faces, rims = {}, {}
    for name, poly in shapes:
        model = [((x - cx) * scale, (cy - y) * scale) for x, y in poly]      # y up
        f = faces.setdefault(name, Builder())
        r = rims.setdefault(name, Builder())
        extrude(f, r, model, args.depth, args.bevel)
        check_f, check_r = Builder(), Builder()
        extrude(check_f, check_r, model, args.depth, args.bevel)
        whole = Builder()
        whole.pos = check_f.pos + check_r.pos
        whole.idx = check_f.idx + [i + len(check_f.pos) for i in check_r.idx]
        print(f'{name:10} {len(model)} corners  backwards triangles: {verify(whole, name)}')

    order = []
    for n in ('ira-green', 'ira-navy', 'ira-grey'):
        if n in faces:
            order += [(n, faces[n]), (n + '-rim', rims[n])]
    Path(args.out).write_bytes(pack_glb(order, args.face_roughness, args.rim_roughness))
    print('wrote', args.out, Path(args.out).stat().st_size, 'bytes')
    w = (max(xs) - min(xs)) * scale
    print(f'mark: {w:.3f} x {HEIGHT:.3f} x {args.depth:.3f}')


if __name__ == '__main__':
    main()
