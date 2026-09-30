"""Build the original monochrome Overdrive product icon font.

Requires fontTools for authoring only: python -m pip install fonttools
The extension ships the generated WOFF and needs no Python dependency.
"""

from __future__ import annotations

import math
from pathlib import Path

from fontTools.fontBuilder import FontBuilder
from fontTools.pens.ttGlyphPen import TTGlyphPen


UPM = 1000
GLYPHS = {
    "files": 0xE001,
    "search": 0xE002,
    "source": 0xE003,
    "debug": 0xE004,
    "extensions": 0xE005,
    "terminal": 0xE006,
    "settings": 0xE007,
    "chevron_right": 0xE008,
    "chevron_down": 0xE009,
    "close": 0xE00A,
    "refresh": 0xE00B,
    "command": 0xE00C,
}


def contour(pen: TTGlyphPen, points: list[tuple[float, float]]) -> None:
    pen.moveTo(tuple(round(value) for value in points[0]))
    for point in points[1:]:
        pen.lineTo(tuple(round(value) for value in point))
    pen.closePath()


def poly(pen: TTGlyphPen, *points: tuple[float, float]) -> None:
    contour(pen, list(points))


def rect(pen: TTGlyphPen, x0: float, y0: float, x1: float, y1: float) -> None:
    contour(pen, [(x0, y0), (x1, y0), (x1, y1), (x0, y1)])


def ring_rect(
    pen: TTGlyphPen, x0: float, y0: float, x1: float, y1: float, stroke: float = 84
) -> None:
    rect(pen, x0, y0, x1, y1)
    contour(
        pen,
        [
            (x0 + stroke, y0 + stroke),
            (x0 + stroke, y1 - stroke),
            (x1 - stroke, y1 - stroke),
            (x1 - stroke, y0 + stroke),
        ],
    )


def line(
    pen: TTGlyphPen, x0: float, y0: float, x1: float, y1: float, width: float = 88
) -> None:
    distance = math.hypot(x1 - x0, y1 - y0)
    dx = (y1 - y0) * width / (2 * distance)
    dy = -(x1 - x0) * width / (2 * distance)
    contour(
        pen,
        [(x0 + dx, y0 + dy), (x1 + dx, y1 + dy), (x1 - dx, y1 - dy), (x0 - dx, y0 - dy)],
    )


def ring(
    pen: TTGlyphPen, cx: float, cy: float, outer: float, inner: float, sides: int = 12
) -> None:
    outer_points = [
        (cx + outer * math.cos(2 * math.pi * i / sides), cy + outer * math.sin(2 * math.pi * i / sides))
        for i in range(sides)
    ]
    inner_points = [
        (cx + inner * math.cos(2 * math.pi * i / sides), cy + inner * math.sin(2 * math.pi * i / sides))
        for i in reversed(range(sides))
    ]
    contour(pen, outer_points)
    contour(pen, inner_points)


def draw_icon(name: str, pen: TTGlyphPen) -> None:
    if name == "files":
        ring_rect(pen, 292, 160, 795, 725, 82)
        line(pen, 205, 735, 205, 815, 80)
        line(pen, 205, 815, 692, 815, 80)
        rect(pen, 390, 370, 694, 435)
        rect(pen, 390, 520, 620, 585)
    elif name == "search":
        ring(pen, 430, 560, 260, 172, 12)
        line(pen, 595, 365, 805, 155, 104)
    elif name == "source":
        line(pen, 305, 710, 305, 260, 92)
        line(pen, 650, 710, 650, 490, 92)
        line(pen, 305, 490, 650, 490, 92)
        ring(pen, 305, 745, 100, 44, 10)
        ring(pen, 650, 745, 100, 44, 10)
        ring(pen, 305, 225, 100, 44, 10)
    elif name == "debug":
        poly(pen, (240, 140), (790, 500), (240, 860))
        poly(pen, (330, 292), (330, 708), (665, 500))
        # The counterclockwise inner triangle cuts a bright triangular center.
    elif name == "extensions":
        for x0, y0 in [(170, 170), (545, 170), (170, 545)]:
            ring_rect(pen, x0, y0, x0 + 290, y0 + 290, 72)
        poly(pen, (545, 545), (835, 545), (835, 620), (620, 620), (620, 835), (545, 835))
    elif name == "terminal":
        line(pen, 205, 700, 435, 500, 96)
        line(pen, 435, 500, 205, 300, 96)
        rect(pen, 480, 270, 825, 360)
    elif name == "settings":
        ring(pen, 500, 500, 220, 120, 12)
        for index in range(8):
            angle = 2 * math.pi * index / 8
            x0, y0 = 500 + 228 * math.cos(angle), 500 + 228 * math.sin(angle)
            x1, y1 = 500 + 340 * math.cos(angle), 500 + 340 * math.sin(angle)
            line(pen, x0, y0, x1, y1, 100)
    elif name == "chevron_right":
        line(pen, 330, 780, 640, 500, 112)
        line(pen, 640, 500, 330, 220, 112)
    elif name == "chevron_down":
        line(pen, 210, 640, 500, 345, 112)
        line(pen, 500, 345, 790, 640, 112)
    elif name == "close":
        line(pen, 230, 770, 770, 230, 106)
        line(pen, 230, 230, 770, 770, 106)
    elif name == "refresh":
        for index in range(1, 10):
            a0 = math.radians(35 + index * 26)
            a1 = math.radians(35 + (index + 1) * 26)
            line(
                pen,
                500 + 260 * math.cos(a0), 500 + 260 * math.sin(a0),
                500 + 260 * math.cos(a1), 500 + 260 * math.sin(a1), 92,
            )
        poly(pen, (735, 620), (875, 640), (810, 780))
    elif name == "command":
        poly(pen, (500, 850), (760, 705), (760, 295), (500, 150), (240, 295), (240, 705))
        contour(pen, [(500, 740), (330, 645), (330, 355), (500, 260), (670, 355), (670, 645)])
        poly(pen, (500, 600), (600, 500), (500, 400), (400, 500))
    else:
        raise ValueError(name)


def main() -> None:
    glyph_order = [".notdef", *GLYPHS]
    glyphs = {}
    metrics = {}
    for name in glyph_order:
        pen = TTGlyphPen(None)
        if name != ".notdef":
            draw_icon(name, pen)
        glyphs[name] = pen.glyph()
        metrics[name] = (1000, 0)

    builder = FontBuilder(UPM, isTTF=True)
    builder.setupGlyphOrder(glyph_order)
    builder.setupCharacterMap({codepoint: name for name, codepoint in GLYPHS.items()})
    builder.setupGlyf(glyphs)
    builder.setupHorizontalMetrics(metrics)
    builder.setupHorizontalHeader(ascent=850, descent=-150)
    builder.setupNameTable({
        "familyName": "Neon District Overdrive Icons",
        "styleName": "Regular",
        "uniqueFontIdentifier": "NeonDistrictOverdriveIcons-Regular-1.0",
        "fullName": "Neon District Overdrive Icons Regular",
        "psName": "NeonDistrictOverdriveIcons-Regular",
        "version": "Version 1.0",
    })
    builder.setupOS2(
        sTypoAscender=850,
        sTypoDescender=-150,
        usWinAscent=850,
        usWinDescent=150,
    )
    builder.setupPost()
    builder.setupMaxp()
    font = builder.font
    font.flavor = "woff"
    destination = Path(__file__).with_name("overdrive.woff")
    font.save(destination)
    print(destination)


if __name__ == "__main__":
    main()
