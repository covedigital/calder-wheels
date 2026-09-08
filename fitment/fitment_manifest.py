"""
Calder Wheels — Wheel Fitment Manifest

Defines the Calder Wheels product catalog's fitment specifications:
- Wheel designs (nickname, code, series)
- Available sizes/fitments per design
- Bolt pattern coverage

This is the "curated fitment data" referenced in the architecture doc.
For launch, fitment data is seeded here. Post-launch, this feeds from
the inventory ledger's product catalog.

Fitment matching logic:
  A wheel fits a vehicle IFF all of the following match:
    1. Bolt pattern (e.g. "5x114.3")
    2. Wheel diameter ∈ [vehicle_diameter_min, vehicle_diameter_max]
    3. Wheel width ∈ [vehicle_width_min, vehicle_width_max]
    4. Wheel offset ∈ [vehicle_offset_min, vehicle_offset_max]
    5. Wheel hub bore >= vehicle hub bore (hub-centric)
       (hub bore can be larger with centering rings)
    6. Wheel load rating >= vehicle minimum load rating
"""

from dataclasses import dataclass, field
from typing import Optional


# ─── Bolt Pattern Definitions ──────────────────────────────────────────────

@dataclass(frozen=True)
class BoltPattern:
    """A bolt/lug pattern specification."""
    id: int
    pattern: str       # e.g. "5x114.3"
    lugs: int          # e.g. 5
    pcd_mm: float      # Pitch Circle Diameter in mm, e.g. 114.3
    description: str   # e.g. "5-lug, 114.3mm PCD"


# Common bolt patterns for passenger vehicles and light trucks
BOLT_PATTERNS: list[BoltPattern] = [
    BoltPattern(1, "4x100",   4, 100.0,  "4-lug, 100mm PCD — compact cars"),
    BoltPattern(2, "4x108",   4, 108.0,  "4-lug, 108mm PCD — Ford/Volvo"),
    BoltPattern(3, "4x114.3", 4, 114.3,  "4-lug, 114.3mm PCD — Honda/Nissan"),
    BoltPattern(4, "5x100",   5, 100.0,  "5-lug, 100mm PCD — Subaru/VW/Audi"),
    BoltPattern(5, "5x105",   5, 105.0,  "5-lug, 105mm PCD — Buick/Chevy"),
    BoltPattern(6, "5x108",   5, 108.0,  "5-lug, 108mm PCD — Ford/Lincoln/Volvo"),
    BoltPattern(7, "5x110",   5, 110.0,  "5-lug, 110mm PCD — Mercedes/GM Europe"),
    BoltPattern(8, "5x112",   5, 112.0,  "5-lug, 112mm PCD — Mercedes/BMW/VW/Audi"),
    BoltPattern(9, "5x114.3", 5, 114.3,  "5-lug, 114.3mm PCD — Honda/Toyota/Nissan/Mazda"),
    BoltPattern(10, "5x115",  5, 115.0,  "5-lug, 115mm PCD — GM/Buick/Chevy/Cadillac"),
    BoltPattern(11, "5x120",  5, 120.0,  "5-lug, 120mm PCD — BMW"),
    BoltPattern(12, "5x120.7",5, 120.7,  "5-lug, 120.7mm PCD — GM full-size trucks"),
    BoltPattern(13, "5x127",  5, 127.0,  "5-lug, 127mm PCD — Jeep/Dodge/Chrysler"),
    BoltPattern(14, "5x130",  5, 130.0,  "5-lug, 130mm PCD — Porsche/Lambo"),
    BoltPattern(15, "5x135",  5, 135.0,  "5-lug, 135mm PCD — Ford Super Duty"),
    BoltPattern(16, "5x139.7",5, 139.7,  "5-lug, 139.7mm PCD — Toyota/Jeep trucks"),
    BoltPattern(17, "5x150",  5, 150.0,  "5-lug, 150mm PCD — Toyota Tundra/LX"),
    BoltPattern(18, "6x114.3",6, 114.3,  "6-lug, 114.3mm PCD — some Hyundai/Kia"),
    BoltPattern(19, "6x135",  6, 135.0,  "6-lug, 135mm PCD — Ford F-150"),
    BoltPattern(20, "6x139.7",6, 139.7,  "6-lug, 139.7mm PCD — Toyota/Chevy/GMC trucks"),
    BoltPattern(21, "6x5.5",  6, 139.7,  "6-lug, 5.5in PCD (same as 6x139.7)"),
    BoltPattern(22, "8x165.1",8, 165.1,  "8-lug, 165.1mm PCD — Ford/Chevy HD trucks"),
    BoltPattern(23, "8x170",  8, 170.0,  "8-lug, 170mm PCD — Ford Super Duty"),
    BoltPattern(24, "8x180",  8, 180.0,  "8-lug, 180mm PCD — Ram HD trucks"),
    BoltPattern(25, "5x98",   5, 98.0,   "5-lug, 98mm PCD — Alfa Romeo/Fiat"),
]

