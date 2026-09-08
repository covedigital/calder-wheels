"""
Calder Wheels — Upload composite layer PNGs to Shopify Files via REST Admin API.

Usage:
  # Set credentials (or use env vars)
  export SHOPIFY_STORE="calder-wheels.myshopify.com"
  export SHOPIFY_TOKEN="shpat_..."

  python upload_composites.py
  python upload_composites.py --dry-run
"""

import argparse
import mimetypes
import os
import sys
from pathlib import Path

import requests

COMPOSITES_DIR = Path(__file__).parent.parent / "shopify" / "assets" / "composites"
API_VERSION = "2024-07"


def find_all_pngs() -> list[Path]:
    return sorted(COMPOSITES_DIR.rglob("*.png"))


def shopify_path(local_path: Path) -> str:
    relative = local_path.relative_to(COMPOSITES_DIR)
    return f"composites/{relative.as_posix()}"


def upload_file(file_path: Path, store: str, token: str, dry_run: bool = False) -> bool:
    filename = shopify_path(file_path)
    size_kb = file_path.stat().st_size / 1024

    if dry_run:
        print(f"  [DRY-RUN] Would upload: {filename} ({size_kb:.0f} KB)")
        return True

    url = f"https://{store}/admin/api/{API_VERSION}/files.json"
    headers = {"X-Shopify-Access-Token": token}

    with open(file_path, "rb") as f:
        files = {
            "file": (
                filename,
                f,
                mimetypes.guess_type(file_path)[0] or "image/png",
            )
        }
        resp = requests.post(url, headers=headers, files=files)

    if resp.status_code in (200, 201):
        print(f"  ✓ {filename} ({size_kb:.0f} KB)")
        return True
    else:
        print(f"  ✗ {filename} — {resp.status_code}: {resp.text[:200]}")
        return False


def verify_credentials(store: str, token: str) -> bool:
    url = f"https://{store}/admin/api/{API_VERSION}/shop.json"
    headers = {"X-Shopify-Access-Token": token}
    resp = requests.get(url, headers=headers)
    if resp.status_code == 200:
        shop_name = resp.json().get("shop", {}).get("name", store)
        print(f"  Authenticated: {shop_name}")
        return True
    else:
        print(f"  Auth failed: {resp.status_code} {resp.text[:200]}")
        return False


def main():
    parser = argparse.ArgumentParser(description="Upload composite PNGs to Shopify Files")
    parser.add_argument("--store", default=os.environ.get("SHOPIFY_STORE", ""),
                        help="Shopify store domain (e.g. calder-wheels.myshopify.com)")
    parser.add_argument("--token", default=os.environ.get("SHOPIFY_TOKEN", ""),
                        help="Shopify Admin API access token")
    parser.add_argument("--dry-run", action="store_true",
                        help="Show what would be uploaded without uploading")
    args = parser.parse_args()

    if not args.store or not args.token:
        print("Error: SHOPIFY_STORE and SHOPIFY_TOKEN required")
        print("  export SHOPIFY_STORE='calder-wheels.myshopify.com'")
        print("  export SHOPIFY_TOKEN='shpat_...'")
        sys.exit(1)

    pngs = find_all_pngs()
    total_kb = sum(p.stat().st_size for p in pngs) / 1024
    print(f"Found {len(pngs)} PNG files ({total_kb:.0f} KB total)")
    print(f"Target: {args.store}")
    print()

    if not args.dry_run:
        print("Verifying credentials...")
        if not verify_credentials(args.store, args.token):
            sys.exit(1)
        print()

    success = 0
    for png in pngs:
        if upload_file(png, args.store, args.token, args.dry_run):
            success += 1

    print()
    print(f"{'Dry run' if args.dry_run else 'Uploaded'}: {success}/{len(pngs)} files")


if __name__ == "__main__":
    main()