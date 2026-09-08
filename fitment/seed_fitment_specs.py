"""
Calder Wheels — Fitment Specs Seeder (CSV Import)

Reads a CSV of curated fitment specifications and bulk-inserts them
into the fitment_specs table, matching against NHTSA-seeded vehicles.

CSV format:
  year,make_model,bolt_pattern,diameter_min,diameter_max,
  width_min,width_max,offset_min,offset_max,hub_bore,load_rating_min,source

The `year` column accepts:
  - Single year:    "2024"
  - Year range:     "2020-2025"  (seeds every year in range)
  - Comma-separated: "2022,2024"

The `make_model` column is a space-separated make + model name.
The parser tries multiple matching strategies:
  1. Exact make + exact model match against DB
  2. Make starts-with + model substring match (for NHTSA variations)
  3. Partial model name match (e.g. "3 Series" matches "3-Series", "3 Series")

Usage:
  python seed_fitment_specs.py --db fitment.db --csv launch-fitments.csv
  python seed_fitment_specs.py --db fitment.db --csv launch-fitments.csv --dry-run
"""

import argparse
import csv
import re
import sqlite3
import sys
from pathlib import Path
from typing import Optional

# Bolt pattern data (mirrors fitment_manifest.py for standalone use)
DEFAULT_BOLT_PATTERNS = [
    (1, "4x100",   "4-lug, 100mm PCD — compact cars"),
    (2, "4x108",   "4-lug, 108mm PCD — Ford/Volvo"),
    (3, "4x114.3", "4-lug, 114.3mm PCD — Honda/Nissan"),
    (4, "5x100",   "5-lug, 100mm PCD — Subaru/VW/Audi"),
    (5, "5x105",   "5-lug, 105mm PCD — Buick/Chevy"),
    (6, "5x108",   "5-lug, 108mm PCD — Ford/Lincoln/Volvo"),
    (7, "5x110",   "5-lug, 110mm PCD — Mercedes/GM Europe"),
    (8, "5x112",   "5-lug, 112mm PCD — Mercedes/BMW/VW/Audi"),
    (9, "5x114.3", "5-lug, 114.3mm PCD — Honda/Toyota/Nissan/Mazda"),
    (10, "5x115",  "5-lug, 115mm PCD — GM/Buick/Chevy/Cadillac"),
    (11, "5x120",  "5-lug, 120mm PCD — BMW"),
    (12, "5x120.7","5-lug, 120.7mm PCD — GM full-size trucks"),
    (13, "5x127",  "5-lug, 127mm PCD — Jeep/Dodge/Chrysler"),
    (14, "5x130",  "5-lug, 130mm PCD — Porsche/Lambo"),
    (15, "5x135",  "5-lug, 135mm PCD — Ford Super Duty"),
    (16, "5x139.7","5-lug, 139.7mm PCD — Toyota/Jeep trucks"),
    (17, "5x150",  "5-lug, 150mm PCD — Toyota Tundra/LX"),
    (18, "6x114.3","6-lug, 114.3mm PCD — some Hyundai/Kia"),
    (19, "6x135",  "6-lug, 135mm PCD — Ford F-150"),
    (20, "6x139.7","6-lug, 139.7mm PCD — Toyota/Chevy/GMC trucks"),
    (21, "6x5.5",  "6-lug, 5.5in PCD (same as 6x139.7)"),
    (22, "8x165.1","8-lug, 165.1mm PCD — Ford/Chevy HD trucks"),
    (23, "8x170",  "8-lug, 170mm PCD — Ford Super Duty"),
    (24, "8x180",  "8-lug, 180mm PCD — Ram HD trucks"),
    (25, "5x98",   "5-lug, 98mm PCD — Alfa Romeo/Fiat"),
]

