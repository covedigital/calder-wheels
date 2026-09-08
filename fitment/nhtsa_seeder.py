"""
Calder Wheels — NHTSA vPIC Vehicle Data Seeder

Seeds the fitment database with vehicle makes and models from the
NHTSA Product Information Catalog and Vehicle Explorer (vPIC) API.

Usage:
    python nhtsa_seeder.py --db fitment.db [--years 2015-2026] [--rate 10]

The API is rate-limited. This script respects rate limits and can resume
if interrupted (idempotent inserts).
"""

import argparse
import sqlite3
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime
from typing import Optional

import requests

NHTSA_BASE = "https://vpic.nhtsa.dot.gov/api/vehicles"
REQUEST_DELAY = 1.0  # seconds between requests (conservative — NHTSA rate-limits aggressively)

# Vehicle types we care about (passenger vehicles + light trucks)
# NHTSA returns everything including motorcycles/ATVs — we filter these out.
EXCLUDE_VEHICLE_TYPES = {
    "MOTORCYCLE", "ATV", "OFF ROAD", "TRAILER", "BUS",
    "LOW SPEED VEHICLE", "RECREATIONAL VEHICLE", "SNOWMOBILE",
    "MOTOR SCOOTER", "MOPED", "TRICYCLE", "BIKE",
}
# Vehicle types we KEEP (passenger + light commercial)
INCLUDE_VEHICLE_TYPES = {
    "PASSENGER CAR", "TRUCK", "SUV", "VAN",
    "MULTIPURPOSE PASSENGER VEHICLE (MPV)", "MPV",
    "INCOMPLETE VEHICLE",  # chassis cabs, cutaway vans — often light trucks
}


