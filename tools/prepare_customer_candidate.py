#!/usr/bin/env python3
from pathlib import Path
import argparse
import subprocess
import os

from PIL import Image, ImageDraw


def run_chroma(input_path: Path, raw_alpha: Path) -> None:
    helper = Path(os.environ.get("CODEX_HOME", str(Path.home() / ".codex"))) / "skills/.system/imagegen/scripts/remove_chroma_key.py"
    subprocess.run(
        [
            "python3",
            str(helper),
            "--input",
            str(input_path),
            "--out",
            str(raw_alpha),
            "--auto-key",
            "border",
            "--soft-matte",
            "--transparent-threshold",
            "12",
            "--opaque-threshold",
            "220",
            "--despill",
        ],
        check=True,
    )


def normalize_square(raw_alpha: Path, output: Path) -> None:
    im = Image.open(raw_alpha).convert("RGBA")
    bbox = im.getbbox()
    if not bbox:
        raise SystemExit(f"empty alpha image: {raw_alpha}")
    subject = im.crop(bbox)
    scale = min(900 / subject.width, 900 / subject.height, 1.0)
    if scale < 1.0:
        subject = subject.resize((round(subject.width * scale), round(subject.height * scale)), Image.LANCZOS)
    out = Image.new("RGBA", (1024, 1024), (0, 0, 0, 0))
    out.paste(subject, ((1024 - subject.width) // 2, 1024 - subject.height - 34), subject)
    output.parent.mkdir(parents=True, exist_ok=True)
    out.save(output)


def make_qa(states: list[tuple[str, Path]], output: Path) -> None:
    cell_w, cell_h, label_h = 240, 330, 44
    bgs = [("white", (255, 255, 255)), ("dark", (36, 25, 48)), ("checker", None)]
    out = Image.new("RGB", (cell_w * len(states), (cell_h + label_h) * len(bgs)), "white")
    draw = ImageDraw.Draw(out)
    for row, (bg_name, bg) in enumerate(bgs):
        for col, (state, path) in enumerate(states):
            x, y = col * cell_w, row * (cell_h + label_h)
            if bg:
                draw.rectangle([x, y, x + cell_w, y + cell_h], fill=bg)
            else:
                size = 20
                for yy in range(y, y + cell_h, size):
                    for xx in range(x, x + cell_w, size):
                        color = (238, 238, 238) if ((xx // size + yy // size) % 2 == 0) else (198, 198, 198)
                        draw.rectangle([xx, yy, xx + size, yy + size], fill=color)
            im = Image.open(path).convert("RGBA")
            im.thumbnail((205, 255), Image.LANCZOS)
            out.paste(im, (x + (cell_w - im.width) // 2, y + 24 + (255 - im.height) // 2), im)
            draw.rectangle([x, y + cell_h, x + cell_w, y + cell_h + label_h], fill=(255, 255, 255))
            draw.text((x + 10, y + cell_h + 12), f"{bg_name} {state}", fill=(30, 30, 30))
    output.parent.mkdir(parents=True, exist_ok=True)
    out.save(output)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--chroma", type=Path)
    parser.add_argument("--raw-alpha", type=Path)
    parser.add_argument("--out", type=Path)
    parser.add_argument("--qa", type=Path)
    parser.add_argument("--qa-state", action="append", default=[], help="label=path")
    args = parser.parse_args()

    if args.chroma and args.raw_alpha:
        run_chroma(args.chroma, args.raw_alpha)
    if args.raw_alpha and args.out:
        normalize_square(args.raw_alpha, args.out)
    if args.qa:
        states = []
        for item in args.qa_state:
            label, path = item.split("=", 1)
            states.append((label, Path(path)))
        make_qa(states, args.qa)


if __name__ == "__main__":
    main()
