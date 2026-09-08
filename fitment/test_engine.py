"""
Calder Wheels — Fitment Matching Engine Test Suite

Tests the core matching logic: Year → Make → Model → compatible wheels.

Categories:
  1. Bolt pattern matching (exact)
  2. Dimensional matching (diameter, width, offset ranges)
  3. Hub bore compatibility (wheel >= vehicle)
  4. Load rating minimum
  5. Integration: engine.find_matches()
  6. Edge cases: no matches, fallback makes/models
  7. Bolt pattern lookup
"""

import os
import sys
import sqlite3
import tempfile
import unittest
from pathlib import Path

# Ensure we can import from the fitment directory
sys.path.insert(0, str(Path(__file__).parent))

from engine import FitmentEngine, VehicleSpec, VehicleMatch
from fitment_manifest import (
    WHEEL_DESIGNS,
    BOLT_PATTERNS,
    BOLT_PATTERN_MAP,
    WheelDesign,
    WheelFitment,
)
from nhtsa_seeder import NHTSASeeder


# ─── Helper: Create an in-memory test database ─────────────────────────────

def create_test_db() -> str:
    """Create and populate a test SQLite database with vehicle fitment data."""
    fd, path = tempfile.mkstemp(suffix=".db")
    os.close(fd)

    conn = sqlite3.connect(path)
    schema = Path(__file__).parent / "schema.sql"
    conn.executescript(schema.read_text())

    # Seed bolt patterns
    for bp in BOLT_PATTERNS:
        conn.execute(
            "INSERT OR IGNORE INTO bolt_patterns (id, pattern, description) VALUES (?, ?, ?)",
            (bp.id, bp.pattern, bp.description),
        )

    # Seed vehicle data for testing
    makes = [
        (474, "HONDA"),
        (440, "TOYOTA"),
        (448, "FORD"),
        (452, "BMW"),
        (460, "MERCEDES-BENZ"),
    ]
    conn.executemany("INSERT OR IGNORE INTO makes (make_id, name) VALUES (?, ?)", makes)

    models = [
        # Honda
        (1861, 474, "Accord"),
        (1863, 474, "Civic"),
        (1865, 474, "CR-V"),
        # Toyota
        (4706, 440, "Camry"),
        (4748, 440, "RAV4"),
        (4720, 440, "Tacoma"),
        # Ford
        (1598, 448, "Mustang"),
        (1605, 448, "F-150"),
        # BMW
        (2597, 452, "3 Series"),
        (2600, 452, "5 Series"),
        # Mercedes
        (2857, 460, "C-Class"),
    ]
    conn.executemany(
        "INSERT OR IGNORE INTO models (model_id, make_id, name) VALUES (?, ?, ?)",
        models,
    )

    # Model years
    model_years_data = []
    for mid, _, _ in models:
        for y in range(2020, 2026):
            model_years_data.append((mid, y))
    conn.executemany(
        "INSERT OR IGNORE INTO model_years (model_id, year) VALUES (?, ?)",
        model_years_data,
    )

    # Fitment specs for each model-year (curated)
    fitment_specs = [
        # 2020-2025 Honda Accord: 5x114.3, 16-20", 7-9.5", ET35-55, hub 64.1
        # 2020-2025 Honda Civic: 5x114.3, 16-19", 7-9", ET35-50, hub 64.1
        # 2020-2025 Honda CR-V: 5x114.3, 17-20", 7-9", ET35-50, hub 64.1
        # 2020-2025 Toyota Camry: 5x114.3, 16-19", 7-9", ET35-50, hub 64.1
        # 2020-2025 Toyota RAV4: 5x114.3, 17-20", 7-9", ET35-50, hub 64.1
        # 2020-2025 Toyota Tacoma: 6x139.7, 16-18", 7-9", ET0-25, hub 78.1
        # 2020-2025 Ford Mustang: 5x114.3, 17-20", 8-10.5", ET25-45, hub 70.6
        # 2020-2025 Ford F-150: 6x135, 17-22", 7-10", ET0-35, hub 87.1
        # 2020-2025 BMW 3 Series: 5x112, 17-20", 7-9.5", ET25-45, hub 72.6
        # 2020-2025 BMW 5 Series: 5x112, 18-21", 7.5-10", ET20-40, hub 72.6
        # 2020-2025 Mercedes C-Class: 5x112, 17-20", 7-9", ET30-50, hub 66.6
    ]

    # We need to match model_years inserted above with their IDs
    # Query back to get actual IDs
    for y in range(2020, 2026):
        # Accord — 5x114.3
        my_id = conn.execute(
            "SELECT id FROM model_years WHERE model_id = 1861 AND year = ?", (y,)
        ).fetchone()[0]
        conn.execute(
            """INSERT OR REPLACE INTO fitment_specs
               (model_year_id, bolt_pattern_id, diameter_min, diameter_max,
                width_min, width_max, offset_min, offset_max, hub_bore, load_rating_min, source)
               VALUES (?, 9, 16.0, 20.0, 7.0, 9.5, 35, 55, 64.1, 600, 'verified')""",
            (my_id,),
        )

        # Civic — 5x114.3
        my_id = conn.execute(
            "SELECT id FROM model_years WHERE model_id = 1863 AND year = ?", (y,)
        ).fetchone()[0]
        conn.execute(
            """INSERT OR REPLACE INTO fitment_specs
               (model_year_id, bolt_pattern_id, diameter_min, diameter_max,
                width_min, width_max, offset_min, offset_max, hub_bore, load_rating_min, source)
               VALUES (?, 9, 16.0, 19.0, 7.0, 9.0, 35, 50, 64.1, 600, 'verified')""",
            (my_id,),
        )

        # CR-V — 5x114.3
        my_id = conn.execute(
            "SELECT id FROM model_years WHERE model_id = 1865 AND year = ?", (y,)
        ).fetchone()[0]
        conn.execute(
            """INSERT OR REPLACE INTO fitment_specs
               (model_year_id, bolt_pattern_id, diameter_min, diameter_max,
                width_min, width_max, offset_min, offset_max, hub_bore, load_rating_min, source)
               VALUES (?, 9, 17.0, 20.0, 7.0, 9.0, 35, 50, 64.1, 650, 'verified')""",
            (my_id,),
        )

        # Mustang — 5x114.3
        my_id = conn.execute(
            "SELECT id FROM model_years WHERE model_id = 1598 AND year = ?", (y,)
        ).fetchone()[0]
        conn.execute(
            """INSERT OR REPLACE INTO fitment_specs
               (model_year_id, bolt_pattern_id, diameter_min, diameter_max,
                width_min, width_max, offset_min, offset_max, hub_bore, load_rating_min, source)
               VALUES (?, 9, 17.0, 20.0, 8.0, 10.5, 25, 45, 70.6, 700, 'verified')""",
            (my_id,),
        )

        # F-150 — 6x135
        my_id = conn.execute(
            "SELECT id FROM model_years WHERE model_id = 1605 AND year = ?", (y,)
        ).fetchone()[0]
        conn.execute(
            """INSERT OR REPLACE INTO fitment_specs
               (model_year_id, bolt_pattern_id, diameter_min, diameter_max,
                width_min, width_max, offset_min, offset_max, hub_bore, load_rating_min, source)
               VALUES (?, 19, 17.0, 22.0, 7.0, 10.0, 0, 35, 87.1, 800, 'verified')""",
            (my_id,),
        )

        # BMW 3 Series — 5x112
        my_id = conn.execute(
            "SELECT id FROM model_years WHERE model_id = 2597 AND year = ?", (y,)
        ).fetchone()[0]
        conn.execute(
            """INSERT OR REPLACE INTO fitment_specs
               (model_year_id, bolt_pattern_id, diameter_min, diameter_max,
                width_min, width_max, offset_min, offset_max, hub_bore, load_rating_min, source)
               VALUES (?, 8, 17.0, 20.0, 7.0, 9.5, 25, 45, 72.6, 650, 'verified')""",
            (my_id,),
        )

        # BMW 5 Series — 5x112
        my_id = conn.execute(
            "SELECT id FROM model_years WHERE model_id = 2600 AND year = ?", (y,)
        ).fetchone()[0]
        conn.execute(
            """INSERT OR REPLACE INTO fitment_specs
               (model_year_id, bolt_pattern_id, diameter_min, diameter_max,
                width_min, width_max, offset_min, offset_max, hub_bore, load_rating_min, source)
               VALUES (?, 8, 18.0, 21.0, 7.5, 10.0, 20, 40, 72.6, 700, 'verified')""",
            (my_id,),
        )

        # Mercedes C-Class — 5x112
        my_id = conn.execute(
            "SELECT id FROM model_years WHERE model_id = 2857 AND year = ?", (y,)
        ).fetchone()[0]
        conn.execute(
            """INSERT OR REPLACE INTO fitment_specs
               (model_year_id, bolt_pattern_id, diameter_min, diameter_max,
                width_min, width_max, offset_min, offset_max, hub_bore, load_rating_min, source)
               VALUES (?, 8, 17.0, 20.0, 7.0, 9.0, 30, 50, 66.6, 650, 'verified')""",
            (my_id,),
        )

        # Tacoma — 6x139.7
        my_id = conn.execute(
            "SELECT id FROM model_years WHERE model_id = 4720 AND year = ?", (y,)
        ).fetchone()[0]
        conn.execute(
            """INSERT OR REPLACE INTO fitment_specs
               (model_year_id, bolt_pattern_id, diameter_min, diameter_max,
                width_min, width_max, offset_min, offset_max, hub_bore, load_rating_min, source)
               VALUES (?, 20, 16.0, 18.0, 7.0, 9.0, 0, 25, 78.1, 750, 'verified')""",
            (my_id,),
        )

        # Camry — 5x114.3
        my_id = conn.execute(
            "SELECT id FROM model_years WHERE model_id = 4706 AND year = ?", (y,)
        ).fetchone()[0]
        conn.execute(
            """INSERT OR REPLACE INTO fitment_specs
               (model_year_id, bolt_pattern_id, diameter_min, diameter_max,
                width_min, width_max, offset_min, offset_max, hub_bore, load_rating_min, source)
               VALUES (?, 9, 16.0, 19.0, 7.0, 9.0, 35, 50, 64.1, 600, 'verified')""",
            (my_id,),
        )

        # RAV4 — 5x114.3
        my_id = conn.execute(
            "SELECT id FROM model_years WHERE model_id = 4748 AND year = ?", (y,)
        ).fetchone()[0]
        conn.execute(
            """INSERT OR REPLACE INTO fitment_specs
               (model_year_id, bolt_pattern_id, diameter_min, diameter_max,
                width_min, width_max, offset_min, offset_max, hub_bore, load_rating_min, source)
               VALUES (?, 9, 17.0, 19.0, 7.0, 8.5, 35, 50, 64.1, 650, 'verified')""",
            (my_id,),
        )

    conn.commit()
    conn.close()
    return path


