"""
Calder Wheels — Wheel Configurator Domain Model

The configurator is the core product experience: a customer selects
center finish × barrel/lip finish × hardware finish to define their wheel.

Key architectural rules (from architecture.md §5):
  - Finishes are component identity, not attributes — each finish × type
    is a distinct component SKU with its own stock
  - Different series have different configuration surfaces
  - A configuration is only orderable if its BOM resolves (availability gate)
  - Price = sum of component costs
  - Preview uses pre-rendered 2D layer composites (not on-the-fly 3D)

Client rendering files:
  shopify/assets/composites/design-{code}/
    center-{finish}.png     (z=0)
    barrel-{finish}.png     (z=1)
    bolt-{finish}.png       (z=2)

  Size-specific subdirectories supported: barrel/bolt renders can be
  swapped per size (e.g. shopify/assets/composites/design-201/24x10/barrel-bk.png)
"""

from dataclasses import dataclass, field
from decimal import Decimal
from enum import Enum
from typing import Optional


# ─── Component Types ───────────────────────────────────────────────────────

class ComponentType(str, Enum):
    CENTER = "center"
    BARREL = "barrel"
    HARDWARE = "hardware"

    def prefix(self) -> str:
        return {"center": "C", "barrel": "B", "hardware": "H"}[self.value]

    def label(self) -> str:
        return {"center": "Center", "barrel": "Barrel/Lip", "hardware": "Hardware"}[self.value]

    def layer_name(self) -> str:
        return {"center": "center", "barrel": "barrel", "hardware": "bolt"}[self.value]


# ─── Series Definitions ────────────────────────────────────────────────────

class Series(str, Enum):
    FORGED = "forged"
    FLOW_FORMED = "flow_formed"
    THREE_PIECE = "three_piece"

    def label(self) -> str:
        return {"forged": "Forged Monoblock",
                "flow_formed": "Flow-Formed",
                "three_piece": "3-Piece Forged"}[self.value]

    def configurable_components(self) -> list[ComponentType]:
        mapping = {
            Series.FORGED: [ComponentType.CENTER],
            Series.FLOW_FORMED: [ComponentType.CENTER, ComponentType.BARREL],
            Series.THREE_PIECE: [ComponentType.CENTER, ComponentType.BARREL, ComponentType.HARDWARE],
        }
        return mapping[self]

    def has_barrel_choice(self) -> bool:
        return self in (Series.FLOW_FORMED, Series.THREE_PIECE)

    def has_hardware_choice(self) -> bool:
        return self == Series.THREE_PIECE


# ─── Finish Definitions ────────────────────────────────────────────────────

@dataclass(frozen=True)
class Finish:
    """A surface finish that can be applied to a component."""
    id: str                    # internal ID, e.g. "BK", "POLISH", "CHROME"
    name: str                  # display name, e.g. "Gloss Black"
    client_code: str           # matches the client rendering filename, e.g. "bk"
    component_type: ComponentType
    category: str              # "standard", "premium", "chrome"
    sort_order: int

    def filename(self, component: Optional[ComponentType] = None) -> str:
        """Filename for the pre-rendered finish layer image.

        Matches the actual file naming convention used by
        resolve_composite_layers() and the organized PNGs:
          composites/design-{code}/center-{client_code}.png
          composites/design-{code}/barrel-{client_code}.png
          composites/design-{code}/bolt-{client_code}.png
        """
        return f"{self.component_type.layer_name()}-{self.client_code}.png"


# ─── Finish Catalogs (client-aligned) ──────────────────────────────────────
# Client rendering codes:
#   Center: BK (Gloss Black), BKUTI (Black Titanium), SU (Satin Silver)
#   Barrel: BK (Black barrel), POLISH (Polished)
#   Bolt:   BK (Black bolts), CHROME (Chrome bolts)

def _build_center_finishes() -> list[Finish]:
    return [
        Finish("BK",    "Gloss Black",      "bk",    ComponentType.CENTER, "standard", 1),
        Finish("BKUTI", "Black Titanium",   "bkuti", ComponentType.CENTER, "premium",  2),
        Finish("SU",    "Satin Silver",     "su",    ComponentType.CENTER, "standard", 3),
    ]


