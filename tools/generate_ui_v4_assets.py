from __future__ import annotations

from pathlib import Path
from typing import Iterable, Tuple

from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "resources" / "ui_generated_v4"
PREVIEW = ROOT / "assets" / "reference" / "ui_samples" / "v4_replaceable_ui"
SCALE = 4

Color = Tuple[int, int, int, int]


INK: Color = (42, 29, 51, 255)
TEAL: Color = (20, 129, 121, 255)
TEAL_DARK: Color = (10, 86, 82, 255)
CREAM: Color = (255, 248, 232, 255)
CREAM_2: Color = (255, 239, 201, 255)
RED: Color = (255, 92, 82, 255)
ORANGE: Color = (255, 181, 54, 255)
PURPLE: Color = (122, 82, 151, 255)
GREEN: Color = (104, 181, 71, 255)
MUTED: Color = (189, 181, 171, 255)


def sc(v: float) -> int:
    return int(round(v * SCALE))


def rgba(color: Color, alpha: int | None = None) -> Color:
    if alpha is None:
        return color
    return (color[0], color[1], color[2], alpha)


def new_canvas(width: int, height: int) -> Image.Image:
    return Image.new("RGBA", (sc(width), sc(height)), (0, 0, 0, 0))


def rounded(draw: ImageDraw.ImageDraw, box: Iterable[float], radius: float, fill: Color, outline: Color | None = None, width: int = 1) -> None:
    draw.rounded_rectangle(tuple(sc(v) for v in box), radius=sc(radius), fill=fill, outline=outline, width=sc(width))


def ellipse(draw: ImageDraw.ImageDraw, box: Iterable[float], fill: Color, outline: Color | None = None, width: int = 1) -> None:
    draw.ellipse(tuple(sc(v) for v in box), fill=fill, outline=outline, width=sc(width))


