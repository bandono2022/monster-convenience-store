from collections import deque
from pathlib import Path
from statistics import median

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / "assets/ui/final-candidates/gameplay-retry-v1"
OUT = BASE / "_cutout_probe"
QA = BASE / "_qa"

TESTS = [
    "product_rice_ball_v1",
    "product_lemon_drink_v3",
    "product_snack_bag_v1",
    "product_pudding_cup_v1",
]


def dist(a, b):
    return sum((a[i] - b[i]) ** 2 for i in range(3)) ** 0.5


def bg_color(im):
    w, h = im.size
    pts = []
    step = max(1, min(w, h) // 80)
    for x in range(0, w, step):
        pts.append(im.getpixel((x, 0))[:3])
        pts.append(im.getpixel((x, h - 1))[:3])
    for y in range(0, h, step):
        pts.append(im.getpixel((0, y))[:3])
        pts.append(im.getpixel((w - 1, y))[:3])
    return tuple(int(median([p[i] for p in pts])) for i in range(3))


def flood_cutout(src, tolerance=72):
    im = Image.open(src).convert("RGBA")
    w, h = im.size
    pix = im.load()
    bg = bg_color(im)
    seen = bytearray(w * h)
    q = deque()

    def add(x, y):
        i = y * w + x
        if seen[i]:
            return
        if dist(pix[x, y][:3], bg) <= tolerance:
            seen[i] = 1
            q.append((x, y))

    for x in range(w):
        add(x, 0)
        add(x, h - 1)
    for y in range(h):
        add(0, y)
        add(w - 1, y)

    while q:
        x, y = q.popleft()
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= nx < w and 0 <= ny < h:
                add(nx, ny)

    out = im.copy()
    op = out.load()
    for y in range(h):
        for x in range(w):
            if seen[y * w + x]:
                r, g, b, _ = op[x, y]
                op[x, y] = (r, g, b, 0)
    return out


def checker(size, cell=18):
    w, h = size
    im = Image.new("RGB", size, "white")
    d = ImageDraw.Draw(im)
    for y in range(0, h, cell):
        for x in range(0, w, cell):
            if (x // cell + y // cell) % 2:
                d.rectangle((x, y, x + cell - 1, y + cell - 1), fill=(205, 205, 205))
    return im


def fit(im, size=(220, 220), bg=(255, 255, 255)):
    if im.mode == "RGBA":
        canvas = Image.new("RGBA", im.size, bg + (255,))
        canvas.alpha_composite(im)
        im = canvas.convert("RGB")
    else:
        im = im.convert("RGB")
    im.thumbnail(size, Image.Resampling.LANCZOS)
    out = Image.new("RGB", size, bg)
    out.paste(im, ((size[0] - im.width) // 2, (size[1] - im.height) // 2))
    return out


def composite_tile(rgba, bg):
    if bg == "checker":
        base = checker(rgba.size).convert("RGBA")
    else:
        base = Image.new("RGBA", rgba.size, bg + (255,))
    base.alpha_composite(rgba)
    return fit(base.convert("RGB"))


def label(text, size=(220, 28)):
    im = Image.new("RGB", size, (250, 248, 241))
    ImageDraw.Draw(im).text((8, 7), text, fill=(35, 30, 45), font=ImageFont.load_default())
    return im


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    QA.mkdir(parents=True, exist_ok=True)
    rows = []
    report = []

    for name in TESTS:
        src = BASE / "_sources/products" / f"{name}_chroma.png"
        old = BASE / "products" / f"{name}.png"
        new = flood_cutout(src)
        out_path = OUT / f"{name}_flood.png"
        new.save(out_path)

        alpha = new.getchannel("A")
        report.append(f"- `{out_path.relative_to(ROOT)}` size={new.size} alpha_bbox={alpha.getbbox()} alpha_extrema={alpha.getextrema()}")

        src_im = Image.open(src).convert("RGB")
        old_im = Image.open(old).convert("RGBA") if old.exists() else None
        labels = [
            label(name),
            label("source"),
            label("old dark"),
            label("flood white"),
            label("flood dark"),
            label("flood checker"),
        ]
        images = [
            fit(src_im),
            composite_tile(old_im, (31, 26, 45)) if old_im else Image.new("RGB", (220, 220), (240, 220, 220)),
            composite_tile(new, (255, 255, 255)),
            composite_tile(new, (31, 26, 45)),
            composite_tile(new, "checker"),
        ]
        row = Image.new("RGB", (220 * 6, 28 + 220), (255, 255, 255))
        for i, tile in enumerate(labels):
            row.paste(tile, (i * 220, 0))
        for i, tile in enumerate([Image.new("RGB", (220, 220), (250, 248, 241))] + images):
            row.paste(tile, (i * 220, 28))
        rows.append(row)

    sheet = Image.new("RGB", (220 * 6, len(rows) * 248), (255, 255, 255))
    for i, row in enumerate(rows):
        sheet.paste(row, (0, i * 248))
    sheet.save(QA / "cutout_flood_probe_contact_sheet.png")
    (QA / "cutout_flood_probe_report.md").write_text("\n".join(report) + "\n", encoding="utf-8")
    print(QA / "cutout_flood_probe_contact_sheet.png")


if __name__ == "__main__":
    main()
