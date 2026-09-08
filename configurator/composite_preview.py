"""
Calder Wheels — Composite Preview Generator

Verifies that the organized layer PNGs exist and can be composited
into a single preview image. Also generates composite JPG previews
matching the client's original renderings for QA.

Usage:
    python composite_preview.py                         # list all layers
    python composite_preview.py --render 201 BK POLISH CHROME  # composite one
    python composite_preview.py --render-all              # composite all combos
"""

import argparse
import os
import sys
from pathlib import Path

import sys
sys.path.insert(0, str(Path(__file__).parent))

from configurator_model import (
    CLIENT_DESIGNS,
    CENTER_FINISHES,
    BARREL_FINISHES,
    HARDWARE_FINISHES,
    get_finish,
    ComponentType,
    Series,
    resolve_composite_layers,
)

COMPOSITES_DIR = Path(__file__).parent.parent / "shopify" / "assets" / "composites"
OUTPUT_DIR = Path(__file__).parent / "previews"
CANVAS_SIZE = (1920, 1564)


def verify_layers_exist(design_code: str, layers: list) -> list[str]:
    """Check if all layer files exist on disk. Returns missing files."""
    missing = []
    for layer in layers:
        rel = layer.path(design_code)
        rel = rel[len("composites/"):]
        layer_path = COMPOSITES_DIR / rel
        if not layer_path.exists():
            missing.append(str(layer_path))
    return missing


def list_all_layers():
    """List every layer file that exists on disk."""
    print(f"\nComposite layers in: {COMPOSITES_DIR}\n")
    for design_dir in sorted(COMPOSITES_DIR.iterdir()):
        if not design_dir.is_dir():
            continue
        print(f"  {design_dir.name}/")
        for f in sorted(design_dir.iterdir()):
            size_kb = f.stat().st_size / 1024
            print(f"    {f.name}  ({size_kb:.0f} KB)")
        print()


def render_composite(design_code: str, center: str, barrel: str,
                     hardware: str, size_suffix: str = None) -> str:
    """Composite layers with Pillow and save a preview JPG."""
    try:
        from PIL import Image
    except ImportError:
        print("Pillow not installed. Run: pip install Pillow")
        return ""

    design = CLIENT_DESIGNS.get(design_code)
    if not design:
        return f"Unknown design: {design_code}"

    layers = resolve_composite_layers(
        design_code, design.series,
        center, barrel, hardware,
        size_suffix=size_suffix,
    )

    missing = verify_layers_exist(design_code, layers)
    if missing:
        return f"Missing layer files:\n  " + "\n  ".join(missing)

    composite = Image.new("RGBA", CANVAS_SIZE, (0, 0, 0, 0))
    for layer in layers:
        layer_path = COMPOSITES_DIR / layer.path(design_code)[len("composites/"):]
        img = Image.open(layer_path).convert("RGBA")
        composite = Image.alpha_composite(composite, img)

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    outfile = OUTPUT_DIR / f"{design_code}_{center}_{barrel}_{hardware}.jpg"
    composite.convert("RGB").save(outfile, "JPEG", quality=95)
    return str(outfile)


def render_all():
    """Generate composite previews for every valid combination."""
    results = []
    for dc, design in CLIENT_DESIGNS.items():
        for c in CENTER_FINISHES:
            for b in BARREL_FINISHES:
                for h in HARDWARE_FINISHES:
                    out = render_composite(dc, c.id, b.id, h.id)
                    if "Missing" not in out:
                        results.append(out)
                        print(f"  ✓ {dc} {c.id} {b.id} {h.id} → {out}")
                    else:
                        print(f"  ✗ {dc} {c.id} {b.id} {h.id}: {out}")
    print(f"\nGenerated {len(results)} composite previews in {OUTPUT_DIR}/")


def main():
    parser = argparse.ArgumentParser(description="Configurator composite preview generator")
    parser.add_argument("--render", nargs=4,
                        metavar=("DESIGN", "CENTER", "BARREL", "HARDWARE"),
                        help="Render one configuration: DESIGN CENTER BARREL HARDWARE")
    parser.add_argument("--render-all", action="store_true",
                        help="Render all valid finish combinations")
    args = parser.parse_args()

    if args.render:
        dc, c, b, h = args.render
        out = render_composite(dc, c.upper(), b.upper(), h.upper())
        print(out)
    elif args.render_all:
        render_all()
    else:
        list_all_layers()
        print(f"Usage: {sys.argv[0]} --render 201 BK POLISH CHROME")
        print(f"       {sys.argv[0]} --render-all")


if __name__ == "__main__":
    main()