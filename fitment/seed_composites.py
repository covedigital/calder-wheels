"""
Calder Wheels — Composite Image Upload Helper

Generates a manifest of all 35 composite layer PNGs for Shopify upload.
Also generates a Shopify Theme Kit / CLI-compatible asset mapping.

Usage:
  python seed_composites.py --manifest upload_manifest.json
  python seed_composites.py --shopify-dir ../shopify/assets/composites
"""

import argparse
import json
import os
from pathlib import Path


DESIGNS = ["201", "202", "203", "205", "207"]
EXPECTED_LAYERS = [
    "center-bk.png", "center-bkuti.png", "center-su.png",
    "barrel-bk.png", "barrel-polish.png",
    "bolt-bk.png", "bolt-chrome.png",
]

COMPOSITES_DIR = Path(__file__).parent.parent / "shopify" / "assets" / "composites"


def verify_all_layers() -> list[str]:
    """Verify all 35 layer files exist. Returns list of missing files."""
    missing = []
    for design in DESIGNS:
        design_dir = COMPOSITES_DIR / f"design-{design}"
        if not design_dir.exists():
            missing.append(f"design-{design}/ (directory missing)")
            continue
        for layer in EXPECTED_LAYERS:
            layer_path = design_dir / layer
            if not layer_path.exists():
                missing.append(f"design-{design}/{layer}")
    return missing


def generate_manifest(output_path: str):
    """Generate a JSON manifest of all composite layers."""
    missing = verify_all_layers()
    if missing:
        print(f"Missing {len(missing)} layer files:")
        for m in missing:
            print(f"  ✗ {m}")
        print("Run the copy script first.")
        return

    manifest = {
        "version": "1.0",
        "total_layers": len(DESIGNS) * len(EXPECTED_LAYERS),
        "designs": DESIGNS,
        "layers_per_design": len(EXPECTED_LAYERS),
        "files": [],
    }

    for design in DESIGNS:
        design_dir = COMPOSITES_DIR / f"design-{design}"
        for layer in sorted(os.listdir(design_dir)):
            if not layer.endswith(".png"):
                continue
            layer_path = design_dir / layer
            size_kb = layer_path.stat().st_size / 1024
            manifest["files"].append({
                "local_path": f"composites/design-{design}/{layer}",
                "shopify_path": f"assets/composites/design-{design}/{layer}",
                "size_kb": round(size_kb, 1),
                "design": design,
                "layer": layer,
            })

    with open(output_path, "w") as f:
        json.dump(manifest, f, indent=2)

    total_size = sum(f["size_kb"] for f in manifest["files"])
    print(f"Wrote manifest: {output_path}")
    print(f"  {manifest['total_layers']} files, {total_size:.0f} KB total")
    print(f"  Upload to Shopify at: assets/composites/design-{'{201-207}'}/{{layer}}.png")


def generate_shopify_kit_config(output_path: str):
    """Generate a config.yml snippet for Shopify Theme Kit / CLI."""
    missing = verify_all_layers()
    if missing:
        print("Missing layer files. Cannot generate config.")
        return

    lines = ["# Calder Wheels — Composite Layer Assets",
             "# Add to config.yml under assets:", ""]
    for design in DESIGNS:
        design_dir = COMPOSITES_DIR / f"design-{design}"
        for layer in sorted(os.listdir(design_dir)):
            if not layer.endswith(".png"):
                continue
            local = f"composites/design-{design}/{layer}"
            shopify = f"assets/composites/design-{design}/{layer}"
            lines.append(f"  - {local}")

    with open(output_path, "w") as f:
        f.write("\n".join(lines))

    print(f"Wrote: {output_path}")


def main():
    parser = argparse.ArgumentParser(description="Composite image upload helper")
    parser.add_argument("--manifest", default="", help="Output JSON manifest path")
    parser.add_argument("--verify", action="store_true", help="Verify all layer files exist")
    parser.add_argument("--shopify-config", default="", help="Output Shopify CLI config snippet")
    args = parser.parse_args()

    if args.verify:
        missing = verify_all_layers()
        if missing:
            print(f"Missing {len(missing)} files:")
            for m in missing:
                print(f"  ✗ {m}")
        else:
            print(f"✅ All {len(DESIGNS) * len(EXPECTED_LAYERS)} layer files present")

    if args.manifest:
        generate_manifest(args.manifest)

    if args.shopify_config:
        generate_shopify_kit_config(args.shopify_config)

    if not args.verify and not args.manifest and not args.shopify_config:
        missing = verify_all_layers()
        if missing:
            print(f"Missing {len(missing)} files. Run the copy script first.")
        else:
            print(f"✅ All {len(DESIGNS) * len(EXPECTED_LAYERS)} layer files present")
            print(f"   Location: {COMPOSITES_DIR}")
            print(f"   Run: python seed_composites.py --manifest manifest.json")


if __name__ == "__main__":
    main()