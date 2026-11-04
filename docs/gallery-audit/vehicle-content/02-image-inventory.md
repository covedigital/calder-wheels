# 02 — Vehicle Image Inventory (40 images)

> Source: `docs/design/mockups/vehicles/Photo Shoot/` · Method: `sips` (dimensions), `stat` (size), `md5` (duplicates). **LIMITATION (explicit):** this agent cannot visually inspect images (no image-input support) — visual-composition judgments (three-quarter vs close-up, wheel visibility, lighting) are **deferred to client review via the per-folder contact sheets** (`contact-sheets/*.html`). Cover defaults to `_1.png` per folder pending that review, per the instruction not to auto-select `_1` *without* visual assessment — assessment must be human.

## Global findings

- **40/41 images are 2560×1440 (16:9 landscape, PNG)** — perfectly uniform for the 3:2 card crop and detail hero (safe crop, no upscaling needed).
- **1 duplicate pair:** `Tahoe M-2/Tahoe-M-2_2.png` ≡ `Tahoe-M-2_1.png` (identical MD5 `b697380eb14463c7fd0b5dc0c2e65453`) → Tahoe M-2 has **3 unique** images; `_2` should be dropped from the gallery list (keep on disk).
- **1 low-res outlier:** `G63 M-07/G63-M-07_4.png` is **940×482** (1.1 MB) vs 2560×1440 siblings. Fine as a thumbnail, but must never be a detail hero. Flagged.
- **All PNG**, ~200 MB total. Upload originals to Shopify Files unmodified — Shopify CDN transforms on delivery (`image_url` width params in the theme handle responsive sizes); no recompression or upscaling required or performed.

## Per-image inventory

