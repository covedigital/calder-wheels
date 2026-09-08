"""
Calder Wheels — Configurator Test Suite (client-aligned)

Tests the configurator domain model against actual client data:
  - 5 designs: 201, 202, 203, 205, 207
  - 3 center finishes: BK, BKUTI, SU
  - 2 barrel finishes: BK, POLISH
  - 2 hardware finishes: BK, CHROME
  - All designs are 3-Piece (center + barrel + bolts)
"""

import os
import sys
import unittest
from decimal import Decimal
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from configurator_model import (
    CLIENT_DESIGNS,
    CENTER_FINISHES,
    BARREL_FINISHES,
    HARDWARE_FINISHES,
    FINISH_MAP,
    DEFAULT_COMPONENT_PRICES,
    get_finish,
    get_component_price,
    get_finishes_for_component,
    get_finishes_for_series,
    get_design,
    get_all_designs,
    resolve_composite_layers,
    ConfiguratorState,
    ConfigurationResult,
    AvailabilityGate,
    BOMLineItem,
    CompositeLayer,
    ComponentType,
    Series,
    Finish,
)

COMPOSITES_DIR = Path(__file__).parent.parent / "shopify" / "assets" / "composites"


# ═══════════════════════════════════════════════════════════════════════════
# 1. Client Design Catalog
# ═══════════════════════════════════════════════════════════════════════════

class TestClientDesignCatalog(unittest.TestCase):
    def test_exactly_five_designs(self):
        self.assertEqual(len(CLIENT_DESIGNS), 5)

    def test_all_designs_are_three_piece(self):
        for code, design in CLIENT_DESIGNS.items():
            self.assertEqual(design.series, Series.THREE_PIECE,
                             f"{code} should be 3-piece")

    def test_design_codes_match_client(self):
        expected = {"201", "202", "203", "205", "207"}
        self.assertEqual(set(CLIENT_DESIGNS.keys()), expected)

    def test_get_design(self):
        d = get_design("201")
        self.assertIsNotNone(d)
        self.assertEqual(d.code, "201")
        self.assertIsNone(get_design("999"))

    def test_get_all_designs(self):
        all_d = get_all_designs()
        self.assertEqual(len(all_d), 5)

    def test_series_is_three_piece(self):
        for code in CLIENT_DESIGNS:
            d = CLIENT_DESIGNS[code]
            self.assertTrue(d.series.has_barrel_choice())
            self.assertTrue(d.series.has_hardware_choice())


# ═══════════════════════════════════════════════════════════════════════════
# 2. Finish Catalog (client-aligned)
# ═══════════════════════════════════════════════════════════════════════════

class TestClientFinishCatalog(unittest.TestCase):
    def test_center_finishes_match_client(self):
        ids = {f.id for f in CENTER_FINISHES}
        self.assertEqual(ids, {"BK", "BKUTI", "SU"})

    def test_barrel_finishes_match_client(self):
        ids = {f.id for f in BARREL_FINISHES}
        self.assertEqual(ids, {"BK", "POLISH"})

    def test_hardware_finishes_match_client(self):
        ids = {f.id for f in HARDWARE_FINISHES}
        self.assertEqual(ids, {"BK", "CHROME"})

    def test_all_finishes_have_unique_ids_within_type(self):
        for catalog in [CENTER_FINISHES, BARREL_FINISHES, HARDWARE_FINISHES]:
            ids = [f.id for f in catalog]
            self.assertEqual(len(ids), len(set(ids)))

    def test_finish_client_codes(self):
        for f in CENTER_FINISHES:
            self.assertIn(f.client_code, {"bk", "bkuti", "su"})
        for f in BARREL_FINISHES:
            self.assertIn(f.client_code, {"bk", "polish"})
        for f in HARDWARE_FINISHES:
            self.assertIn(f.client_code, {"bk", "chrome"})

    def test_finish_filename_generation(self):
        f = get_finish(ComponentType.CENTER, "BK")
        self.assertEqual(f.filename(), "center-bk.png")
        f = get_finish(ComponentType.BARREL, "POLISH")
        self.assertEqual(f.filename(), "barrel-polish.png")
        f = get_finish(ComponentType.HARDWARE, "CHROME")
        self.assertEqual(f.filename(), "bolt-chrome.png")

    def test_finish_map_complete(self):
        all_finishes = set(CENTER_FINISHES + BARREL_FINISHES + HARDWARE_FINISHES)
        for key, f in FINISH_MAP.items():
            self.assertIn(f, all_finishes)

    def test_get_finishes_for_component(self):
        self.assertEqual(len(get_finishes_for_component(ComponentType.CENTER)), 3)
        self.assertEqual(len(get_finishes_for_component(ComponentType.BARREL)), 2)
        self.assertEqual(len(get_finishes_for_component(ComponentType.HARDWARE)), 2)

    def test_category_mapping(self):
        self.assertEqual(get_finish(ComponentType.CENTER, "BK").category, "standard")
        self.assertEqual(get_finish(ComponentType.CENTER, "BKUTI").category, "premium")
        self.assertEqual(get_finish(ComponentType.HARDWARE, "CHROME").category, "chrome")