def _build_barrel_finishes() -> list[Finish]:
    return [
        Finish("BK",     "Black",     "bk",     ComponentType.BARREL, "standard", 1),
        Finish("POLISH", "Polished",  "polish", ComponentType.BARREL, "premium",  2),
    ]


def _build_hardware_finishes() -> list[Finish]:
    return [
        Finish("BK",     "Black Bolts",     "bk",     ComponentType.HARDWARE, "standard", 1),
        Finish("CHROME", "Chrome Bolts",    "chrome", ComponentType.HARDWARE, "chrome",   2),
    ]


CENTER_FINISHES: list[Finish] = _build_center_finishes()
BARREL_FINISHES: list[Finish] = _build_barrel_finishes()
HARDWARE_FINISHES: list[Finish] = _build_hardware_finishes()

FINISH_MAP: dict[str, Finish] = {}
for f in CENTER_FINISHES + BARREL_FINISHES + HARDWARE_FINISHES:
    FINISH_MAP[f"{f.component_type.prefix()}-{f.id}"] = f


def get_finish(component_type: ComponentType, finish_id: str) -> Optional[Finish]:
    return FINISH_MAP.get(f"{component_type.prefix()}-{finish_id}")


def get_finishes_for_component(ctype: ComponentType) -> list[Finish]:
    mapping = {
        ComponentType.CENTER: CENTER_FINISHES,
        ComponentType.BARREL: BARREL_FINISHES,
        ComponentType.HARDWARE: HARDWARE_FINISHES,
    }
    return list(mapping[ctype])


def get_finishes_for_series(series: Series) -> dict[ComponentType, list[Finish]]:
    return {
        ct: get_finishes_for_component(ct)
        for ct in series.configurable_components()
    }


# ─── Client Design Catalog ─────────────────────────────────────────────────

@dataclass
class WheelDesign:
    code: str           # e.g. "201"
    nickname: str       # e.g. "Apex"
    series: Series
    description: str = ""


CLIENT_DESIGNS: dict[str, WheelDesign] = {
    "201": WheelDesign("201", "Apex",       Series.THREE_PIECE, "Timeless 7-spoke 3-piece forged"),
    "202": WheelDesign("202", "Vertex",     Series.THREE_PIECE, "Aggressive split-spoke 3-piece forged"),
    "203": WheelDesign("203", "Striker",    Series.THREE_PIECE, "Sport mesh 3-piece forged"),
    "205": WheelDesign("205", "Turbine",    Series.THREE_PIECE, "Turbine-blade 3-piece forged"),
    "207": WheelDesign("207", "Vortex",     Series.THREE_PIECE, "Deep dish step-lip 3-piece forged"),
}


def get_design(code: str) -> Optional[WheelDesign]:
    return CLIENT_DESIGNS.get(code)


def get_all_designs() -> list[WheelDesign]:
    return list(CLIENT_DESIGNS.values())


# ─── Component Pricing ─────────────────────────────────────────────────────

@dataclass
class ComponentPrice:
    component_type: ComponentType
    finish_id: str
    unit_cost: Decimal
    retail_price: Decimal
    dealer_price: Decimal


DEFAULT_COMPONENT_PRICES: dict[str, ComponentPrice] = {}

def _init_prices():
    center_costs = {
        "BK":    (Decimal("150.00"), Decimal("400.00"), Decimal("280.00")),
        "BKUTI": (Decimal("180.00"), Decimal("480.00"), Decimal("336.00")),
        "SU":    (Decimal("160.00"), Decimal("420.00"), Decimal("294.00")),
    }
    barrel_costs = {
        "BK":     (Decimal("120.00"), Decimal("300.00"), Decimal("210.00")),
        "POLISH": (Decimal("140.00"), Decimal("350.00"), Decimal("245.00")),
    }
    hardware_costs = {
        "BK":     (Decimal("12.00"),  Decimal("30.00"),  Decimal("21.00")),
        "CHROME": (Decimal("15.00"),  Decimal("35.00"),  Decimal("24.50")),
    }

    for fid, (cost, retail, dealer) in center_costs.items():
        DEFAULT_COMPONENT_PRICES[f"C-{fid}"] = ComponentPrice(
            ComponentType.CENTER, fid, cost, retail, dealer,
        )
    for fid, (cost, retail, dealer) in barrel_costs.items():
        DEFAULT_COMPONENT_PRICES[f"B-{fid}"] = ComponentPrice(
            ComponentType.BARREL, fid, cost, retail, dealer,
        )
    for fid, (cost, retail, dealer) in hardware_costs.items():
        DEFAULT_COMPONENT_PRICES[f"H-{fid}"] = ComponentPrice(
            ComponentType.HARDWARE, fid, cost, retail, dealer,
        )

