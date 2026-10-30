#!/usr/bin/env python3
"""Regenerate the Shopify product export CSV, filling in metafield columns.

Reads:  docs/architecture/imports/products_export_with_bom.csv
Writes: docs/architecture/imports/products_export_with_metafields.csv

Only the product parent row (first row of each Handle group) gets metafields
populated. Variant rows and every existing column/value are preserved as-is.
"""

import csv
import json
import re
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
INPUT = BASE_DIR / "docs/architecture/imports/products_export_with_bom.csv"
OUTPUT = BASE_DIR / "docs/architecture/imports/products_export_with_metafields.csv"

VARIANT_MAP_COL = "variant_map (product.metafields.custom.variant_map)"

# Existing metafield column names -> values computed below.
BOLT_PATTERN = "bolt_pattern (product.metafields.custom.bolt_pattern)"
CONSTRUCTION = "construction (product.metafields.custom.construction)"
DEALER_MOQ = "dealer_moq (product.metafields.custom.dealer_moq)"
TIER_1 = "dealer_tier_1_price (product.metafields.custom.dealer_tier_1_price)"
TIER_2 = "dealer_tier_2_price (product.metafields.custom.dealer_tier_2_price)"
TIER_3 = "dealer_tier_3_price (product.metafields.custom.dealer_tier_3_price)"
DESIGN_CODE = "design_code (product.metafields.custom.design_code)"
DESIGN_NICKNAME = "design_nickname (product.metafields.custom.design_nickname)"
IS_CONFIGURABLE = "is_configurable (product.metafields.custom.is_configurable)"
LEAD_TIME = "lead_time_days (product.metafields.custom.lead_time_days)"
LOAD_RATING = "load_rating (product.metafields.custom.load_rating)"
SERIES = "series (product.metafields.custom.series)"

THREE_PIECE_TYPE = "3-Piece Forged Wheel"

BOLT_PATTERN_RE = re.compile(r"(\d+X\d+)\s+\+?(\d+MM)\s+(\d+\.?\d*)\s+center bore", re.IGNORECASE)
LOAD_RATING_RE = re.compile(r"(\d[\d,]*)\s*lb", re.IGNORECASE)
SUV_HANDLE_RE = re.compile(r"^calder-([a-z]+\d+)")
THREE_PIECE_HANDLE_RE = re.compile(r"^([a-z]+)-(\d+)$")
TITLE_VEHICLE_RE = re.compile(r"^Calder\s+\S+\s+(.*)$")

SUV_NICKNAMES = {
    "lexus-gx-infiniti-qx": "Lexus GX",
    "range-rover-l460": "Range Rover L460",
    "g-wagon": "G-Wagon",
    "expedition-f150": "Expedition",
    "tahoe-yukon-escalade": "Tahoe",
}


def parse_price(value):
    try:
        return float(value)
    except (TypeError, ValueError):
        return 0.0


def format_money(value):
    return "{:.2f}".format(round(value, 2))


def extract_bolt_pattern(description):
    if not description:
        return ""
    match = BOLT_PATTERN_RE.search(description)
    if not match:
        return ""
    return match.group(1).lower()


def extract_load_rating(description, is_three_piece):
    if not is_three_piece:
        return "2650"
    if description:
        match = LOAD_RATING_RE.search(description)
        if match:
            return match.group(1).replace(",", "")
    return "2200"


def design_code_from_handle(handle, is_three_piece):
    if is_three_piece:
        match = THREE_PIECE_HANDLE_RE.match(handle)
        if match:
            return match.group(2)
        return ""
    match = SUV_HANDLE_RE.match(handle)
    if match:
        return match.group(1).upper()
    return ""


def design_nickname_from_title(handle, title, is_three_piece):
    if is_three_piece:
        match = THREE_PIECE_HANDLE_RE.match(handle)
        if match:
            return match.group(1).title()
        return ""
    # "Calder     207    Lexus GX / Infiniti QX - Gloss Black Lip / ..."
    match = TITLE_VEHICLE_RE.match(title)
    if not match:
        return ""
    rest = match.group(1).strip()
    vehicle = rest.split(" - ", 1)[0].strip()
    return vehicle.split(" / ", 1)[0].strip()


