#!/usr/bin/env python3
from __future__ import annotations

import argparse
from dataclasses import dataclass
from pathlib import Path

from PIL import Image, ImageDraw


@dataclass
class Component:
    box: tuple[int, int, int, int]
    area: int


def find_components_by_x_runs(image: Image.Image, alpha_threshold: int) -> list[Component]:
    alpha = image.getchannel("A")
    width, height = image.size
    columns: list[tuple[int, int]] = []

    for x in range(width):
        area = 0
        for y in range(height):
            if alpha.getpixel((x, y)) > alpha_threshold:
                area += 1
        if area:
            columns.append((x, area))

    if not columns:
        raise SystemExit("No alpha pixels found in sheet")

    runs: list[tuple[int, int]] = []
    start = prev = columns[0][0]
    gap_tolerance = 12
    for x, _ in columns[1:]:
        if x - prev > gap_tolerance:
            runs.append((start, prev + 1))
            start = x
        prev = x
    runs.append((start, prev + 1))

    components: list[Component] = []
    for left, right in runs:
        ys: list[int] = []
        area = 0
        for x in range(left, right):
            for y in range(height):
                if alpha.getpixel((x, y)) > alpha_threshold:
                    ys.append(y)
                    area += 1
        if area < 500:
            continue
        top = max(min(ys) - 4, 0)
        bottom = min(max(ys) + 5, height)
        components.append(Component((max(left - 4, 0), top, min(right + 4, width), bottom), area))

    components.sort(key=lambda component: component.box[0])
    if len(components) < 3:
        raise SystemExit(f"Expected at least 3 components, found {len(components)}")
    return components


def scale_crop(crop: Image.Image, scale: float) -> Image.Image:
    width = max(1, round(crop.width * scale))
    height = max(1, round(crop.height * scale))
    return crop.resize((width, height), Image.LANCZOS)


def paste_bottom_center(canvas: Image.Image, subject: Image.Image, center_x: int, bottom_y: int) -> None:
    x = round(center_x - subject.width / 2)
    y = bottom_y - subject.height
    canvas.alpha_composite(subject, (x, y))


def split_sheet(args: argparse.Namespace) -> None:
    sheet = Image.open(args.input).convert("RGBA")
    components = find_components_by_x_runs(sheet, args.alpha_threshold)
    body_component = components[0]
    hand_components = components[1:3]

    body_crop = sheet.crop(body_component.box)
    scale = min(args.body_target_width / body_crop.width, args.body_target_height / body_crop.height)
    body = scale_crop(body_crop, scale)

    body_canvas = Image.new("RGBA", (1024, 1024), (0, 0, 0, 0))
    paste_bottom_center(body_canvas, body, args.anchor_x, args.baseline_y)

    hands_canvas = Image.new("RGBA", (1024, 1024), (0, 0, 0, 0))
    centers = [int(value) for value in args.hand_centers.split(",")]
    if len(centers) != 2:
        raise SystemExit("--hand-centers must contain two comma-separated x positions")

    for component, center_x in zip(hand_components, centers):
        hand = scale_crop(sheet.crop(component.box), scale)
        paste_bottom_center(hands_canvas, hand, center_x, args.baseline_y)

    args.body_out.parent.mkdir(parents=True, exist_ok=True)
    args.hands_out.parent.mkdir(parents=True, exist_ok=True)
    body_canvas.save(args.body_out)
    hands_canvas.save(args.hands_out)

    if args.composite_out:
        composite = Image.alpha_composite(body_canvas, hands_canvas)
        args.composite_out.parent.mkdir(parents=True, exist_ok=True)
        composite.save(args.composite_out)


def checker(draw: ImageDraw.ImageDraw, x: int, y: int, w: int, h: int) -> None:
    size = 24
    for yy in range(y, y + h, size):
        for xx in range(x, x + w, size):
            fill = (238, 238, 238) if ((xx // size + yy // size) % 2 == 0) else (194, 194, 194)
            draw.rectangle([xx, yy, xx + size, yy + size], fill=fill)


def make_contact_sheet(args: argparse.Namespace) -> None:
    entries = [(label, Path(path)) for label, path in (item.split("=", 1) for item in args.entry)]
    cell_w, cell_h, label_h = 260, 320, 34
    rows = [("white", (255, 255, 255)), ("dark", (33, 25, 47)), ("checker", None)]
    out = Image.new("RGB", (cell_w * len(entries), (cell_h + label_h) * len(rows)), "white")
    draw = ImageDraw.Draw(out)

    for row, (bg_name, fill) in enumerate(rows):
        y = row * (cell_h + label_h)
        for col, (label, path) in enumerate(entries):
            x = col * cell_w
            if fill is None:
                checker(draw, x, y, cell_w, cell_h)
            else:
                draw.rectangle([x, y, x + cell_w, y + cell_h], fill=fill)
            image = Image.open(path).convert("RGBA")
            image.thumbnail((220, 260), Image.LANCZOS)
            out.paste(image, (x + (cell_w - image.width) // 2, y + 24 + (260 - image.height) // 2), image)
            draw.rectangle([x, y + cell_h, x + cell_w, y + cell_h + label_h], fill=(255, 255, 255))
            draw.text((x + 8, y + cell_h + 10), f"{bg_name} {label}", fill=(26, 26, 26))

    args.out.parent.mkdir(parents=True, exist_ok=True)
    out.save(args.out)


def main() -> None:
    parser = argparse.ArgumentParser()
    subparsers = parser.add_subparsers(dest="command", required=True)

    split = subparsers.add_parser("split")
    split.add_argument("--input", type=Path, required=True)
    split.add_argument("--body-out", type=Path, required=True)
    split.add_argument("--hands-out", type=Path, required=True)
    split.add_argument("--composite-out", type=Path)
    split.add_argument("--anchor-x", type=int, default=512)
    split.add_argument("--baseline-y", type=int, default=900)
    split.add_argument("--body-target-width", type=int, default=760)
    split.add_argument("--body-target-height", type=int, default=790)
    split.add_argument("--hand-centers", default="350,674")
    split.add_argument("--alpha-threshold", type=int, default=16)
    split.set_defaults(func=split_sheet)

    contact = subparsers.add_parser("contact")
    contact.add_argument("--out", type=Path, required=True)
    contact.add_argument("--entry", action="append", required=True, help="label=path")
    contact.set_defaults(func=make_contact_sheet)

    args = parser.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