_init_prices()


def get_component_price(ctype: ComponentType, finish_id: str) -> Optional[ComponentPrice]:
    return DEFAULT_COMPONENT_PRICES.get(f"{ctype.prefix()}-{finish_id}")


# ─── 2D Layer Composite System ─────────────────────────────────────────────

COMPOSITE_Z_ORDER = {
    ComponentType.CENTER: 0,
    ComponentType.BARREL: 1,
    ComponentType.HARDWARE: 2,
}


@dataclass
class CompositeLayer:
    """A single image layer in the pre-rendered composite."""
    finish_id: str
    component_type: ComponentType
    filename: str        # the actual PNG filename, e.g. "center-bk.png"
    z_index: int         # render order (0 = bottom)
    size_suffix: Optional[str] = None  # optional size folder, e.g. "24x10"

    def path(self, design_code: str) -> str:
        """Asset path relative to shopify/assets/composites/.

        Supports optional size-specific subdirectories:
          composites/design-201/center-bk.png          (generic)
          composites/design-201/24x10/center-bk.png    (size-specific)
        """
        base = f"composites/design-{design_code}"
        if self.size_suffix:
            return f"{base}/{self.size_suffix}/{self.filename}"
        return f"{base}/{self.filename}"


def resolve_composite_layers(
    design_code: str,
    series: Series,
    center_finish: str,
    barrel_finish: Optional[str] = None,
    hardware_finish: Optional[str] = None,
    size_suffix: Optional[str] = None,
) -> list[CompositeLayer]:
    """
    Resolve the ordered list of image layers for a configuration.

    Layers are returned in render order (z-index ascending).
    Each layer references a pre-rendered PNG.

    File naming convention (matches organized PNGs):
      composites/design-{code}/center-{finish}.png
      composites/design-{code}/barrel-{finish}.png
      composites/design-{code}/bolt-{finish}.png

    Size suffix creates subdirectories for size-specific renders:
      composites/design-{code}/24x10/barrel-polish.png
    """
    layers = []

    finish = get_finish(ComponentType.CENTER, center_finish)
    if finish:
        filename = f"center-{finish.client_code}.png"
        layers.append(CompositeLayer(
            center_finish, ComponentType.CENTER,
            filename, COMPOSITE_Z_ORDER[ComponentType.CENTER],
            size_suffix=size_suffix,
        ))

    if barrel_finish and series.has_barrel_choice():
        finish = get_finish(ComponentType.BARREL, barrel_finish)
        if finish:
            filename = f"barrel-{finish.client_code}.png"
            layers.append(CompositeLayer(
                barrel_finish, ComponentType.BARREL,
                filename, COMPOSITE_Z_ORDER[ComponentType.BARREL],
                size_suffix=size_suffix,
            ))

    if hardware_finish and series.has_hardware_choice():
        finish = get_finish(ComponentType.HARDWARE, hardware_finish)
        if finish:
            filename = f"bolt-{finish.client_code}.png"
            layers.append(CompositeLayer(
                hardware_finish, ComponentType.HARDWARE,
                filename, COMPOSITE_Z_ORDER[ComponentType.HARDWARE],
                size_suffix=size_suffix,
            ))

    layers.sort(key=lambda l: l.z_index)
    return layers


# ─── Configuration State Machine ───────────────────────────────────────────

