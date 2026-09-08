"""
Calder Wheels — Fitment API Server

FastAPI application that wraps the NHTSA seeder + matching engine as live
endpoints for the Shopify storefront. Keeps the vehicle database
auto-synced with NHTSA on a schedule.

The theme's fitment-finder.js calls this API as its primary data source.
The Liquid snippet (fitment-data.liquid) is a fallback when the API
is unreachable.

Run:
    pip install fastapi uvicorn apscheduler
    uvicorn fitment_api_server:app --reload --port 8081

Endpoints:
    GET  /api/fitment/vehicles       — full vehicle database for storefront
    GET  /api/fitment/makes          — list of makes
    GET  /api/fitment/models         — models for a make + year
    POST /api/fitment/match          — match a vehicle to compatible wheels
    POST /api/fitment/sync           — trigger NHTSA re-sync (admin)
    GET  /api/fitment/sync/status    — last sync time, record counts
    GET  /api/fitment/health         — health check
"""

import os
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

# Ensure imports work from the fitment directory
sys.path.insert(0, str(Path(__file__).parent))

from engine import FitmentEngine, VehicleSpec, VehicleMatch
from fitment_manifest import WHEEL_DESIGNS

try:
    from fastapi import FastAPI, HTTPException, BackgroundTasks, Query
    from fastapi.middleware.cors import CORSMiddleware
    from pydantic import BaseModel, Field
    from apscheduler.schedulers.background import BackgroundScheduler
    from apscheduler.triggers.interval import IntervalTrigger
except ImportError:
    print("Missing dependencies. Install with: pip install fastapi uvicorn apscheduler")
    sys.exit(1)

# ─── Config ─────────────────────────────────────────────────────────────────

DB_PATH = os.environ.get("CALDER_FITMENT_DB", str(Path(__file__).parent / "fitment.db"))
SYNC_INTERVAL_HOURS = int(os.environ.get("CALDER_SYNC_INTERVAL_HOURS", "168"))  # default: weekly
NHTSA_YEARS = os.environ.get("CALDER_NHTSA_YEARS", "2010-2026")
NHTSA_RATE = float(os.environ.get("CALDER_NHTSA_RATE", "5"))
SKIP_INITIAL_SYNC = os.environ.get("CALDER_FITMENT_SKIP_SYNC", "").lower() in ("1", "true", "yes")

app = FastAPI(
    title="Calder Wheels Fitment API",
    version="1.0.0",
    description="Live vehicle fitment data from NHTSA vPIC API. Auto-synced.",
)

