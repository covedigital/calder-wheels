"""
Calder Wheels — Product Metafield Seed Script

Generates a JSON file that can be imported into Shopify to set
product metafields for the configurator, series badges, and dealer pricing.

Also generates a CSV for bulk import via Shopify Admin.

Usage:
  python seed_metafields.py --json metafields.json
  python seed_metafields.py --csv metafields.csv
  python seed_metafields.py --json metafields.json --csv metafields.csv
"""

import argparse
import csv
import json
import sys
from pathlib import Path

# Add configurator to path
sys.path.insert(0, str(Path(__file__).parent.parent / "configurator"))

from configurator_model import (
    CLIENT_DESIGNS,
    CENTER_FINISHES,
    BARREL_FINISHES,
    HARDWARE_FINISHES,
    get_component_price,
    ComponentType,
    Series,
)


# ─── Product Definitions ────────────────────────────────────────────────────

# Maps client design codes to Shopify product handles
# These are the actual products that will be created in Shopify
PRODUCTS = [
    # (handle, title, design_code, design_nickname, series, dealer_moq, dealer_tier_1, dealer_tier_2, dealer_tier_3)
    ("apex-201", "Apex 201 — 3-Piece Forged", "201", "Apex", "three_piece", 1, 1015.00, 955.00, 895.00),
    ("vertex-202", "Vertex 202 — 3-Piece Forged", "202", "Vertex", "three_piece", 1, 1015.00, 955.00, 895.00),
    ("striker-203", "Striker 203 — 3-Piece Forged", "203", "Striker", "three_piece", 1, 1015.00, 955.00, 895.00),
    ("turbine-205", "Turbine 205 — 3-Piece Forged", "205", "Turbine", "three_piece", 1, 1015.00, 955.00, 895.00),
    ("vortex-207", "Vortex 207 — 3-Piece Forged", "207", "Vortex", "three_piece", 1, 1015.00, 955.00, 895.00),
]


def build_bom_json(design_code: str) -> dict:
    """Build the BOM JSON structure for a product."""
    design = CLIENT_DESIGNS.get(design_code)
    if not design:
        return {"components": []}

    components = []
    for ct in design.series.configurable_components():
        finishes = {
            ComponentType.CENTER: CENTER_FINISHES,
            ComponentType.BARREL: BARREL_FINISHES,
            ComponentType.HARDWARE: HARDWARE_FINISHES,
        }[ct]
        component_list = []
        for finish in finishes:
            price = get_component_price(ct, finish.id)
            component_list.append({
                "id": finish.id,
                "name": finish.name,
                "client_code": finish.client_code,
                "type": ct.value,
                "category": finish.category,
                "unit_cost": float(price.unit_cost) if price else 0,
                "retail_price": float(price.retail_price) if price else 0,
                "image": f"design-{design_code.lower()}-{ct.layer_name()}-{finish.client_code}.png",
            })
        components.extend(component_list)

    return {"components": components}


def build_variant_map(design_code: str) -> dict:
    """
    Build the variant_map for a design.
    Maps config key (center|barrel|hardware) to variant ID.
    This is a placeholder — actual variant IDs come from Shopify.
    """
    return {"_note": "Populated after Shopify product creation with variant IDs"}


def export_json(output_path: str):
    """Export metafields as JSON for use with Shopify Admin API."""
    records = []
    for handle, title, code, nickname, series, moq, t1, t2, t3 in PRODUCTS:
        records.append({
            "handle": handle,
            "title": title,
            "metafields": {
                "is_configurable": True,
                "design_code": code,
                "design_nickname": nickname,
                "series": series,
                "dealer_moq": moq,
                "dealer_tier_1_price": t1,
                "dealer_tier_2_price": t2,
                "dealer_tier_3_price": t3,
                "dealer_only": False,
                "lead_time_days": 10,
                "bom": build_bom_json(code),
                "variant_map": build_variant_map(code),
            },
        })

    with open(output_path, "w") as f:
        json.dump(records, f, indent=2)

    print(f"Wrote JSON: {output_path} ({len(records)} products)")


def export_csv(output_path: str):
    """Export metafields as CSV for Shopify Admin bulk import.

    Column format: handle, namespace, key, value (JSON-encoded)
    """
    with open(output_path, "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["handle", "namespace", "key", "value"])

        for handle, title, code, nickname, series, moq, t1, t2, t3 in PRODUCTS:
            metafields = [
                ("custom", "is_configurable", "true"),
                ("custom", "design_code", json.dumps(code)),
                ("custom", "design_nickname", json.dumps(nickname)),
                ("custom", "series", json.dumps(series)),
                ("custom", "dealer_moq", str(moq)),
                ("custom", "dealer_tier_1_price", str(t1)),
                ("custom", "dealer_tier_2_price", str(t2)),
                ("custom", "dealer_tier_3_price", str(t3)),
                ("custom", "dealer_only", "false"),
                ("custom", "lead_time_days", "10"),
                ("custom", "bom", json.dumps(build_bom_json(code))),
                ("custom", "variant_map", json.dumps(build_variant_map(code))),
            ]
            for ns, key, value in metafields:
                writer.writerow([handle, ns, key, value])

    print(f"Wrote CSV: {output_path} ({len(PRODUCTS)} products × 12 metafields)")


def main():
    parser = argparse.ArgumentParser(description="Export product metafield seed data")
    parser.add_argument("--json", default="", help="Output JSON file path")
    parser.add_argument("--csv", default="", help="Output CSV file path")
    args = parser.parse_args()

    if not args.json and not args.csv:
        parser.print_help()
        print("\nExample: python seed_metafields.py --json metafields.json --csv metafields.csv")
        sys.exit(1)

    if args.json:
        export_json(args.json)
    if args.csv:
        export_csv(args.csv)


if __name__ == "__main__":
    main()