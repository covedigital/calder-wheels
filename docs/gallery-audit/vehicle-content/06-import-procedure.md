# 06 — Content Import Procedure

> No Shopify Admin API credentials are available to this session — the **manual Admin procedure** below is the primary path. If the client later provides Admin API access, the same manifest (`03-content-manifest.json`) drives scripted imports (§5) with identical safeguards.

## 0. Preconditions (all APPROVED-GATED)
1. Phase A schema fields exist on `gallery_build` (`vehicle_color`, `wheel_design_id`, `official_calder_design`).
2. The `gallery_build` metaobject definition exists (per `docs/gallery-metaobject-setup.md`) **with web pages enabled**.
3. All 40 images uploaded to Files.

## 1. Idempotency & dedup rules (apply to every import method)
- **Stable unique identifier = entry `handle`** (manifest §`entries[].handle`).
- Import = **create-if-missing, update-if-exists** — never a blind create; re-running the manifest cannot duplicate entries.
- Before each create: search existing `gallery_build` entries for the handle; abort that entry with a report line if a **published** entry with the same handle exists (never overwrite published content without explicit approval).
- Image order preserved exactly as `gallery_images[]` array order (already the approved order: cover first).
- Every image reference validated: file exists in Files, filename matches manifest, not the excluded duplicate (`Tahoe-M-2_2.png`), and `G63-M-07_4.png` never set as `featured_image`.
- Every product reference validated against the live-store table (doc 04) before enabling CTAs.
- Failures are **collected and reported**, never silently skipped.

## 2. Manual Admin import (per entry ×12)
1. **Content → Metaobjects → Gallery Builds → Add entry.**
2. Set **handle** exactly from the manifest (idempotency depends on it).
3. Fill fields from the manifest row: `title`, `gallery_type=vehicle`, `vehicle_make/model`, `vehicle_color` (where set), `wheel_design_id`, `official_calder_design` (true/false), `wheel_model` = design code (CLM-01…), `wheel_series` = "Spun Forged".
4. `featured_image` ← the cover file; `gallery_images` ← remaining files **in manifest order** (cover first, duplicate excluded).
5. `wheel_product` ← search products for the manifest handle (e.g. `calder-clb-07-wheel`) — Shopify resolves the reference natively; do not paste URLs.
6. `featured`, `sort_order` from manifest.
7. **Save as DRAFT** (do not activate). Note the entry URL for QA.
8. Repeat; keep a running checklist of created handles vs. manifest (12/12).

## 3. Image upload validation checklist
- [ ] 40 unique files present in Files (41 on disk minus 1 duplicate); any upload failure reported with filename.
- [ ] No `Tahoe-M-2_2.png` in any `gallery_images` list.
- [ ] `G63-M-07_4.png` present in G63 list but **not** featured.
- [ ] Filenames match manifest exactly (Shopify may suffix duplicates — if a filename collision occurs, re-check against MD5 table in doc 02).

## 4. Post-import validation report (generate after import)
Per entry: handle · title · cover file · gallery file count/order · design ID · resolved product handle (from the Shopify reference, not the manifest) · draft/published · warnings. Compare against `03-content-manifest.json`; any drift = validation failure.

## 5. Scripted import (only if Admin API access is later granted)
- GraphQL `metaobjectSet/updates` (or REST) keyed on `handle`; upsert semantics per §1.
- Batch limit: files uploaded via Files API first; validate returned CDN URLs land in the entry fields.
- Dry-run mode: `--dry-run` prints creates/updates without writing; requires explicit `--publish` flag to activate anything; **never** publishes F-150 (manifest flag blocks it regardless).

## 6. Publication gate (applies to both paths)
Publish = set Active, executed **only** after: QA pass (doc 07) + client cover confirmations + F-150 decision + the mandatory client confirmation in doc 08 §1. Draft entries are invisible to the storefront (`shop.metaobjects` exposes only Active entries) — drafts are safe to leave in place indefinitely.