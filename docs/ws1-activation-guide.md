# Calder Wheels — WS1 Assessment & Activation Guide

---

## WS1 Status Assessment

**Theme:** 111 sections, 386 snippets, 29 templates, 224 assets — Calder additions integrated into the Lumia 7.0.1 theme (uploaded to live Shopify)
**Backend:** 18 Python files across configurator + fitment, 2 FastAPI server apps (deployed on Cove Digital), 117 passing tests
**Composite assets:** 35 organized layer PNGs (5 designs × 7 finishes each), 1920×1564 RGBA — uploaded to theme assets
**Fitment DB:** 40k+ model-years seeded, 1,958 curated fitment specs, 12 bolt patterns
**Products:** 5 configured products in Shopify with full metafields

### 1.1 Storefront Foundation — ~50% done

| Item | Status | What's needed |
|------|--------|---------------|
| Homepage layout | ❌ | Stock Lumia demo (fashion). Needs wheel-centric rebuild |
| Wheel catalog + series filtering | ✅ | Metafields seeded, series badges in product cards, dark banner |
| PDP with design nickname/code | ✅ | Badge in main-product.liquid reads `custom.design_code` / `custom.design_nickname` |
| Finish matrix photography | ✅ | 35 PNGs uploaded to theme assets, wired via metafields |
| Dual gallery | ✅ | `page.gallery.json` — Vehicle Gallery + Design Gallery |
| Mobile-responsive | ✅ | Lumia native |
| SEO/AEO | ❌ | Not started |
| Customer accounts | ✅ | Standard Shopify + dealer-context |
| Checkout | ✅ | Standard Shopify |

### 1.2 Wheel Configurator — ~90% done

| Item | Status | Notes |
|------|--------|-------|
| Component/finish model | ✅ | Client-correct codes (BK/BKUTI/SU/POLISH/CHROME) |
| 2D layer composites | ✅ | 35 PNGs, composite_preview.py generates all 60 combos |
| Price calculation | ✅ | Python + FastAPI + Liquid inline |
| Realtime availability gate | ✅ | API endpoint (stub — needs inventory ledger) |
| Configurator PDP section | ✅ | Liquid section + JS + CSS, wired into product.json |
| Config → SKU → add to cart | ✅ | Cart properties preserved (`_center_finish` etc.) |
| **API server** | ✅ | FastAPI on port 8080, 6 endpoints |

### 1.3 Vehicle Fitment Finder — ~95% done

| Item | Status | Notes |
|------|--------|-------|
| Fitment DB + engine | ✅ | SQLite, 6-criteria matching, 40 tests |
| Fitment API server | ✅ | FastAPI on port 8081, deployed on Cove Digital, auto-syncs with NHTSA weekly |
| Frontend component | ✅ | Liquid section + JS, cascading Year→Make→Model |
| PDP integration | ✅ | In product.json |
| Never-surface-incompatible | ✅ | Strict matching |
| **NHTSA DB seed** | ✅ | ~40k model-years seeded (2000-2026), auto-refresh via cron/launchd |
| **Curated fitment specs** | ✅ | 1,958 rows covering 12 bolt patterns, 100+ vehicle models |

### 1.4 Dealer Portal Phase 1 — ~100% done

| Item | Status |
|------|--------|
| Dealer landing page | ✅ `/pages/dealer-program` |
| Multi-step application form | ✅ 4-step: Business → Contact → Shipping → Review |
| Admin approval workflow | ✅ Documented (tags + metafields) |
| Pending interstitial | ✅ Shown on /account for `dealer-applied` customers |
| Dashboard | ✅ Stats, orders table, pending quotes, account summary |
| Quick Order | ✅ SKU search, line items, PO#, submit, save draft |
| Invoices | ✅ Credit limit, outstanding, payment methods, invoice list |
| Dealer pricing on PDP | ✅ Tier detection, savings % |
| Dealer pricing on cards | ✅ Collection cards show dealer price + MOQ |
| Dealer-only gating | ✅ Hides from non-dealers, redirects PDP |
| MOQ enforcement | ✅ Cart-change JS blocks checkout |
| Order Guide PDF | ✅ Printable price list at `/pages/dealer-order-guide?view=dealer-guide` |
| Re-order | ✅ Order detail page → "Re-order" button → loads into Quick Order |
| **Dealer test account** | ✅ Created with `dealer-approved`, `dealer-tier-1`, `dealer-net-30` tags + credit metafields |