@dataclass
class ConfiguratorState:
    """
    The customer's current configuration selection.

    This is the single source of truth for what the customer
    has selected in the configurator UI.
    """
    design_code: str
    series: Series
    center_finish: Optional[str] = None
    barrel_finish: Optional[str] = None
    hardware_finish: Optional[str] = None
    diameter: Optional[float] = None
    width: Optional[float] = None
    bolt_pattern: Optional[str] = None
    size_suffix: Optional[str] = None      # e.g. "24x10" for size-specific layers

    # ─── Validation ──────────────────────────────────────────────────

    def is_complete(self) -> bool:
        if not self.center_finish:
            return False
        if self.series.has_barrel_choice() and not self.barrel_finish:
            return False
        if self.series.has_hardware_choice() and not self.hardware_finish:
            return False
        if not self.diameter or not self.width or not self.bolt_pattern:
            return False
        return True

    def missing_fields(self) -> list[str]:
        missing = []
        if not self.center_finish:
            missing.append("Center finish")
        if self.series.has_barrel_choice() and not self.barrel_finish:
            missing.append("Barrel/Lip finish")
        if self.series.has_hardware_choice() and not self.hardware_finish:
            missing.append("Hardware finish")
        if not self.diameter:
            missing.append("Diameter")
        if not self.width:
            missing.append("Width")
        if not self.bolt_pattern:
            missing.append("Bolt pattern")
        return missing

    def auto_size_suffix(self) -> Optional[str]:
        """Derive size suffix from diameter x width, e.g. '24x10'."""
        if self.diameter and self.width:
            return f"{int(self.diameter)}x{int(self.width)}"
        return None

    # ─── SKU Resolution ───────────────────────────────────────────────

    def resolve_finished_sku(self) -> Optional[str]:
        """
        Resolve the configuration to a finished SKU.

        Format: {DESIGN}-{DIAMETER}-{CENTER}-{BARREL}[-{HARDWARE}]
        Example: 201-24-BK-POLISH
                 207-22-BKUTI-BK-CHROME
        """
        if not self.is_complete():
            return None

        parts = [
            self.design_code.upper(),
            str(int(self.diameter)),
            self.center_finish.upper(),
        ]
        if self.series.has_barrel_choice():
            parts.append(self.barrel_finish.upper())
        if self.series.has_hardware_choice():
            parts.append(self.hardware_finish.upper())

        return "-".join(parts)

    # ─── BOM Generation ───────────────────────────────────────────────

    def generate_bom(self) -> list["BOMLineItem"]:
        if not self.is_complete():
            return []

        bom = []

        cp = get_component_price(ComponentType.CENTER, self.center_finish)
        if cp:
            bom.append(BOMLineItem(
                component_sku=f"{self.design_code}-C-{self.center_finish}",
                component_type="center",
                finish=self.center_finish,
                quantity=1,
                unit_cost=cp.unit_cost,
                retail_price=cp.retail_price,
            ))

        if self.barrel_finish and self.series.has_barrel_choice():
            cp = get_component_price(ComponentType.BARREL, self.barrel_finish)
            if cp:
                bom.append(BOMLineItem(
                    component_sku=f"{self.design_code}-B-{self.barrel_finish}",
                    component_type="barrel",
                    finish=self.barrel_finish,
                    quantity=1,
                    unit_cost=cp.unit_cost,
                    retail_price=cp.retail_price,
                ))

        hw_qty = 20 if self.series == Series.THREE_PIECE else 0
        if self.hardware_finish and hw_qty > 0:
            cp = get_component_price(ComponentType.HARDWARE, self.hardware_finish)
            if cp:
                bom.append(BOMLineItem(
                    component_sku=f"HWARE-{self.hardware_finish}",
                    component_type="hardware",
                    finish=self.hardware_finish,
                    quantity=hw_qty,
                    unit_cost=cp.unit_cost,
                    retail_price=cp.retail_price,
                ))

        return bom

    # ─── Pricing ──────────────────────────────────────────────────────

    def calculate_retail_price(self) -> Optional[Decimal]:
        bom = self.generate_bom()
        if not bom:
            return None
        return sum(line.retail_total() for line in bom)

    def calculate_dealer_price(self) -> Optional[Decimal]:
        bom = self.generate_bom()
        if not bom:
            return None
        return sum(line.dealer_total() for line in bom)

    def calculate_cost(self) -> Optional[Decimal]:
        bom = self.generate_bom()
        if not bom:
            return None
        return sum(line.cost_total() for line in bom)

    # ─── Composite Preview ────────────────────────────────────────────

    def get_composite_layers(self) -> list["CompositeLayer"]:
        suffix = self.size_suffix or self.auto_size_suffix()
        return resolve_composite_layers(
            self.design_code,
            self.series,
            self.center_finish,
            self.barrel_finish,
            self.hardware_finish,
            size_suffix=suffix,
        )