BOLT_PATTERN_ALIASES = {
    "5x4.5": "5x114.3",
    "5x4.5in": "5x114.3",
    "5x4.53": "5x115",
    "5x4.72": "5x120",
    "5x4.75": "5x120.7",
    "5x5": "5x127",
    "5x5.5": "5x139.7",
    "5x5.5in": "5x139.7",
    "5x5.9": "5x150",
    "6x5.5": "6x139.7",
    "6x5.5in": "6x139.7",
    "8x6.5": "8x165.1",
    "8x6.5in": "8x165.1",
    "8x6.69": "8x170",
}


def normalize_model_name(name: str) -> str:
    """Normalize model name for fuzzy matching."""
    n = name.strip()
    n = re.sub(r"[-\s]+", " ", n)
    return n.upper()


class FitmentSpecSeeder:
    def __init__(self, db_path: str):
        self.db_path = db_path
        self.conn = sqlite3.connect(db_path)
        self.conn.row_factory = sqlite3.Row
        self.stats = {"csv_rows": 0, "matched": 0, "inserted": 0, "skipped": 0, "errors": 0}

    def seed_bolt_patterns(self):
        """Seed the bolt_patterns lookup table if empty."""
        cur = self.conn.execute("SELECT COUNT(*) AS c FROM bolt_patterns")
        if cur.fetchone()["c"] > 0:
            return
        for bp_id, pattern, desc in DEFAULT_BOLT_PATTERNS:
            self.conn.execute(
                "INSERT OR IGNORE INTO bolt_patterns (id, pattern, description) VALUES (?, ?, ?)",
                (bp_id, pattern, desc),
            )
        self.conn.commit()
        print(f"  Seeded {len(DEFAULT_BOLT_PATTERNS)} bolt patterns")

    def _resolve_bolt_pattern_id(self, pattern: str) -> Optional[int]:
        """Resolve a bolt pattern string to its ID in the DB."""
        clean = pattern.strip()
        if clean in BOLT_PATTERN_ALIASES:
            clean = BOLT_PATTERN_ALIASES[clean]

        cur = self.conn.execute(
            "SELECT id FROM bolt_patterns WHERE pattern = ?", (clean,)
        )
        row = cur.fetchone()
        if row:
            return row["id"]

        normalized = clean.upper().replace(" ", "")
        cur = self.conn.execute(
            "SELECT id, pattern FROM bolt_patterns"
        )
        for bp in cur.fetchall():
            if bp["pattern"].upper().replace(" ", "") == normalized:
                return bp["id"]

        return None

    def _parse_years(self, year_str: str) -> list[int]:
        """Parse a year string into a list of years."""
        years = []
        parts = [p.strip() for p in year_str.split(",")]
        for part in parts:
            if "-" in part and len(part.split("-")) == 2:
                parts_inner = part.split("-")
                start, end = int(parts_inner[0]), int(parts_inner[1])
                years.extend(range(start, end + 1))
            else:
                try:
                    years.append(int(part))
                except ValueError:
                    pass
        return sorted(set(years))

    def _find_model_year_ids(self, make_model: str, years: list[int]) -> list[tuple]:
        """
        Find model_year_id values matching a make+model string and year list.

        The make_model string is parsed as: first token = make, rest = model.
        Tries multiple matching strategies against the DB.
        """
        tokens = make_model.strip().split(None, 1)
        if len(tokens) != 2:
            return []

        make_query = tokens[0].upper()
        model_query = normalize_model_name(tokens[1])

        results = []
        year_placeholders = ",".join("?" * len(years))

        # Strategy 1: Exact match
        cur = self.conn.execute(f"""
            SELECT my.id, my.year, mk.name AS make_name, md.name AS model_name
            FROM model_years my
            JOIN models md ON md.model_id = my.model_id
            JOIN makes mk ON mk.make_id = md.make_id
            WHERE mk.name = ? AND my.year IN ({year_placeholders})
        """, (make_query, *years))

        exact = {}
        for row in cur.fetchall():
            norm = normalize_model_name(row["model_name"])
            if norm == model_query:
                key = (row["year"], norm)
                if key not in exact:
                    exact[key] = row
                    results.append(row)

        if results:
            return results

        # Strategy 2: Make starts-with + model contains
        cur = self.conn.execute(f"""
            SELECT my.id, my.year, mk.name AS make_name, md.name AS model_name
            FROM model_years my
            JOIN models md ON md.model_id = my.model_id
            JOIN makes mk ON mk.make_id = md.make_id
            WHERE mk.name LIKE ? AND my.year IN ({year_placeholders})
        """, (make_query + "%", *years))

        seen = set()
        for row in cur.fetchall():
            norm = normalize_model_name(row["model_name"])
            if model_query in norm or norm in model_query:
                key = (row["year"], row["id"])
                if key not in seen:
                    seen.add(key)
                    results.append(row)

        return results

    def seed_from_csv(self, csv_path: str, dry_run: bool = False):
        """Read a CSV file and seed fitment_specs from its rows."""
        csv_path = Path(csv_path)
        if not csv_path.exists():
            print(f"CSV not found: {csv_path}", file=sys.stderr)
            sys.exit(1)

        with open(csv_path, "r") as f:
            reader = csv.DictReader(f)
            required = ["year", "make_model", "bolt_pattern"]
            for col in required:
                if col not in reader.fieldnames:
                    print(f"Missing required column: {col}", file=sys.stderr)
                    print(f"Found: {reader.fieldnames}", file=sys.stderr)
                    sys.exit(1)

            for row in reader:
                self.stats["csv_rows"] += 1
                try:
                    self._seed_one(row, dry_run)
                except Exception as e:
                    self.stats["errors"] += 1
                    print(f"  [error] row {self.stats['csv_rows']}: {e}",
                          file=sys.stderr)

        if not dry_run:
            self.conn.commit()

    def _seed_one(self, row: dict, dry_run: bool):
        """Process a single CSV row and insert fitment specs."""
        year_str = row["year"].strip()
        make_model = row["make_model"].strip()
        bolt_pattern = row["bolt_pattern"].strip()

        years = self._parse_years(year_str)
        if not years:
            print(f"  [skip] invalid year '{year_str}' — {make_model}")
            self.stats["skipped"] += 1
            return

        bp_id = self._resolve_bolt_pattern_id(bolt_pattern)
        if bp_id is None:
            print(f"  [skip] unknown bolt pattern '{bolt_pattern}' — {make_model} {year_str}")
            self.stats["skipped"] += 1
            return

        model_year_matches = self._find_model_year_ids(make_model, years)
        if not model_year_matches:
            print(f"  [skip] no DB match for '{make_model}' in years {years}")
            self.stats["skipped"] += 1
            return

        # Parse numerical values with defaults
        def safe_float(val, default):
            try:
                return float(val) if val.strip() else default
            except (ValueError, AttributeError):
                return default

        def safe_int(val, default):
            try:
                return int(val) if val.strip() else default
            except (ValueError, AttributeError):
                return default

        dmn = safe_float(row.get("diameter_min", ""), 16.0)
        dmx = safe_float(row.get("diameter_max", ""), 20.0)
        wmn = safe_float(row.get("width_min", ""), 7.0)
        wmx = safe_float(row.get("width_max", ""), 9.5)
        omn = safe_int(row.get("offset_min", ""), 35)
        omx = safe_int(row.get("offset_max", ""), 55)
        hub = safe_float(row.get("hub_bore", ""), 64.1)
        load = safe_int(row.get("load_rating_min", ""), 600)
        source = row.get("source", "curated").strip()

        for my in model_year_matches:
            my_id = my["id"]
            year = my["year"]
            make = my["make_name"] if len(my) > 3 else "?"
            model = my["model_name"] if len(my) > 3 else "?"

            if dry_run:
                print(f"  [dry-run] would insert: {year} {make} {model} "
                      f"→ {bolt_pattern} ({dmn}-{dmx}x{wmn}-{wmx} ET{omn}-{omx} "
                      f"hub={hub} load={load}) [{source}]")
                self.stats["matched"] += 1
                continue

            try:
                self.conn.execute("""
                    INSERT OR REPLACE INTO fitment_specs
                    (model_year_id, bolt_pattern_id, diameter_min, diameter_max,
                     width_min, width_max, offset_min, offset_max, hub_bore,
                     load_rating_min, source)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (my_id, bp_id, dmn, dmx, wmn, wmx, omn, omx, hub, load, source))
                self.stats["inserted"] += 1
                self.stats["matched"] += 1
            except sqlite3.IntegrityError as e:
                print(f"  [warn] {year} {make} {model}: {e}")
                self.stats["errors"] += 1

    def print_stats(self):
        print(f"\nStats: {self.stats['csv_rows']} CSV rows | "
              f"{self.stats['matched']} vehicle-matches | "
              f"{self.stats['inserted']} inserted | "
              f"{self.stats['skipped']} skipped | "
              f"{self.stats['errors']} errors")

    def close(self):
        self.conn.close()


def verify_db(db_path: str):
    """Print summary of fitment_specs data in the database."""
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row

    cur = conn.execute("SELECT COUNT(*) AS c FROM fitment_specs")
    total = cur.fetchone()["c"]
    print(f"fitment_specs total rows: {total}")

    cur = conn.execute("""
        SELECT bp.pattern, COUNT(*) AS c
        FROM fitment_specs fs
        JOIN bolt_patterns bp ON bp.id = fs.bolt_pattern_id
        GROUP BY bp.pattern
        ORDER BY c DESC
        LIMIT 20
    """)
    print("Bolt pattern distribution:")
    for row in cur.fetchall():
        print(f"  {row['pattern']}: {row['c']} vehicles")

    cur = conn.execute("""
        SELECT mk.name AS make, COUNT(DISTINCT md.name) AS models,
               COUNT(*) AS specs
        FROM fitment_specs fs
        JOIN model_years my ON my.id = fs.model_year_id
        JOIN models md ON md.model_id = my.model_id
        JOIN makes mk ON mk.make_id = md.make_id
        GROUP BY mk.name
        ORDER BY specs DESC
        LIMIT 20
    """)
    print("Top makes by spec count:")
    for row in cur.fetchall():
        print(f"  {row['make']}: {row['models']} models, {row['specs']} specs")

    conn.close()


def main():
    parser = argparse.ArgumentParser(
        description="Seed fitment_specs from curated CSV"
    )
    parser.add_argument("--db", default="fitment.db",
                        help="SQLite database path")
    parser.add_argument("--csv",
                        help="CSV file with fitment specs to import")
    parser.add_argument("--dry-run", action="store_true",
                        help="Show what would be inserted without writing")
    parser.add_argument("--verify", action="store_true",
                        help="Print summary of fitment_specs and exit")
    args = parser.parse_args()

    if args.verify:
        verify_db(args.db)
        return

    if not args.csv:
        print("Specify --csv or --verify", file=sys.stderr)
        sys.exit(1)

    if not Path(args.db).exists():
        print(f"Database not found: {args.db}", file=sys.stderr)
        print("Run 'python nhtsa_seeder.py --db fitment.db --years 2010-2026' first.",
              file=sys.stderr)
        sys.exit(1)

    seeder = FitmentSpecSeeder(args.db)

    try:
        seeder.seed_bolt_patterns()
        print(f"Seeding fitment specs from: {args.csv}")
        if args.dry_run:
            print("DRY RUN — no changes will be written\n")
        seeder.seed_from_csv(args.csv, dry_run=args.dry_run)
        seeder.print_stats()
    finally:
        seeder.close()


if __name__ == "__main__":
    main()