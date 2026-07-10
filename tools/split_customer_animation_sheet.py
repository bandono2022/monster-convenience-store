#!/usr/bin/env python3
from __future__ import annotations

import argparse
from dataclasses import dataclass
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


CANVAS_SIZE = 1024


@dataclass(frozen=True)
class ComponentSpec:
    name: str
    region: tuple[int, int, int, int]


@dataclass(frozen=True)
class CharacterSpec:
    key: str
    source: Path
    body_region: tuple[int, int, int, int]
    components: tuple[ComponentSpec, ...]
    face_target_y: int
    hand_targets: dict[str, tuple[int, int]]


def alpha_bbox(image: Image.Image) -> tuple[int, int, int, int]:
    bbox = image.getchannel("A").getbbox()
    if bbox is None:
        raise SystemExit("empty alpha crop")
    return bbox


def crop_trim(source: Image.Image, region: tuple[int, int, int, int], pad: int = 8) -> Image.Image:
    crop = source.crop(region)
    left, top, right, bottom = alpha_bbox(crop)
    left = max(0, left - pad)
    top = max(0, top - pad)
    right = min(crop.width, right + pad)
    bottom = min(crop.height, bottom + pad)
    return crop.crop((left, top, right, bottom))


def crop_trim_with_abs_box(
    source: Image.Image, region: tuple[int, int, int, int], pad: int = 8
) -> tuple[Image.Image, tuple[int, int, int, int]]:
    crop = source.crop(region)
    left, top, right, bottom = alpha_bbox(crop)
    left = max(0, left - pad)
    top = max(0, top - pad)
    right = min(crop.width, right + pad)
    bottom = min(crop.height, bottom + pad)
    abs_box = (region[0] + left, region[1] + top, region[0] + right, region[1] + bottom)
    return crop.crop((left, top, right, bottom)), abs_box


def resize(image: Image.Image, scale: float) -> Image.Image:
    width = max(1, round(image.width * scale))
    height = max(1, round(image.height * scale))
    return image.resize((width, height), Image.LANCZOS)


def paste_center(canvas: Image.Image, image: Image.Image, center: tuple[int, int]) -> None:
    x = round(center[0] - image.width / 2)
    y = round(center[1] - image.height / 2)
    canvas.alpha_composite(image, (x, y))


def paste_bottom_center(canvas: Image.Image, image: Image.Image, center_x: int, bottom_y: int) -> None:
    x = round(center_x - image.width / 2)
    y = bottom_y - image.height
    canvas.alpha_composite(image, (x, y))


def body_scale_and_top(body: Image.Image, baseline_y: int) -> tuple[float, int]:
    scale = min(760 / body.width, 790 / body.height)
    scaled_height = round(body.height * scale)
    return scale, baseline_y - scaled_height


