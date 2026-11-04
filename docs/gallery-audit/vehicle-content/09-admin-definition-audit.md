# 09 — Admin `gallery_build` Definition Audit (vs. theme code)

> Date: 2026-11-01 · Source: client's Shopify Admin screenshots (transcribed). Theme references verified in `Working Theme-via-CLI` Liquid. **The definition exists with 15 fields — do not create a duplicate.**

## 1. Field-by-field audit (15 Admin fields vs theme keys)

The theme Liquid reads these keys. Admin field **names** can be anything; **keys** must match:

| # | Admin field (screenshot) | Theme key required | Verdict |
|---|---|---|---|
| 1 | Title | `title` (detail: `entry.title`) | ✅ verify key |
| 2 | Gallery Type | `gallery_type` — values **`vehicle`** / **`wheel`** (theme gates listings on this; unset defaults to `vehicle`) | ✅ verify key + values |
| 3 | Vehicle Year | `vehicle_year` | ✅ verify key |
| 4 | Vehicle Make | `vehicle_make` | ✅ verify key |
| 5 | Vehicle Model | `vehicle_model` | ✅ verify key |
| 6 | Vehicle Color | `vehicle_color` | ✅ verify key |
| 7 | Design Code | `design_code` (drives PDP deep-link CTA) | ✅ verify key |
| 8 | Design ID | `wheel_design_id` (Admin-side organization only — theme does not read it in Liquid) | ✅ verify key |
| 9 | Official Design | `official_calder_design` (VGC-3 gating) | ✅ verify key |
| 10 | **Wheel Model / Series (ONE field)** | theme reads **`wheel_model` AND `wheel_series` separately** | ⚠ **MISMATCH — split into two fields (see §2.1)** |
| 11 | Product | `wheel_product` (product reference) | ✅ verify key |
| 12 | Featured Image | `featured_image` (file) | ✅ verify key |
| 13 | Gallery Images | `gallery_images` (list of files — **correct type**) | ✅ verify key |
| 14 | Featured | `featured` | ✅ verify key |
| 15 | Display Order | `sort_order` (integer) | ✅ verify key |

**Fields the theme reads but Admin doesn't have** — all render **safely blank** (no template changes needed): `overall_finish`, `construction`, `front_wheel_size`, `bolt_pattern`, `weight`, `load_rating`, `description`, `tire_brand`, `fitment_notes`, `image_2/3`, `center/lip/hardware_finish`, `seo_title/seo_description`. None are required for the 12-vehicle launch. Optional adds only if you want FINISH SHOWN / spec rows populated.

## 2. Required corrections (before creating entries)

### 2.1 Split "Wheel Model / Series" into TWO fields  ⚠ the one real fix
- Theme card/detail use `build.wheel_model.value` and `build.wheel_series.value` **separately**. A single combined field leaves `wheel_series` empty everywhere (card sub-line, detail series eyebrow, related-galleries matching).
- **Fix:** rename field 10 to **Wheel Model** (key `wheel_model`), then **add** a new field **Wheel Series** → Single line text → key `wheel_series`.