# ─── Tests ─────────────────────────────────────────────────────────────────

class TestBoltPatterns(unittest.TestCase):
    """Bolt pattern manifest is correctly defined."""

    def test_all_patterns_have_unique_ids(self):
        ids = [bp.id for bp in BOLT_PATTERNS]
        self.assertEqual(len(ids), len(set(ids)))

    def test_all_patterns_have_unique_patterns(self):
        patterns = [bp.pattern for bp in BOLT_PATTERNS]
        self.assertEqual(len(patterns), len(set(patterns)))

    def test_lug_counts_are_valid(self):
        for bp in BOLT_PATTERNS:
            self.assertIn(bp.lugs, [4, 5, 6, 8])

    def test_pattern_map_is_complete(self):
        for bp in BOLT_PATTERNS:
            self.assertIn(bp.pattern, BOLT_PATTERN_MAP)
            self.assertEqual(BOLT_PATTERN_MAP[bp.pattern].pattern, bp.pattern)


class TestWheelCatalog(unittest.TestCase):
    """Wheel design manifest is correctly defined."""

    def test_all_designs_have_unique_codes(self):
        codes = [d.code for d in WHEEL_DESIGNS.values()]
        self.assertEqual(len(codes), len(set(codes)))

    def test_all_designs_have_series(self):
        for code, design in WHEEL_DESIGNS.items():
            self.assertIn(design.series, ["forged", "flow_formed", "three_piece"],
                          f"{code}: invalid series '{design.series}'")

    def test_all_designs_have_fitments(self):
        for code, design in WHEEL_DESIGNS.items():
            self.assertGreater(len(design.fitments), 0,
                               f"{code} has no fitments")

    def test_all_fitments_have_valid_bolt_patterns(self):
        for code, design in WHEEL_DESIGNS.items():
            for fitment in design.fitments:
                self.assertIn(fitment.bolt_pattern, BOLT_PATTERN_MAP,
                              f"{code}: invalid bolt pattern '{fitment.bolt_pattern}'")

    def test_all_fitments_have_positive_dimensions(self):
        for code, design in WHEEL_DESIGNS.items():
            for f in design.fitments:
                self.assertGreater(f.diameter, 0, f"{code}: invalid diameter")
                self.assertGreater(f.width, 0, f"{code}: invalid width")
                self.assertGreater(f.hub_bore, 0, f"{code}: invalid hub bore")
                self.assertGreater(f.load_rating, 0, f"{code}: invalid load rating")

    def test_total_fitments_count(self):
        total = sum(len(d.fitments) for d in WHEEL_DESIGNS.values())
        self.assertGreater(total, 20, "Too few fitments for a launch catalog")


