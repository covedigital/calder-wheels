"""
Calder Wheels — Configurator API Server Tests

Tests all API endpoints against the FastAPI server using TestClient.
Covers: resolve, availability, price, finishes, designs, health, error cases.
"""

import os
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from configurator_model import CLIENT_DESIGNS, CENTER_FINISHES, get_all_designs

try:
    from fastapi.testclient import TestClient
    from api_server import app
except ImportError:
    # Tests will be skipped if fastapi isn't installed
    app = None
    TestClient = None


@unittest.skipIf(TestClient is None, "fastapi not installed (pip install fastapi uvicorn)")
class TestAPIHealth(unittest.TestCase):
    """Health check and basic connectivity."""

    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    def test_health(self):
        resp = self.client.get("/api/configurator/health")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data["status"], "ok")
        self.assertEqual(data["service"], "calder-wheels-configurator")


@unittest.skipIf(TestClient is None, "fastapi not installed")
class TestAPIDesigns(unittest.TestCase):
    """GET /api/configurator/designs"""

    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    def test_returns_all_designs(self):
        resp = self.client.get("/api/configurator/designs")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn("designs", data)
        self.assertEqual(len(data["designs"]), 5)

    def test_each_design_has_required_fields(self):
        resp = self.client.get("/api/configurator/designs")
        designs = resp.json()["designs"]
        for d in designs:
            self.assertIn("code", d)
            self.assertIn("nickname", d)
            self.assertIn("series", d)
            self.assertIn("configurable_components", d)

    def test_design_codes_match(self):
        resp = self.client.get("/api/configurator/designs")
        codes = {d["code"] for d in resp.json()["designs"]}
        self.assertEqual(codes, {"201", "202", "203", "205", "207"})


@unittest.skipIf(TestClient is None, "fastapi not installed")
class TestAPIFinishes(unittest.TestCase):
    """GET /api/configurator/finishes"""

    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    def test_returns_all_finish_types(self):
        resp = self.client.get("/api/configurator/finishes")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn("center", data)
        self.assertIn("barrel", data)
        self.assertIn("hardware", data)

    def test_center_finish_count(self):
        resp = self.client.get("/api/configurator/finishes")
        self.assertEqual(len(resp.json()["center"]), 3)

    def test_barrel_finish_count(self):
        resp = self.client.get("/api/configurator/finishes")
        self.assertEqual(len(resp.json()["barrel"]), 2)

    def test_hardware_finish_count(self):
        resp = self.client.get("/api/configurator/finishes")
        self.assertEqual(len(resp.json()["hardware"]), 2)

    def test_finish_has_id_and_name(self):
        resp = self.client.get("/api/configurator/finishes")
        for type_key in ["center", "barrel", "hardware"]:
            for f in resp.json()[type_key]:
                self.assertIn("id", f)
                self.assertIn("name", f)
                self.assertIn("category", f)

    def test_finish_categories(self):
        resp = self.client.get("/api/configurator/finishes")
        categories = {f["category"] for f in resp.json()["center"]}
        self.assertIn("standard", categories)
        self.assertIn("premium", categories)