### 2.2 Web page settings (Content/SEO section of the definition)
- **Page title → select `Title`** (currently "no field selected" — entries would publish with empty `<title>`).
- **Meta description →** no eligible field exists yet. **Recommended:** add one field **SEO Description** → Single line text → key `seo_description`, then select it here. (Optional but cheap; satisfies the Phase-E SEO requirement. Entries can leave it blank.)
- **Web page handle `gallery-builds` → keep as-is** (agreed: don't change without a redirect plan).
- **Theme template "No theme template" → resolve after theme push** (see §3).

### 2.3 Metaobject display name (Admin list view)
- Your §4 recommendation is **correct**: set the definition's *display name* field to **Title** so Admin lists entries by name ("Cadillac Escalade M-07"), not by their numeric `sort_order` value. This is separate from the `Display Order` data field, which stays.

## 3. Answers to "Required review" (§1–7 of your notes)

1. **Web page publication configured correctly?** Yes — Active/draft ✓, Publish as web pages ✓, Enable in Online Store ✓. Two gaps: **Page title not selected** (§2.2) and **no theme template assigned** (see #2).
2. **Compatible detail template in theme?** **Yes — `templates/metaobject.gallery_build.liquid`** exists in the repo (renders `{% section 'calder-gallery-detail' %}`). It is **not on the live store yet** (you haven't pushed). After your push, re-open the definition's web-page settings — the template should become selectable ("metaobject" / "calder-gallery-detail"). If Shopify doesn't detect it, create the template file as `metaobject.gallery_builds.liquid` (plural type) with the same one-line include — Shopify's metaobject template naming follows the definition type.
3. **How are entry URLs generated?** Per your Admin example: `https://wvpnpr-t7.myshopify.com/pages/gallery-builds/{entry-handle}`. Theme cards prefer `build.system.url` (this URL) and fall back to `/pages/gallery-build?build=<handle>` — both routes render the same detail section, so either works.
4. **Set Page title to `Title`?** **Yes** (§2.2).
5. **Add SEO meta description field?** **Recommended** — one new single-line field `seo_description` (§2.2), then select it. Keep entries free to leave it blank.
6. **Can entries publish + render through the theme?** Yes — once the theme is pushed (template becomes available) and entries are Active, listing + detail render with zero further code changes.
7. **Change the web-page handle?** **No** — keep `gallery-builds`.

## 4. Answers to "Required OpenCode audit" (§1–10 of your notes)

1. All 15 fields correctly configured? **14/15 — field 10 must be split (§2.1).**
2. Actual field keys: **not visible in screenshots — verify in Admin** (expand each field; keys must equal the table in §1).
3. Existing entries? **No — step 3 not started (confirmed by you).** Safe to add fields now, before any entries exist.
4. Draft/active: n/a yet. Active-draft status is Enabled ✓ — drafts are storefront-invisible (`shop.metaobjects` exposes only Active).
5. Listing template queries this metaobject? **Yes** — `sections/calder-vehicle-gallery.liquid` loops `shop.metaobjects.gallery_build.values`.
6. Detail uses native web pages? **Yes** — `templates/metaobject.gallery_build.liquid` (+ `/pages/gallery-build?build=` compat route).
7. Filtering uses Gallery Type? **Yes** — `gtype == gallery_type` gate (lines 17–18); use exactly `vehicle`/`wheel`.
8. Product references → universal PDPs? **Verified live 2026-11-01**: 201→`calder-clm-01-wheel`, 202→`calder-clm-02-wheel`, 203→`calder-clm-03-wheel`, 207→`calder-clb-07-wheel` (all 200, correct design tags).
9. Display-name config correction? **Yes** — set to `Title` (§2.3).
10. Additional fields genuinely required? **Only `wheel_series` (§2.1).** Optional: `seo_description` (§2.2). Nothing else — avoid further schema changes.

## 5. Note on your image rename (`vehicle-gallery-*` prefix)

No breakage: `gallery_images` fields reference uploaded **files by picker**, not by filename string. Two effects:
- `03-content-manifest.json` filenames are now **advisory for ordering only** — when populating each entry, pick the `vehicle-gallery-*` files in the manifest order (cover `_1` first, duplicate `_2` of Tahoe excluded).
- Contact sheets still reference the original local files — unaffected.

## 6. Go/No-Go for Step 3 (creating the 12 draft entries)

**GO after:** (a) split field 10 → `wheel_model` + `wheel_series`; (b) verify all keys match §1; (c) set display name → `Title`; (d) Page title → `Title`; (e) push the theme so the metaobject template exists.
**Then:** create the 12 entries as **Draft** per manifest (handles must match exactly — they're the idempotency keys), F-150 with `official_calder_design=false`, Design Code/ID/Product left **blank**. Publish only after QA + the F-150/§11 approvals.

**Launch considerations (§7) status:** design assignments confirmed (your table = manifest) ✓ · products live-verified ✓ · 40 images uploaded ✓ · covers = `_1` per folder pending your visual confirm · gallery type `vehicle` ✓ · no fitment claims in content ✓ · F-150 approval **pending** · detail rendering QA **pending theme push** · draft invisibility ✓ by Active/draft design.