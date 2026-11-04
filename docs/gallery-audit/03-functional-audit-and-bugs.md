# 03 — Functional Audit & Bugs

> Mode: read-only. Findings combine static theme inspection with fetched renderings of the live pages (2026-11-01). JavaScript-runtime behaviors that could not be executed are marked UNVERIFIED-RUNTIME.

## Live-page verification

### `/pages/vehicle-gallery` (VERIFIED)
Hero header, `VEHICLE GALLERY | WHEEL GALLERY` tabs, search input, filter selects (Make, Model, Wheel Model, Diameter, Finish, Bolt Pattern, Series, Wheel Style), RESET, sort (Featured / Name A–Z / Name Z–A), fitment CTA band — all render. **Zero cards.** "No matching gallery items. Try another filter." is genuinely visible here.

### `/pages/wheel-gallery` (VERIFIED)
Same chrome. **Exactly one card**: "Design 201 / X5 12 SERIES / Black" → `/products/apex-201`. The empty-state message appears in the fetched HTML alongside the card; whether JS hides it at runtime could not be verified without a browser (UNVERIFIED-RUNTIME). See BUG-03 for why the message/card coexistence is suspicious.

## Root cause of the "empty galleries"

**Primary cause (VERIFIED): no `gallery_build` metaobjects exist in the store, and the fallback blocks are empty/unconfigured.**

Evidence chain:
1. Both listings loop `shop.metaobjects.gallery_build.values` first (`sections/calder-vehicle-gallery.liquid:15-24`; `sections/calder-wheel-gallery.liquid:15-24`). `docs/gallery-metaobject-setup.md:3` explicitly frames creating the metaobject in Shopify Admin as a **pending manual step** — theme code cannot create Admin schemas.
2. `templates/page.vehicle-gallery.json` has **no `blocks` key** → server renders an empty grid → `calder-gallery-v2.js` computes `visible.length === 0` → `empty.hidden = false` → *"No matching gallery items."*
3. `templates/page.wheel-gallery.json` has **exactly one** `wheel_build` block → exactly the one card observed live ("Design 201").
4. Corroboration: `sections/calder-gallery-detail.liquid:40` ("Gallery item not found / Choose a published Gallery Build entry") + an unconfigured fallback block in `templates/page.gallery-build.json` — consistent with zero metaobject entries.

**Ruled out with evidence:** JS fetch failures (there are no fetches in the listing path — all server-rendered), `is_published` gating (no such flag referenced in Liquid), stale references, conditional rendering bugs. NOT an intended empty state.

**Secondary cause (VERIFIED code bug):** see BUG-01/BUG-03 below — the hide/show logic is broken by CSS, so even once content exists, filtering/pagination will misbehave.

## Confirmed issues

### BUG-01 — `[hidden]` defeated by CSS (P0 once content exists; P1 now)
- **File:** `assets/calder-gallery-v2.css:2`
- **Evidence:** `.calder-gallery-grid__item{display:block;…}` overrides the UA `[hidden]{display:none}` rule. `calder-gallery-v2.js` hides cards via `c.hidden=true`, which **cannot work**. Filtered-out / paginated-out / out-of-search cards will stay visible.
- **Expected:** hidden cards disappear. **Actual:** they remain rendered.
- **Fix:** add `.calder-gallery-grid__item[hidden]{display:none!important}` (or remove `display:block` from the author rule).
- **Dependencies:** none. Smallest-viable-change compliant.

### BUG-02 — v1 CSS loaded on v2 pages (P1)
- **File:** `layout/theme.liquid:93,98` loads `calder-gallery.css` (787 LOC v1 styles incl. `.calder-gallery-empty`) on `vehicle-gallery`, `wheel-gallery`, `gallery-build` suffixes; `theme.liquid:99` loads `calder-gallery-detail.css` on the metaobject route — both alongside v2 CSS.
- **Effect:** duplicate/conflicting stylesheet payload (~25 KB dead CSS per gallery page), cascade ambiguity.
- **Fix:** remove those `stylesheet` loads after verifying no v1 class usage on those routes.

### BUG-03 — Empty state can coexist with cards (P1, UNVERIFIED-RUNTIME)
- Live wheel-gallery HTML contains both the card and the "No matching gallery items" text (server-rendered `hidden` attribute state is not represented in a static fetch). If JS `visible.length` is 0 while a card displays — which BUG-01 makes possible in the opposite direction — the page shows a card *and* "no matching" simultaneously. Requires browser QA after BUG-01 fix.

