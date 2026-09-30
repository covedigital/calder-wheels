# Calder Wheels --- Product Card Visual Specification

**Component:** Calder Product Listing Card\
**Reference variant:** B1\
**Classification:** SHARED\
**Reference:** `calder-product-card-b1-reference.png`\
**Immediate implementation context:** Lumia
`index-product-carousel-tabs`

> This is a component-level visual specification. It defines
> presentation and visual relationships, not final Liquid architecture.
> Existing Shopify/Lumia product selection, fitment, variant, price,
> wishlist, carousel, and cart behavior remains authoritative unless the
> implementation agent verifies that a visual requirement cannot be
> achieved through reuse, restyling, or extension.

## Visual authority and invariants

**OBSERVED:** B1 is the approved visual authority. The product image is
dominant; the card is a premium white/light-neutral commerce surface
with restrained rounding/elevation. The hierarchy is media →
taxonomy/title → rating → price → swatches → optional attributes →
primary CTA → secondary action. Technical labels/actions use compact
uppercase tracking. Optional data must collapse without leaving dead
space.

**ESTIMATED:** The supplied raster is approximately 264 × 682 px, about
1:2.58 W:H. Treat these as reference proportions rather than fixed
production dimensions.

## 1. Card container

**OBSERVED:** White/light-neutral background; no prominent border; soft
edge definition; compact vertical rhythm.

**ESTIMATED:** 8--10 px radius; 14--16 px principal internal padding;
diffuse low-opacity shadow around `0 2px 12–18px rgba(0,0,0,.06–.10)`.
Typical internal gaps are 8--14 px, with stronger separation before the
feature row and CTA.

## 2. Product media area

**OBSERVED:** The wheel is the dominant element on a clean
white/light-neutral field. Main media is near-square and centered. A
three-cell thumbnail rail appears beneath it; the selected thumbnail has
a thin dark outline.

**ESTIMATED:** Media plus thumbnails consume about 38--42% of total card
height. Main image region is roughly 235--250 px tall at the 264 px
reference width, with 10--18 px image breathing room. Product occupies
roughly 80--90% of usable media width. Thumbnail gap is about 8--10 px
and cell radius about 7--9 px.

**ASSUMPTION:** Use contain-like behavior and centered positioning so
wheel geometry is never cropped. Thumbnail rail is conditional and may
collapse when compatible alternate-media behavior is unavailable.

## 3. Product badge

**OBSERVED:** Optional badge at top-left of media, uppercase,
bold/semibold, widely tracked, white on dark muted olive/green.

**ESTIMATED:** 27--30 px high, roughly 88--92 px minimum width, 12--14
px horizontal padding, 5--6 px radius.

**CONDITIONAL:** Must be data/state driven. Implementation agent must
verify source.

## 4. Wishlist control

**OBSERVED:** Outline heart at top-right, visually transparent,
approximately 21--23 px icon inside a 36--40 px visual control region.

**ASSUMPTION:** Hover/focus/selected feedback should use existing Lumia
semantics and remain stable in position. Implementation agent must
verify wishlist markup/integration and state classes.

## 5. Product taxonomy/type

**OBSERVED:** Small uppercase technical label above title; example
`BEADLOCK-STYLE`.

**ESTIMATED:** 11--12 px, weight 600--700, tracking around .14--.18em;
10--12 px above and 2--4 px below.

**CONDITIONAL:** Source may be product type, collection, tag, metafield,
or theme mapping and must be verified.

## 6. Product title

**OBSERVED:** Large, compact, dark title; example `B1`.

**ESTIMATED:** 28--31 px, weight 700--800, line-height 1.0--1.08; 2--4
px from taxonomy and 4--7 px to rating.

**ASSUMPTION:** In reusable contexts, permit up to two lines while
preserving the theme's equal-card strategy.

## 7. Rating

**OBSERVED:** Five compact gold stars followed by `4.7 (64)` in dark
subordinate text.

**ESTIMATED:** Stars approximately 15--17 px, 1--2 px between stars,
8--10 px before rating text.

**CONDITIONAL:** Never synthesize rating data. Verify Lumia rating
snippet and review/metafield source; omit cleanly when absent.

## 8. Price

**OBSERVED:** `$699` is strongly weighted; `/ wheel` is smaller and
lighter.

**ESTIMATED:** Primary price 21--24 px at 700--800 weight; suffix 14--16
px regular weight; approximately 10--12 px vertical separation around
the row.

