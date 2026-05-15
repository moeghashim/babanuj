"""Render the Babanuj 'Shop by category' section as a 1280x720 PNG.

Pavilion Light — geometric, image-forward, hand-restrained.
Renders at 2x then downscales for crisp anti-aliasing.
"""

from __future__ import annotations
import math
import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

# --------------------------------------------------------------------
# Constants
# --------------------------------------------------------------------

FONT_DIR = (
    "/Users/moeghashim/Library/Application Support/Claude/"
    "local-agent-mode-sessions/skills-plugin/"
    "1f2dcbbd-d068-4794-aff1-ed2ab1688699/"
    "f095c184-89a9-4b8e-9a44-e3df92427d2e/"
    "skills/canvas-design/canvas-fonts"
)
OUT_PATH = os.path.join(os.path.dirname(__file__), "shop-by-category-mockup.png")

S = 3  # supersampling factor
W = 1280 * S
H = 720 * S


def px(v: float) -> int:
    return int(round(v * S))


BG = "#ffffff"
INK = "#1f2a1c"
INK2 = "#4a5240"
ACCENT = "#3a5c3a"
RULE = (31, 42, 28, int(0.10 * 255))  # var(--rule)

CATS = [
    {
        "name": "Baklava",
        "hue": "#bfa86a",          # warm gold
        "deep": "#5a4419",          # dark amber
        "accent": "#5a6a3a",        # pistachio green
        "glow": "#e8d5a0",
    },
    {
        "name": "Cookies & Maamoul",
        "hue": "#d6a06e",          # warm sand
        "deep": "#5e3a1e",
        "accent": "#3a2618",
        "glow": "#efc998",
    },
    {
        "name": "Turkish Delight",
        "hue": "#e8b0a8",          # rose
        "deep": "#7a3a32",
        "accent": "#a35c5c",
        "glow": "#f4d3ce",
    },
    {
        "name": "Chocolate",
        "hue": "#7a4a2e",          # cocoa
        "deep": "#2a1108",
        "accent": "#caa55a",        # gold
        "glow": "#b07a4a",
    },
    {
        "name": "Gift Boxes",
        "hue": "#3a5c3a",          # sage
        "deep": "#1f2a1c",
        "accent": "#caa55a",        # gold ribbon
        "glow": "#7a9a6a",
    },
    {
        "name": "Dates",
        "hue": "#5e3a1e",          # rich brown
        "deep": "#2a1808",
        "accent": "#caa55a",
        "glow": "#8a5a30",
    },
]


# --------------------------------------------------------------------
# Helpers
# --------------------------------------------------------------------