@unittest.skipIf(TestClient is None, "fastapi not installed")
class TestAPIResolve(unittest.TestCase):
    """POST /api/configurator/resolve"""

    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    def test_resolve_forged_config(self):
        resp = self.client.post("/api/configurator/resolve", json={
            "design_code": "201",
            "series": "three_piece",
            "center_finish": "BK",
            "barrel_finish": "POLISH",
            "hardware_finish": "CHROME",
            "diameter": 24.0,
            "width": 10.0,
            "bolt_pattern": "5x114.3",
        })
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data["finished_sku"], "201-24-BK-POLISH-CHROME")
        self.assertAlmostEqual(data["total_retail"], 1450.00)
        self.assertEqual(len(data["bom"]), 3)
        self.assertEqual(len(data["composite_layers"]), 3)

    def test_resolve_returns_composite_paths(self):
        resp = self.client.post("/api/configurator/resolve", json={
            "design_code": "207",
            "series": "three_piece",
            "center_finish": "BKUTI",
            "barrel_finish": "BK",
            "hardware_finish": "BK",
            "diameter": 22.0,
            "width": 9.0,
            "bolt_pattern": "5x112",
        })
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        for layer in data["composite_layers"]:
            self.assertIn("path", layer)
            self.assertIn("design-207", layer["path"])
            self.assertIn("z_index", layer)

    def test_resolve_with_size_suffix(self):
        resp = self.client.post("/api/configurator/resolve", json={
            "design_code": "201",
            "series": "three_piece",
            "center_finish": "BK",
            "barrel_finish": "POLISH",
            "hardware_finish": "CHROME",
            "diameter": 22.0,
            "width": 9.0,
            "bolt_pattern": "5x114.3",
            "size_suffix": "22x9",
        })
        data = resp.json()
        for layer in data["composite_layers"]:
            self.assertIn("22x9", layer["path"])

    def test_resolve_incomplete_config(self):
        resp = self.client.post("/api/configurator/resolve", json={
            "design_code": "201",
            "series": "three_piece",
            "center_finish": "BK",
            "diameter": 24.0,
            "width": 10.0,
            "bolt_pattern": "5x114.3",
        })
        self.assertEqual(resp.status_code, 400)

    def test_resolve_invalid_series(self):
        resp = self.client.post("/api/configurator/resolve", json={
            "design_code": "201",
            "series": "invalid",
            "center_finish": "BK",
            "barrel_finish": "POLISH",
            "hardware_finish": "CHROME",
            "diameter": 24.0,
            "width": 10.0,
            "bolt_pattern": "5x114.3",
        })
        self.assertEqual(resp.status_code, 400)

    def test_resolve_case_insensitive_finishes(self):
        """Finishes should be uppercased by the API."""
        resp = self.client.post("/api/configurator/resolve", json={
            "design_code": "201",
            "series": "three_piece",
            "center_finish": "bk",
            "barrel_finish": "polish",
            "hardware_finish": "chrome",
            "diameter": 24.0,
            "width": 10.0,
            "bolt_pattern": "5x114.3",
        })
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.json()["finished_sku"], "201-24-BK-POLISH-CHROME")


@unittest.skipIf(TestClient is None, "fastapi not installed")
class TestAPIAvailability(unittest.TestCase):
    """POST /api/configurator/available"""

    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    def test_available_returns_true(self):
        resp = self.client.post("/api/configurator/available", json={
            "design_code": "201",
            "series": "three_piece",
            "center_finish": "BK",
            "barrel_finish": "POLISH",
            "hardware_finish": "CHROME",
            "diameter": 24.0,
            "width": 10.0,
            "bolt_pattern": "5x114.3",
        })
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertTrue(data["is_orderable"])
        self.assertIn("finished_sku", data)
        self.assertIn("lead_time", data)

    def test_available_incomplete(self):
        resp = self.client.post("/api/configurator/available", json={
            "design_code": "201",
            "series": "three_piece",
            "center_finish": "BK",
            "diameter": 24.0,
            "width": 10.0,
            "bolt_pattern": "5x114.3",
        })
        self.assertEqual(resp.status_code, 400)


@unittest.skipIf(TestClient is None, "fastapi not installed")
class TestAPIPrice(unittest.TestCase):
    """POST /api/configurator/price"""

    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    def test_price_returns_breakdown(self):
        resp = self.client.post("/api/configurator/price", json={
            "design_code": "201",
            "series": "three_piece",
            "center_finish": "BK",
            "barrel_finish": "POLISH",
            "hardware_finish": "CHROME",
            "diameter": 24.0,
            "width": 10.0,
            "bolt_pattern": "5x114.3",
        })
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertAlmostEqual(data["total_retail"], 1450.00)
        self.assertAlmostEqual(data["total_dealer"], 1015.00)  # 70% of retail
        self.assertIn("bom", data)
        for item in data["bom"]:
            self.assertIn("retail_price", item)
            self.assertIn("quantity", item)


if __name__ == "__main__":
    unittest.main()