class TestFitmentEngine(unittest.TestCase):
    """Core matching engine logic."""

    @classmethod
    def setUpClass(cls):
        cls.db_path = create_test_db()
        cls.engine = FitmentEngine(cls.db_path)

    @classmethod
    def tearDownClass(cls):
        cls.engine.close()
        os.unlink(cls.db_path)

    # ─── Vehicle Lookup ───────────────────────────────────────────────

    def test_get_makes(self):
        makes = self.engine.get_makes()
        self.assertIn("HONDA", makes)
        self.assertIn("TOYOTA", makes)
        self.assertIn("FORD", makes)

    def test_get_models_for_make_and_year(self):
        models = self.engine.get_models("HONDA", 2024)
        self.assertIn("Accord", models)
        self.assertIn("Civic", models)
        self.assertIn("CR-V", models)

    def test_get_models_no_results(self):
        models = self.engine.get_models("FERRARI", 2024)
        self.assertEqual(len(models), 0)

    def test_get_models_case_insensitive(self):
        models = self.engine.get_models("honda", 2024)
        self.assertIn("Accord", models)

    def test_get_vehicle_specs(self):
        specs = self.engine.get_vehicle_specs("HONDA", "Accord", 2024)
        self.assertGreater(len(specs), 0)
        spec = specs[0]
        self.assertEqual(spec.make, "HONDA")
        self.assertEqual(spec.model, "Accord")
        self.assertEqual(spec.year, 2024)
        self.assertEqual(spec.bolt_pattern, "5x114.3")
        self.assertEqual(spec.diameter_min, 16.0)
        self.assertEqual(spec.diameter_max, 20.0)
        self.assertEqual(spec.hub_bore, 64.1)

    # ─── Wheel Fits Vehicle — Criteria Tests ──────────────────────────

    def test_wheel_fits_vehicle_bolt_pattern(self):
        """Bolt pattern must match exactly."""
        spec = VehicleSpec(2024, "BMW", "3 Series", "5x112", 17, 20, 7, 9.5, 25, 45, 72.6, 650)
        # Check using the private method via find_matches
        matches = self.engine.find_matches("BMW", "3 Series", 2024)
        for m in matches:
            self.assertEqual(m.bolt_pattern, "5x112")

    def test_wheel_fits_vehicle_diameter_range(self):
        """Wheel diameter must be within vehicle range."""
        spec = VehicleSpec(2024, "HONDA", "Civic", "5x114.3", 16, 19, 7, 9, 35, 50, 64.1, 600)
        matches = self.engine.find_matches("HONDA", "Civic", 2024)
        for m in matches:
            self.assertGreaterEqual(m.diameter, 16.0)
            self.assertLessEqual(m.diameter, 19.0)

    def test_wheel_fits_vehicle_offset_range(self):
        """Wheel offset must be within vehicle range."""
        spec = VehicleSpec(2024, "BMW", "5 Series", "5x112", 18, 21, 7.5, 10, 20, 40, 72.6, 700)
        matches = self.engine.find_matches("BMW", "5 Series", 2024)
        for m in matches:
            self.assertGreaterEqual(m.offset, 20)
            self.assertLessEqual(m.offset, 40)

    def test_wheel_fits_vehicle_hub_bore(self):
        """Wheel hub bore must be >= vehicle hub bore."""
        spec = VehicleSpec(2024, "MERCEDES-BENZ", "C-Class", "5x112", 17, 20, 7, 9, 30, 50, 66.6, 650)
        matches = self.engine.find_matches("MERCEDES-BENZ", "C-Class", 2024)
        for m in matches:
            self.assertGreaterEqual(m.hub_bore, 66.6)

    def test_incompatible_bolt_pattern(self):
        """No wheels should match for a vehicle with different bolt pattern."""
        # F-150 uses 6x135 — none of our wheels should match
        matches = self.engine.find_matches("FORD", "F-150", 2024)
        self.assertEqual(len(matches), 0)

    def test_tacoma_fitment_empty(self):
        """Tacoma uses 6x139.7 — none of our launch wheels should match."""
        matches = self.engine.find_matches("TOYOTA", "Tacoma", 2024)
        self.assertEqual(len(matches), 0)

    # ─── Integration: Full Vehicle Matches ────────────────────────────

    def test_honda_accord_2024_matches(self):
        """2024 Accord should match several flow-formed wheels."""
        matches = self.engine.find_matches("HONDA", "Accord", 2024)
        self.assertGreater(len(matches), 0)
        for m in matches:
            self.assertEqual(m.bolt_pattern, "5x114.3")
            self.assertIn(m.design_nickname, {"Mob", "Striker", "Vortex", "Zenith", "Axiom"})

    def test_bmw_3series_2024_matches(self):
        """2024 BMW 3 Series should match 5x112 designs."""
        matches = self.engine.find_matches("BMW", "3 Series", 2024)
        self.assertGreater(len(matches), 0)
        for m in matches:
            self.assertEqual(m.bolt_pattern, "5x112")

    def test_ford_mustang_2024_matches(self):
        """2024 Mustang should match 5x114.3 designs with appropriate sizes."""
        matches = self.engine.find_matches("FORD", "Mustang", 2024)
        self.assertGreater(len(matches), 0)
        for m in matches:
            self.assertEqual(m.bolt_pattern, "5x114.3")
            # Mustang needs 8.0"+ width, ET25-45
            self.assertGreaterEqual(m.width, 8.0)

    def test_no_duplicate_matches(self):
        """Each (design, fitment) pair should appear at most once."""
        matches = self.engine.find_matches("HONDA", "Accord", 2024)
        keys = [f"{m.design_code}/{m.bolt_pattern}/{m.diameter}x{m.width}/ET{m.offset}"
                for m in matches]
        self.assertEqual(len(keys), len(set(keys)))

    def test_multi_year_consistency(self):
        """Same vehicle across years should return similar matches."""
        m2023 = self.engine.find_matches("HONDA", "Accord", 2023)
        m2024 = self.engine.find_matches("HONDA", "Accord", 2024)
        m2025 = self.engine.find_matches("HONDA", "Accord", 2025)
        self.assertEqual(len(m2023), len(m2024))
        self.assertEqual(len(m2024), len(m2025))

    def test_matches_sorted_by_diameter_desc(self):
        """Matches should be sorted by diameter descending."""
        matches = self.engine.find_matches("HONDA", "Accord", 2024)
        diameters = [m.diameter for m in matches]
        self.assertEqual(diameters, sorted(diameters, reverse=True))

    # ─── Direct Spec Matching ─────────────────────────────────────────

    def test_find_matches_for_spec(self):
        spec = VehicleSpec(2024, "HONDA", "Civic", "5x114.3", 16, 19, 7, 9, 35, 50, 64.1, 600)
        matches = self.engine.find_matches_for_spec(spec)
        self.assertGreater(len(matches), 0)

    def test_find_matches_for_spec_narrow_range(self):
        """Very narrow range should return fewer/filtered results."""
        spec = VehicleSpec(2024, "HONDA", "Civic", "5x114.3", 18, 18, 8, 8.5, 35, 40, 64.1, 600)
        matches = self.engine.find_matches_for_spec(spec)
        for m in matches:
            self.assertEqual(m.diameter, 18.0)

    # ─── Bolt Pattern Lookup ──────────────────────────────────────────

    def test_find_by_bolt_pattern_5x114(self):
        matches = self.engine.find_matches_by_bolt_pattern("5x114.3")
        self.assertGreater(len(matches), 0)
        for m in matches:
            self.assertEqual(m.bolt_pattern, "5x114.3")

    def test_find_by_bolt_pattern_filtered_diameter(self):
        matches = self.engine.find_matches_by_bolt_pattern("5x114.3", diameter=20)
        self.assertGreater(len(matches), 0)
        for m in matches:
            self.assertEqual(m.diameter, 20.0)

    def test_find_by_invalid_bolt_pattern(self):
        matches = self.engine.find_matches_by_bolt_pattern("99x999")
        self.assertEqual(len(matches), 0)

    # ─── Fallback Tests ──────────────────────────────────────────────

    def test_fallback_makes(self):
        engine_no_db = FitmentEngine()
        makes = engine_no_db.get_makes()
        self.assertIn("HONDA", makes)
        self.assertIn("TESLA", makes)

    def test_fallback_models(self):
        engine_no_db = FitmentEngine()
        models = engine_no_db._get_models_fallback("HONDA", 2024)
        self.assertIn("Civic", models)

    def test_fallback_models_unknown_make(self):
        engine_no_db = FitmentEngine()
        models = engine_no_db._get_models_fallback("UNKNOWN", 2024)
        self.assertEqual(len(models), 0)