class NHTSASeeder:
    def __init__(self, db_path: str, delay: float = REQUEST_DELAY):
        self.db_path = db_path
        self.delay = delay
        self.conn = sqlite3.connect(db_path)
        self.conn.row_factory = sqlite3.Row
        self._init_schema()

    def _init_schema(self):
        with open("schema.sql") as f:
            self.conn.executescript(f.read())
        self.conn.commit()

    def _get(self, path: str, params: Optional[dict] = None) -> Optional[dict]:
        """GET with exponential backoff retry on 403/429."""
        max_retries = 3
        for attempt in range(max_retries):
            time.sleep(self.delay)
            url = f"{NHTSA_BASE}/{path}"
            p = params or {}
            p.setdefault("format", "json")
            try:
                resp = requests.get(url, params=p, timeout=30)
                if resp.status_code == 403:
                    backoff = 2 ** attempt
                    print(f"    [403 on {path}] retry in {backoff}s...")
                    time.sleep(backoff)
                    continue
                if resp.status_code == 429:
                    backoff = 5 * (2 ** attempt)
                    print(f"    [429 rate-limited] retry in {backoff}s...")
                    time.sleep(backoff)
                    continue
                resp.raise_for_status()
                return resp.json()
            except requests.RequestException as e:
                if attempt < max_retries - 1:
                    backoff = 2 ** attempt
                    print(f"    [error: {e}] retry in {backoff}s...")
                    time.sleep(backoff)
                else:
                    print(f"    [giving up after {max_retries} attempts] {e}")
                    return None
        return None

    def seed_makes(self) -> list[dict]:
        """Fetch all makes from NHTSA and insert into the database."""
        data = self._get("GetAllMakes")
        if data is None:
            print("  [error] Could not fetch makes from NHTSA (API unreachable)")
            return []
        makes = data.get("Results", [])
        count = 0
        for m in makes:
            mid = int(m["Make_ID"])
            name = m["Make_Name"].strip().upper()
            try:
                self.conn.execute(
                    "INSERT OR IGNORE INTO makes (make_id, name) VALUES (?, ?)",
                    (mid, name),
                )
                count += 1
            except Exception:
                pass
        self.conn.commit()
        print(f"  \u2192 {count} makes seeded ({len(makes)} total from NHTSA)")
        return makes

    def _fetch_vehicle_type(self, make_id: int) -> tuple:
        """Fetch vehicle type for a single make. Returns (make_id, type_name_or_None)."""
        try:
            time.sleep(self.delay)
            url = f"{NHTSA_BASE}/GetVehicleTypesForMakeId/{make_id}?format=json"
            resp = requests.get(url, timeout=15)
            resp.raise_for_status()
            data = resp.json()
            types = {t["VehicleTypeName"].strip().upper()
                     for t in data.get("Results", [])}
            # Return the first matching passenger type, or None
            matching = types & INCLUDE_VEHICLE_TYPES
            non_matching = types - EXCLUDE_VEHICLE_TYPES
            if matching:
                return (make_id, sorted(matching)[0])
            if non_matching:
                return (make_id, sorted(non_matching)[0])
            if types:
                return (make_id, sorted(types)[0])
            return (make_id, None)
        except Exception:
            return (make_id, None)

    def classify_makes(self, max_workers: int = 3):
        """
        Classify all makes in the DB by fetching their vehicle types.
        Uses concurrent workers for speed. Idempotent — skips already-classified.
        """
        cur = self.conn.execute(
            "SELECT make_id FROM makes WHERE vehicle_type IS NULL"
        )
        unclassified = [row["make_id"] for row in cur.fetchall()]
        if not unclassified:
            print("  All makes already classified.")
            return

        print(f"  Classifying {len(unclassified)} makes (speed={max_workers} workers)...")
        classified = 0
        start = time.time()

        with ThreadPoolExecutor(max_workers=max_workers) as pool:
            futures = {pool.submit(self._fetch_vehicle_type, mid): mid
                       for mid in unclassified}
            for future in as_completed(futures):
                mid, vtype = future.result()
                if vtype:
                    self.conn.execute(
                        "UPDATE makes SET vehicle_type = ? WHERE make_id = ?",
                        (vtype, mid),
                    )
                else:
                    self.conn.execute(
                        "UPDATE makes SET vehicle_type = 'OTHER' WHERE make_id = ?",
                        (mid,),
                    )
                classified += 1
                if classified % 500 == 0:
                    self.conn.commit()
                    elapsed = time.time() - start
                    rate = classified / elapsed if elapsed > 0 else 0
                    print(f"    {classified}/{len(unclassified)} "
                          f"({rate:.1f} makes/sec)")

        self.conn.commit()
        elapsed = time.time() - start
        print(f"  Classified {classified} makes in {elapsed:.1f}s")

    def get_passenger_make_ids(self) -> list[int]:
        """Get make IDs classified as passenger vehicle types."""
        cur = self.conn.execute(
            "SELECT make_id FROM makes WHERE vehicle_type IN ("
            + ",".join("?" * len(INCLUDE_VEHICLE_TYPES))
            + ")",
            tuple(sorted(INCLUDE_VEHICLE_TYPES)),
        )
        return [row["make_id"] for row in cur.fetchall()]

    def seed_models_for_make_year(self, make_id: int, year: int) -> int:
        """
        Seed models for a specific make and year.
        Returns number of model-year records inserted (0 on failure).
        """
        endpoint = f"GetModelsForMakeIdYear/makeId/{make_id}/modelyear/{year}"
        data = self._get(endpoint)
        if data is None:
            return 0
        results = data.get("Results", [])
        count = 0

        for r in results:
            make_id_val = int(r.get("Make_ID", 0))
            model_id = int(r.get("Model_ID", 0))
            model_name = r.get("Model_Name", "").strip()
            make_name = r.get("Make_Name", "").strip().upper()

            if make_id_val == 0 or model_id == 0:
                continue

            self.conn.execute(
                "INSERT OR IGNORE INTO makes (make_id, name) VALUES (?, ?)",
                (make_id_val, make_name),
            )
            self.conn.execute(
                "INSERT OR IGNORE INTO models (model_id, make_id, name) VALUES (?, ?, ?)",
                (model_id, make_id_val, model_name),
            )
            self.conn.execute(
                "INSERT OR IGNORE INTO model_years (model_id, year) VALUES (?, ?)",
                (model_id, year),
            )
            count += 1

        self.conn.commit()
        return count

    def seed_year_range(self, start_year: int, end_year: int):
        """
        Seed all model-year combinations over a range of years.
        Iterates per-make (filtered to passenger vehicles) × per-year.
        Resumes from where it left off if interrupted (UNIQUE constraints).
        """
        make_ids = self.get_passenger_make_ids()
        if not make_ids:
            print("  No passenger makes classified. Running classify step first...")
            self.classify_makes()
            make_ids = self.get_passenger_make_ids()

        print(f"  {len(make_ids)} passenger makes, years {start_year}-{end_year}")
        total_combos = len(make_ids) * (end_year - start_year + 1)
        print(f"  Total API calls: {total_combos}")
        print()

        grand_total = 0
        make_count = 0
        errors = []
        for make_id in make_ids:
            make_count += 1
            cur = self.conn.execute(
                "SELECT name FROM makes WHERE make_id = ?", (make_id,)
            )
            row = cur.fetchone()
            make_name = row["name"] if row else f"ID-{make_id}"
            year_total = 0
            make_failures = 0

            for year in range(start_year, end_year + 1):
                try:
                    c = self.seed_models_for_make_year(make_id, year)
                    year_total += c
                    grand_total += c
                    if c == 0:
                        make_failures += 1
                except Exception as e:
                    make_failures += 1
                    if make_failures == 1:
                        errors.append((make_id, make_name, str(e)[:60]))
                        print(f"    [warning] {make_name} errors: {e}")

            pct = 100 * make_count / len(make_ids)
            status = " (errors)" if make_failures else ""
            print(f"  [{make_count}/{len(make_ids)}] {make_name}: "
                  f"{year_total} records{status} ({pct:.1f}%)")

            self.conn.commit()  # flush after each make

        if errors:
            print(f"\n  {len(errors)} makes had errors (skipped or partial):")
            for mid, mname, err in errors[:10]:
                print(f"    {mname} (ID {mid}): {err}")
            if len(errors) > 10:
                print(f"    ...and {len(errors)-10} more")

        print(f"\n  Total: {grand_total} model-year records across "
              f"{len(make_ids)} makes")

    def get_stats(self) -> dict:
        cur = self.conn.execute("SELECT COUNT(*) AS c FROM makes")
        makes = cur.fetchone()["c"]
        cur = self.conn.execute("SELECT COUNT(*) AS c FROM models")
        models = cur.fetchone()["c"]
        cur = self.conn.execute("SELECT COUNT(*) AS c FROM model_years")
        model_years = cur.fetchone()["c"]
        return {"makes": makes, "models": models, "model_years": model_years}

    def close(self):
        self.conn.close()