# ═══════════════════════════════════════════════════════════════════════════
# 3. Layer File Verification (PNGs on disk)
# ═══════════════════════════════════════════════════════════════════════════

class TestLayerFilesOnDisk(unittest.TestCase):
    def test_composites_directory_exists(self):
        self.assertTrue(COMPOSITES_DIR.exists())

    def test_each_design_has_all_seven_layers(self):
        expected = {"center-bk.png", "center-bkuti.png", "center-su.png",
                    "barrel-bk.png", "barrel-polish.png",
                    "bolt-bk.png", "bolt-chrome.png"}
        for code in CLIENT_DESIGNS:
            design_dir = COMPOSITES_DIR / f"design-{code}"
            self.assertTrue(design_dir.exists(), f"Missing directory: design-{code}")
            files = set(f.name for f in design_dir.iterdir() if f.is_file())
            missing = expected - files
            self.assertEqual(len(missing), 0,
                             f"design-{code} missing: {missing}")

    def test_layers_are_rgba_png(self):
        from PIL import Image
        for code in CLIENT_DESIGNS:
            design_dir = COMPOSITES_DIR / f"design-{code}"
            for f in sorted(design_dir.iterdir()):
                if f.suffix != ".png":
                    continue
                img = Image.open(f)
                self.assertIn(img.mode, ("RGBA", "LA"),
                              f"{f.name} is {img.mode}, expected RGBA")
                self.assertEqual(img.size, (1920, 1564),
                                 f"{f.name} is {img.size[0]}x{img.size[1]}, expected 1920x1564")


# ═══════════════════════════════════════════════════════════════════════════
# 4. ConfiguratorState with Client Data
# ═══════════════════════════════════════════════════════════════════════════

class TestClientConfiguratorState(unittest.TestCase):
    def test_design_201_complete(self):
        config = ConfiguratorState(
            design_code="201", series=Series.THREE_PIECE,
            center_finish="BK", barrel_finish="POLISH", hardware_finish="CHROME",
            diameter=24.0, width=10.0, bolt_pattern="5x114.3",
        )
        self.assertTrue(config.is_complete())
        self.assertEqual(len(config.missing_fields()), 0)

    def test_design_207_complete(self):
        config = ConfiguratorState(
            design_code="207", series=Series.THREE_PIECE,
            center_finish="BKUTI", barrel_finish="BK", hardware_finish="BK",
            diameter=22.0, width=9.0, bolt_pattern="5x112",
        )
        self.assertTrue(config.is_complete())

    def test_missing_center(self):
        config = ConfiguratorState(
            design_code="201", series=Series.THREE_PIECE,
            barrel_finish="POLISH", hardware_finish="CHROME",
            diameter=24.0, width=10.0, bolt_pattern="5x114.3",
        )
        self.assertFalse(config.is_complete())
        self.assertIn("Center finish", config.missing_fields())

    def test_missing_barrel(self):
        config = ConfiguratorState(
            design_code="201", series=Series.THREE_PIECE,
            center_finish="BK", hardware_finish="CHROME",
            diameter=24.0, width=10.0, bolt_pattern="5x114.3",
        )
        self.assertFalse(config.is_complete())
        self.assertIn("Barrel/Lip finish", config.missing_fields())

    def test_missing_hardware(self):
        config = ConfiguratorState(
            design_code="201", series=Series.THREE_PIECE,
            center_finish="BK", barrel_finish="POLISH",
            diameter=24.0, width=10.0, bolt_pattern="5x114.3",
        )
        self.assertFalse(config.is_complete())
        self.assertIn("Hardware finish", config.missing_fields())

    def test_all_fields_missing(self):
        config = ConfiguratorState(design_code="201", series=Series.THREE_PIECE)
        missing = config.missing_fields()
        self.assertIn("Center finish", missing)
        self.assertIn("Barrel/Lip finish", missing)
        self.assertIn("Hardware finish", missing)
        self.assertIn("Diameter", missing)
        self.assertIn("Width", missing)
        self.assertIn("Bolt pattern", missing)