BOLT_PATTERN_MAP: dict[str, BoltPattern] = {bp.pattern: bp for bp in BOLT_PATTERNS}


# ─── Wheel Design Definitions ──────────────────────────────────────────────

@dataclass
class WheelFitment:
    """A single size/fitment a wheel design is available in."""
    bolt_pattern: str      # e.g. "5x114.3"
    diameter: float        # inches, e.g. 20.0
    width: float           # inches, e.g. 8.5
    offset: int            # mm, e.g. 35
    hub_bore: float        # mm, e.g. 72.6
    load_rating: int = 725  # kg per wheel

    def key(self) -> str:
        return f"{self.bolt_pattern}/{self.diameter}x{self.width}/ET{self.offset}"


@dataclass
class WheelDesign:
    """A Calder Wheels design (nickname + code + series)."""
    nickname: str
    code: str
    series: str  # 'forged', 'flow_formed', 'three_piece'
    description: str = ""
    fitments: list[WheelFitment] = field(default_factory=list)

    def add_fitment(self, bp: str, dia: float, w: float, off: int,
                    hub: float = 72.6, load: int = 725):
        self.fitments.append(WheelFitment(bp, dia, w, off, hub, load))

    def bolt_patterns(self) -> set[str]:
        return {f.bolt_pattern for f in self.fitments}

    def sizes(self) -> list[tuple[float, float]]:
        return list({(f.diameter, f.width) for f in self.fitments})


# ─── Calder Wheels Launch Catalog ──────────────────────────────────────────

WHEEL_DESIGNS: dict[str, WheelDesign] = {}