def main():
    parser = argparse.ArgumentParser(
        description="Seed vehicle data from NHTSA vPIC API"
    )
    parser.add_argument(
        "--db", default="fitment.db",
        help="SQLite database path (default: fitment.db)"
    )
    parser.add_argument(
        "--years", default="2010-2026",
        help="Year range to seed (default: 2010-2026)"
    )
    parser.add_argument(
        "--rate", type=float, default=2,
        help="Requests per second (default: 2 — NHTSA is aggressive)"
    )
    parser.add_argument(
        "--classify", action="store_true",
        help="Only classify makes (skip model-year seeding)"
    )
    args = parser.parse_args()

    delay = 1.0 / args.rate
    seeder = NHTSASeeder(args.db, delay=delay)

    try:
        start_year, end_year = map(int, args.years.split("-"))
    except ValueError:
        print("Error: --years must be in format START-END, e.g. 2010-2026")
        sys.exit(1)

    print("Calder Wheels — NHTSA Vehicle Data Seeder")
    print(f"  Database: {args.db}")
    print(f"  Year range: {start_year}-{end_year}")
    print(f"  Rate: {args.rate} req/s")
    print()

    print("Step 1: Seeding makes...")
    seeder.seed_makes()

    print("\nStep 2: Classifying makes by vehicle type...")
    seeder.classify_makes()

    passenger_count = len(seeder.get_passenger_make_ids())
    total_makes = seeder.conn.execute("SELECT COUNT(*) FROM makes").fetchone()[0]
    print(f"  {passenger_count}/{total_makes} makes classified as passenger vehicles")

    if not args.classify:
        print(f"\nStep 3: Seeding models by year (passenger makes only)...")
        seeder.seed_year_range(start_year, end_year)

    print("\nStep 4: Database statistics:")
    stats = seeder.get_stats()
    for k, v in stats.items():
        print(f"  {k}: {v}")

    seeder.close()
    print("\nDone.")


if __name__ == "__main__":
    main()