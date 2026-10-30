"""
Calder Wheels — Fitment Specs Migration: Active Vehicle Deactivation

Sets is_active=0 for all existing fitment_specs, then seeds the
calder-suv-fitments.csv as the active set.

Run after schema update:
  1. ALTER TABLE fitment_specs ADD COLUMN is_active INTEGER NOT NULL DEFAULT 1;
  2. python migrate_active_vehicles.py --db fitment.db

Or direct SQL:
  UPDATE fitment_specs SET is_active = 0;
  (then seed calder-suv-fitments.csv with python seed_fitment_specs.py ...)
"""

import argparse
import sqlite3
import sys
from pathlib import Path


def deactivate_all(db_path: str):
    """Set is_active=0 for all fitment_specs rows."""
    conn = sqlite3.connect(db_path)
    try:
        cur = conn.execute("SELECT COUNT(*) AS c FROM fitment_specs")
        total = cur.fetchone()["c"]

        conn.execute("UPDATE fitment_specs SET is_active = 0")
        conn.commit()

        cur = conn.execute("SELECT COUNT(*) AS c FROM fitment_specs WHERE is_active = 0")
        updated = cur.fetchone()["c"]

        print(f"Deactivated {updated} of {total} fitment_specs rows")
        print("Run 'python seed_fitment_specs.py --db fitment.db --csv calder-suv-fitments.csv' to activate selected vehicles.")
    finally:
        conn.close()


def add_column_if_missing(db_path: str):
    """Add is_active column if it doesn't exist (for backward compat)."""
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    try:
        cur = conn.execute("PRAGMA table_info(fitment_specs)")
        cols = [row["name"] for row in cur.fetchall()]
        if "is_active" not in cols:
            conn.execute("ALTER TABLE fitment_specs ADD COLUMN is_active INTEGER NOT NULL DEFAULT 1")
            conn.commit()
            print("Added is_active column to fitment_specs")
        else:
            print("is_active column already exists")
    finally:
        conn.close()


def main():
    parser = argparse.ArgumentParser(
        description="Migrate fitment_specs for active vehicle deactivation"
    )
    parser.add_argument("--db", default="fitment.db", help="SQLite database path")
    parser.add_argument("--deactivate-all", action="store_true",
                        help="Set is_active=0 for all existing rows")
    args = parser.parse_args()

    if not Path(args.db).exists():
        print(f"Database not found: {args.db}", file=sys.stderr)
        sys.exit(1)

    add_column_if_missing(args.db)

    if args.deactivate_all:
        deactivate_all(args.db)


if __name__ == "__main__":
    main()