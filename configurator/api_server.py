"""
Calder Wheels — Configurator REST API Server

FastAPI application wrapping the configurator domain model for the
Shopify storefront and middleware layer.

Endpoints:
  GET  /api/configurator/designs      — all wheel designs
  GET  /api/configurator/finishes     — finish catalogs per component type
  POST /api/configurator/resolve      — resolve a config to SKU + BOM + price + layers
  POST /api/configurator/available    — check if a config is orderable
  POST /api/configurator/price        — get pricing breakdown for a config

Run locally:
    pip install fastapi uvicorn
    uvicorn api_server:app --reload --port 8080

Architecture context:
  This is the "middleware API" referenced in architecture.md §5.4 and §6.3.
  The Shopify configurator calls this API for realtime availability checks.
  It wraps the deterministic Python domain model (Tier 1, no LLM).
"""

import os
import sys
from pathlib import Path
from typing import Optional

# Ensure we can import from the configurator package
sys.path.insert(0, str(Path(__file__).parent))

from configurator_model import (
    CLIENT_DESIGNS,
    CENTER_FINISHES,
    BARREL_FINISHES,
    HARDWARE_FINISHES,
    get_finishes_for_component,
    get_finishes_for_series,
    ConfiguratorState,
    ConfigurationResult,
    AvailabilityGate,
    Series,
    ComponentType,
    get_all_designs,
)

try:
    from fastapi import FastAPI, HTTPException
    from fastapi.middleware.cors import CORSMiddleware
    from pydantic import BaseModel, Field
except ImportError:
    print("Missing dependencies. Install with: pip install fastapi uvicorn")
    sys.exit(1)