def _init_catalog():
    """Initialize the launch catalog of wheel designs and their fitments."""

    # === Series: Flow-Formed ===

    mob = WheelDesign("Mob", "FF01", "flow_formed",
                      "Aggressive multi-spoke flow-formed design")
    mob.add_fitment("5x114.3", 18, 8.0, 35, 72.6)
    mob.add_fitment("5x114.3", 18, 9.0, 38, 72.6)
    mob.add_fitment("5x114.3", 19, 8.5, 35, 72.6)
    mob.add_fitment("5x114.3", 19, 9.5, 40, 72.6)
    mob.add_fitment("5x114.3", 20, 8.5, 35, 74.1)
    mob.add_fitment("5x114.3", 20, 10.0, 40, 74.1)
    mob.add_fitment("5x100", 18, 8.0, 35, 72.6)
    mob.add_fitment("5x100", 19, 8.5, 38, 72.6)
    mob.add_fitment("5x112", 19, 8.5, 35, 72.6)
    mob.add_fitment("5x112", 20, 8.5, 35, 72.6)
    mob.add_fitment("5x120", 19, 8.5, 30, 74.1)
    mob.add_fitment("5x120", 20, 8.5, 30, 74.1)
    WHEEL_DESIGNS[mob.code] = mob

    striker = WheelDesign("Striker", "FF02", "flow_formed",
                          "Split-spoke motorsport-inspired flow-formed design")
    striker.add_fitment("5x114.3", 18, 8.0, 35, 72.6)
    striker.add_fitment("5x114.3", 19, 8.5, 35, 72.6)
    striker.add_fitment("5x114.3", 20, 8.5, 35, 74.1)
    striker.add_fitment("5x114.3", 20, 10.0, 40, 74.1)
    striker.add_fitment("5x100", 18, 8.0, 35, 72.6)
    striker.add_fitment("5x112", 19, 8.5, 35, 72.6)
    striker.add_fitment("5x112", 20, 8.5, 35, 72.6)
    striker.add_fitment("5x120", 19, 8.5, 30, 74.1)
    striker.add_fitment("5x120.7", 20, 9.0, 25, 78.1)
    striker.add_fitment("5x127", 18, 8.5, 25, 78.1)
    striker.add_fitment("5x127", 20, 9.0, 25, 78.1)
    striker.add_fitment("5x139.7", 18, 8.5, 0, 78.1)
    striker.add_fitment("5x139.7", 20, 9.0, 0, 78.1)
    WHEEL_DESIGNS[striker.code] = striker

    # === Series: Forged (monoblock) ===

    vortex = WheelDesign("Vortex", "FG01", "forged",
                         "Deep concave monoblock forged — 5-spoke")
    vortex.add_fitment("5x114.3", 19, 8.5, 35, 72.6)
    vortex.add_fitment("5x114.3", 20, 9.0, 35, 74.1)
    vortex.add_fitment("5x114.3", 20, 10.5, 40, 74.1)
    vortex.add_fitment("5x112", 19, 8.5, 35, 72.6)
    vortex.add_fitment("5x112", 20, 9.0, 35, 74.1)
    vortex.add_fitment("5x112", 21, 9.0, 35, 74.1)
    vortex.add_fitment("5x120", 19, 8.5, 30, 74.1)
    vortex.add_fitment("5x120", 20, 9.0, 30, 74.1)
    vortex.add_fitment("5x120", 20, 10.5, 35, 74.1)
    vortex.add_fitment("5x120", 21, 9.0, 30, 74.1)
    WHEEL_DESIGNS[vortex.code] = vortex

    zenith = WheelDesign("Zenith", "FG02", "forged",
                         "Y-spoke forged monoblock — staggered fitments")
    zenith.add_fitment("5x114.3", 19, 8.5, 35, 72.6)
    zenith.add_fitment("5x114.3", 20, 8.5, 35, 74.1)
    zenith.add_fitment("5x114.3", 20, 10.5, 40, 74.1)
    zenith.add_fitment("5x112", 19, 8.5, 35, 72.6)
    zenith.add_fitment("5x112", 20, 8.5, 35, 74.1)
    zenith.add_fitment("5x112", 20, 10.5, 38, 74.1)
    zenith.add_fitment("5x112", 21, 9.0, 33, 74.1)
    zenith.add_fitment("5x120", 20, 9.0, 30, 74.1)
    zenith.add_fitment("5x120", 21, 9.5, 32, 74.1)
    WHEEL_DESIGNS[zenith.code] = zenith

    # === Series: Three-Piece ===

    axiom = WheelDesign("Axiom", "TP01", "three_piece",
                        "3-piece forged — modular center + barrel")
    axiom.add_fitment("5x114.3", 19, 8.5, 35, 72.6)
    axiom.add_fitment("5x114.3", 20, 9.0, 35, 74.1)
    axiom.add_fitment("5x114.3", 20, 10.5, 40, 74.1)
    axiom.add_fitment("5x114.3", 22, 9.0, 35, 74.1)
    axiom.add_fitment("5x114.3", 22, 10.5, 40, 74.1)
    axiom.add_fitment("5x112", 20, 9.0, 35, 72.6)
    axiom.add_fitment("5x112", 22, 9.0, 33, 74.1)
    axiom.add_fitment("5x120", 20, 9.0, 30, 74.1)
    axiom.add_fitment("5x120", 22, 9.5, 32, 74.1)
    axiom.add_fitment("5x120.7", 20, 9.0, 25, 78.1)
    axiom.add_fitment("5x127", 20, 9.0, 25, 78.1)
    WHEEL_DESIGNS[axiom.code] = axiom


# Initialize the catalog on import
_init_catalog()


def get_bolt_pattern_by_id(pid: int) -> Optional[BoltPattern]:
    for bp in BOLT_PATTERNS:
        if bp.id == pid:
            return bp
    return None


def get_all_designs() -> list[WheelDesign]:
    return list(WHEEL_DESIGNS.values())