#!/usr/bin/env python3
"""
Calder Wheels — Full NHTSA Vehicle Data Seeder (2000-2026)
===========================================================

Threaded, resumable, rate-limited. Seeds ALL makes classified as
passenger vehicles across the full year range.

Handles:
  - SQLite thread-safety (one connection per worker)
  - NHTSA rate limits (configurable delay)
  - Resume from interruption (INSERT OR IGNORE)
  - Existing data preservation (skips already-seeded combos)

Usage:
  # Full seed
  python3 seed_nhtsa_full.py --db fitment.db --years 2000-2026 --workers 5

  # Incremental (resume from where you left off)
  python3 seed_nhtsa_full.py --db fitment.db --years 2000-2026 --workers 5

  # Quick check
  python3 seed_nhtsa_full.py --db fitment.db --stats
"""

import argparse
import concurrent.futures
import sqlite3
import sys
import time
from pathlib import Path
from typing import Optional

import requests

NHTSA_BASE = "https://vpic.nhtsa.dot.gov/api/vehicles"
INCLUDE_VEHICLE_TYPES = {
    "PASSENGER CAR", "TRUCK", "SUV", "VAN",
    "MULTIPURPOSE PASSENGER VEHICLE (MPV)", "MPV",
    "INCOMPLETE VEHICLE",
}


class FullNHTSASeeder:
    def __init__(self, db_path: str, delay: float = 0.3):
        self.db_path = db_path
        self.delay = delay
        self.stats = {"attempted": 0, "inserted": 0, "errors": 0, "skipped": 0}

    def get_passenger_make_ids(self) -> list[tuple[int, str]]:
        """Get (make_id, name) for all passenger-classified makes."""
        conn = sqlite3.connect(self.db_path)
        cur = conn.execute(
            "SELECT make_id, name FROM makes WHERE vehicle_type IN ("
            + ",".join("?" * len(INCLUDE_VEHICLE_TYPES))
            + ") ORDER BY name",
            tuple(sorted(INCLUDE_VEHICLE_TYPES)),
        )
        result = [(r[0], r[1]) for r in cur.fetchall()]
        conn.close()
        return result

    def already_seeded(self, make_id: int, year: int) -> bool:
        """Check if this make+year combo already has model-year records."""
        conn = sqlite3.connect(self.db_path)
        cur = conn.execute("""
            SELECT 1 FROM model_years my
            JOIN models m ON m.model_id = my.model_id
            WHERE m.make_id = ? AND my.year = ?
            LIMIT 1
        """, (make_id, year))
        result = cur.fetchone() is not None
        conn.close()
        return result

    def seed_make_year(self, make_id: int, make_name: str, year: int) -> int:
        """Seed models for one make+year. Returns record count."""
        time.sleep(self.delay)

        url = f"{NHTSA_BASE}/GetModelsForMakeIdYear/makeId/{make_id}/modelyear/{year}?format=json"
        try:
            resp = requests.get(url, timeout=15)
            resp.raise_for_status()
            data = resp.json()
        except Exception:
            return 0

        results = data.get("Results", [])
        if not results:
            return 0

        conn = sqlite3.connect(self.db_path)
        count = 0
        try:
            for r in results:
                mid = int(r.get("Model_ID", 0))
                mname = r.get("Model_Name", "").strip()
                mnf_name = r.get("Make_Name", "").strip().upper()
                if mid == 0 or not mname:
                    continue

                conn.execute(
                    "INSERT OR IGNORE INTO makes (make_id, name) VALUES (?, ?)",
                    (make_id, mnf_name or make_name),
                )
                conn.execute(
                    "INSERT OR IGNORE INTO models (model_id, make_id, name) VALUES (?, ?, ?)",
                    (mid, make_id, mname),
                )
                conn.execute(
                    "INSERT OR IGNORE INTO model_years (model_id, year) VALUES (?, ?)",
                    (mid, year),
                )
                count += 1
            conn.commit()
        finally:
            conn.close()

        return count

    def run(self, start_year: int, end_year: int, workers: int = 5):
        """Seed the full year range across all passenger makes."""
        makes = self.get_passenger_make_ids()
        all_years = list(range(start_year, end_year + 1))

        # Filter to unseeded combos only (resumable)
        combos = []
        for mid, mname in makes:
            for yr in all_years:
                if not self.already_seeded(mid, yr):
                    combos.append((mid, mname, yr))

        total = len(combos)
        print(f"Passenger makes: {len(makes)}")
        print(f"Year range: {start_year}-{end_year} ({len(all_years)} years)")
        print(f"Unseeded combos: {total}")
        if total == 0:
            print("All combos already seeded — nothing to do.")
            return
        print(f"Workers: {workers}")
        print()

        done = 0
        records = 0
        start_time = time.time()

        with concurrent.futures.ThreadPoolExecutor(max_workers=workers) as pool:
            future_map = {}
            for mid, mname, yr in combos:
                f = pool.submit(self.seed_make_year, mid, mname, yr)
                future_map[f] = (mid, mname, yr)

            for fut in concurrent.futures.as_completed(future_map):
                done += 1
                mid, mname, yr = future_map[fut]
                try:
                    c = fut.result()
                    if c > 0:
                        records += c
                    status = f"{c} models" if c > 0 else "empty/skip"
                except Exception as e:
                    status = f"ERROR: {e}"
                    self.stats["errors"] += 1

                elapsed = time.time() - start_time
                rate = done / elapsed if elapsed > 0 else 0
                pct = 100 * done / total

                print(f"  [{done}/{total}] {pct:.0f}% | {mname} ({yr}) → {status} | {rate:.1f} combos/s")

                if done % 50 == 0:
                    self._print_stats(records, elapsed)

        elapsed = time.time() - start_time
        self._print_stats(records, elapsed)
        self._save_stats(records, elapsed)

    def _print_stats(self, records: int, elapsed: float):
        print()
        conn = sqlite3.connect(self.db_path)
        mc = conn.execute("SELECT COUNT(*) FROM models").fetchone()[0]
        myc = conn.execute("SELECT COUNT(*) FROM model_years").fetchone()[0]
        fsc = conn.execute("SELECT COUNT(*) FROM fitment_specs").fetchone()[0]
        conn.close()
        print(f"  ─── DB: {mc} models, {myc} model_years, {fsc} fitment_specs ───")
        print(f"  ─── Time: {elapsed:.0f}s ({elapsed/60:.1f}m), {records} new records ───")
        print()

    def _save_stats(self, records: int, elapsed: float):
        """Persist last-run stats to a file for cron monitoring."""
        stats_path = Path(self.db_path).parent / ".seed_stats"
        with open(stats_path, "w") as f:
            f.write(f"timestamp={time.strftime('%Y-%m-%d %H:%M:%S')}\n")
            f.write(f"duration_seconds={elapsed:.0f}\n")
            f.write(f"records_inserted={records}\n")
        print(f"Stats written to {stats_path}")

    def print_stats(self):
        """Print current database statistics."""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        for t in ["makes", "models", "model_years", "bolt_patterns", "fitment_specs"]:
            c = conn.execute(f"SELECT COUNT(*) FROM {t}").fetchone()[0]
            print(f"  {t}: {c}")

        cur = conn.execute("""
            SELECT mk.name AS make, COUNT(DISTINCT md.name) AS models,
                   COUNT(DISTINCT my.year) AS years
            FROM makes mk
            JOIN models md ON md.make_id = mk.make_id
            JOIN model_years my ON my.model_id = md.model_id
            GROUP BY mk.name
            ORDER BY models DESC
            LIMIT 15
        """)
        print("\nTop makes by model count:")
        for r in cur.fetchall():
            print(f"  {r['make']}: {r['models']} models across {r['years']} years")
        conn.close()