def shadow_layer(size: tuple[int, int], box: Iterable[float], radius: float, opacity: int, blur: float, offset_y: float) -> Image.Image:
    layer = Image.new("RGBA", (sc(size[0]), sc(size[1])), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    moved = list(box)
    moved[1] += offset_y
    moved[3] += offset_y
    rounded(d, moved, radius, (20, 14, 25, opacity))
    return layer.filter(ImageFilter.GaussianBlur(sc(blur)))


def vertical_gradient(width: int, height: int, top: Color, bottom: Color) -> Image.Image:
    img = Image.new("RGBA", (sc(width), sc(height)), (0, 0, 0, 0))
    pix = img.load()
    h = img.height
    for y in range(h):
        t = y / max(1, h - 1)
        color = tuple(int(top[i] * (1 - t) + bottom[i] * t) for i in range(4))
        for x in range(img.width):
            pix[x, y] = color
    return img


def downsample(img: Image.Image) -> Image.Image:
    return img.resize((img.width // SCALE, img.height // SCALE), Image.Resampling.LANCZOS)


def save(img: Image.Image, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    downsample(img).save(path)


def draw_card_base(path: Path, accent: Color, disabled: bool = False, hot_tab: bool = False, heat_tab: bool = False) -> None:
    w, h = 214, 264
    img = new_canvas(w, h)
    img.alpha_composite(shadow_layer((w, h), (8, 10, w - 8, h - 13), 28, 72, 4, 4))
    d = ImageDraw.Draw(img)
    fill = (238, 231, 220, 245) if disabled else CREAM
    border = MUTED if disabled else accent
    rounded(d, (8, 5, w - 8, h - 13), 28, fill, INK, 5)
    rounded(d, (13, 10, w - 13, h - 18), 23, fill, border, 4)
    rounded(d, (27, 33, w - 27, 151), 20, (255, 251, 241, 235) if not disabled else (229, 222, 213, 210))
    rounded(d, (60, 141, w - 60, 149), 4, (72, 45, 58, 38))
    rounded(d, (42, 178, w - 42, 211), 14, (245, 226, 198, 190), (215, 192, 158, 160), 2)
    rounded(d, (54, 222, w - 54, 252), 14, TEAL if not disabled else (127, 138, 133, 230), INK, 3)
    if hot_tab or heat_tab:
        tab = ORANGE if hot_tab else RED
        rounded(d, (8, 5, 82, 39), 17, tab)
        rounded(d, (12, 9, 78, 35), 13, rgba((255, 255, 255, 255), 26))
    # Small glossy corner, target-reference style.
    ellipse(d, (171, 17, 194, 40), rgba((255, 255, 255, 255), 48))
    save(img, path)


def draw_order_bubble(path: Path, accent: Color, selected: bool) -> None:
    w, h = 366, 176
    img = new_canvas(w, h)
    img.alpha_composite(shadow_layer((w, h), (20, 12, 346, 148), 28, 64, 4, 5))
    d = ImageDraw.Draw(img)
    body = (20, 12, 346, 148)
    tail = [(64, 142), (91, 142), (68, 171)]
    # Tail shadow / outline / fill
    d.polygon([(sc(x), sc(y)) for x, y in tail], fill=INK)
    inner_tail = [(68, 140), (88, 140), (70, 160)]
    d.polygon([(sc(x), sc(y)) for x, y in inner_tail], fill=CREAM)
    rounded(d, body, 28, CREAM, INK, 5)
    rounded(d, (25, 17, 341, 143), 23, CREAM, accent, 5 if selected else 4)
    rounded(d, (40, 30, 326, 72), 18, rgba((255, 255, 255, 255), 42))
    # Light suggested item-slot rhythm without dashed placeholders.
    for i in range(3):
        x = 81 + i * 72
        rounded(d, (x, 33, x + 56, 89), 12, (255, 251, 241, 92), (190, 164, 132, 85), 2)
    rounded(d, (92, 116, 298, 139), 12, (41, 30, 47, 255))
    ellipse(d, (45, 103, 86, 144), RED, (255, 255, 255, 255), 3)
    save(img, path)


def draw_hud_panel(path: Path, width: int, accent: Color, timer: bool = False) -> None:
    h = 76 if timer else 72
    img = new_canvas(width, h + 12)
    img.alpha_composite(shadow_layer((width, h + 12), (5, 4, width - 5, h), h / 2, 76, 3, 4))
    d = ImageDraw.Draw(img)
    rounded(d, (5, 4, width - 5, h), h / 2, TEAL_DARK if not timer else RED, INK, 5)
    rounded(d, (16, 13, width - 16, h - 11), (h - 24) / 2, rgba((255, 255, 255, 255), 23))
    icon_size = h - 16
    icon_fill = CREAM if timer else accent
    ellipse(d, (12, 12, 12 + icon_size, 12 + icon_size), icon_fill, INK, 4)
    rounded(d, (74, 20, width - 18, h - 18), 16, rgba((255, 255, 255, 255), 20))
    rounded(d, (82, h - 33, width - 28, h - 17), 8, rgba((0, 0, 0, 255), 42))
    ellipse(d, (width - 32, 14, width - 16, 30), rgba((255, 255, 255, 255), 36))
    save(img, path)


def make_preview(asset_paths: list[Path]) -> None:
    thumb_bg = (236, 246, 232, 255)
    cell_w, cell_h = 300, 215
    cols = 3
    rows = (len(asset_paths) + cols - 1) // cols
    sheet = Image.new("RGBA", (cols * cell_w, rows * cell_h + 70), thumb_bg)
    d = ImageDraw.Draw(sheet)
    try:
        font = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", 18)
        title_font = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 28)
    except Exception:
        font = ImageFont.load_default()
        title_font = ImageFont.load_default()
    d.text((24, 22), "Monster Store UI V4 Replaceable Base Assets", fill=(42, 29, 51, 255), font=title_font)
    for index, path in enumerate(asset_paths):
        asset = Image.open(path).convert("RGBA")
        col = index % cols
        row = index // cols
        x = col * cell_w
        y = 70 + row * cell_h
        d.rounded_rectangle((x + 16, y + 16, x + cell_w - 16, y + cell_h - 36), radius=16, fill=(255, 250, 239, 255))
        max_w, max_h = cell_w - 64, cell_h - 88
        scale = min(max_w / asset.width, max_h / asset.height, 1.0)
        resized = asset.resize((int(asset.width * scale), int(asset.height * scale)), Image.Resampling.LANCZOS)
        sheet.alpha_composite(resized, (x + (cell_w - resized.width) // 2, y + 28))
        d.text((x + 24, y + cell_h - 32), path.name, fill=(42, 29, 51, 255), font=font)
    PREVIEW.mkdir(parents=True, exist_ok=True)
    sheet.save(PREVIEW / "ui_v4_replaceable_base_preview.png")


def main() -> None:
    assets = [
        OUT / "product_card" / "product_card_base_normal.png",
        OUT / "product_card" / "product_card_base_heat.png",
        OUT / "product_card" / "product_card_base_hot.png",
        OUT / "product_card" / "product_card_base_disabled.png",
        OUT / "order" / "order_bubble_selected.png",
        OUT / "order" / "order_bubble_normal.png",
        OUT / "topbar" / "hud_panel_left.png",
        OUT / "topbar" / "hud_panel_timer.png",
        OUT / "topbar" / "hud_panel_coin.png",
    ]
    draw_card_base(assets[0], TEAL)
    draw_card_base(assets[1], RED, heat_tab=True)
    draw_card_base(assets[2], ORANGE, hot_tab=True)
    draw_card_base(assets[3], MUTED, disabled=True)
    draw_order_bubble(assets[4], RED, True)
    draw_order_bubble(assets[5], PURPLE, False)
    draw_hud_panel(assets[6], 190, RED)
    draw_hud_panel(assets[7], 236, RED, timer=True)
    draw_hud_panel(assets[8], 190, ORANGE)
    make_preview(assets)
    print("Generated", len(assets), "assets")
    for asset in assets:
        print(asset.relative_to(ROOT))
    print((PREVIEW / "ui_v4_replaceable_base_preview.png").relative_to(ROOT))


if __name__ == "__main__":
    main()