### BUG-04 — Legacy product reference in the only wheel-gallery block (P0 for launch)
- **File:** `templates/page.wheel-gallery.json:6-16` — block `wheel_build_DL76hM` links `detail_url: shopify://products/apex-201`.
- **Expected:** card links to a registry design (`/products/calder-{design}-wheel`) or a gallery detail entry. **Actual:** links to a legacy "Apex 201" product that predates the 6-design system; the card's "X5 12 SERIES / Design 201" copy doesn't match registry naming (`CLB/CLM-01…07`, "Design 201"→design 201 mapping in `calder-demo-inventory.js:91-94`).
- **Fix:** replace with a `gallery_build` entry or a registry-correct block; delete the Apex reference.

### BUG-05 — Hand-rolled query-string parsing in detail section (P1)
- **File:** `sections/calder-gallery-detail.liquid:3-5` — `split:'&'` + `kv[0]=='build'`. Breaks on extra params/order/URL-encoding; no distinction between "not published" and "bad handle".
- **Fix:** robust parsing loop or Liquid `url_param` equivalent pattern; distinct 404-style messaging.

### BUG-06 — `style_filter_values` theme setting unfilled (P1)
- Both listing templates expose `style_filter_values` ("comma-separated canonical style values used by Shop by Wheel Style") but it is empty in both `page.*.json` files → the Wheel Style facet has no vocabulary and can never match.

### BUG-07 — Deployed-version skew risk (P0 to resolve before any fix ships)
- Backup sections (`*.backup-102226`) contain *different* empty-state markup and messages ("No Matching Wheels Found"; persistent setup notice). If the live store is running an older theme upload, live behavior will diverge from repo HEAD. **Action:** verify live theme version via Shopify Admin before implementing.

### BUG-08 — `page.gallery.json` is invalid JSON (P2)
- Comment header (`// ...`) inside a JSON template file. Also a competing legacy gallery page reachable at `/pages/gallery`.

### BUG-09 — Detail fields drift from documented schema (P2)
- `calder-gallery-detail.liquid:26-37` reads `image_2`, `image_3`, `wheel_style`, `bolt_pattern`, `weight`, `load_rating` — none in `docs/gallery-metaobject-setup.md` field list. Admin-entered data will silently not render unless the definition includes them.

## 24-point functional checklist (current state)

| # | Check | Status |
|---|---|---|
| 1 | Initial rendering | PASS (chrome renders) |
| 2 | Data loading | FAIL — no `gallery_build` entries exist |
| 3 | Card generation | FAIL (vehicle: 0 cards) / PARTIAL (wheel: 1 stale card) |
| 4 | Search | Code present; UNVERIFIED-RUNTIME |
| 5 | Filter controls | Render; options JS-derived from cards |
| 6 | Simultaneous filters | Code present; broken hide behavior (BUG-01) |
| 7 | Filter reset | RESET control present |
| 8 | Sort | Featured/A–Z/Z–A present |
| 9 | Empty states | Message exists but conflated with zero-content (BUG-03) |
| 10 | Broken images | n/a (no cards); placeholder path exists in card snippet |
| 11 | Aspect ratios | Fixed via CSS — verify after content |
| 12 | Card navigation | Vehicle: none; Wheel: → legacy `apex-201` (BUG-04) |
| 13 | Detail rendering | Not-found path renders; real entries UNVERIFIABLE (no data) |
| 14 | Product links | Missing registry deep-link params from gallery (gap, not bug) |
| 15 | Back/forward nav | Filters don't touch URL (see 07-integration §gap) |
| 16 | URL param persistence | None for filters; `?build=` only on detail |
| 17–19 | Mobile/tablet/desktop | Structural classes present; full QA pending content |
| 20 | Accessibility | Selects are semantic; labels are duplicated word ("MakeMake") in fetched HTML — verify label/option rendering; ARIA on slider UNVERIFIED |
| 21 | JS errors | None detectable statically |
| 22 | Liquid errors | None observed |
| 23 | Performance | BUG-02 dead CSS; 457 KB unused registry asset present in theme (not loaded) |
| 24 | Missing Shopify data | **The core failure** — Admin metaobjects never created |

## Severity-ranked fix order
1. **Create & populate `gallery_build` metaobjects in Shopify Admin** (P0, unblocks everything).
2. BUG-01 `[hidden]` CSS fix (P0, one line).
3. BUG-04 legacy Apex block (P0).
4. BUG-07 live-vs-repo version verification (P0 process step).
5. BUG-02, BUG-05, BUG-06, BUG-09 (P1).
6. BUG-03 runtime verification + BUG-08 (P1–P2, bundled into implementation Phase B).