# ─── CORS ───────────────────────────────────────────────────────────────────
# Origins allowed to call this API from the browser. Set CALDER_CORS_ORIGINS
# as a comma-separated list to override (e.g. dev store, preview, local).
CORS_ORIGINS = os.environ.get(
    "CALDER_CORS_ORIGINS",
    "https://calderwheels.com,https://www.calderwheels.com,"
    "https://calder-wheels.myshopify.com,https://calder-wheels-dev.myshopify.com,"
    "http://127.0.0.1:9292,http://localhost:9292",
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_origin_regex=(
        r"https://.*\.myshopify\.com"
        r"|https://.*\.myshopify\.dev"
        r"|https://.*\.shopifypreview\.com"
        r"|https://.*\.shopify\.com"
    ),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Sync State ─────────────────────────────────────────────────────────────

SYNC_STATE = {
    "last_sync": None,
    "last_sync_duration": None,
    "is_syncing": False,
    "error": None,
    "stats": {},
}


# ─── Models ─────────────────────────────────────────────────────────────────

class MatchRequest(BaseModel):
    year: int
    make: str
    model: str


class MatchResult(BaseModel):
    design_code: str
    design_nickname: str
    series: str
    bolt_pattern: str
    diameter: float
    width: float
    offset: int
    hub_bore: float
    load_rating: int


# ─── NHTSA Sync ─────────────────────────────────────────────────────────────

def run_nhtsa_sync():
    """
    Run the NHTSA seeder to refresh the database.
    Called by the scheduler and the POST /sync endpoint.
    """
    global SYNC_STATE

    if SYNC_STATE["is_syncing"]:
        return {"status": "skipped", "reason": "Sync already in progress"}

    SYNC_STATE["is_syncing"] = True
    SYNC_STATE["error"] = None
    start_time = time.time()

    try:
        from nhtsa_seeder import NHTSASeeder

        start_year, end_year = map(int, NHTSA_YEARS.split("-"))
        delay = 1.0 / NHTSA_RATE

        seeder = NHTSASeeder(DB_PATH, delay=delay)
        seeder.seed_makes()
        seeder.seed_year_range(start_year, end_year)
        stats = seeder.get_stats()
        seeder.close()

        SYNC_STATE["last_sync"] = datetime.now(timezone.utc).isoformat()
        SYNC_STATE["last_sync_duration"] = round(time.time() - start_time, 1)
        SYNC_STATE["stats"] = stats
        SYNC_STATE["is_syncing"] = False

        return {"status": "success", "duration_seconds": SYNC_STATE["last_sync_duration"], "stats": stats}

    except Exception as e:
        SYNC_STATE["error"] = str(e)
        SYNC_STATE["is_syncing"] = False
        return {"status": "failed", "error": str(e)}


# ─── Scheduler ──────────────────────────────────────────────────────────────

scheduler = BackgroundScheduler()
scheduler.add_job(
    run_nhtsa_sync,
    trigger=IntervalTrigger(hours=SYNC_INTERVAL_HOURS),
    id="nhtsa_sync",
    name="NHTSA vehicle data sync",
    replace_existing=True,
)


# ─── Engine ─────────────────────────────────────────────────────────────────

def get_engine() -> FitmentEngine:
    """Get a FitmentEngine instance connected to the DB."""
    if not Path(DB_PATH).exists():
        # Auto-sync on first request if DB doesn't exist
        run_nhtsa_sync()
    return FitmentEngine(DB_PATH)


# ─── Endpoints ──────────────────────────────────────────────────────────────

@app.get("/api/fitment/health")
def health():
    """Health check with sync status."""
    return {
        "status": "ok",
        "service": "calder-wheels-fitment",
        "db_exists": Path(DB_PATH).exists(),
        "sync": {
            "last_sync": SYNC_STATE["last_sync"],
            "is_syncing": SYNC_STATE["is_syncing"],
            "error": SYNC_STATE["error"],
            "interval_hours": SYNC_INTERVAL_HOURS,
        },
    }


@app.get("/api/fitment/vehicles")
def get_vehicles():
    """
    Return the full vehicle database as JSON.
    This is the primary endpoint the storefront calls.
    Format matches what fitment-finder.js expects.
    """
    engine = get_engine()
    conn = engine.conn
    if not conn:
        return {"vehicles": []}

    cur = conn.execute("""
        SELECT
            my.year,
            mk.name AS make,
            md.name AS model,
            '' AS generation,
            '' AS trim,
            COALESCE(bp.pattern, '') AS bolt_pattern,
            fs.diameter_min, fs.diameter_max,
            fs.width_min, fs.width_max,
            fs.offset_min, fs.offset_max,
            fs.hub_bore, fs.load_rating_min
        FROM model_years my
        JOIN models md ON md.model_id = my.model_id
        JOIN makes mk ON mk.make_id = md.make_id
        LEFT JOIN fitment_specs fs ON fs.model_year_id = my.id
        LEFT JOIN bolt_patterns bp ON bp.id = fs.bolt_pattern_id
        ORDER BY my.year DESC, mk.name, md.name
    """)

    vehicles = []
    for row in cur.fetchall():
        vehicles.append({
            "year": row["year"],
            "make": row["make"],
            "model": row["model"],
            "generation": row["generation"],
            "trim": row["trim"],
            "bolt_pattern": row["bolt_pattern"] or "",
            "min_diameter": row["diameter_min"],
            "max_diameter": row["diameter_max"],
            "min_width": row["width_min"],
            "max_width": row["width_max"],
            "min_offset": row["offset_min"],
            "max_offset": row["offset_max"],
            "hub_bore": row["hub_bore"],
            "load_rating_min": row["load_rating_min"],
        })

    return {"vehicles": vehicles}


@app.get("/api/fitment/makes")
def get_makes():
    """Get all makes (for Year → Make dropdown)."""
    engine = get_engine()
    return {"makes": engine.get_makes()}


@app.get("/api/fitment/models")
def get_models(
    make: str = Query(..., description="Vehicle make (e.g. HONDA)"),
    year: int = Query(..., description="Model year (e.g. 2024)"),
):
    """Get models for a given make and year (Make → Model dropdown)."""
    engine = get_engine()
    return {"models": engine.get_models(make.upper(), year)}


@app.post("/api/fitment/match")
def match_vehicle(req: MatchRequest):
    """
    Match a specific vehicle to compatible wheels.
    Returns all wheel fitments that satisfy the 6 matching criteria.
    """
    engine = get_engine()
    matches = engine.find_matches(req.make.upper(), req.model, req.year)

    if not matches:
        # Try fallback: check if the vehicle exists in the DB at all
        specs = engine.get_vehicle_specs(req.make.upper(), req.model, req.year)
        if not specs:
            return {
                "matches": [],
                "vehicle_found": False,
                "message": f"No vehicle data for {req.year} {req.make.upper()} {req.model}. NHTSA may not have this model year.",
            }
        return {
            "matches": [],
            "vehicle_found": True,
            "message": "Vehicle found but no compatible wheels match. Check bolt pattern and dimensions.",
        }

    return {
        "matches": [
            {
                "design_code": m.design_code,
                "design_nickname": m.design_nickname,
                "series": m.series,
                "bolt_pattern": m.bolt_pattern,
                "diameter": m.diameter,
                "width": m.width,
                "offset": m.offset,
                "hub_bore": m.hub_bore,
                "load_rating": m.load_rating,
            }
            for m in matches
        ],
        "vehicle_found": True,
        "count": len(matches),
    }


@app.post("/api/fitment/sync")
def trigger_sync(background_tasks: BackgroundTasks):
    """
    Trigger an immediate NHTSA re-sync.
    Runs in the background — check /sync/status for progress.
    """
    background_tasks.add_task(run_nhtsa_sync)

    return {
        "status": "started",
        "message": "NHTSA sync started in the background.",
        "check_status_at": "/api/fitment/sync/status",
    }


@app.get("/api/fitment/sync/status")
def sync_status():
    """Get the last sync time, record counts, and current sync state."""
    stats = {}
    if Path(DB_PATH).exists():
        try:
            import sqlite3
            conn = sqlite3.connect(DB_PATH)
            cur = conn.execute("SELECT COUNT(*) FROM makes")
            stats["makes"] = cur.fetchone()[0]
            cur = conn.execute("SELECT COUNT(*) FROM models")
            stats["models"] = cur.fetchone()[0]
            cur = conn.execute("SELECT COUNT(*) FROM model_years")
            stats["model_years"] = cur.fetchone()[0]
            cur = conn.execute("SELECT COUNT(*) FROM fitment_specs")
            stats["fitment_specs"] = cur.fetchone()[0]
            conn.close()
        except Exception:
            pass

    return {
        "last_sync": SYNC_STATE["last_sync"],
        "last_sync_duration_seconds": SYNC_STATE["last_sync_duration"],
        "is_syncing": SYNC_STATE["is_syncing"],
        "error": SYNC_STATE["error"],
        "stats": stats,
        "sync_interval_hours": SYNC_INTERVAL_HOURS,
        "next_sync_eta": "Auto-syncs every {} hours".format(SYNC_INTERVAL_HOURS),
    }


# ─── Startup / Shutdown ─────────────────────────────────────────────────────

@app.on_event("startup")
def on_startup():
    """Start the scheduler and run initial sync if DB is missing or empty."""
    scheduler.start()

    if SKIP_INITIAL_SYNC:
        print("Initial NHTSA sync skipped (CALDER_FITMENT_SKIP_SYNC=True)")
        if SYNC_STATE["last_sync"] is None:
            SYNC_STATE["last_sync"] = datetime.now(timezone.utc).isoformat()
        return

    # If the DB already has vehicle data, skip the full seed (idempotent seed
    # still runs via the weekly scheduler). This avoids re-fetching all 7,837
    # NHTSA combos on every container restart.
    has_data = False
    if Path(DB_PATH).exists():
        try:
            import sqlite3
            conn = sqlite3.connect(DB_PATH)
            cur = conn.execute("SELECT COUNT(*) FROM model_years")
            has_data = cur.fetchone()[0] > 0
            conn.close()
        except Exception:
            has_data = False

    if has_data:
        print("Fitment database already seeded "
              f"(model_years present). Skipping initial sync.")
        SYNC_STATE["last_sync"] = datetime.now(timezone.utc).isoformat()
        return

    if not Path(DB_PATH).exists():
        print("No fitment database found. Starting initial NHTSA sync...")
        run_nhtsa_sync()
    else:
        if SYNC_STATE["last_sync"] is None:
            print("Database exists but empty. Starting sync...")
            run_nhtsa_sync()


@app.on_event("shutdown")
def on_shutdown():
    scheduler.shutdown(wait=False)


# ─── Main ───────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("CALDER_FITMENT_PORT", "8081"))
    uvicorn.run(app, host="0.0.0.0", port=port)