# ═══════════════════════════════════════════════════════════════════════════
# 5. SKU Resolution
# ═══════════════════════════════════════════════════════════════════════════

class TestSKUResolution(unittest.TestCase):
    def test_sku_format_basic(self):
        config = ConfiguratorState(
            design_code="201", series=Series.THREE_PIECE,
            center_finish="BK", barrel_finish="POLISH", hardware_finish="CHROME",
            diameter=24.0, width=10.0, bolt_pattern="5x114.3",
        )
        self.assertEqual(config.resolve_finished_sku(), "201-24-BK-POLISH-CHROME")

    def test_sku_bkuti_and_bk_bolts(self):
        config = ConfiguratorState(
            design_code="207", series=Series.THREE_PIECE,
            center_finish="BKUTI", barrel_finish="BK", hardware_finish="BK",
            diameter=22.0, width=9.0, bolt_pattern="5x112",
        )
        self.assertEqual(config.resolve_finished_sku(), "207-22-BKUTI-BK-BK")

    def test_sku_incomplete_returns_none(self):
        config = ConfiguratorState(
            design_code="201", series=Series.THREE_PIECE,
            center_finish="BK",
        )
        self.assertIsNone(config.resolve_finished_sku())


# ═══════════════════════════════════════════════════════════════════════════
# 6. BOM Generation
# ═══════════════════════════════════════════════════════════════════════════

class TestBOMForClientData(unittest.TestCase):
    def test_bom_has_three_items_for_three_piece(self):
        config = ConfiguratorState(
            design_code="201", series=Series.THREE_PIECE,
            center_finish="BK", barrel_finish="POLISH", hardware_finish="CHROME",
            diameter=24.0, width=10.0, bolt_pattern="5x114.3",
        )
        bom = config.generate_bom()
        self.assertEqual(len(bom), 3)
        types = {li.component_type for li in bom}
        self.assertEqual(types, {"center", "barrel", "hardware"})

    def test_hardware_quantity_is_20(self):
        config = ConfiguratorState(
            design_code="201", series=Series.THREE_PIECE,
            center_finish="BK", barrel_finish="POLISH", hardware_finish="CHROME",
            diameter=24.0, width=10.0, bolt_pattern="5x114.3",
        )
        bom = config.generate_bom()
        hw = [li for li in bom if li.component_type == "hardware"][0]
        self.assertEqual(hw.quantity, 20)

    def test_empty_bom_for_incomplete(self):
        config = ConfiguratorState(design_code="201", series=Series.THREE_PIECE)
        self.assertEqual(len(config.generate_bom()), 0)


# ═══════════════════════════════════════════════════════════════════════════
# 7. Pricing
# ═══════════════════════════════════════════════════════════════════════════

class TestClientPricing(unittest.TestCase):
    def test_bk_center_pricing(self):
        p = get_component_price(ComponentType.CENTER, "BK")
        self.assertEqual(p.unit_cost, Decimal("150.00"))
        self.assertEqual(p.retail_price, Decimal("400.00"))

    def test_bkuti_premium_pricing(self):
        p = get_component_price(ComponentType.CENTER, "BKUTI")
        self.assertEqual(p.retail_price, Decimal("480.00"))

    def test_polish_barrel_pricing(self):
        p = get_component_price(ComponentType.BARREL, "POLISH")
        self.assertEqual(p.retail_price, Decimal("350.00"))

    def test_chrome_hardware_pricing(self):
        p = get_component_price(ComponentType.HARDWARE, "CHROME")
        self.assertEqual(p.retail_price, Decimal("35.00"))

    def test_retail_price_bk_polish_chrome(self):
        config = ConfiguratorState(
            design_code="201", series=Series.THREE_PIECE,
            center_finish="BK", barrel_finish="POLISH", hardware_finish="CHROME",
            diameter=24.0, width=10.0, bolt_pattern="5x114.3",
        )
        # center 400 + barrel 350 + hardware 35*20 = 700
        self.assertEqual(config.calculate_retail_price(), Decimal("1450.00"))

    def test_retail_price_bkuti_polish_gold(self):
        config = ConfiguratorState(
            design_code="207", series=Series.THREE_PIECE,
            center_finish="BKUTI", barrel_finish="BK", hardware_finish="BK",
            diameter=24.0, width=10.0, bolt_pattern="5x114.3",
        )
        # center 480 + barrel 300 + hardware 30*20 = 600
        self.assertEqual(config.calculate_retail_price(), Decimal("1380.00"))

    def test_dealer_discount(self):
        config = ConfiguratorState(
            design_code="201", series=Series.THREE_PIECE,
            center_finish="BK", barrel_finish="POLISH", hardware_finish="CHROME",
            diameter=24.0, width=10.0, bolt_pattern="5x114.3",
        )
        retail = config.calculate_retail_price()
        dealer = config.calculate_dealer_price()
        self.assertEqual(dealer, retail * Decimal("0.7"))

    def test_cost_margin(self):
        config = ConfiguratorState(
            design_code="201", series=Series.THREE_PIECE,
            center_finish="BK", barrel_finish="POLISH", hardware_finish="CHROME",
            diameter=24.0, width=10.0, bolt_pattern="5x114.3",
        )
        cost = config.calculate_cost()
        retail = config.calculate_retail_price()
        margin = float((retail - cost) / retail * 100)
        self.assertGreater(margin, 40, f"Margin only {margin:.1f}%")

    def test_pricing_incomplete(self):
        config = ConfiguratorState(design_code="201", series=Series.THREE_PIECE)
        self.assertIsNone(config.calculate_retail_price())
        self.assertIsNone(config.calculate_cost())