app = FastAPI(
    title="Calder Wheels Configurator API",
    version="1.0.0",
    description="Resolves wheel configurations to SKUs, BOMs, prices, and composite layers.",
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


# ─── Request / Response Models ─────────────────────────────────────────────

class ResolveRequest(BaseModel):
    design_code: str = Field(..., description="e.g. '201', '207'")
    series: str = Field(..., description="'forged', 'flow_formed', or 'three_piece'")
    center_finish: str = Field(..., description="'BK', 'BKUTI', 'SU'")
    barrel_finish: Optional[str] = Field(None, description="'BK', 'POLISH'")
    hardware_finish: Optional[str] = Field(None, description="'BK', 'CHROME'")
    diameter: float = Field(..., description="Wheel diameter in inches")
    width: float = Field(..., description="Wheel width in inches")
    bolt_pattern: str = Field(..., description="e.g. '5x114.3'")
    size_suffix: Optional[str] = Field(
        None, description="Optional size folder override (e.g. '24x10')"
    )


class AvailabilityRequest(BaseModel):
    design_code: str
    series: str
    center_finish: str
    barrel_finish: Optional[str] = None
    hardware_finish: Optional[str] = None
    diameter: float
    width: float
    bolt_pattern: str
    # When already resolved, pass the finished_sku directly to skip resolution
    finished_sku: Optional[str] = Field(None, description="Pre-resolved SKU")


class PriceRequest(BaseModel):
    design_code: str
    series: str
    center_finish: Optional[str] = None
    barrel_finish: Optional[str] = None
    hardware_finish: Optional[str] = None
    diameter: float
    width: float
    bolt_pattern: str


class QuoteRequest(BaseModel):
    product_id: str = ""
    variant_id: str = ""
    product_title: str = ""
    name: str = ""
    email: str = ""
    phone: str = ""
    vehicle: str = ""
    quantity: str = "1"
    notes: str = ""
    dealer_inquiry: str = ""
    center_finish: Optional[str] = None
    barrel_finish: Optional[str] = None
    hardware_finish: Optional[str] = None


# ─── Endpoints ─────────────────────────────────────────────────────────────

@app.get("/api/configurator/designs")
def list_designs():
    """Get all wheel designs with their available fitments."""
    designs = []
    for d in get_all_designs():
        designs.append({
            "code": d.code,
            "nickname": d.nickname,
            "series": d.series.value,
            "series_label": d.series.label(),
            "description": d.description,
            "configurable_components": [
                ct.value for ct in d.series.configurable_components()
            ],
        })
    return {"designs": designs}


@app.get("/api/configurator/finishes")
def list_finishes():
    """Get all available finishes grouped by component type."""
    return {
        "center": [
            {
                "id": f.id,
                "name": f.name,
                "client_code": f.client_code,
                "category": f.category,
                "image_filename": f.filename(),
            }
            for f in CENTER_FINISHES
        ],
        "barrel": [
            {
                "id": f.id,
                "name": f.name,
                "client_code": f.client_code,
                "category": f.category,
                "image_filename": f.filename(),
            }
            for f in BARREL_FINISHES
        ],
        "hardware": [
            {
                "id": f.id,
                "name": f.name,
                "client_code": f.client_code,
                "category": f.category,
                "image_filename": f.filename(),
            }
            for f in HARDWARE_FINISHES
        ],
    }


@app.post("/api/configurator/resolve")
def resolve_configuration(req: ResolveRequest):
    """
    Resolve a configuration to a finished SKU with full BOM, pricing,
    and composite layer paths.

    This is the primary endpoint the configurator calls on finish selection.
    """
    try:
        series = Series(req.series)
    except ValueError:
        raise HTTPException(status_code=400, detail=f"Invalid series: {req.series}")

    config = ConfiguratorState(
        design_code=req.design_code,
        series=series,
        center_finish=req.center_finish.upper(),
        barrel_finish=req.barrel_finish.upper() if req.barrel_finish else None,
        hardware_finish=req.hardware_finish.upper() if req.hardware_finish else None,
        diameter=req.diameter,
        width=req.width,
        bolt_pattern=req.bolt_pattern,
        size_suffix=req.size_suffix,
    )

    result = ConfigurationResult.from_config(config)
    if not result.is_complete:
        raise HTTPException(
            status_code=400,
            detail=result.error or "Incomplete configuration",
        )

    return result.summary()


@app.post("/api/configurator/available")
def check_availability(req: AvailabilityRequest):
    """
    Check if a configuration is orderable based on component availability.

    This is the realtime gate called after each finish selection.
    Currently returns available=true (stub). When the inventory ledger
    is connected, this will query component stock levels.
    """
    try:
        series = Series(req.series)
    except ValueError:
        raise HTTPException(status_code=400, detail=f"Invalid series: {req.series}")

    config = ConfiguratorState(
        design_code=req.design_code,
        series=series,
        center_finish=req.center_finish.upper(),
        barrel_finish=req.barrel_finish.upper() if req.barrel_finish else None,
        hardware_finish=req.hardware_finish.upper() if req.hardware_finish else None,
        diameter=req.diameter,
        width=req.width,
        bolt_pattern=req.bolt_pattern,
    )

    result = ConfigurationResult.from_config(config)
    if not result.is_complete:
        raise HTTPException(
            status_code=400,
            detail=result.error or "Incomplete configuration",
        )

    gate = AvailabilityGate()
    result = gate.check(result)

    return {
        "finished_sku": result.finished_sku,
        "is_orderable": result.is_orderable,
        "available_to_build": 999 if result.is_orderable else 0,
        "lead_time_days": 10,
        "lead_time": "5-10 business days",
    }


@app.post("/api/configurator/price")
def get_price(req: PriceRequest):
    """
    Get a full pricing breakdown for a configuration.

    Returns retail, dealer, and cost breakdowns.
    """
    try:
        series = Series(req.series)
    except ValueError:
        raise HTTPException(status_code=400, detail=f"Invalid series: {req.series}")

    config = ConfiguratorState(
        design_code=req.design_code,
        series=series,
        center_finish=req.center_finish.upper(),
        barrel_finish=req.barrel_finish.upper() if req.barrel_finish else None,
        hardware_finish=req.hardware_finish.upper() if req.hardware_finish else None,
        diameter=req.diameter,
        width=req.width,
        bolt_pattern=req.bolt_pattern,
    )

    result = ConfigurationResult.from_config(config)
    if not result.is_complete:
        raise HTTPException(
            status_code=400,
            detail=result.error or "Incomplete configuration",
        )

    return result.summary()


@app.get("/api/configurator/health")
def health():
    """Health check endpoint."""
    return {"status": "ok", "service": "calder-wheels-configurator"}


@app.post("/api/configurator/quote")
def submit_quote(req: QuoteRequest):
    """
    Submit a quote request. Stores to local DB and returns success.
    Messages can be forwarded to email/n8n via integration layer.
    """
    import json
    from datetime import datetime

    quote_dir = Path(__file__).parent / "quotes"
    quote_dir.mkdir(exist_ok=True)
    timestamp = datetime.utcnow().strftime("%Y%m%d-%H%M%S")
    safe_name = "".join(c for c in req.name if c.isalnum() or c in " _-").strip() or "anonymous"
    filename = f"quote_{timestamp}_{safe_name}.json"

    record = {
        "submitted_at": datetime.utcnow().isoformat(),
        "product_id": req.product_id,
        "variant_id": req.variant_id,
        "product_title": req.product_title,
        "name": req.name,
        "email": req.email,
        "phone": req.phone,
        "vehicle": req.vehicle,
        "quantity": req.quantity,
        "notes": req.notes,
        "dealer_inquiry": req.dealer_inquiry == "yes",
        "config": {
            "center_finish": req.center_finish,
            "barrel_finish": req.barrel_finish,
            "hardware_finish": req.hardware_finish,
        },
    }

    with open(quote_dir / filename, "w") as f:
        json.dump(record, f, indent=2)

    return {
        "status": "ok",
        "message": "Quote request received. We will contact you within 1-2 business days.",
        "quote_id": filename.replace(".json", ""),
    }


# ─── Main ──────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)