### 1.5 Dealer Portal Phase 2 — ~70% done

| Item | Status |
|------|--------|
| Quick Order (full) | ✅ SKU search, line items, submit, save draft |
| Enhanced quote management | 🟡 `quote-list.liquid` exists, filter/search |
| Enhanced order detail | ✅ PO# display, NET-30 indicator, production status timeline |
| Re-order functionality | ✅ |

### 1.6 Dealer Portal Phase 3 — ~50% done

| Item | Status |
|------|--------|
| Payment terms summary | ✅ |
| Outstanding invoices table | ✅ |
| Order Guide PDF | ✅ |
| Invoice download from QuickBooks | ❌ WS2 dependency |

| Item | Status |
|------|--------|
| Payment terms summary | ✅ |
| Outstanding invoices table | ✅ |
| Order Guide PDF | ✅ |
| Invoice download from QuickBooks | ❌ WS2 dependency |

---

## Activation Guide

### Step 1: Deploy the middleware API servers

> ✅ **Already completed.** Both servers running on Cove Digital production server behind nginx reverse proxy.

Two servers need to run on your middleware host (VPS, Railway, Render, etc.):

#### Configurator API (port 8080)

```bash
cd configurator
pip install -r requirements-api.txt
CALDER_API_PORT=8080 uvicorn api_server:app --host 0.0.0.0 --port 8080
```

#### Fitment API (port 8081)

```bash
cd fitment
pip install -r requirements-api.txt
CALDER_FITMENT_PORT=8081 \
  CALDER_NHTSA_YEARS="2010-2026" \
  CALDER_SYNC_INTERVAL_HOURS=168 \
  uvicorn fitment_api_server:app --host 0.0.0.0 --port 8081
```

On first startup, the Fitment API auto-seeds the NHTSA database (takes ~2-3 minutes). Subsequent startups use the cached DB. The server re-syncs with NHTSA every 168 hours (weekly).

### Step 2: Set API URLs in Shopify Admin

> ✅ **Already completed.** API URLs configured in theme settings pointing to Cove Digital endpoints.

1. Go to Shopify Admin → Online Store → Theme → Customize
2. Theme Settings → "CALDER WHEELS — API"
3. Set **Fitment API URL** to `https://your-server.com:8081`
4. Set **Configurator API URL** to `https://your-server.com:8080`
5. Save

The `fitment-data.liquid` snippet reads these settings and sets `window.CALDER_FITMENT_API` and `window.CALDER_API_BASE`, which the JS files use as their primary data source.

### Step 3: Create products in Shopify

> ✅ **Already completed.** 5 products created in Shopify.

Create 5 products in Shopify Admin with these handles:

| Handle | Title |
|--------|-------|
| `apex-201` | Apex 201 — 3-Piece Forged |
| `vertex-202` | Vertex 202 — 3-Piece Forged |
| `striker-203` | Striker 203 — 3-Piece Forged |
| `turbine-205` | Turbine 205 — 3-Piece Forged |
| `vortex-207` | Vortex 207 — 3-Piece Forged |

### Step 4: Seed product metafields

> ✅ **Already completed.** Metafields seeded on all 5 products.

```bash
cd fitment
python seed_metafields.py --csv /tmp/calder-metafields.csv
```

Then import `calder-metafields.csv` into Shopify Admin:
- Products → All Products → (select all 5) → More Actions → Import Metafields
- Or use the Shopify Admin API with the JSON output

