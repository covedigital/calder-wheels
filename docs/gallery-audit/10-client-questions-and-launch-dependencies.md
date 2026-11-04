# 10 — Client Questions & Launch Dependencies

## 1. Launch blockers (P0)
1. **Vehicle photography** — how many real installation photos exist at launch, and for which vehicles? (Vehicle Gallery cannot launch empty; even 3–6 strong builds suffice.)
2. **Photo ownership/permissions** — confirmation of rights to publish each customer vehicle photo (and wheel studio shots).
3. **Which galleries launch** — confirm both Vehicle + Wheel go live, or Wheel-only first (6 studio shots minimum).
4. **Finish + spec data per entry** — for each build: diameter, center/barrel/hardware finishes (registry vocabulary), bolt pattern, front/rear sizes, tire info if shown. The metaobject schema fields are only as good as this data.
5. **Shopify Admin confirmation** — authorize/confirm creation of the `gallery_build` metaobject definition + entries (theme code cannot create Admin schemas). Who owns this: client staff or us via Admin access?
6. **Metaobject web pages** — approve enabling web pages on the definition (needed for SEO detail URLs). Also confirm the live theme version matches the repo (BUG-07) before fixes ship.
7. **`style_filter_values` vocabulary** — the canonical "Wheel Style" list (e.g., Split-Spoke, Mesh, Multi-Piece…) used by Shop by Style. Currently empty; the facet cannot work without it.
8. **`apex-201` removal** — approve deleting the legacy Design-201/Apex block (BUG-04) once registry-correct entries exist.

## 2. Important decisions (P1)
9. **Wheel Gallery organization** — approve one-card-per-design with finish-swatch previews (vs. one card per finish config; would be ~12 cards/design).
10. **Card → PDP behavior** — approve deep links with configuration preselected + the "reference only, availability confirmed on product page" microcopy (doc 07 G-2).
11. **Filter URL persistence** — shareable URL-param filter state (Vossen-style) vs. current stateless client filtering.
12. **Detail canonical route** — metaobject URL as canonical vs. `?build=` page (recommend metaobject).
13. **Content management responsibility** — who authors/unpublishes/reorders Gallery Builds in Admin post-launch? Recommend documenting the workflow alongside `docs/gallery-metaobject-setup.md`.
14. **Inventory source** — when to flip `calder_inventory_source` from `demo` to the real QuickBooks feed (affects PDP states the gallery links into; independent of gallery code).

## 3. Optional enhancements (P2 — not launch blockers)
15. Video support on detail pages (Vossen has it; field + lazy iframe).
16. Customer-submitted builds — intake flow + moderation policy needed before accepting UGC.
17. "Load more" vs numbered pagination (current numbered pagination is fine at launch scale).
18. Photo-count badge / camera icon on cards.
19. Social sharing buttons + copy-link on detail.
20. Vehicle-param preselection into the fitment finder from gallery cards.
21. Finish-level "warehouse photography" entries (Vossen wheel-gallery model) once finish-matrix photography exists.

Unanswered P2/P1 questions do **not** block launch; only items 1–8 do.