**ASSUMPTION:** Preserve native Shopify/Lumia sale and compare-at
semantics: sale price remains primary and compare-at becomes
subordinate/struck-through.

**UNKNOWN:** Verify whether `/ wheel` is globally valid,
product-specific, or configurable.

## 9. Finish/color swatches

**OBSERVED:** Circular swatches followed by a plain `+N` overflow
indicator; reference shows `+2`.

**ESTIMATED:** 22--24 px diameter with 8--9 px gaps and subtle neutral
border where contrast requires it.

**ASSUMPTION:** Selected state should be clearly outlined/ringed using
compatible Lumia behavior. Prefer fewer visible swatches plus `+N`
rather than multi-row wrapping at narrow widths.

**BOUNDARY:** Do not redefine Lumia variant-selection architecture.

## 10. Feature/attribute row

**OBSERVED:** Optional three-column region with thin top divider and
thin vertical separators. Icons sit above centered two-line labels.
Reference examples: Off-Road Ready, Custom Finishes, Built for
Performance.

**ESTIMATED:** Icons 22--27 px; labels 9--11 px at 500--600 weight;
approximately 12--14 px vertical padding.

**CONDITIONAL:** Render only from verified product data/metafields or
explicit theme configuration. Never hard-code unsupported claims.

## 11. Primary CTA

**OBSERVED:** Full-width near-black button with white cart icon and
tracked uppercase `ADD TO CART`.

**ESTIMATED:** 41--44 px tall; 5--6 px radius; 12--13 px text at
600--700 weight with .12--.16em tracking; icon gap 10--12 px; about
10--12 px top spacing.

**ASSUMPTION:** Hover, keyboard focus, disabled, and unavailable states
must remain clearly perceivable and compatible with existing Lumia
semantics.

**FUNCTIONAL BOUNDARY:** The label is presentation in the reference, not
a mandate for direct add-to-cart. Variant, fitment, finish, size,
configuration, availability, or product-detail routing remains governed
by verified Shopify/Lumia behavior.

## 12. Secondary action

**OBSERVED:** Centered `View Details →`, materially quieter than the
CTA.

**ESTIMATED:** 12--13 px, 600--700 weight; approximately 13--16 px above
and 2--5 px bottom breathing room.

## 13. Responsive behavior

**ASSUMPTION --- no approved mobile component reference exists.**
Preserve near-square product-media prominence; keep title and price
legible; maintain practical touch targets; reduce visible swatches
before wrapping; allow optional thumbnails/feature row to simplify or
hide at narrow card widths; do not introduce drawers, hover-only
controls, or elaborate new interactions. Suggested compact card padding
is 12--14 px, title 24--28 px, CTA minimum 44 px high, and wishlist
target approximately 44 px where layout permits.

Existing Lumia carousel/grid breakpoints should be preserved unless
implementation verification demonstrates a visual conflict.

## Optional and conditional regions

Optional: badge, thumbnail rail, rating, swatches, feature/attribute
row.

Conditional: rating/reviews, sale/compare-at pricing, badge, wishlist
when supported, swatches and `+N`, feature row, direct Add to Cart
behavior, `/ wheel` suffix.

## Unknown Shopify/data dependencies

Implementation must verify the source for taxonomy and badge;
rating/review integration; wishlist implementation; swatch option
names/assets/interactions; `/ wheel` applicability; feature-row
metafields/configuration; direct-cart versus configuration routing;
fitment/size/finish requirements; and the shared Lumia product-card
markup/CSS hooks.

## Implementation-agent verification checklist

1.  Inspect `index-product-carousel-tabs` and the shared `product-card`
    renderer before editing.
2.  Confirm every context that reuses the same product-card renderer.
3.  Map optional visual regions to existing settings/product
    fields/metafields/tags or verified extensions.
4.  Preserve native carousel, URL, price, variant/cart, wishlist, and
    accessibility behavior wherever available.
5.  QA realistic long titles, missing ratings, sale pricing, swatch
    overflow, unavailable products, and products requiring
    configuration.
6.  QA desktop/tablet/mobile in carousel and grid contexts.
7.  Treat every mobile measurement/behavior above as **ASSUMPTION**
    until visual QA.

## Verified project context

**VERIFIED_PROJECT_CONTEXT:** The supplied Lumia carousel uses the
shared `product-card` renderer for multi-product slides and defines
responsive carousel behavior. The supplied Lumia product-grid also uses
the same `product-card` renderer in default/fixed-banner grid contexts.
This makes the existing shared renderer the first
reuse/restyle/extension point to inspect, without prescribing final
Liquid architecture.