def main():
    parser = argparse.ArgumentParser(
        description="Full NHTSA vehicle seeder (2000-2026, threaded, resumable)"
    )
    parser.add_argument("--db", default="fitment.db", help="SQLite database path")
    parser.add_argument("--years", default="2000-2026", help="Year range (e.g. 2000-2026)")
    parser.add_argument("--workers", type=int, default=5, help="Concurrent workers")
    parser.add_argument("--delay", type=float, default=0.3, help="Delay between calls (seconds)")
    parser.add_argument("--stats", action="store_true", help="Just print stats and exit")
    args = parser.parse_args()

    if not Path(args.db).exists():
        print(f"Database not found: {args.db}")
        print("Run init first or create via schema.sql")
        sys.exit(1)

    seeder = FullNHTSASeeder(args.db, delay=args.delay)

    if args.stats:
        seeder.print_stats()
        return

    try:
        parts = args.years.split("-")
        start_year, end_year = int(parts[0]), int(parts[1])
    except (ValueError, IndexError):
        print("Invalid --years format. Use START-END, e.g. 2000-2026")
        sys.exit(1)

    print("=" * 60)
    print("  Calder Wheels — Full NHTSA Seeder")
    print("=" * 60)
    print()
    seeder.run(start_year, end_year, workers=args.workers)
    print("\nDone.")


if __name__ == "__main__":
    main()