def build_variant_map(group_rows):
    mapping = {}
    for row in group_rows:
        opt1 = (row["Option1 Value"] or "").strip()
        opt2 = (row["Option2 Value"] or "").strip()
        sku = (row["Variant SKU"] or "").strip()
        if not sku or " ; " in opt1 or " ; " in opt2:
            continue
        if not opt1 or not opt2:
            continue
        mapping["{};;{}".format(opt1, opt2)] = sku
    return mapping


def process():
    with open(INPUT, newline="", encoding="utf-8") as handle:
        reader = csv.DictReader(handle)
        fieldnames = list(reader.fieldnames)
        rows = list(reader)

    original_fieldnames = list(fieldnames)
    if VARIANT_MAP_COL not in fieldnames:
        bom_col = "bom (product.metafields.custom.bom)"
        # Insert variant_map immediately before the bom column (keep bom last).
        fieldnames.insert(fieldnames.index(bom_col), VARIANT_MAP_COL)

    output_file = open(OUTPUT, "w", newline="", encoding="utf-8")
    sheet = csv.DictWriter(
        output_file,
        fieldnames=fieldnames,
        lineterminator="\r\n",
    )
    sheet.writeheader()

    product_count = 0
    three_piece_count = 0
    suv_count = 0
    draft_suv_count = 0
    missing_bolt_pattern = []
    three_piece_loads = {}

    i = 0
    total = len(rows)
    while i < total:
        handle = rows[i]["Handle"].strip()
        group = []
        while i < total and rows[i]["Handle"].strip() == handle:
            group.append(rows[i])
            i += 1

        parent = group[0]
        is_three_piece = parent["Type"].strip() == THREE_PIECE_TYPE
        product_count += 1
        if is_three_piece:
            three_piece_count += 1
        else:
            suv_count += 1
            if len(group) == 1:
                draft_suv_count += 1

        description = parent["Body (HTML)"] or ""

        # Retail price = first variant's price (parent's own price when the
        # parent row carries the first variant, e.g. 3-Piece products).
        price = 0.0
        price_row = -1
        for row in group:
            candidate = parse_price(row["Variant Price"])
            if candidate > 0:
                price = candidate
                break

        # ---- Metafield values to write on the parent row only ----
        metafields = {
            BOLT_PATTERN: extract_bolt_pattern(description),
            CONSTRUCTION: "3-Piece Forged" if is_three_piece else "Spun Forged",
            DEALER_MOQ: "1" if is_three_piece else "4",
            TIER_1: format_money(price * 0.85),
            TIER_2: format_money(price * 0.90),
            TIER_3: format_money(price * 0.95),
            DESIGN_CODE: design_code_from_handle(handle, is_three_piece),
            DESIGN_NICKNAME: design_nickname_from_title(handle, parent["Title"], is_three_piece),
            IS_CONFIGURABLE: "TRUE",
            LEAD_TIME: "10" if is_three_piece else "15",
            LOAD_RATING: extract_load_rating(description, is_three_piece),
            SERIES: "three_piece" if is_three_piece else "SUV Wheel - Spun Forged",
        }
        variant_map = build_variant_map(group)
        metafields[VARIANT_MAP_COL] = json.dumps(
            variant_map, ensure_ascii=False, separators=(",", ":")
        )

        if not metafields[BOLT_PATTERN]:
            missing_bolt_pattern.append(handle)
        if is_three_piece:
            three_piece_loads[handle] = metafields[LOAD_RATING]

        # Apply metafields to the parent row; variant rows stay untouched.
        for row in group:
            if row is parent:
                for key, value in metafields.items():
                    row[key] = value
            sheet.writerow(row)

    output_file.close()

    # ---- Report ----
    print("Input file:  {}".format(INPUT))
    print("Output file: {}".format(OUTPUT))
    print("Rows in:  {}".format(total))
    print("Rows out: {}".format(len(rows)))
    print("Products processed: {}".format(product_count))
    print("  SUV Wheel products:     {}".format(suv_count))
    print("  Of which draft (no variants): {}".format(draft_suv_count))
    print("  3-Piece products:       {}".format(three_piece_count))
    print("Field count in:  {}".format(len(original_fieldnames)))
    print("Field count out: {}".format(len(fieldnames)))
    print("Products missing a parseable bolt pattern (left blank): {}".format(len(missing_bolt_pattern)))
    print("3-Piece load ratings: {}".format(three_piece_loads))
    return 0


if __name__ == "__main__":
    sys.exit(process())