# ═══════════════════════════════════════════════════════════════════════════
# 8. 2D Composite Layer Resolution
# ═══════════════════════════════════════════════════════════════════════════

class TestCompositeLayers(unittest.TestCase):
    def test_three_layers_for_three_piece(self):
        layers = resolve_composite_layers("201", Series.THREE_PIECE,
                                            "BK", "POLISH", "CHROME")
        self.assertEqual(len(layers), 3)

    def test_z_order_correct(self):
        layers = resolve_composite_layers("201", Series.THREE_PIECE,
                                            "BK", "POLISH", "CHROME")
        self.assertEqual(layers[0].component_type, ComponentType.CENTER)
        self.assertEqual(layers[1].component_type, ComponentType.BARREL)
        self.assertEqual(layers[2].component_type, ComponentType.HARDWARE)

    def test_filename_convention_center(self):
        layers = resolve_composite_layers("201", Series.THREE_PIECE,
                                            "BK", "POLISH", "CHROME")
        self.assertEqual(layers[0].filename, "center-bk.png")

    def test_filename_convention_barrel(self):
        layers = resolve_composite_layers("201", Series.THREE_PIECE,
                                            "BK", "POLISH", "CHROME")
        self.assertEqual(layers[1].filename, "barrel-polish.png")

    def test_filename_convention_hardware(self):
        layers = resolve_composite_layers("201", Series.THREE_PIECE,
                                            "BK", "POLISH", "CHROME")
        self.assertEqual(layers[2].filename, "bolt-chrome.png")

    def test_path_format_no_size_suffix(self):
        layers = resolve_composite_layers("201", Series.THREE_PIECE,
                                            "BK", "POLISH", "CHROME")
        self.assertEqual(layers[0].path("201"),
                         "composites/design-201/center-bk.png")

    def test_path_format_with_size_suffix(self):
        layers = resolve_composite_layers("201", Series.THREE_PIECE,
                                            "BK", "POLISH", "CHROME",
                                            size_suffix="24x10")
        self.assertEqual(layers[0].path("201"),
                         "composites/design-201/24x10/center-bk.png")
        self.assertEqual(layers[1].path("201"),
                         "composites/design-201/24x10/barrel-polish.png")

    def test_auto_size_suffix(self):
        config = ConfiguratorState(
            design_code="201", series=Series.THREE_PIECE,
            center_finish="BK", barrel_finish="POLISH", hardware_finish="CHROME",
            diameter=24.0, width=10.0, bolt_pattern="5x114.3",
        )
        self.assertEqual(config.auto_size_suffix(), "24x10")

    def test_composite_layers_from_state(self):
        config = ConfiguratorState(
            design_code="201", series=Series.THREE_PIECE,
            center_finish="BK", barrel_finish="POLISH", hardware_finish="CHROME",
            diameter=24.0, width=10.0, bolt_pattern="5x114.3",
        )
        layers = config.get_composite_layers()
        self.assertEqual(len(layers), 3)
        # verify size suffix is auto-derived
        for l in layers:
            self.assertEqual(l.size_suffix, "24x10")

    def test_different_designs_resolve(self):
        for code in CLIENT_DESIGNS:
            layers = resolve_composite_layers(code, Series.THREE_PIECE,
                                                "BK", "POLISH", "CHROME")
            self.assertEqual(len(layers), 3, f"Failed for design {code}")


# ═══════════════════════════════════════════════════════════════════════════
# 9. ConfigurationResult
# ═══════════════════════════════════════════════════════════════════════════

