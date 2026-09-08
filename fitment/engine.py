"""
Calder Wheels — Vehicle Fitment Matching Engine

The core engine that answers: "What wheels fit my vehicle?"

Matching is strict (per architecture §7):
  - A wheel fits a vehicle IFF all fitment parameters match
  - We NEVER surface incompatible products
  - Exact match only — no "suggest nearby" logic

Matching criteria:
  1. Bolt pattern (exact)
  2. Wheel diameter ∈ [vehicle_diameter_min, vehicle_diameter_max]
  3. Wheel width ∈ [vehicle_width_min, vehicle_width_max]
  4. Wheel offset ∈ [vehicle_offset_min, vehicle_offset_max]
  5. Wheel hub bore >= vehicle hub bore (use centering rings if larger)
  6. Wheel load rating >= vehicle minimum load rating

Two modes:
  - **Embedded (SQLite)**: full database-backed — for the middleware/ledger service
  - **In-memory**: for the configurator's realtime availability gate,
    using only the fitment_manifest catalog

Architecture: serves both retail and dealer portals from one fitment truth.
"""

import sqlite3
from dataclasses import dataclass, field
from typing import Optional

from fitment_manifest import (
    WHEEL_DESIGNS,
    BOLT_PATTERN_MAP,
    WheelDesign,
    WheelFitment,
)


# ─── Query Results ─────────────────────────────────────────────────────────

@dataclass
class VehicleMatch:
    """A wheel that fits a specific vehicle configuration."""
    design_code: str
    design_nickname: str
    series: str
    bolt_pattern: str
    diameter: float
    width: float
    offset: int
    hub_bore: float
    load_rating: int
    match_score: int = 100  # 100 = exact match (reserved for future weighting)

    def display_name(self) -> str:
        return f"{self.design_nickname} ({self.design_code}) — {self.diameter}x{self.width} ET{self.offset}"


@dataclass
class VehicleQuery:
    """A vehicle fitment query — what the customer selects."""
    year: int
    make: str
    model: str
    # Optional: generation/trim refinements can filter fitment_specs further


@dataclass
class VehicleSpec:
    """A vehicle's fitment specification (from the database)."""
    year: int
    make: str
    model: str
    bolt_pattern: str
    diameter_min: float
    diameter_max: float
    width_min: float
    width_max: float
    offset_min: int
    offset_max: int
    hub_bore: float
    load_rating_min: int


# ─── Engine ────────────────────────────────────────────────────────────────