| # | Folder / file | W×H | Size (MB) | MD5 (short) | Notes |
|---|---|---|---|---|---|
| 1 | Escalade M-07/Escalade-M-07_1.png | 2560×1440 | 5.5 | 16021656 | **Proposed cover** (pending review) |
| 2 | Escalade M-07/Escalade-M-07_2.png | 2560×1440 | 5.6 | 2a4752b5 | secondary |
| 3 | Escalade M-07/Escalade-M-07_3.png | 2560×1440 | 5.2 | d8cd2c75 | secondary |
| 4 | Escalade V 01/Escalade-V-01_1.png | 2560×1440 | 5.8 | c6e53b9b | **Proposed cover** (pending review) |
| 5 | Escalade V 01/Escalade-V-01_2.png | 2560×1440 | 5.2 | c101f865 | secondary |
| 6 | Escalade V 01/Escalade-V-01_3.png | 2560×1440 | 5.4 | 6a742167 | secondary |
| 7 | Escalade V 01/Escalade-V-01_4.png | 2560×1440 | 5.8 | c4f90b0b | secondary |
| 8 | Escalde M-01/Escalade-M-01_1.png | 2560×1440 | 6.0 | 846c32af | **Proposed cover** (pending review) |
| 9 | Escalde M-01/Escalade-M-01_2.png | 2560×1440 | 4.9 | 3d9737c0 | secondary |
| 10 | Escalde M-01/Escalade-M-01_3.png | 2560×1440 | 4.7 | dd032f66 | secondary |
| 11 | Escalde M-01/Escalade-M-01_4.png | 2560×1440 | 5.0 | 1e50a72f | secondary |
| 12 | Escalde M-01/Escalade-M-01_5.png | 2560×1440 | 6.1 | 746c4875 | secondary |
| 13 | Escalde M-01/Escalade-M-01_6.png | 2560×1440 | 6.2 | 2d22dd1a | secondary |
| 14 | Escalde V White/Escalade-V-White_1.png | 2560×1440 | 5.6 | f7539e06 | **Proposed cover** (pending review) |
| 15 | Escalde V White/Escalade-V-White_2.png | 2560×1440 | 5.2 | d0437e6d | secondary |
| 16 | Escalde V White/Escalade-V-White_3.png | 2560×1440 | 5.3 | d4e3740e | secondary |
| 17 | F150 Raptor/F150-Raptor_1.png | 2560×1440 | 6.2 | e76e22de | **Proposed cover** (pending review) |
| 18 | F150 Raptor/F150-Raptor_2.png | 2560×1440 | 5.6 | 2079f13b | secondary |
| 19 | F150 Raptor/F150-Raptor_3.png | 2560×1440 | 5.7 | ba3fc722 | secondary |
| 20 | G63 M-07/G63-M-07_1.png | 2560×1440 | 4.9 | 2b6ec86c | **Proposed cover** (pending review) |
| 21 | G63 M-07/G63-M-07_2.png | 2560×1440 | 5.7 | 31e4da3d | secondary |
| 22 | G63 M-07/G63-M-07_3.png | 2560×1440 | 4.6 | 6ed2c7dc | secondary |
| 23 | G63 M-07/G63-M-07_4.png | **940×482** | 1.1 | 8c2c1cb1 | ⚠ LOW-RES — thumbnail only, never hero |
| 24 | Range Rover M-07/Range-Rover-M-07_1.png | 2560×1440 | 6.0 | 6eb68929 | **Proposed cover** (pending review) |
| 25 | Range Rover M-07/Range-Rover-M-07_2.png | 2560×1440 | 4.7 | 8b63932e | secondary |
| 26 | Range Rover M-07/Range-Rover-M-07_3.png | 2560×1440 | 6.2 | d9d9669a | secondary |
| 27 | Silverado Black/Silverado-Black_1.png | 2560×1440 | 6.1 | dae33786 | **Proposed cover** (pending review) |
| 28 | Silverado Black/Silverado-Black_2.png | 2560×1440 | 6.1 | 510aa50d | secondary |
| 29 | Silverado Black/Silverado-Black_3.png | 2560×1440 | 6.4 | 7be43ec8 | secondary |
| 30 | Silverado Red/Silverado-Red_1.png | 2560×1440 | 5.8 | f805fe26 | **Proposed cover** (pending review) |
| 31 | Silverado Red/Silverado-Red_2.png | 2560×1440 | 5.3 | 042806c0 | secondary |
| 32 | Tahoe Black/Tahoe-Black_1.png | 2560×1440 | 5.7 | ede78a5a | **Proposed cover** (pending review) |
| 33 | Tahoe Black/Tahoe-Black_2.png | 2560×1440 | 5.2 | b0cce1f2 | secondary |
| 34 | Tahoe Black/Tahoe-Black_3.png | 2560×1440 | 5.0 | f3f1ecfc | secondary |
| 35 | Tahoe M-2/Tahoe-M-2_1.png | 2560×1440 | 5.8 | b697380e | **Proposed cover** (pending review) |
| 36 | Tahoe M-2/Tahoe-M-2_2.png | 2560×1440 | 5.8 | b697380e | ⚠ **DUPLICATE of #35 — exclude from gallery** |
| 37 | Tahoe M-2/Tahoe-M-2_3.png | 2560×1440 | 5.5 | 7e3bb1f7 | secondary |
| 38 | Tahoe M-2/Tahoe-M-2_4.png | 2560×1440 | 6.2 | e8d99fd1 | secondary |
| 39 | Tahoe White M-02/Tahoe-White-M-02_1.png | 2560×1440 | 6.2 | 4fa5cf3f | **Proposed cover** (pending review) |
| 40 | Tahoe White M-02/Tahoe-White-M-02_2.png | 2560×1440 | 5.5 | 38a9abbe | secondary |
| 41 | Tahoe White M-02/Tahoe-White-M-02_3.png | 2560×1440 | 6.2 | 24dbacc8 | secondary |

*(41 files listed; #36 excluded from the 40-unique import set.)*

## Cover image recommendations (Phase-Four listing thumbnails)

| Entry | Proposed cover | Rationale |
|---|---|---|
| All 12 entries | folder `_1.png` | Uniform 2560×1440 16:9 → clean 3:2 card crop; filename convention suggests lead shot. **Held for client visual confirmation** — open `contact-sheets/<folder>.html` and reply "cover OK" or name the preferred file per folder. Full-vehicle shots should be preferred over wheel close-ups per the brief; visually confirm `_1` is a full-vehicle three-quarter where possible. |

## Image processing recommendations
- **Preserve originals** — no edits made; sources untouched.
- Delivery: upload PNGs to Shopify Files; the theme requests CDN-transformed widths (850/400 cards, 1900 hero, 180 thumbs) via `image_url` — automatic format/quality negotiation, no manual recompression.
- `G63-M-07_4.png` (940×482): acceptable in the gallery list (thumb renders fine at 180px), but **must not** be set as `featured_image`.
- Alt text: derive from entry title (`"2026 Cadillac Escalade on Calder CLB-07 wheels"` pattern) — set in metaobject fields, not filenames.