class TestConfigurationResult(unittest.TestCase):
    def test_from_complete_config(self):
        config = ConfiguratorState(
            design_code="201", series=Series.THREE_PIECE,
            center_finish="BK", barrel_finish="POLISH", hardware_finish="CHROME",
            diameter=24.0, width=10.0, bolt_pattern="5x114.3",
        )
        result = ConfigurationResult.from_config(config)
        self.assertTrue(result.is_complete)
        self.assertIsNone(result.error)
        self.assertEqual(result.finished_sku, "201-24-BK-POLISH-CHROME")

    def test_from_incomplete_config(self):
        config = ConfiguratorState(design_code="201", series=Series.THREE_PIECE,
                                     center_finish="BK")
        result = ConfigurationResult.from_config(config)
        self.assertFalse(result.is_complete)
        self.assertIsNotNone(result.error)

    def test_summary_all_keys(self):
        config = ConfiguratorState(
            design_code="201", series=Series.THREE_PIECE,
            center_finish="BK", barrel_finish="POLISH", hardware_finish="CHROME",
            diameter=24.0, width=10.0, bolt_pattern="5x114.3",
        )
        result = ConfigurationResult.from_config(config)
        s = result.summary()
        self.assertIn("finished_sku", s)
        self.assertIn("design_code", s)
        self.assertIn("series", s)
        self.assertIn("center_finish", s)
        self.assertIn("barrel_finish", s)
        self.assertIn("hardware_finish", s)
        self.assertIn("size_suffix", s)
        self.assertIn("total_retail", s)
        self.assertIn("bom", s)
        self.assertIn("composite_layers", s)

    def test_summary_composite_layers_paths(self):
        config = ConfiguratorState(
            design_code="201", series=Series.THREE_PIECE,
            center_finish="BK", barrel_finish="POLISH", hardware_finish="CHROME",
            diameter=24.0, width=10.0, bolt_pattern="5x114.3",
        )
        result = ConfigurationResult.from_config(config)
        s = result.summary()
        self.assertEqual(len(s["composite_layers"]), 3)
        paths = [l["path"] for l in s["composite_layers"]]
        for p in paths:
            self.assertIn("design-201", p)

    def test_availability_gate(self):
        config = ConfiguratorState(
            design_code="201", series=Series.THREE_PIECE,
            center_finish="BK", barrel_finish="POLISH", hardware_finish="CHROME",
            diameter=24.0, width=10.0, bolt_pattern="5x114.3",
        )
        result = ConfigurationResult.from_config(config)
        gate = AvailabilityGate()
        result = gate.check(result)
        self.assertTrue(result.is_orderable)


# ═══════════════════════════════════════════════════════════════════════════
# 10. Size Suffix Expansion (post-launch)
# ═══════════════════════════════════════════════════════════════════════════

class TestSizeSuffixExpansion(unittest.TestCase):
    def test_size_suffix_set_explicitly(self):
        config = ConfiguratorState(
            design_code="201", series=Series.THREE_PIECE,
            center_finish="BK", barrel_finish="POLISH", hardware_finish="CHROME",
            diameter=22.0, width=9.0, bolt_pattern="5x114.3",
            size_suffix="22x9",
        )
        layers = config.get_composite_layers()
        for l in layers:
            self.assertEqual(l.size_suffix, "22x9")
            self.assertIn("22x9", l.path("201"))

    def test_size_suffix_auto_derived(self):
        config = ConfiguratorState(
            design_code="201", series=Series.THREE_PIECE,
            center_finish="BK", barrel_finish="POLISH", hardware_finish="CHROME",
            diameter=22.0, width=9.0, bolt_pattern="5x114.3",
        )
        layers = config.get_composite_layers()
        for l in layers:
            self.assertEqual(l.size_suffix, "22x9")

    def test_size_suffix_none_when_no_diameter(self):
        config = ConfiguratorState(
            design_code="201", series=Series.THREE_PIECE,
            center_finish="BK",
        )
        suffix = config.auto_size_suffix()
        self.assertIsNone(suffix)

    def test_size_suffix_in_summary(self):
        config = ConfiguratorState(
            design_code="201", series=Series.THREE_PIECE,
            center_finish="BK", barrel_finish="POLISH", hardware_finish="CHROME",
            diameter=22.0, width=9.5, bolt_pattern="5x114.3",
        )
        result = ConfigurationResult.from_config(config)
        s = result.summary()
        self.assertEqual(s["size_suffix"], "22x9")


if __name__ == "__main__":
    unittest.main()