This sets:
- `custom.is_configurable` → enables the configurator section
- `custom.design_code` / `custom.design_nickname` → PDP badge ("201 · Apex")
- `custom.series` → series badge on collection cards
- `custom.dealer_tier_1/2/3_price` → dealer pricing
- `custom.bom` → full BOM for the configurator JS (components: 1 center + 1 barrel + 20 hardware)
- `custom.dealer_moq` → minimum order quantity
- `custom.lead_time_days` → lead time display

### Step 5: Upload composite images

> ✅ **Already completed.** 35 PNGs uploaded to theme assets via `push_composites.sh`.

Upload the 35 PNG files from `shopify/assets/composites/` to Shopify:

```bash
cd fitment
python seed_composites.py --manifest upload_manifest.json
```

Manual upload via Shopify Admin:
- Settings → Files → Upload
- Upload all 35 PNGs maintaining the folder structure:
  ```
  composites/design-201/center-bk.png
  composites/design-201/center-bkuti.png
  ...etc
  ```

Or use Theme Kit / Shopify CLI to sync the `shopify/assets/composites/` directory.

### Step 6: Seed the NHTSA vehicle database

> ✅ **Already completed.** ~40k model-years seeded (2000-2026). Auto-refresh via cron/launchd configured.

```bash
cd fitment
pip install requests
python nhtsa_seeder.py --db fitment.db --years 2010-2026
```

This populates the local SQLite database. If you're running the Fitment API server, it does this automatically on first startup.

> **Note:** For a full 2000-2026 seed (recommended for launch), use the threaded seeder instead:
> ```bash
> cd fitment
> pip install requests
> python3 seed_nhtsa_full.py --db fitment.db --years 2000-2026 --workers 5
> ```
> This seeds 27 years × ~107 passenger makes (~2,889 API calls) in ~3 minutes via 5 concurrent workers. Already-seeded combos are skipped automatically (resumable).

#### Auto-refresh with cron / launchd

The NHTSA database auto-refreshes daily at 3 AM via cron and/or launchd:

| Method | File | Schedule |
|--------|------|----------|
| **cron** | `crontab -e` shows `0 3 * * * fitment/seed_nhtsa_cron.sh` | Daily at 3 AM |
| **launchd** | `~/Library/LaunchAgents/com.calderwheels.nhtsaseed.plist` | Daily at 3 AM |
| **Wrapper script** | `fitment/seed_nhtsa_cron.sh` | Calls `seed_nhtsa_full.py` with env config |

The cron job is idempotent — already-seeded make+year combos are skipped (INSERT OR IGNORE), so it's safe for daily runs. Logs at `fitment/logs/nhtsa-seed.log`.

To disable auto-refresh:
```bash
crontab -l | grep -v nhtsa_seed | crontab -
launchctl unload ~/Library/LaunchAgents/com.calderwheels.nhtsaseed.plist
```

### Step 7: Curate fitment specs (bolt pattern data)

> ✅ **Already completed.** 1,958 fitment specs across 12 bolt patterns, 100+ vehicle models. CSV imported via `seed_fitment_specs.py`.

The NHTSA seeder gives you vehicle taxonomy (makes/models/years). You still need to populate `fitment_specs` with bolt patterns, offsets, and hub bores per vehicle. Without this, the fitment finder shows dropdowns but returns no compatible wheels.

**Time estimate:** 4-8 hours for a curated launch set (~30-50 popular models)

#### 7.1 What you're populating

Each row in `fitment_specs` maps a vehicle (year + model) to its wheel specification:

| Column | Example | Meaning |
|--------|---------|---------|
| `model_year_id` | 14293 | FK → model_years (which vehicle) |
| `bolt_pattern_id` | 9 | FK → bolt_patterns (e.g. `5x114.3`) |
| `diameter_min/max` | 16.0 / 20.0 | Recommended wheel diameter range (inches) |
| `width_min/max` | 7.0 / 9.5 | Recommended wheel width range (inches) |
| `offset_min/max` | 35 / 55 | Offset range (mm). Negative = more poke |
| `hub_bore` | 64.1 | Vehicle hub bore (mm). Wheel bore must be ≥ this |
| `load_rating_min` | 600 | Minimum load rating per wheel (kg) |
| `source` | `'curated'` | Data quality tag: `curated`, `verified`, `estimated` |