def font(name: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(os.path.join(FONT_DIR, name), size)


def hex_to_rgb(h: str) -> tuple[int, int, int]:
    h = h.lstrip("#")
    return tuple(int(h[i : i + 2], 16) for i in (0, 2, 4))


def with_alpha(h: str, a: float) -> tuple[int, int, int, int]:
    r, g, b = hex_to_rgb(h)
    return (r, g, b, int(round(a * 255)))


def rounded_mask(size: tuple[int, int], radius: int) -> Image.Image:
    """1-bit mask for a rounded rectangle."""
    m = Image.new("L", size, 0)
    ImageDraw.Draw(m).rounded_rectangle(
        (0, 0, size[0], size[1]), radius=radius, fill=255
    )
    return m


def draw_rub_el_hizb(
    canvas: Image.Image,
    cx: float,
    cy: float,
    r: float,
    color: tuple[int, int, int, int],
    stroke: float,
) -> None:
    """Draw the Rub el Hizb — two overlapping squares (one rotated 45°)."""
    draw = ImageDraw.Draw(canvas, "RGBA")
    # Two squares
    s = r / math.sqrt(2)
    sq1 = [(cx - s, cy - s), (cx + s, cy - s), (cx + s, cy + s), (cx - s, cy + s)]
    # Rotated 45°
    sq2 = [(cx, cy - r), (cx + r, cy), (cx, cy + r), (cx - r, cy)]
    draw.polygon(sq1, outline=color, width=max(1, int(stroke)))
    draw.polygon(sq2, outline=color, width=max(1, int(stroke)))


def vertical_scrim(
    width: int, height: int, top_alpha: float, bottom_alpha: float
) -> Image.Image:
    """Vertical alpha gradient (transparent→black). For text legibility scrims."""
    g = Image.new("L", (1, height))
    for y in range(height):
        t = y / (height - 1) if height > 1 else 1
        a = top_alpha + (bottom_alpha - top_alpha) * t
        g.putpixel((0, y), int(round(a * 255)))
    g = g.resize((width, height), Image.BILINEAR)
    scrim = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    black = Image.new("RGBA", (width, height), (0, 0, 0, 255))
    scrim.paste(black, mask=g)
    return scrim


# --------------------------------------------------------------------
# Per-category illustrations
# --------------------------------------------------------------------

def illustrate_card(cat: dict, w: int, h: int) -> Image.Image:
    """Return an RGBA image (w x h) with the category's illustrated content."""
    img = Image.new("RGBA", (w, h), hex_to_rgb(cat["hue"]) + (255,))
    d = ImageDraw.Draw(img, "RGBA")

    cx, cy = w / 2, h / 2

    # 1) Background: a single oversize Rub el Hizb in the top-right corner,
    #    half-cropped, extremely low opacity. The "patient inheritance" — a
    #    quote, not a wallpaper.
    star_r = w * 0.45
    star_color = with_alpha(cat["deep"], 0.08)
    draw_rub_el_hizb(
        img,
        w * 0.95, h * 0.12,
        star_r,
        star_color,
        stroke=max(1, S * 0.9),
    )

    # 2) Hero illustration — geometric, abstract, evokes the food
    name = cat["name"]
    if name == "Baklava":
        _draw_baklava(d, cx, cy, w, h, cat)
    elif name.startswith("Cookies"):
        _draw_maamoul(d, cx, cy, w, h, cat, img)
    elif name == "Turkish Delight":
        _draw_lokum(d, cx, cy, w, h, cat)
    elif name == "Chocolate":
        _draw_chocolate(d, cx, cy, w, h, cat)
    elif name == "Gift Boxes":
        _draw_giftbox(d, cx, cy, w, h, cat)
    elif name == "Dates":
        _draw_dates(d, cx, cy, w, h, cat)

    # 3) Bottom dark scrim for label legibility
    scrim_h = int(h * 0.50)
    scrim = vertical_scrim(w, scrim_h, top_alpha=0.0, bottom_alpha=0.62)
    img.paste(scrim, (0, h - scrim_h), scrim)

    return img


# --- Each illustrator draws into the passed ImageDraw, centered on (cx, cy) --

def _draw_baklava(d: ImageDraw.ImageDraw, cx, cy, w, h, cat) -> None:
    # A single confident diamond, layered phyllo as concentric rhombi.
    rx = w * 0.34
    ry = h * 0.30
    layers = 9
    for i in range(layers, 0, -1):
        scale = i / layers
        kx = rx * scale
        ky = ry * scale
        # Alternate cream and dark amber layers
        if i % 2 == 0:
            c = with_alpha("#f4ede0", 0.62)
        else:
            c = with_alpha(cat["deep"], 0.30)
        pts = [
            (cx, cy - ky),
            (cx + kx, cy),
            (cx, cy + ky),
            (cx - kx, cy),
        ]
        d.polygon(pts, fill=c)
    # Single pistachio at center — the prized green
    cr = w * 0.045
    d.ellipse(
        (cx - cr, cy - cr, cx + cr, cy + cr),
        fill=with_alpha(cat["accent"], 1.0),
    )


def _draw_maamoul(d: ImageDraw.ImageDraw, cx, cy, w, h, cat, img) -> None:
    # Wood-stamp: filled disc + the eight-point star embossed.
    outer = w * 0.36
    # Solid disc as base — the cookie's body
    d.ellipse(
        (cx - outer, cy - outer, cx + outer, cy + outer),
        fill=with_alpha("#f4ede0", 0.92),
    )
    # Inner ring (etched border)
    inner = outer * 0.86
    d.ellipse(
        (cx - inner, cy - inner, cx + inner, cy + inner),
        outline=with_alpha(cat["deep"], 0.35),
        width=max(1, int(S * 1.0)),
    )
    # The 8-point star — embossed wood-stamp mark
    draw_rub_el_hizb(
        img,
        cx, cy,
        outer * 0.55,
        with_alpha(cat["deep"], 0.65),
        stroke=max(1, S * 1.4),
    )
    # Center dot — like a fennel seed
    cr = w * 0.022
    d.ellipse(
        (cx - cr, cy - cr, cx + cr, cy + cr),
        fill=with_alpha(cat["deep"], 0.85),
    )


def _draw_lokum(d: ImageDraw.ImageDraw, cx, cy, w, h, cat) -> None:
    # 3 rounded squares slightly overlapping — lokum cubes
    side = w * 0.22
    r = side * 0.22
    positions = [
        (-side * 0.85, -side * 0.10),
        (0, side * 0.10),
        (side * 0.85, -side * 0.10),
    ]
    for i, (dx, dy) in enumerate(positions):
        x1, y1 = cx + dx - side / 2, cy + dy - side / 2
        x2, y2 = cx + dx + side / 2, cy + dy + side / 2
        # Soft shadow
        d.rounded_rectangle(
            (x1 + S * 2, y1 + S * 4, x2 + S * 2, y2 + S * 4),
            radius=r,
            fill=with_alpha(cat["deep"], 0.18),
        )
        # Body
        d.rounded_rectangle(
            (x1, y1, x2, y2),
            radius=r,
            fill=with_alpha("#f8d6cf" if i == 1 else "#f0c5bc", 0.95),
        )
        # Inner highlight
        d.rounded_rectangle(
            (x1 + side * 0.12, y1 + side * 0.10, x2 - side * 0.45, y2 - side * 0.55),
            radius=r * 0.7,
            fill=with_alpha("#ffffff", 0.22),
        )
        # Tiny pistachio fleck
        fr = side * 0.07
        d.ellipse(
            (
                cx + dx - fr,
                cy + dy - fr,
                cx + dx + fr,
                cy + dy + fr,
            ),
            fill=with_alpha("#5a6a3a", 0.85),
        )
    # Powdered-sugar texture: scattered tiny dots
    import random
    rng = random.Random(7)
    for _ in range(70):
        x = cx + rng.uniform(-w * 0.42, w * 0.42)
        y = cy + rng.uniform(-h * 0.30, h * 0.32)
        dr = rng.uniform(S * 0.6, S * 1.8)
        d.ellipse(
            (x - dr, y - dr, x + dr, y + dr),
            fill=with_alpha("#ffffff", rng.uniform(0.35, 0.75)),
        )


def _draw_chocolate(d: ImageDraw.ImageDraw, cx, cy, w, h, cat) -> None:
    # Chocolate bar — rectangular, segmented, with kataifi strands hinted
    bar_w = w * 0.62
    bar_h = h * 0.46
    x1, y1 = cx - bar_w / 2, cy - bar_h / 2
    x2, y2 = cx + bar_w / 2, cy + bar_h / 2
    # Drop shadow
    d.rounded_rectangle(
        (x1 + S * 3, y1 + S * 6, x2 + S * 3, y2 + S * 6),
        radius=S * 8,
        fill=(0, 0, 0, 60),
    )
    # Body
    d.rounded_rectangle(
        (x1, y1, x2, y2), radius=S * 8, fill=with_alpha(cat["deep"], 0.95)
    )
    # Segment lines (3 cols × 2 rows)
    for k in range(1, 3):
        sx = x1 + (bar_w / 3) * k
        d.line(
            [(sx, y1 + S * 4), (sx, y2 - S * 4)],
            fill=with_alpha("#000000", 0.35),
            width=max(1, int(S * 0.8)),
        )
    sy = y1 + bar_h / 2
    d.line(
        [(x1 + S * 4, sy), (x2 - S * 4, sy)],
        fill=with_alpha("#000000", 0.35),
        width=max(1, int(S * 0.8)),
    )
    # Highlight band across the top third
    d.rounded_rectangle(
        (x1 + S * 3, y1 + S * 3, x2 - S * 3, y1 + bar_h * 0.18),
        radius=S * 4,
        fill=with_alpha("#ffffff", 0.10),
    )
    # Kataifi strands — fine gold threads above the bar
    import random
    rng = random.Random(11)
    for _ in range(14):
        sx = cx + rng.uniform(-bar_w * 0.45, bar_w * 0.45)
        sy_top = y1 - rng.uniform(h * 0.04, h * 0.16)
        ex = sx + rng.uniform(-w * 0.05, w * 0.05)
        ey = y1 + rng.uniform(S * 2, S * 6)
        d.line(
            [(sx, sy_top), (ex, ey)],
            fill=with_alpha(cat["accent"], rng.uniform(0.55, 0.95)),
            width=max(1, int(S * 0.7)),
        )


def _draw_giftbox(d: ImageDraw.ImageDraw, cx, cy, w, h, cat) -> None:
    # A simple cube with crossing ribbon
    side = min(w, h) * 0.48
    x1, y1 = cx - side / 2, cy - side / 2 + h * 0.04
    x2, y2 = cx + side / 2, cy + side / 2 + h * 0.04
    # Box body
    d.rounded_rectangle(
        (x1, y1, x2, y2),
        radius=S * 6,
        fill=with_alpha("#f9f3e6", 0.95),
        outline=with_alpha(cat["deep"], 0.35),
        width=max(1, int(S * 0.8)),
    )
    # Ribbon — vertical
    ribbon_w = side * 0.16
    d.rectangle(
        (cx - ribbon_w / 2, y1, cx + ribbon_w / 2, y2),
        fill=with_alpha(cat["accent"], 0.95),
    )
    # Ribbon — horizontal
    d.rectangle(
        (x1, cy + h * 0.04 - ribbon_w / 2, x2, cy + h * 0.04 + ribbon_w / 2),
        fill=with_alpha(cat["accent"], 0.95),
    )
    # Bow knots (two ellipses at top center)
    bow_w = side * 0.32
    bow_h = side * 0.18
    knot_top = y1 - bow_h * 0.55
    d.ellipse(
        (cx - bow_w, knot_top, cx, knot_top + bow_h),
        fill=with_alpha(cat["accent"], 0.95),
    )
    d.ellipse(
        (cx, knot_top, cx + bow_w, knot_top + bow_h),
        fill=with_alpha(cat["accent"], 0.95),
    )
    # Knot center
    knot_r = ribbon_w * 0.65
    d.ellipse(
        (cx - knot_r, knot_top + bow_h * 0.25 - knot_r * 0.6,
         cx + knot_r, knot_top + bow_h * 0.25 + knot_r * 1.2),
        fill=with_alpha(cat["deep"], 0.95),
    )


def _draw_dates(d: ImageDraw.ImageDraw, cx, cy, w, h, cat) -> None:
    # Three oval dates in a row, with pistachio peeking
    n = 3
    date_w = w * 0.22
    date_h = h * 0.30
    gap = w * 0.05
    total_w = n * date_w + (n - 1) * gap
    start_x = cx - total_w / 2 + date_w / 2
    for i in range(n):
        dx = start_x + i * (date_w + gap)
        # Soft shadow
        d.ellipse(
            (dx - date_w / 2 + S * 2, cy - date_h / 2 + S * 6,
             dx + date_w / 2 + S * 2, cy + date_h / 2 + S * 6),
            fill=with_alpha("#000000", 0.30),
        )
        # Body — gradient effect: outer darker, inner lighter
        for r in range(4, 0, -1):
            t = r / 4
            sx = date_w * (0.5 - 0.04 * (4 - r))
            sy = date_h * (0.5 - 0.06 * (4 - r))
            color = (
                int(94 + (138 - 94) * (1 - t)),
                int(58 + (90 - 58) * (1 - t)),
                int(30 + (48 - 30) * (1 - t)),
                255,
            )
            d.ellipse((dx - sx, cy - sy, dx + sx, cy + sy), fill=color)
        # Top highlight slice
        d.ellipse(
            (dx - date_w * 0.30, cy - date_h * 0.45,
             dx + date_w * 0.10, cy - date_h * 0.10),
            fill=with_alpha("#ffffff", 0.16),
        )
        # Pistachio fleck peeking from the top
        pr = date_w * 0.10
        d.ellipse(
            (dx - pr, cy - date_h * 0.55 - pr * 0.3,
             dx + pr, cy - date_h * 0.55 + pr * 1.6),
            fill=with_alpha("#5a6a3a", 0.95),
        )


# --------------------------------------------------------------------
# Composition
# --------------------------------------------------------------------

def main() -> None:
    canvas = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(canvas, "RGBA")

    # Fonts
    f_head = font("BricolageGrotesque-Bold.ttf", px(38))
    f_view = font("WorkSans-Regular.ttf", px(13.5))
    f_micro = font("WorkSans-Regular.ttf", px(10.5))
    f_card = font("BricolageGrotesque-Bold.ttf", px(16))
    f_serif_it = font("CrimsonPro-Italic.ttf", px(20))

    PAD = px(56)
    GUTTER = px(16)
    CARD_Y = px(160)
    CARD_W = (W - 2 * PAD - 5 * GUTTER) // 6
    CARD_H = CARD_W
    RADIUS = px(18)

    # ---- Top: small all-caps eyebrow + heading + View all ----
    # Eyebrow
    eyebrow = "THE PANTRY"
    draw.text((PAD, px(56)), eyebrow,
              fill=hex_to_rgb(ACCENT) + (255,),
              font=ImageFont.truetype(
                  os.path.join(FONT_DIR, "WorkSans-Bold.ttf"), px(11)
              ))
    # Underline tick after eyebrow
    eb_len = draw.textlength(eyebrow, font=ImageFont.truetype(
        os.path.join(FONT_DIR, "WorkSans-Bold.ttf"), px(11)))
    draw.line(
        [(PAD + eb_len + px(10), px(56) + px(7)),
         (PAD + eb_len + px(30), px(56) + px(7))],
        fill=hex_to_rgb(ACCENT) + (255,),
        width=max(1, int(S * 0.8)),
    )
    # Main heading
    draw.text((PAD, px(82)), "Shop by category",
              fill=hex_to_rgb(INK) + (255,), font=f_head)
    # View all (right aligned)
    view_text = "View all  →"
    vt_len = draw.textlength(view_text, font=f_view)
    draw.text(
        (W - PAD - vt_len, px(98)), view_text,
        fill=hex_to_rgb(ACCENT) + (255,), font=f_view,
    )
    # Soft hairline under view all
    draw.line(
        [(W - PAD - vt_len, px(98) + px(20)),
         (W - PAD - px(18), px(98) + px(20))],
        fill=hex_to_rgb(ACCENT) + (255,),
        width=max(1, int(S * 0.6)),
    )

    # ---- Cards row ----
    for i, cat in enumerate(CATS):
        x = PAD + i * (CARD_W + GUTTER)
        card = illustrate_card(cat, CARD_W, CARD_H)
        # Rounded mask
        mask = rounded_mask((CARD_W, CARD_H), RADIUS)
        # Drop shadow
        shadow = Image.new("RGBA", (CARD_W + px(60), CARD_H + px(60)), (0, 0, 0, 0))
        ImageDraw.Draw(shadow).rounded_rectangle(
            (px(30), px(34), CARD_W + px(30), CARD_H + px(34)),
            radius=RADIUS,
            fill=(31, 42, 28, 28),
        )
        shadow = shadow.filter(ImageFilter.GaussianBlur(px(18)))
        canvas.paste(shadow, (x - px(30), CARD_Y - px(30)), shadow)
        # Card
        canvas.paste(card, (x, CARD_Y), mask)

        # Hairline 1px outline at low alpha — etches the edge crisp
        ImageDraw.Draw(canvas, "RGBA").rounded_rectangle(
            (x, CARD_Y, x + CARD_W, CARD_Y + CARD_H),
            radius=RADIUS,
            outline=(31, 42, 28, 28),
            width=max(1, int(S * 0.6)),
        )

        # Label inside card (bottom-left)
        label = cat["name"]
        # Slight responsive shrink for the long "Cookies & Maamoul" label
        f = f_card
        if draw.textlength(label, font=f) > CARD_W - px(26):
            f = font("BricolageGrotesque-Bold.ttf", px(13.5))
        draw.text(
            (x + px(14), CARD_Y + CARD_H - px(34)),
            label, fill=(255, 255, 255, 255), font=f,
        )
        # Micro caption under label (e.g., "7 items" / "23 items"…)
        item_counts = {
            "Baklava": "7 items",
            "Cookies & Maamoul": "9 items",
            "Turkish Delight": "2 items",
            "Chocolate": "2 items",
            "Gift Boxes": "23 items",
            "Dates": "14 items",
        }
        cnt = item_counts.get(cat["name"], "")
        draw.text(
            (x + px(14), CARD_Y + CARD_H - px(16)),
            cnt, fill=(255, 255, 255, 200), font=f_micro,
        )

    # ---- Below cards: hairline rule + italic editorial caption ----
    rule_y = CARD_Y + CARD_H + px(48)
    rule_x = W / 2
    rule_w = px(60)
    draw.line(
        [(rule_x - rule_w / 2, rule_y), (rule_x + rule_w / 2, rule_y)],
        fill=hex_to_rgb(ACCENT) + (255,),
        width=max(1, int(S * 0.8)),
    )

    caption = "From Antep to Damascus, Dubai to Houston."
    cap_w = draw.textlength(caption, font=f_serif_it)
    draw.text(
        ((W - cap_w) / 2, rule_y + px(18)),
        caption,
        fill=hex_to_rgb(INK2) + (240,),
        font=f_serif_it,
    )

    # Tiny page reference at very bottom right, like an editorial folio
    folio = "0 1   ·   T H E   P A N T R Y"
    f_folio = font("WorkSans-Regular.ttf", px(9.5))
    folio_w = draw.textlength(folio, font=f_folio)
    draw.text(
        (W - PAD - folio_w, H - px(28)),
        folio,
        fill=(31, 42, 28, 110),
        font=f_folio,
    )

    # ---- Downscale to final resolution ----
    final = canvas.resize((1280, 720), Image.LANCZOS)
    final.save(OUT_PATH, optimize=True)
    print(f"Wrote {OUT_PATH}")


if __name__ == "__main__":
    main()
