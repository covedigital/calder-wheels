# Wheel Gallery Entries — Review + Admin Procedure (2026-11-15)

Companion to `wheel-entry-data-sheet.json` (six DRAFT wheel-type `gallery_build` entries, one per design).
Source of truth for every pre-filled value: `docs/architecture/calder_design_registry.json` (design id, series,
construction, fitment groups) + the live product metafields (`products_export_1.csv` — bolt pattern lists).
**Do not import until you have reviewed the `REVIEW`/`SUPPLY` fields.**

## 1. What you are reviewing (per entry)

| Field | Status |
|---|---|
| `handle` | **REVIEW** — proposed `{design}-gloss-black`; rename freely (kebab-case, unique, permanent) |
| `bolt_pattern` | Pre-filled from the design product metafields — confirm these match the build you will photograph |
| `center_finish` / `lip_finish` / `hardware_finish` / `front_wheel_size` | Pre-filled with the design default configuration (22" × Gloss Black × Gloss Black Lip × Chrome Bolts). **You choose the options you want depicted** — any PDP-vocabulary combination is valid; the images must show exactly this configuration |
| `overall_finish` | Human-readable summary of the above — keep in sync if you change the options |
| `wheel_offset` + `center_bore` | **REVIEW — REQUIRED INPUT**: pick ONE offset/bore pair from the listed options (they correspond to the design's registry fitment groups). The pair must match the build in the photos. Multi-pattern designs: if you later add entries depicting other configurations, one entry per configuration |
| `cover_image` + `gallery_images` | **SUPPLY (manual media task)** — upload per the media policy; filenames are proposals |
| Everything else | Pre-filled, authoritative — no changes needed |

## 2. Admin prerequisites (once, before creating any entry)

1. **Add two metaobject definition fields** to `gallery_build`: `wheel_offset` (single-line text), `center_bore`
   (single-line text). Every other field the theme reads already exists on the definition.
2. **Backfill `bolt_pattern` on the existing 12 vehicle entries** — required for the VEHICLES WITH THIS WHEEL
   match rule (§4). Values from the fitment sheet:

   | Vehicle entry handle | bolt_pattern |
   |---|---|
   | cadillac-escalade-m-07 | 6x139 |
   | cadillac-escalade-v-01 | 6x139 |
   | cadillac-escalade-m-01 | 6x139 |
   | cadillac-escalade-v-white | 6x139 |
   | ford-f-150-raptor | 6x135 |
   | mercedes-benz-g63-m-07 | 5x130 |
   | range-rover-m-07 | 5x120 |
   | chevrolet-silverado-black | 6x139 |
   | chevrolet-silverado-red | 6x139 |
   | chevrolet-tahoe-black | 6x139 |
   | chevrolet-tahoe-m-2 | 6x139 |
   | chevrolet-tahoe-white-m-02 | 6x139 |

   (F-150 Raptor publication remains gated per the existing procedure — backfilling the field does not publish it.)

## 3. Pairing rule (theme-enforced on the details page)

> A wheel entry correlates to vehicle entries with the **same design** (`wheel_model`) **and** a
> bolt pattern contained in the wheel entry's `bolt_pattern` list — and vice versa.

- **Create one first, and vice versa:** when you create a wheel entry, confirm at least one matching vehicle
  entry exists (same design + compatible pattern); if not, create the vehicle entry first — the Theme Editor
  preview shows a dashed hint telling you exactly which counterpart is missing. The same applies in reverse
  when creating vehicle entries.
- Either side missing a bolt pattern degrades gracefully to a design-only match (nothing is hidden for
  legacy data), but a wheel entry WITH patterns never pulls a vehicle entry that has none.

## 4. After the first wheel entry exists

1. Create the entry per the reviewed sheet (handle exact) → publish when QA passes.
2. Re-point the wheel gallery's static CLM-01 block: Theme Editor → Wheel Gallery → the CLM-01 block →
   **Gallery Build metaobject handle** = the reviewed handle (e.g. `clm-01-gloss-black`). The card activates
   automatically — it is intentionally inert until then.
3. The block's new intake fields (Center finish / Barrel & lip finish / Hardware & rivet finish / Offset /
   Center bore) mirror the metaobject fields for static-block consistency.

## 5. What the theme already does with this data

- Details page: renders the entry's configuration (FINISH SHOWN), specs grid (now including OFFSET and
  CENTER BORE for wheel entries), and the **VIEW THIS CONFIGURATION** PDP deep link with the entry's exact
  options preselected (`design_code` + size + finishes).
- VEHICLES WITH THIS WHEEL: pulls vehicle entries by the §3 pairing rule (max 4). Wheel mini on vehicle
  details mirrors it (max 5).
- Empty results show a truthful "coming soon" note to shoppers + the dashed create-the-counterpart hint to
  you inside the Theme Editor.