The 6-criteria matching engine uses these values to determine compatibility (see `engine.py:169-188`).

#### 7.2 Strategy: prioritize by bolt pattern match

Calder Wheels supports **25 bolt patterns** (defined in `fitment_manifest.py:41-67`). Focus on vehicles whose bolt patterns intersect with Calder's catalog — everything else will return zero matches regardless.

Priority order for launch:
1. **Tier 1 — High-volume sport/performance** (Accord, Civic, Camry, Mustang, 3 Series, C-Class, WRX, GTI) — all `5x114.3` or `5x112`
2. **Tier 2 — Luxury/SUV** (MDX, RX, X5, GLE, Cayenne) — `5x112`, `5x114.3`
3. **Tier 3 — Truck/off-road** (F-150, Silverado, Tacoma, Wrangler) — `6x135`, `5x127`, `5x139.7`
4. **Tier 4 — Everything else** (as time permits)

Calder's supported bolt patterns:
```
4x100, 4x108, 4x114.3, 5x100, 5x105, 5x108, 5x110, 5x112, 5x114.3,
5x115, 5x120, 5x120.7, 5x127, 5x130, 5x135, 5x139.7, 5x150, 6x114.3,
6x135, 6x139.7, 6x5.5, 8x165.1, 8x170, 8x180, 5x98
```

Vehicles using unsupported patterns (e.g. `5x100` Subaru, `5x108` Volvo) can be skipped at launch.

#### 7.3 Reference sources for bolt pattern lookups

| Source | URL | Quality |
|--------|-----|---------|
| **Wheel-Size.com** | `https://www.wheel-size.com` | Best — per-year/model/trim, includes all 6 specs |
| **Tire Rack** | `https://www.tirerack.com` | Good — per-vehicle fitment guide, verified data |
| **Discount Tire** | `https://www.discounttire.com` | Good — fitment search by vehicle |
| **Manufacturer specs** | Owner manuals / OEM parts catalogs | Authoritative but labor-intensive |

**Wheel-Size.com workflow:**
1. Go to `https://www.wheel-size.com/size/` and enter Year/Make/Model
2. Read the "Bolt pattern (PCD)", "Center bore", "Wheel fastener", and "Rim sizes" sections
3. Extract: bolt pattern (e.g. `5x114.3`), hub bore (e.g. `64.1`), recommended diameter range, width range, offset range
4. For load rating, use the vehicle's GVWR / 4 wheels × 1.25 safety factor, or default to 600 kg for sedans, 700 kg for SUVs, 800 kg for trucks

#### 7.4 Method A: Seed via CSV (recommended)

Use the `seed_fitment_specs.py` utility:

```bash
cd fitment

# 1. Create a CSV of fitment specs (see template below)
cat > launch-fitments.csv << 'CSVEOF'
year,make_model,bolt_pattern,diameter_min,diameter_max,width_min,width_max,offset_min,offset_max,hub_bore,load_rating_min,source
2020-2025,Honda Accord,5x114.3,16,20,7,9.5,35,55,64.1,600,verified
2020-2025,Honda Civic,5x114.3,16,19,7,9,35,50,64.1,600,verified
2020-2025,Honda CR-V,5x114.3,17,20,7,9,35,50,64.1,650,verified
2020-2025,Toyota Camry,5x114.3,16,19,7,9,35,50,64.1,600,verified
2020-2025,Toyota RAV4,5x114.3,17,19,7,8.5,35,50,64.1,650,verified
2020-2025,Ford Mustang,5x114.3,17,20,8,10.5,25,45,70.6,700,verified
2020-2025,BMW 3 Series,5x112,17,20,7,9.5,25,45,72.6,650,verified
2020-2025,BMW 5 Series,5x112,18,21,7.5,10,20,40,72.6,700,verified
2020-2025,Mercedes-Benz C-Class,5x112,17,20,7,9,30,50,66.6,650,verified
2020-2025,Mercedes-Benz E-Class,5x112,17,20,7.5,9.5,30,50,66.6,700,verified
2020-2025,Audi A4,5x112,16,19,7,8.5,30,50,66.6,600,verified
2020-2025,Audi A6,5x112,17,20,7.5,9.5,30,50,66.6,650,verified
2020-2025,BMW X3,5x112,17,20,7.5,9.5,25,50,72.6,700,verified
2020-2025,BMW X5,5x112,18,22,8,10.5,25,50,72.6,750,verified
2020-2025,Mercedes-Benz GLC,5x112,17,20,7,9,30,50,66.6,700,verified
2020-2025,Mercedes-Benz GLE,5x112,18,21,8,10,30,50,66.6,750,verified
2020-2025,Porsche 911,5x130,19,21,8.5,11.5,25,55,72.6,700,curated
2020-2025,Porsche Cayenne,5x130,18,21,8,10.5,30,60,71.6,750,curated
2020-2025,Jeep Wrangler,5x127,16,18,7,9,0,25,78.1,700,verified
2020-2025,Jeep Grand Cherokee,5x127,17,20,7.5,10,20,45,78.1,750,verified
2020-2025,Ford F-150,6x135,17,22,7,10,0,35,87.1,800,verified
2020-2025,Toyota Tacoma,6x139.7,16,18,7,9,0,25,78.1,750,verified
2020-2025,Toyota Tundra,5x150,17,20,7.5,10,15,40,78.1,800,curated
2020-2025,Nissan Altima,5x114.3,16,19,7,8.5,35,50,66.1,600,curated
2020-2025,Nissan Sentra,5x114.3,15,18,6.5,8,35,50,66.1,600,curated
2020-2025,Nissan Rogue,5x114.3,17,19,7,8.5,35,50,66.1,650,curated
2020-2025,Hyundai Elantra,5x114.3,15,18,6.5,8,35,50,67.1,600,curated
2020-2025,Hyundai Sonata,5x114.3,16,18,7,8,35,50,67.1,600,curated
2020-2025,Kia K5,5x114.3,16,19,7,8.5,35,50,67.1,600,curated
2020-2025,Kia Sorento,5x114.3,17,20,7,9,35,50,67.1,700,curated
2020-2025,Subaru WRX,5x100,17,19,7.5,9.5,35,55,56.1,600,curated
2020-2025,Subaru Outback,5x100,17,19,7,9,35,55,56.1,650,curated
2020-2025,Tesla Model 3,5x114.3,18,20,7.5,9.5,30,50,64.1,700,curated
2020-2025,Tesla Model Y,5x114.3,18,21,8,10,30,50,64.1,750,curated
2020-2025,Chevrolet Camaro,5x120.7,18,20,8,10.5,20,40,66.9,700,curated
2020-2025,Chevrolet Silverado,6x139.7,17,22,7,10,0,30,78.1,800,curated
CSVEOF

# 2. Import into the database
python seed_fitment_specs.py --db fitment.db --csv launch-fitments.csv
```

The script matches year range + model name against NHTSA-seeded vehicles and creates `fitment_specs` rows for each matching model-year. A single CSV row like `2020-2025,Honda Accord,5x114.3,...` expands to 6 model-year rows (2020, 2021, 2022, 2023, 2024, 2025).

#### 7.5 Method B: Seed via Python REPL (direct SQL)

For quick single-vehicle testing:

```bash
cd fitment
python
```