class TestNHTSASeeder(unittest.TestCase):
    """NHTSA seeder script (without hitting the API)."""

    def test_schema_initialization(self):
        """Schema should initialize cleanly."""
        fd, path = tempfile.mkstemp(suffix=".db")
        os.close(fd)
        try:
            conn = sqlite3.connect(path)
            schema = Path(__file__).parent / "schema.sql"
            conn.executescript(schema.read_text())
            tables = conn.execute(
                "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
            ).fetchall()
            table_names = [t[0] for t in tables]
            self.assertIn("makes", table_names)
            self.assertIn("models", table_names)
            self.assertIn("model_years", table_names)
            self.assertIn("fitment_specs", table_names)
            self.assertIn("wheel_designs", table_names)
            self.assertIn("wheel_fitments", table_names)
            self.assertIn("bolt_patterns", table_names)

            # Check view
            views = conn.execute(
                "SELECT name FROM sqlite_master WHERE type='view' ORDER BY name"
            ).fetchall()
            view_names = [v[0] for v in views]
            self.assertIn("vehicle_fitment_view", view_names)

            conn.close()
        finally:
            os.unlink(path)


class TestVehicleSpecEdgeCases(unittest.TestCase):
    """Edge cases for the matching engine."""

    @classmethod
    def setUpClass(cls):
        cls.db_path = create_test_db()
        cls.engine = FitmentEngine(cls.db_path)

    @classmethod
    def tearDownClass(cls):
        cls.engine.close()
        os.unlink(cls.db_path)

    def test_vehicle_not_in_database(self):
        """Vehicle not in database should return empty."""
        matches = self.engine.find_matches("FERRARI", "F40", 1990)
        self.assertEqual(len(matches), 0)

    def test_year_without_fitment_specs(self):
        """Vehicle year with no fitment specs should return empty."""
        matches = self.engine.find_matches("HONDA", "Accord", 1990)
        self.assertEqual(len(matches), 0)

    def test_match_result_fields(self):
        """Match results should have all required fields."""
        matches = self.engine.find_matches("HONDA", "Accord", 2024)
        self.assertGreater(len(matches), 0)
        m = matches[0]
        self.assertTrue(hasattr(m, "design_code"))
        self.assertTrue(hasattr(m, "design_nickname"))
        self.assertTrue(hasattr(m, "series"))
        self.assertTrue(hasattr(m, "bolt_pattern"))
        self.assertTrue(hasattr(m, "diameter"))
        self.assertTrue(hasattr(m, "width"))
        self.assertTrue(hasattr(m, "offset"))
        self.assertTrue(hasattr(m, "hub_bore"))
        self.assertTrue(hasattr(m, "load_rating"))
        self.assertTrue(hasattr(m, "match_score"))
        self.assertIsNotNone(m.display_name())

    def test_display_name_format(self):
        """Display name should be human-readable."""
        matches = self.engine.find_matches("HONDA", "Accord", 2024)
        self.assertGreater(len(matches), 0)
        name = matches[0].display_name()
        self.assertIn("(", name)
        self.assertIn(")", name)
        self.assertIn("x", name)


if __name__ == "__main__":
    unittest.main()