#!/bin/bash
# =============================================================================
# Calder Wheels — NHTSA Seed Runner
# =============================================================================
# Reads env or uses defaults. Idempotent — resumes where it left off.
# Called by cron (macOS) or launchd every 7 days.
#
# Env overrides:
#   CALDER_FITMENT_DB     — path to SQLite DB (default: fitment/seed_nhtsa_full.py --db)
#   CALDER_NHTSA_YEARS    — year range (default: 2000-2026)
#   CALDER_NHTSA_WORKERS  — concurrent API workers (default: 5)
# =============================================================================

set -euo pipefail

DIR="$(cd "$(dirname "$0")" && pwd)"
DB="${CALDER_FITMENT_DB:-$DIR/fitment.db}"
YEARS="${CALDER_NHTSA_YEARS:-2000-2026}"
WORKERS="${CALDER_NHTSA_WORKERS:-5}"
LOG="$DIR/logs/nhtsa-seed.log"

mkdir -p "$(dirname "$LOG")"

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Starting NHTSA seed ($YEARS, $WORKERS workers)" >> "$LOG"
python3 "$DIR/seed_nhtsa_full.py" \
  --db "$DB" \
  --years "$YEARS" \
  --workers "$WORKERS" \
  >> "$LOG" 2>&1

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Finished" >> "$LOG"