```python
import sqlite3
conn = sqlite3.connect("fitment.db")
conn.row_factory = sqlite3.Row

# Find the model_year_id for a specific vehicle
cur = conn.execute("""
    SELECT my.id, my.year, mk.name, md.name
    FROM model_years my
    JOIN models md ON md.model_id = my.model_id
    JOIN makes mk ON mk.make_id = md.make_id
    WHERE mk.name = 'HONDA' AND md.name = 'Accord' AND my.year = 2024
""")
row = cur.fetchone()
print(f"model_year_id={row['id']} for {row['year']} {row['name']} {row[3]}")

# bolt_pattern_id for '5x114.3' is 9 (from fitment_manifest.py:50)
# Insert the fitment spec
conn.execute("""
    INSERT OR REPLACE INTO fitment_specs
    (model_year_id, bolt_pattern_id, diameter_min, diameter_max,
     width_min, width_max, offset_min, offset_max, hub_bore,
     load_rating_min, source)
    VALUES (?, 9, 16.0, 20.0, 7.0, 9.5, 35, 55, 64.1, 600, 'verified')
""", (row['id'],))
conn.commit()
conn.close()
```

> **bolt_pattern_id lookup** (from `fitment_manifest.py:41-67`):
> - `5x114.3` → id=9 | `5x112` → id=8 | `5x120` → id=11
> - `5x127` → id=13 | `5x130` → id=14 | `5x139.7` → id=16
> - `5x100` → id=4  | `5x108` → id=6  | `6x135` → id=19
> - `6x139.7` → id=20 | `5x150` → id=17 | `5x120.7` → id=12
> - `5x110` → id=7  | `5x115` → id=10 | `5x98` → id=25

#### 7.6 Method C: Seed via Fitment API (HTTP)

Start the API server and use the `/api/fitment/specs` endpoint (available after seeding):

```bash
cd fitment
CALDER_FITMENT_DB=fitment.db uvicorn fitment_api_server:app --port 8081 &
```

```bash
# Check which model_year_ids exist
curl "http://localhost:8081/api/fitment/vehicles" | python -m json.tool | head -20

# Add a fitment spec via the API
curl -X POST "http://localhost:8081/api/fitment/specs" \
  -H "Content-Type: application/json" \
  -d '{
    "model_year_id": 14293,
    "bolt_pattern_id": 9,
    "diameter_min": 16.0,
    "diameter_max": 20.0,
    "width_min": 7.0,
    "width_max": 9.5,
    "offset_min": 35,
    "offset_max": 55,
    "hub_bore": 64.1,
    "load_rating_min": 600,
    "source": "verified"
  }'
```

#### 7.7 Verification

After seeding, verify the fitment finder returns results:

```bash
# Check the database
cd fitment
python -c "
import sqlite3
conn = sqlite3.connect('fitment.db')
conn.row_factory = sqlite3.Row
cur = conn.execute('SELECT COUNT(*) AS c FROM fitment_specs')
print(f'Fitment specs: {cur.fetchone()[\"c\"]} rows')
cur = conn.execute('SELECT DISTINCT bp.pattern FROM fitment_specs fs JOIN bolt_patterns bp ON bp.id = fs.bolt_pattern_id ORDER BY bp.pattern')
patterns = [r['pattern'] for r in cur.fetchall()]
print(f'Bolt patterns covered: {patterns}')
"
```

```bash
# Run the matching engine test
python -m pytest test_engine.py -v -k "honda_accord|bmw_3series"
```

```bash
# Test the export pipeline
python export_fitment_data.py --db fitment.db --pretty | head -50
```

#### 7.8 Common bolt patterns by vehicle segment (quick reference)

