#!/usr/bin/env python3
"""
Generate six on-brand grayscale architectural placeholder images into /assets.
Run once: `python3 make_placeholders.py`. Replace the output files with real
photography whenever you like (keep the same filenames).
"""
import math
from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 1600  # portrait 3:4
PAPER = 246        # warm off-white value
INK = 17
LINE = 205

PROJECTS = [
    ("01", "GARDEN ATRIA"),
    ("02", "ELEVATED PLAZA"),
    ("03", "HYDRO-FILTRATION DAM"),
    ("04", "WEST LOOP THEATER"),
    ("05", "TUNNEL TO POBLE ESPANYOL"),
    ("06", "SKETCHES FROM ABROAD"),
]


def load_font(size, bold=False):
    candidates = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    ]
    for path in candidates:
        try:
            return ImageFont.truetype(path, size)
        except OSError:
            continue
    return ImageFont.load_default()


def make(idx, num, title):
    img = Image.new("L", (W, H), PAPER)
    d = ImageDraw.Draw(img)

    # faint construction grid
    step = 64
    for x in range(0, W, step):
        d.line([(x, 0), (x, H)], fill=LINE, width=1)
    for y in range(0, H, step):
        d.line([(0, y), (W, y)], fill=LINE, width=1)

    # a simple architectural massing composition, unique per project
    margin = 150
    base = H - margin
    rng = (idx * 97) % 7
    bar_w = (W - margin * 2) // 5
    for i in range(5):
        bh = 180 + ((i * 130 + rng * 70) % 760)
        x0 = margin + i * bar_w
        x1 = x0 + bar_w - 26
        shade = 60 + (i * 28 + rng * 12) % 150
        d.rectangle([x0, base - bh, x1, base], fill=shade, outline=INK, width=2)
        # window mullions
        for wy in range(base - bh + 40, base, 70):
            d.line([(x0 + 12, wy), (x1 - 12, wy)], fill=PAPER, width=1)

    # horizon + section line
    d.line([(margin, base), (W - margin, base)], fill=INK, width=3)
    # a long diagonal "survey" line
    d.line([(margin, margin + 120), (W - margin, base - 60)], fill=INK, width=1)

    # inner frame
    d.rectangle([60, 60, W - 60, H - 60], outline=INK, width=2)

    # oversized ghost number (outline)
    f_num = load_font(420)
    nb = d.textbbox((0, 0), num, font=f_num)
    nx = 90
    ny = 80
    d.text((nx, ny), num, font=f_num, fill=None, stroke_width=3,
           stroke_fill=LINE)

    # title label plate
    f_lab = load_font(34)
    tb = d.textbbox((0, 0), title, font=f_lab)
    tw = tb[2] - tb[0]
    pad = 24
    plate_y = H - 150
    d.rectangle([margin - pad, plate_y - pad, margin + tw + pad, plate_y + (tb[3] - tb[1]) + pad],
                fill=PAPER, outline=INK, width=1)
    d.text((margin, plate_y), title, font=f_lab, fill=INK)

    # tiny caption
    f_cap = load_font(22)
    d.text((margin, plate_y + 70), "PLACEHOLDER — replace in /assets", font=f_cap, fill=120)

    img.convert("RGB").save(f"assets/project-{num}.jpg", "JPEG", quality=86)
    print(f"wrote assets/project-{num}.jpg")


for i, (num, title) in enumerate(PROJECTS):
    make(i, num, title)