# ─── BOM Line Item ─────────────────────────────────────────────────────────

@dataclass
class BOMLineItem:
    component_sku: str
    component_type: str
    finish: str
    quantity: int
    unit_cost: Decimal
    retail_price: Decimal

    def cost_total(self) -> Decimal:
        return self.unit_cost * self.quantity

    def retail_total(self) -> Decimal:
        return self.retail_price * self.quantity

    def dealer_total(self) -> Decimal:
        return (self.retail_price * Decimal("0.7")) * self.quantity


# ─── Configuration Result ──────────────────────────────────────────────────

@dataclass
class ConfigurationResult:
    config: ConfiguratorState
    finished_sku: str
    bom: list[BOMLineItem]
    total_retail: Decimal
    total_dealer: Decimal
    total_cost: Decimal
    composite_layers: list[CompositeLayer]
    is_orderable: bool = False
    is_complete: bool = True
    error: Optional[str] = None

    @classmethod
    def from_config(cls, config: ConfiguratorState) -> "ConfigurationResult":
        sku = config.resolve_finished_sku()
        if not sku:
            missing = ", ".join(config.missing_fields())
            return cls(
                config=config,
                finished_sku="",
                bom=[],
                total_retail=Decimal("0"),
                total_dealer=Decimal("0"),
                total_cost=Decimal("0"),
                composite_layers=[],
                is_complete=False,
                error=f"Missing required fields: {missing}",
            )

        bom = config.generate_bom()
        return cls(
            config=config,
            finished_sku=sku,
            bom=bom,
            total_retail=config.calculate_retail_price() or Decimal("0"),
            total_dealer=config.calculate_dealer_price() or Decimal("0"),
            total_cost=config.calculate_cost() or Decimal("0"),
            composite_layers=config.get_composite_layers(),
        )

    def summary(self) -> dict:
        return {
            "finished_sku": self.finished_sku,
            "design_code": self.config.design_code,
            "design_nickname": self.config.design_code,
            "series": self.config.series.value,
            "center_finish": self.config.center_finish,
            "barrel_finish": self.config.barrel_finish,
            "hardware_finish": self.config.hardware_finish,
            "diameter": self.config.diameter,
            "width": self.config.width,
            "bolt_pattern": self.config.bolt_pattern,
            "size_suffix": self.config.size_suffix or self.config.auto_size_suffix(),
            "total_retail": float(self.total_retail),
            "total_dealer": float(self.total_dealer),
            "total_cost": float(self.total_cost),
            "is_orderable": self.is_orderable,
            "is_complete": self.is_complete,
            "error": self.error,
            "bom": [
                {
                    "component_sku": li.component_sku,
                    "component_type": li.component_type,
                    "finish": li.finish,
                    "quantity": li.quantity,
                    "unit_cost": float(li.unit_cost),
                    "retail_price": float(li.retail_price),
                    "total": float(li.retail_total()),
                }
                for li in self.bom
            ],
            "composite_layers": [
                {
                    "filename": l.filename,
                    "z_index": l.z_index,
                    "path": l.path(self.config.design_code),
                }
                for l in self.composite_layers
            ],
        }


# ─── Availability Gate Interface ───────────────────────────────────────────

class AvailabilityGate:
    def check(self, result: ConfigurationResult) -> ConfigurationResult:
        if not result.is_complete:
            return result
        result.is_orderable = True
        return result