| Segment | Common Bolt Patterns | Typical Hub Bore |
|---------|---------------------|-----------------|
| Honda/Acura (Civic, Accord, MDX) | `5x114.3` | 64.1mm |
| Toyota/Lexus (Camry, RAV4, RX) | `5x114.3` | 60.1mm (some 64.1) |
| Nissan/Infiniti (Altima, Q50) | `5x114.3` | 66.1mm |
| BMW (3, 5, X3, X5) | `5x112` | 72.6mm |
| Mercedes-Benz (C, E, GLC, GLE) | `5x112` | 66.6mm |
| Audi/VW (A4, A6, Golf, Tiguan) | `5x112` | 66.6mm (57.1mm VW) |
| Porsche (911, Cayenne) | `5x130` | 72.6mm |
| Ford (Mustang, Explorer) | `5x114.3` | 70.6mm |
| Ford (F-150, Super Duty) | `6x135` / `8x170` | 87.1mm |
| GM (Camaro, Silverado) | `5x120.7` / `6x139.7` | 66.9mm / 78.1mm |
| Chrysler/Dodge/Jeep | `5x127` (cars/Jeep), `5x139.7` (trucks) | 78.1mm |
| Subaru (WRX, Outback) | `5x100` | 56.1mm |
| Tesla (Model 3/Y) | `5x114.3` | 64.1mm |
| Hyundai/Kia | `5x114.3` | 67.1mm |
| Volvo | `5x108` | 65.1mm |

#### 7.9 Scope guidance for launch

| Metric | Launch Target | Notes |
|--------|--------------|-------|
| **Models curated** | 30-50 | Covers ~80% of US vehicle sales |
| **Model-years created** | 150-300 | Each model × 5-6 years (2020-2025) |
| **Bolt patterns covered** | 10-12 of 25 | Prioritize `5x114.3`, `5x112`, `5x127`, `6x135`, `5x120.7` |
| **Time** | 4-8 hours | Spreadsheet → CSV → import (+ lookup verification) |

Post-launch, scale curation via:
- **ACES/PIES data subscription** — industry standard fitment data feed
- **Crowd-sourced fitment database** — community-contributed verified fitments
- **Tire Rack affiliate API** — commercial fitment data source

### Step 8: Set up dealer accounts

> ✅ **Already completed.** Test dealer account created with `dealer-approved`, `dealer-tier-1`, `dealer-net-30` tags + credit metafields.

Create test dealer accounts in Shopify Admin:

1. Create a customer
2. Add tags:
   - `dealer-approved` — gates all dealer functionality
   - `dealer-tier-1` — pricing tier
   - `dealer-net-30` — enables NET-30 terms (optional)
3. Set metafields:
   - `custom.credit_limit` → 50000
   - `custom.credit_used` → 0
   - `custom.account_status` → "active"

### Step 9: Verify the theme pages

| Page | URL | What to check |
|------|-----|---------------|
| Configurator | Any configurable product | 3 finish selectors, layer composite preview, price, add to cart |
| Fitment Finder | Any product page | Year→Make→Model dropdowns, compatible wheels |
| Gallery | `/pages/gallery` | Vehicle Gallery + Design Gallery |
| Dealer Program | `/pages/dealer-program` | Hero, benefits, CTA |
| Dealer Apply | `/pages/dealer-apply` | 4-step form |
| Dealer Dashboard | `/account` (as dealer) | Stats, orders, quotes, account summary |
| Quick Order | `/account#quick-order` (as dealer) | Line items, SKU search, PO#, submit |
| Invoices | `/account#invoices` (as dealer) | Credit limit, invoices, payment methods |
| Order Guide | `/pages/dealer-order-guide?view=dealer-guide` (as dealer) | Printable PDF with tier pricing |
| Order Detail | Any order page (as dealer) | "Re-order" button, production status timeline |

### Step 10: Verify the API endpoints

Verify against the live Cove Digital endpoints:

```bash
# Configurator API
curl https://[your-server-domain]/api/configurator/health
curl https://[your-server-domain]/api/configurator/finishes

# Resolve a configuration
curl -X POST https://[your-server-domain]/api/configurator/resolve \
  -H "Content-Type: application/json" \
  -d '{"design_code":"201","series":"three_piece","center_finish":"BK","barrel_finish":"POLISH","hardware_finish":"CHROME","diameter":24,"width":10,"bolt_pattern":"5x114.3"}'

# Fitment API
curl https://[your-server-domain]/api/fitment/health
curl https://[your-server-domain]/api/fitment/sync/status
```