def save_component_pack(spec: CharacterSpec, out_root: Path) -> dict[str, Path]:
    source = Image.open(spec.source).convert("RGBA")
    char_dir = out_root / "characters" / spec.key
    placement_dir = char_dir / "placement"
    rig_dir = char_dir / "rig_canvas"
    placement_dir.mkdir(parents=True, exist_ok=True)
    rig_dir.mkdir(parents=True, exist_ok=True)

    body, body_abs = crop_trim_with_abs_box(source, spec.body_region, pad=10)
    scale, body_top = body_scale_and_top(body, baseline_y=930)
    body_scaled = resize(body, scale)

    paths: dict[str, Path] = {}
    body_path = placement_dir / "body_base_v1.png"
    body.save(body_path)
    paths["body_base"] = body_path

    body_canvas = Image.new("RGBA", (CANVAS_SIZE, CANVAS_SIZE), (0, 0, 0, 0))
    paste_bottom_center(body_canvas, body_scaled, CANVAS_SIZE // 2, 930)
    body_canvas_path = rig_dir / "body_base_canvas_v1.png"
    body_canvas.save(body_canvas_path)
    paths["body_base_canvas"] = body_canvas_path

    body_center_x_abs = (body_abs[0] + body_abs[2]) / 2
    face_canvas_y = round(body_top + (spec.face_target_y - body_abs[1]) * scale)

    for component in spec.components:
        tight = crop_trim(source, component.region)
        tight_path = placement_dir / f"{component.name}_v1.png"
        tight.save(tight_path)
        paths[component.name] = tight_path

        canvas = Image.new("RGBA", (CANVAS_SIZE, CANVAS_SIZE), (0, 0, 0, 0))
        scaled = resize(tight, scale)
        if component.name.startswith("face_"):
            paste_center(canvas, scaled, (CANVAS_SIZE // 2, face_canvas_y))
        elif component.name in spec.hand_targets:
            target_x_abs, target_y_abs = spec.hand_targets[component.name]
            target_x = round(CANVAS_SIZE // 2 + (target_x_abs - body_center_x_abs) * scale)
            target_y = round(body_top + (target_y_abs - body_abs[1]) * scale)
            paste_center(canvas, scaled, (target_x, target_y))
        canvas_path = rig_dir / f"{component.name}_canvas_v1.png"
        canvas.save(canvas_path)
        paths[f"{component.name}_canvas"] = canvas_path

    for face in ("face_neutral", "face_happy", "face_impatient"):
        composite = Image.alpha_composite(body_canvas, Image.open(paths[f"{face}_canvas"]).convert("RGBA"))
        composite = Image.alpha_composite(composite, Image.open(paths["left_hand_canvas"]).convert("RGBA"))
        composite = Image.alpha_composite(composite, Image.open(paths["right_hand_canvas"]).convert("RGBA"))
        composite_path = rig_dir / f"rough_composite_{face.removeprefix('face_')}_v1.png"
        composite.save(composite_path)
        paths[f"rough_composite_{face.removeprefix('face_')}"] = composite_path

    return paths


def checker(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], size: int = 20) -> None:
    left, top, right, bottom = box
    for y in range(top, bottom, size):
        for x in range(left, right, size):
            fill = (238, 238, 238) if ((x // size + y // size) % 2 == 0) else (196, 196, 196)
            draw.rectangle((x, y, min(x + size, right), min(y + size, bottom)), fill=fill)


def draw_image_cell(
    out: Image.Image,
    draw: ImageDraw.ImageDraw,
    path: Path,
    label: str,
    box: tuple[int, int, int, int],
    bg: str = "checker",
) -> None:
    if bg == "dark":
        draw.rectangle(box, fill=(35, 27, 50))
    elif bg == "white":
        draw.rectangle(box, fill=(255, 255, 255))
    else:
        checker(draw, box)
    image = Image.open(path).convert("RGBA")
    image.thumbnail((box[2] - box[0] - 28, box[3] - box[1] - 54), Image.LANCZOS)
    x = box[0] + (box[2] - box[0] - image.width) // 2
    y = box[1] + 18 + (box[3] - box[1] - 54 - image.height) // 2
    out.alpha_composite(image, (x, y))
    draw.rectangle((box[0], box[3] - 34, box[2], box[3]), fill=(255, 255, 255))
    draw.text((box[0] + 8, box[3] - 24), label, fill=(35, 31, 44))


def make_overview(out_root: Path, target: Path, paths_by_char: dict[str, dict[str, Path]]) -> Path:
    width, height = 2100, 1650
    out = Image.new("RGBA", (width, height), (248, 246, 238, 255))
    draw = ImageDraw.Draw(out)
    font = ImageFont.load_default()
    draw.text((32, 24), "Customer animation rig v1 - candidate overview", fill=(30, 25, 40), font=font)
    draw.text(
        (32, 48),
        "Raw approved by user. Candidate only: Figma placement review first, no runtime/Figma upload yet.",
        fill=(80, 72, 91),
        font=font,
    )

    target_image = Image.open(target).convert("RGBA")
    target_image.thumbnail((290, 628), Image.LANCZOS)
    draw.rectangle((32, 90, 352, 760), fill=(255, 255, 255), outline=(210, 204, 190), width=2)
    out.alpha_composite(target_image, (32 + (320 - target_image.width) // 2, 112))
    draw.text((44, 728), "authority target", fill=(35, 31, 44), font=font)

    cell_w, cell_h = 220, 240
    labels = [
        ("body_base", "body"),
        ("face_neutral", "face neutral"),
        ("face_happy", "face happy"),
        ("face_impatient", "face impatient"),
        ("left_hand", "left hand"),
        ("right_hand", "right hand"),
    ]
    row_y = {"purple_hoodie": 100, "blue_teal": 410}
    for key, y in row_y.items():
        draw.text((390, y - 28), key.replace("_", " "), fill=(30, 25, 40), font=font)
        for index, (asset_key, label) in enumerate(labels):
            x = 390 + index * (cell_w + 16)
            draw_image_cell(out, draw, paths_by_char[key][asset_key], label, (x, y, x + cell_w, y + cell_h))

    composite_labels = [
        ("rough_composite_neutral", "rough neutral"),
        ("rough_composite_happy", "rough happy"),
        ("rough_composite_impatient", "rough impatient"),
    ]
    comp_y = 800
    for char_index, key in enumerate(("purple_hoodie", "blue_teal")):
        x0 = 390 + char_index * 750
        draw.text((x0, comp_y - 30), f"{key.replace('_', ' ')} rough rig preview", fill=(30, 25, 40), font=font)
        for index, (asset_key, label) in enumerate(composite_labels):
            x = x0 + index * 230
            draw_image_cell(out, draw, paths_by_char[key][asset_key], label, (x, comp_y, x + 210, comp_y + 300), bg="dark")

    draw.rectangle((32, 800, 352, 1498), fill=(255, 255, 255), outline=(210, 204, 190), width=2)
    notes = [
        "Review notes:",
        "- body_base is complete alone.",
        "- face layers are grouped expressions.",
        "- blue_teal hands are bare teal paws.",
        "- purple_hoodie hands include short cuffs.",
        "- rough previews are anchor preflight only.",
        "- user overview approval is still required.",
    ]
    yy = 832
    for note in notes:
        draw.text((54, yy), note, fill=(35, 31, 44), font=font)
        yy += 30

    out_path = out_root / "_qa" / "customer_animation_rig_v1_overview_2026_07_01.png"
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out.convert("RGB").save(out_path)
    return out_path


def build_specs(out_root: Path) -> tuple[CharacterSpec, CharacterSpec]:
    source_root = out_root / "_sources"
    shared_components = (
        ComponentSpec("face_neutral", (700, 80, 1100, 520)),
        ComponentSpec("face_happy", (1060, 80, 1440, 560)),
        ComponentSpec("face_impatient", (1420, 80, 1775, 530)),
        ComponentSpec("left_hand", (845, 555, 1160, 820)),
        ComponentSpec("right_hand", (1200, 555, 1540, 820)),
    )
    purple = CharacterSpec(
        key="purple_hoodie",
        source=source_root / "customer_purple_hoodie_animation_rig_v1_alpha.png",
        body_region=(0, 0, 720, 820),
        components=shared_components,
        face_target_y=350,
        hand_targets={"left_hand": (255, 690), "right_hand": (555, 690)},
    )
    blue = CharacterSpec(
        key="blue_teal",
        source=source_root / "customer_blue_teal_animation_rig_v1_alpha.png",
        body_region=(0, 0, 760, 820),
        components=(
            ComponentSpec("face_neutral", (730, 110, 1095, 540)),
            ComponentSpec("face_happy", (1035, 110, 1430, 560)),
            ComponentSpec("face_impatient", (1390, 110, 1745, 540)),
            ComponentSpec("left_hand", (885, 555, 1165, 830)),
            ComponentSpec("right_hand", (1210, 555, 1510, 830)),
        ),
        face_target_y=365,
        hand_targets={"left_hand": (280, 690), "right_hand": (520, 690)},
    )
    return purple, blue


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--out-root", type=Path, required=True)
    parser.add_argument("--target", type=Path, required=True)
    args = parser.parse_args()

    paths_by_char = {}
    for spec in build_specs(args.out_root):
        paths_by_char[spec.key] = save_component_pack(spec, args.out_root)
    overview = make_overview(args.out_root, args.target, paths_by_char)
    print(overview)


if __name__ == "__main__":
    main()
