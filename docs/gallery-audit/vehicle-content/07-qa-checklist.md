# 07 — QA Checklist (pre-publish test plan)

> Status: **NOT EXECUTED** — content does not exist yet (import is approval-gated). This is the test plan to run after Phases A–D of doc 05. Each row lists the 20 scenarios required by the brief with pass criteria; P0 rows gate publication.

| # | Scenario (brief ref) | Method | Pass criteria | Pri |
|---|---|---|---|---|
| 1 | Every card → correct detail | Click all 12 cards | `?build=<handle>` or metaobject URL renders that entry (title+cover match) | P0 |
| 2 | Detail shows correct images | Visual | Only that folder's files, in manifest order | P0 |
| 3 | Image order | Visual vs manifest | `gallery_images[]` order preserved | P1 |
| 4 | Thumbnail selection | Click each thumb | Hero swaps; counter updates; aria-pressed moves | P1 |
| 5 | Full-screen viewing | Click hero / Esc / ←→ | Lightbox opens, navigates, focus trapped, Esc restores focus | P1 |
| 6 | Manufacturer filter | Select each make (Cadillac/Chevrolet/Ford/Mercedes-Benz/Land Rover) | Correct subset; F-150 appears under Ford only | P0 |
| 7 | Model filter | Select model after make | Make→Model dependency holds (2026-11-01 JS); correct subset | P0 |
| 8 | Wheel design filter | Select each design code (CLM-01/02/03, CLB-07) | Correct subset; **F-150 never appears under any design filter** (empty wheel key) | P0 |
| 9 | Clear filters / RESET | RESET button | Full listing restored; count restored; selects reset | P0 |
| 10 | Responsive | Desktop 1440 / tablet 820 / mobile 390 | 4/3/2-col grids, collapsed mobile filters, no overflow | P0 |
| 11 | 201 → product | Escalade V-01 / M-01 / Silverado Red / Tahoe Black details | CTA opens `/products/calder-clm-01-wheel` (+ config params when finishes set) | P0 |
| 12 | 202 → product | Tahoe M-2 / Tahoe White M-02 | CTA opens `calder-clm-02-wheel` | P0 |
| 13 | 203 → product | Silverado Black | CTA opens `calder-clm-03-wheel` | P0 |
| 14 | 207 → product | Escalade M-07 / V White / G63 / Range Rover | CTA opens `calder-clb-07-wheel` | P0 |
| 15 | F-150 isolation | F-150 detail | **No** product CTA, no configurator link, no wheel spec rows (VGC-3), inquiry CTA only if approved | P0 |
| 16 | Unpublished hidden | Toggle an entry to Draft | Disappears from listing + related loops (`shop.metaobjects` exposes Active only) | P0 |
| 17 | Broken links/images | Crawl listing + 12 details | Zero 404s, zero broken imgs (DevTools network) | P0 |
| 18 | PDP/configurator regression | Full PDP flow on all 4 products + Build Your Wheel | Variant selection, 5-state CTA matrix, cart, fitment — unchanged | P0 |
| 19 | Code-free extensibility | Add a test draft entry | Appears with zero theme edits | P1 |
| 20 | Idempotent re-import | Re-run manifest import | 12 updates, 0 new entries, order + references unchanged | P0 |
| 21 | Result count (VGC-1) | Filter/search | "N of 12" updates correctly | P1 |
| 22 | Duplicate image absent | Tahoe M-2 detail | 3 unique slides, no identical pair | P1 |
| 23 | Low-res guard | G63 detail | Hero never loads the 940×482 file as featured | P1 |
| 24 | Empty state | (If all drafts) listing | No-content editorial message, not "no matching" | P1 |
| 25 | SEO spot check | View source | Unique title/desc per detail; canonical to metaobject URL; image alts present | P1 |

**Go/no-go:** all P0 rows pass → READY_FOR_VISUAL_QA → client approval → publish (doc 08).