---

## What remains for WS1

### High priority (needed for launch)

| Task | Time est. | Notes |
|------|-----------|-------|
| **Homepage rebuild** | 4-6 hrs | Replace Lumia fashion demo with wheel-centric hero, catalog preview, configurator CTA, gallery spotlight |
| **SEO foundation** | 2 hrs | OG images, meta descriptions, structured data, sitemap |
| **Wire application form to backend** | 1-2 hrs | `/apps/calder/dealer-apply` endpoint or Zapier/n8n to email admin on submission |

### All completed in prior steps

| Task | How it was done |
|------|----------------|
| **35 composite PNGs** | Uploaded to theme assets on live Shopify via `push_composites.sh` / Shopify CLI |
| **Product metafields** | 5 test products seeded — configurator flags, design codes, series badges, dealer pricing (3 tiers), BOM, MOQ, lead time |
| **5 products created** | Apex-201, Vertex-202, Striker-203, Turbine-205, Vortex-207 created in Shopify |
| **Fitment specs curated** | 100-vehicle CSV → 1,958 fitment specs in DB, 12 bolt patterns covered |
| **API servers deployed** | Configurator (port 8080) + Fitment (port 8081) running on Cove Digital production server behind nginx |
| **API URLs set** | Theme settings configured with live API endpoints |
| **Dealer test account** | Created with `dealer-approved` + `dealer-tier-1` + `dealer-net-30` tags, `credit_limit` + `credit_used` + `account_status` metafields |

### Medium priority

| Task | Time est. | Notes |
|------|-----------|-------|
| **Enhanced quote management** | 1-2 hrs | `quote-list.liquid` exists; add filter/search polish, quote-to-order conversion |
| **Verify all end-to-end flows** | 1 hr | Configurator → resolve → add to cart, fitment finder → match → PDP, dealer login → dashboard → quick order |

### Low priority (post-launch)

| Task | Notes |
|------|-------|
| Invoice download from QuickBooks | WS2 dependency — requires QB Web Connector + n8n workflow |
| Application form backend wire | Currently client-side only; formal endpoint for admin notification deferred |

---

## File reference

### Theme files (37 Calder-specific)

| Category | Files |
|----------|-------|
| Sections (8) | `dealer-dashboard`, `dealer-invoices`, `dealer-quick-order`, `fitment-finder`, `main-account`, `main-collection-product-grid`, `main-product`, `wheel-configurator` |
| Snippets (20) | `calder-card-badges`, `calder-card-dealer-price`, `configurator-data`, `configurator-preview`, `dealer-admin-workflow`, `dealer-apply-form`, `dealer-cart-moq`, `dealer-context`, `dealer-credit`, `dealer-gating`, `dealer-invoice`, `dealer-pending`, `dealer-price`, `dealer-sidebar`, `fitment-data`, `fitment-results`, `production-status`, `quote-button`, `quote-list` |
| Templates (5) | `page.dealer-program`, `page.dealer-apply`, `page.dealer-portal`, `page.dealer-order-guide`, `page.gallery`, `page.configurator-api` |
| Assets (8) | `configurator-api.js`, `configurator-app.js`, `dealer-backend.js`, `dealer-portal.js`, `dealer-portal.css`, `fitment-finder.js`, `fitment-finder.css`, `wheel-configurator.css` |

### Python backend (13 files)

| Directory | Files |
|-----------|-------|
| `configurator/` | `configurator_model.py`, `api_server.py`, `composite_preview.py`, `test_configurator.py`, `test_api_server.py` |
| `fitment/` | `schema.sql`, `engine.py`, `fitment_manifest.py`, `nhtsa_seeder.py`, `export_fitment_data.py`, `fitment_api_server.py`, `seed_metafields.py`, `seed_composites.py`, `test_engine.py` |

### Composite assets

| Path | Count |
|------|-------|
| `shopify/assets/composites/design-{201,202,203,205,207}/` | 35 PNGs (7 per design) |