# 01 — Reference Gallery Analysis (Vossen & E5 Wheels)

> Audit date: 2026-11-01 · Method: static HTML/markdown fetch of rendered pages. No screenshots captured (no browser automation available in this session); observations below are VERIFIED from fetched markup. JS-behavior claims are marked as such.

## 1. Vossen — Vehicle Gallery (`vossenwheels.com/vehicle-galleries/`)

### VERIFIED OBSERVATIONS

| Aspect | Observation |
|---|---|
| Landing layout | Page title `# Vehicle Gallery` + short positioning copy ("Over 10,000 cars have been photographed… many with videos too"). Grid of cards below a `Filter` heading. |
| Nav between galleries | Persistent "Vehicle Galleries" / "Wheel Galleries" links in header mega-menu and footer. |
| Card grid | Multi-column grid; thumbnails `620x415` (~3:2 landscape), thumb `300x200`. |
| Card content | Image → linked title (`Ferrari Purosangue`) → series line (`Forged: Series 21`) → wheel model (`S21-02 (3-Piece)`). Camera icon on image (photo-count affordance). |
| Filter/search | "Filter" heading on page; detail pages link back with **URL-param facets** (`/vehicle-galleries/?fwp_gallery_make=ferrari`, `?fwp_gallery_make=ferrari,purosangue`, `?fwp_gallery_series=S21-02 (3-Piece)`) — WordPress/FishWP facet URLs, crawlable and shareable. |
| Pagination | Not observed in fetched markup (likely JS "load more" — UNVERIFIED). |
| Detail page | Full-bleed image slider (7 full-size 2000px images + matching 300x200 thumb strip), "Expand gallery" lightbox control, title, `Wheel specs →` anchor, wheel-model card with studio photo linking to the product page (`/wheel/s21-02-3-piece/`). |
| Detail specs | Front/Rear wheel sizes (`22x9.5`, `23x12`), Finish Options section with **finish swatch photography** (Center / Outer Barrel with finish name + description). |
| Related content | "Ferrari Galleries" — related builds grouped by vehicle **make**, plus cross-links to wheel galleries filtered by the same wheel model. |
| CTA | "Request a Quote" multi-step form (year/make/model + wheel specs), persistent header CTA. |
| SEO | Descriptive, keyword-rich URL slugs (`/galleries/ferrari-purosangue-series-21-s21-02-3-piece/`). Unique `<title>` per detail page. |
| Performance | Full-size 2000px images in slider; explicit thumb sizes; photo-first pages, minimal chrome. |

### Classification
- **A — Directly useful for Calder:** card anatomy (image → vehicle name → series → wheel model), camera/photo-count affordance, detail-page structure (slider + thumbs + specs + related), URL-param facets, make-grouped related galleries, wheel→product cross-link, finish swatch photography in specs.
- **B — Useful with modifications:** "Filter" as a collapsible filter header; Request-a-Quote form → Calder already has quote/inquiry flows + configurator, so the form should link there rather than duplicate.
- **C — Unsuitable:** WordPress/FishWP specifics; the mega-menu's duplicated gallery previews inside nav.

## 2. Vossen — Wheel Gallery (`vossenwheels.com/wheel-galleries/`)

### VERIFIED OBSERVATIONS
- Positioning copy: warehouse photography of **every forged set / finish before shipping**.
- **One card per finish configuration** (e.g., `GEN-22 (3-Piece)` / `Brickell Bronze`, `VPS-1` / `Patina Gold`, `G2-14` / `Gloss Clear`) — many cards per design; titles are wheel model, subtitle is series + finish name; images are studio wheel shots, same 620x415 ratio.
- Detail pages live under the same `/galleries/` route as vehicle builds.

### Classification
- **A:** finish-level organization given Calder's finish-matrix photography discipline (from `docs/discovery/inspiration-analysis.md`).
- **B:** for Calder with only 6 designs, **one-card-per-finish could yield dozens of near-duplicate cards** (3 centers × 2 barrels × 2 hardware = up to 12 configs/design). Recommend grouping per design with finish previews instead (see 06-ux-ui-spec).
- **C:** Vossen's sheer volume (100+ cards) is a scale Calder should not emulate at launch.

## 3. E5 Wheels — Vehicle Gallery (`e5wheels.com/gallery/vehicles`)

### VERIFIED OBSERVATIONS
- Page title "Corvette Gallery - E5 Wheels" — galleries organized **by vehicle name** (single-name vehicle pages).
- **LIMITATION (recorded explicitly):** the gallery grid is JavaScript-rendered; the static fetch returned only header/footer markup. Card layout, filters, sorting, pagination, and detail-page behavior **could not be verified** and are NOT described further. No functionality is invented for this reference.

### Classification
- **A:** the "one gallery page per vehicle" naming model.
- **B/C:** everything else — unverified.

## 4. Cross-reference synthesis

Both references use a dual taxonomy (vehicle-first + wheel-first), photo-first cards at ~3:2 landscape, wheel-model cross-links on detail pages, and crawlable detail URLs. Calder's differentiators (fitment finder, live configurator with BOM-backed availability, dealer portal) are absent from both — the gallery should feed those, not just showcase photos.