"""
Calder Wheels — Flatten composite layer PNGs into flat filenames.

Copy:   shopify/assets/composites/design-{id}/{layer}.png
      → shopify/assets/composites-flat/design-{id}-{layer}.png

Usage:
  python fitment/flatten_composites.py
  python fitment/flatten_composites.py --dry-run
  python fitment/flatten_composites.py --output-directory shopify/assets
"""

import argparse
import os
import shutil
from pathlib import Path

COMPOSITES_DIR = Path(__file__).parent.parent / "shopify" / "assets" / "composites"
OUTPUT_DIR = Path(__file__).parent.parent / "shopify" / "assets" / "composites-flat"


def flatten(composites_dir: Path, output_dir: Path, dry_run: bool = False) -> int:
    pngs = sorted(composites_dir.rglob("*.png"))
    if not pngs:
        print(f"No PNGs found in {composites_dir}")
        return 0

    if not dry_run:
        output_dir.mkdir(parents=True, exist_ok=True)

    count = 0
    for png in pngs:
        relative = png.relative_to(composites_dir)
        flat_name = relative.as_posix().replace("/", "-")
        dest = output_dir / flat_name

        if dry_run:
            print(f"  {relative}  →  {flat_name}")
        else:
            shutil.copy2(png, dest)
            size_kb = dest.stat().st_size / 1024
            print(f"  {flat_name}  ({size_kb:.0f} KB)")

        count += 1

    return count


def main():
    parser = argparse.ArgumentParser(description="Flatten composite PNGs")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument(
        "--output-directory",
        default=None,
        help="Custom output directory (default: shopify/assets/composites-flat)",
    )
    args = parser.parse_args()

    output_dir = Path(args.output_directory) if args.output_directory else OUTPUT_DIR

    label = "Dry run" if args.dry_run else "Copying"
    print(f"{label}: {COMPOSITES_DIR} → {output_dir}")
    count = flatten(COMPOSITES_DIR, output_dir, dry_run=args.dry_run)

    if count:
        print(f"\n{count} files written to {output_dir}")
        print(f"Use: shopify theme push --only='{output_dir.name}/*.png'")
    else:
        print("\nNo files found.")


if __name__ == "__main__":
    main()