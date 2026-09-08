"""
Calder Wheels — Fitment Data Export (SQLite → Shopify JSON)

Exports the seed fitment database to a JSON file that can be:
  1. Uploaded as a Shopify asset (fitment-data.json)
  2. Embedded in a Liquid snippet (fitment-data.liquid)
  3. Served by the middleware API

The output format matches what fitment-finder.js expects:
  { vehicles: [{ year, make, model, generation, trim, bolt_pattern, ... }] }

Usage:
  python export_fitment_data.py --db fitment.db --output fitment-data.json
  python export_fitment_data.py --db fitment.db --liquid ../shopify/snippets/fitment-data.liquid
"""

import argparse
import json
import sqlite3
import sys
from pathlib import Path
from typing import Optional


def export_vehicles_json(db_path: str, pretty: bool = False) -> str:
    """
    Query the fitment DB and return a JSON string of vehicles for the JS.
    """
    if not Path(db_path).exists():
        print(f"Database not found: {db_path}", file=sys.stderr)
        print("Run 'python nhtsa_seeder.py --db fitment.db --years 2010-2026' first.", file=sys.stderr)
        sys.exit(1)

    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row

    # Check if fitment_specs has data (curated bolt patterns per vehicle)
    cur = conn.execute("SELECT COUNT(*) AS c FROM fitment_specs")
    has_fitment_specs = cur.fetchone()["c"] > 0

    vehicles = []

    if has_fitment_specs:
        # Export with full fitment data (bolt pattern, diameter range, offset, etc.)
        cur = conn.execute("""
            SELECT
                my.year,
                mk.name AS make,
                md.name AS model,
                '' AS generation,
                '' AS trim,
                bp.pattern AS bolt_pattern,
                fs.diameter_min,
                fs.diameter_max,
                fs.width_min,
                fs.width_max,
                fs.offset_min,
                fs.offset_max,
                fs.hub_bore,
                fs.load_rating_min
            FROM model_years my
            JOIN models md ON md.model_id = my.model_id
            JOIN makes mk ON mk.make_id = md.make_id
            LEFT JOIN fitment_specs fs ON fs.model_year_id = my.id
            LEFT JOIN bolt_patterns bp ON bp.id = fs.bolt_pattern_id
            WHERE fs.id IS NOT NULL
            ORDER BY my.year DESC, mk.name, md.name
        """)
        for row in cur.fetchall():
            vehicles.append({
                "year": row["year"],
                "make": row["make"],
                "model": row["model"],
                "generation": row["generation"],
                "trim": row["trim"],
                "bolt_pattern": row["bolt_pattern"],
                "min_diameter": row["diameter_min"],
                "max_diameter": row["diameter_max"],
                "min_width": row["width_min"],
                "max_width": row["width_max"],
                "min_offset": row["offset_min"],
                "max_offset": row["offset_max"],
                "hub_bore": row["hub_bore"],
                "load_rating_min": row["load_rating_min"],
            })
    else:
        # No fitment specs yet — export just the vehicle taxonomy (makes/models by year)
        # The JS will show the dropdown cascade but results will be empty
        # until fitment_specs are populated.
        cur = conn.execute("""
            SELECT
                my.year,
                mk.name AS make,
                md.name AS model,
                '' AS generation,
                '' AS trim,
                '' AS bolt_pattern,
                NULL AS min_diameter,
                NULL AS max_diameter,
                NULL AS min_width,
                NULL AS max_width,
                NULL AS min_offset,
                NULL AS max_offset,
                NULL AS hub_bore,
                NULL AS load_rating_min
            FROM model_years my
            JOIN models md ON md.model_id = my.model_id
            JOIN makes mk ON mk.make_id = md.make_id
            ORDER BY my.year DESC, mk.name, md.name
        """)
        for row in cur.fetchall():
            vehicles.append({
                "year": row["year"],
                "make": row["make"],
                "model": row["model"],
                "generation": row["generation"],
                "trim": row["trim"],
                "bolt_pattern": row["bolt_pattern"],
                "min_diameter": row["min_diameter"],
                "max_diameter": row["max_diameter"],
                "min_width": row["min_width"],
                "max_width": row["max_width"],
                "min_offset": row["min_offset"],
                "max_offset": row["max_offset"],
                "hub_bore": row["hub_bore"],
                "load_rating_min": row["load_rating_min"],
            })

    conn.close()

    indent = 2 if pretty else None
    return json.dumps({"vehicles": vehicles}, indent=indent)


def write_liquid_snippet(db_path: str, output_path: str):
    """Write a Liquid snippet that embeds the JSON data inline."""
    json_str = export_vehicles_json(db_path, pretty=True)

    liquid = """{% comment %}
  Calder Wheels — Fitment Data Provider
  Embeds the full NHTSA-seeded vehicle database as inline JSON.
  Used by fitment-finder.js as the primary data source.
  Regenerate by running: python export_fitment_data.py --db fitment.db --liquid
{% endcomment %}

<script id="fitment-data-json" type="application/json">
{{ fitment_data }}
</script>

<script>
  window.__fitmentData = {{ fitment_data }};
</script>
""".replace("{{ fitment_data }}", json_str)

    with open(output_path, "w") as f:
        f.write(liquid)

    print(f"Wrote Liquid snippet: {output_path} ({len(json_str) / 1024:.0f} KB)")


def main():
    parser = argparse.ArgumentParser(description="Export fitment DB to Shopify-ready JSON")
    parser.add_argument("--db", default="fitment.db", help="SQLite database path")
    parser.add_argument("--output", default="", help="Output JSON file path")
    parser.add_argument("--liquid", default="", help="Output Liquid snippet path")
    parser.add_argument("--pretty", action="store_true", help="Pretty-print JSON")
    args = parser.parse_args()

    if args.output:
        json_str = export_vehicles_json(args.db, pretty=args.pretty)
        with open(args.output, "w") as f:
            f.write(json_str)
        print(f"Wrote JSON: {args.output} ({len(json_str) / 1024:.0f} KB)")

    if args.liquid:
        write_liquid_snippet(args.db, args.liquid)

    if not args.output and not args.liquid:
        # Just print to stdout
        print(export_vehicles_json(args.db, pretty=args.pretty))


if __name__ == "__main__":
    main()