class FitmentEngine:
    """
    Vehicle fitment matching engine.

    Can operate in two modes:
      - db-backed: uses SQLite for vehicle specs
      - manifest-only: uses the in-memory fitment manifest for wheel data
        (vehicle specs must be passed directly)
    """

    def __init__(self, db_path: Optional[str] = None):
        self.db_path = db_path
        self._conn: Optional[sqlite3.Connection] = None

    @property
    def conn(self) -> Optional[sqlite3.Connection]:
        if self.db_path and self._conn is None:
            self._conn = sqlite3.connect(self.db_path)
            self._conn.row_factory = sqlite3.Row
        return self._conn

    # ─── Vehicle Lookup ────────────────────────────────────────────────

    def get_makes(self) -> list[str]:
        """Get all makes (for 'Year → Make' dropdown)."""
        if not self.conn:
            return self._get_makes_fallback()
        cur = self.conn.execute("SELECT name FROM makes ORDER BY name")
        return [row["name"] for row in cur.fetchall()]

    def get_models(self, make: str, year: int) -> list[str]:
        """Get models for a given make and year ('Make → Model' dropdown)."""
        if not self.conn:
            return self._get_models_fallback(make, year)
        cur = self.conn.execute("""
            SELECT DISTINCT m.name
            FROM models m
            JOIN makes mk ON mk.make_id = m.make_id
            JOIN model_years my ON my.model_id = m.model_id
            WHERE mk.name = ? AND my.year = ?
            ORDER BY m.name
        """, (make.upper(), year))
        return [row["name"] for row in cur.fetchall()]

    def get_vehicle_specs(self, make: str, model: str, year: int) -> list[VehicleSpec]:
        """Get fitment specifications for a specific vehicle."""
        if not self.conn:
            return []

        cur = self.conn.execute("""
            SELECT
                my.year,
                mk.name AS make,
                md.name AS model,
                bp.pattern AS bolt_pattern,
                fs.diameter_min, fs.diameter_max,
                fs.width_min, fs.width_max,
                fs.offset_min, fs.offset_max,
                fs.hub_bore, fs.load_rating_min
            FROM model_years my
            JOIN models md ON md.model_id = my.model_id
            JOIN makes mk ON mk.make_id = md.make_id
            JOIN fitment_specs fs ON fs.model_year_id = my.id
            JOIN bolt_patterns bp ON bp.id = fs.bolt_pattern_id
            WHERE mk.name = ? AND md.name = ? AND my.year = ?
        """, (make.upper(), model, year))
        return [
            VehicleSpec(**dict(row))
            for row in cur.fetchall()
        ]

    # ─── Core Matching ─────────────────────────────────────────────────

    def _wheel_fits_vehicle(
        self,
        wheel: WheelFitment,
        spec: VehicleSpec,
    ) -> bool:
        """
        Check if a single wheel fitment fits a vehicle specification.
        All criteria must pass — never surface incompatible products.
        """
        # 1. Bolt pattern must match exactly
        if wheel.bolt_pattern != spec.bolt_pattern:
            return False

        # 2-4. Wheel dimensions must be within vehicle's recommended range
        if not (spec.diameter_min <= wheel.diameter <= spec.diameter_max):
            return False
        if not (spec.width_min <= wheel.width <= spec.width_max):
            return False
        if not (spec.offset_min <= wheel.offset <= spec.offset_max):
            return False

        # 5. Hub bore: wheel bore >= vehicle hub (centering rings can adapt)
        if wheel.hub_bore < spec.hub_bore:
            return False

        # 6. Load rating must meet minimum
        if wheel.load_rating < spec.load_rating_min:
            return False

        return True

    def find_matches(
        self,
        make: str,
        model: str,
        year: int,
    ) -> list[VehicleMatch]:
        """
        Find all wheels that fit a given vehicle.
        This is the primary public API — used by both storefront and dealer portal.
        """
        specs = self.get_vehicle_specs(make, model, year)

        if not specs:
            # No vehicle spec in database — return no matches
            # (never guess — per architecture §7)
            return []

        matches: list[VehicleMatch] = []
        seen: set[str] = set()

        for spec in specs:
            for design in WHEEL_DESIGNS.values():
                for fitment in design.fitments:
                    if not self._wheel_fits_vehicle(fitment, spec):
                        continue

                    key = f"{design.code}/{fitment.key()}"
                    if key in seen:
                        continue
                    seen.add(key)

                    matches.append(VehicleMatch(
                        design_code=design.code,
                        design_nickname=design.nickname,
                        series=design.series,
                        bolt_pattern=fitment.bolt_pattern,
                        diameter=fitment.diameter,
                        width=fitment.width,
                        offset=fitment.offset,
                        hub_bore=fitment.hub_bore,
                        load_rating=fitment.load_rating,
                    ))

        # Sort: show the most common bolt pattern matches first,
        # then by diameter descending (larger wheels first)
        matches.sort(key=lambda m: (-m.diameter, m.design_nickname))
        return matches

    def find_matches_for_spec(self, spec: VehicleSpec) -> list[VehicleMatch]:
        """
        Find matches given a direct VehicleSpec object.
        Useful when specs are provided programmatically (e.g., from API).
        """
        matches: list[VehicleMatch] = []
        seen: set[str] = set()

        for design in WHEEL_DESIGNS.values():
            for fitment in design.fitments:
                if not self._wheel_fits_vehicle(fitment, spec):
                    continue

                key = f"{design.code}/{fitment.key()}"
                if key in seen:
                    continue
                seen.add(key)

                matches.append(VehicleMatch(
                    design_code=design.code,
                    design_nickname=design.nickname,
                    series=design.series,
                    bolt_pattern=fitment.bolt_pattern,
                    diameter=fitment.diameter,
                    width=fitment.width,
                    offset=fitment.offset,
                    hub_bore=fitment.hub_bore,
                    load_rating=fitment.load_rating,
                ))

        matches.sort(key=lambda m: (-m.diameter, m.design_nickname))
        return matches

    def find_matches_by_bolt_pattern(
        self,
        bolt_pattern: str,
        diameter: Optional[float] = None,
    ) -> list[VehicleMatch]:
        """
        Find all wheels for a given bolt pattern.
        Optional diameter filter. Used for "quick fitment" by known bolt pattern.
        """
        if bolt_pattern not in BOLT_PATTERN_MAP:
            return []

        matches: list[VehicleMatch] = []
        for design in WHEEL_DESIGNS.values():
            for fitment in design.fitments:
                if fitment.bolt_pattern != bolt_pattern:
                    continue
                if diameter is not None and fitment.diameter != diameter:
                    continue

                matches.append(VehicleMatch(
                    design_code=design.code,
                    design_nickname=design.nickname,
                    series=design.series,
                    bolt_pattern=fitment.bolt_pattern,
                    diameter=fitment.diameter,
                    width=fitment.width,
                    offset=fitment.offset,
                    hub_bore=fitment.hub_bore,
                    load_rating=fitment.load_rating,
                ))

        matches.sort(key=lambda m: (-m.diameter, m.design_nickname))
        return matches

    # ─── Fallback Methods (no DB) ──────────────────────────────────────

    def _get_makes_fallback(self) -> list[str]:
        """Return a curated list of common makes when no DB is available."""
        return [
            "ACURA", "ALFA ROMEO", "AUDI", "BMW", "BUICK", "CADILLAC",
            "CHEVROLET", "CHRYSLER", "DODGE", "FIAT", "FORD", "GMC",
            "HONDA", "HYUNDAI", "INFINITI", "JAGUAR", "JEEP", "KIA",
            "LAND ROVER", "LEXUS", "LINCOLN", "MAZDA", "MERCEDES-BENZ",
            "MINI", "MITSUBISHI", "NISSAN", "PORSCHE", "RAM",
            "SUBARU", "TESLA", "TOYOTA", "VOLKSWAGEN", "VOLVO",
        ]

    def _get_models_fallback(self, make: str, year: int) -> list[str]:
        """
        Return common models for a make when no DB is available.
        This is a curated subset for demo/development; production uses NHTSA data.
        """
        common: dict[str, list[str]] = {
            "ACURA": ["Integra", "MDX", "RDX", "TLX", "NSX"],
            "AUDI": ["A3", "A4", "A5", "A6", "Q5", "Q7", "S4", "RS6"],
            "BMW": ["3 Series", "5 Series", "7 Series", "X3", "X5", "M3", "M4"],
            "CHEVROLET": ["Camaro", "Corvette", "Silverado", "Tahoe", "Suburban"],
            "FORD": ["Bronco", "F-150", "Mustang", "Explorer", "Ranger"],
            "HONDA": ["Accord", "Civic", "CR-V", "Pilot", "Odyssey"],
            "HYUNDAI": ["Elantra", "Sonata", "Tucson", "Santa Fe"],
            "JEEP": ["Wrangler", "Grand Cherokee", "Gladiator", "Cherokee"],
            "MAZDA": ["Mazda3", "CX-5", "CX-9", "MX-5 Miata"],
            "MERCEDES-BENZ": ["C-Class", "E-Class", "S-Class", "GLC", "GLE"],
            "NISSAN": ["Altima", "Sentra", "Rogue", "Frontier", "GT-R"],
            "PORSCHE": ["911", "Cayenne", "Macan", "Panamera"],
            "SUBARU": ["Outback", "Forester", "WRX", "Crosstrek"],
            "TESLA": ["Model 3", "Model Y", "Model S", "Model X"],
            "TOYOTA": ["Camry", "Corolla", "RAV4", "Tacoma", "Tundra"],
            "VOLKSWAGEN": ["Golf", "Jetta", "Tiguan", "Atlas"],
            "VOLVO": ["S60", "XC60", "XC90", "V60"],
        }
        return common.get(make.upper(), [])

    def close(self):
        if self._conn:
            self._conn.close()
            self._conn = None