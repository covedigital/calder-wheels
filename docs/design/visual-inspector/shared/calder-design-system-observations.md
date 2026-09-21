# Calder Design System Observations

## Artifact Scope

**Path:** `visual-inspector/shared/calder-design-system-observations.md`

This document records visual-system observations shared across the six client-approved Calder Wheels mockups. It is a cross-page implementation-consistency artifact, not a replacement for the individual page visual specifications.

**Authority rule:** A clear page-specific observation in an approved mockup or `{page}.visual-spec.json` takes precedence over a generalized shared observation here. Page-specific measurements must not be averaged into shared tokens merely for consistency.

## Source Set

- `Calder - 1 - Home.png`
- `Calder - 2 - Category.png`
- `Calder - 3 - Product.png`
- `Calder - 4 - Cart.png`
- `Calder - 5 - Checkout.png`
- `Calder - 6 - Dealer Dashboard.png`

## Core Visual Character

The approved system reads as **premium automotive, precision-engineered, performance-oriented and restrained rather than ornamental**. Strong rectangular geometry, disciplined alignment, white space in commerce areas, cinematic dark photographic bands, and limited warm-gold emphasis recur across the system.

The visual language should not drift toward generic rounded SaaS styling.

## Color System

### Deep Navy

Approximate screenshot-derived range: `#031B2A`–`#08283A`.

Used for consumer headers/footers, dark buttons, image overlays, promotional bands, dealer navigation and major structural contrast.

### White / Off-White

Approximate range: `#FFFFFF`–`#F8F9F9`.

Dominant commerce surface for collection, product, cart and checkout areas.

### Warm Gold

Approximate range: `#C89A5B`–`#D5AA70`.

Used selectively for eyebrows, conversion CTAs, selected/active accents, borders and progress emphasis. Gold functions as emphasis rather than a dominant background.

### Text Navy

Approximate range: `#061D3A`–`#0A2443`.

Used heavily for headings, labels and commerce information.

### Success Green

Approximate range: `#239B45`–`#39A852`.

Used for fitment confirmation and positive operational/account states.

> These values are **ESTIMATED** from screenshots. They are not verified Calder brand tokens. Approved brand/theme values should supersede them once confirmed.

## Typography

### Display Headings

- Uppercase.
- Heavy/bold geometric sans-serif appearance.
- Tight line height.
- Strong navy-on-white or white-on-dark contrast.
- Frequently broken into compact two-line compositions.

### Eyebrows

- Uppercase.
- Warm gold.
- Small relative to the heading.
- Expanded tracking.
- Used to establish section/category context.

### Navigation and CTAs

- Compact uppercase/all-caps treatment.
- Medium-to-bold weight.
- Expanded letter spacing.
- Short action-oriented labels.

### Body Copy

- Clean sans-serif.
- Regular weight.
- Controlled line lengths.
- Clearly subordinate to display typography.

**Exact font family:** `UNKNOWN`. Verify against the Calder brand kit and current Shopify typography assets before converting this observation into source tokens.

## Geometry and Spacing

The consumer pages repeatedly use centered desktop content containers, while selected hero, newsletter, contact and footer regions extend to full viewport width.

The important invariant is **alignment relationships**, not one universal pixel width. Home/Product, Category, Cart and Checkout have different observed source widths and gutters. Their measurements should remain page-specific.

Repeated components inside a page deliberately share left/right edges. Preserve those common edges before chasing isolated measurements.

Controls and cards are generally square or very low-radius. Rounded pills are reserved mainly for compact statuses and badges.

Borders are thin and restrained. Shadows are subtle and are most visible on floating fitment surfaces and selected elevated cards.

## Button System

### Gold Primary

Warm-gold rectangular fill, low radius, tracked uppercase label, frequently paired with a right arrow, cart, or lock affordance.

Typical use: conversion, checkout/order, configuration/build actions.

### Navy Primary

Deep navy fill with white uppercase text.

Typical use: `FIND WHEELS`, `VIEW DETAILS`, active dealer actions.

### Outline Secondary

Transparent/white surface with a thin navy or gold outline.

Typical use: secondary navigation, contact, continue-shopping, save/share.

### Invariant

Avoid generic rounded CTA treatments. The approved system consistently favors disciplined rectangular controls.

## Form System

Inputs use white/light surfaces, thin gray borders, low radius, compact labels and clear dropdown indicators.

The **Year / Make / Model / Trim** fitment model is a recurring cross-page concept. Vehicle context then persists into Product, Cart and Checkout through fitment-confirmed states.

Checkout enlarges the form scale but preserves the same restrained control language.

## Imagery System

### Marketing Imagery

- Cinematic installed-wheel and vehicle photography.
- Mountain/road environments.
- Tight wheel macro photography.
- Manufacturing/engineering imagery.

### Commerce Imagery

- Clean isolated wheel renders.
- White/light backgrounds.
- High product prominence.
- More breathing room than marketing photography.

### Engineering Imagery

Machining/manufacturing imagery supports the precision/material narrative and repeatedly accompanies forged-aluminum, CNC-machined, strength-tested and real-world-proven messaging.

### Product-Fidelity Rule

Do not regenerate supplied/approved Calder wheel designs when implementing imagery. Wheel geometry, finish and Calder branding should remain faithful to the supplied product assets.

Marketing imagery commonly uses `cover`-style crops with deliberate focal positioning; isolated commerce wheel renders behave more like `contain`.

## Iconography

The system uses simple line/outline icons with a technical automotive character. They are generally navy or white with restrained gold accents.

Primary contexts include navigation utilities, engineering proof points, fitment, checkout trust states and dealer operations.

## Shared Semantic States

### Fitment Confirmed

Appears across Category, Product, Cart and Checkout.

Visual invariant:

- green check/status symbol;
- green uppercase confirmation;
- selected vehicle immediately associated with the state.

This should be treated as one semantic shared component with controlled size/layout variants.

### Selected / Active

Depending on component family, selected state is represented by:

- gold border/accent;
- deep navy active fill;
- stronger contrast;
- active progress marker.

Examples include finish selection, collection navigation, progress steps and dealer navigation/actions.

### Status Pills

Rounded pills are appropriate for compact operational states such as dealer order status and account standing. They are not the default general component geometry.

## Shared Component Families

### `global-consumer-header` — GLOBAL

**Pages:** Home, Category, Product, Cart.

Invariants:

- deep navy background;
- Calder logo left;
- compact horizontal navigation;
- utility icons right;
- `FIND YOUR FIT` action.

Minor navigation-label differences exist among references. Resolve final copy against authoritative project navigation content rather than averaging screenshot labels.

### `global-consumer-footer` — GLOBAL

**Pages:** Home, Category, Product, Cart.

Invariants:

- deep navy surface;
- Calder brand block;
- social icons;
- multi-column links;
- legal/lower row.

Footer copy/column labels vary somewhat between approved mockups and should be resolved against project content authority.

### `fitment-system` — SHARED

**Pages:** Home, Category, Product, Cart, Checkout.

Variants include:

- full vehicle finder;
- product configuration fitment;
- selected/confirmed vehicle state.

The semantic vehicle context should persist through the shopping journey.

### `product-card-family` — SHARED

Appears in several controlled forms:

- Homepage editorial cards;
- Category commerce cards;
- Product recommendation cards;
- Checkout summary item;
- Dealer-priced product cards.

Do not force all variants into identical geometry; preserve the shared product hierarchy while allowing context-specific layouts.

### `specialist-cta` — SHARED

**Pages:** Category, Product, Cart.

Recurring traits:

- dark automotive/wheel imagery;
- large white specialist message;
- gold or outlined action.

### `newsletter-band` — SHARED

**Pages:** Home, Category.

Recurring traits:

- dark mountain image;
- white heading/copy;
- email input;
- gold Subscribe action.

### `commerce-progress` — SHARED

**Cart:** three-stage presentation.

**Checkout:** five-stage presentation.

The concept is shared; the exact geometry is page-specific.

### `order-summary` — SHARED

**Pages:** Cart, Checkout.

Recurring traits:

- right-side desktop card;
- clear monetary hierarchy;
- dominant gold conversion CTA;
- reassurance/trust treatment.

## Page Shell Governance

### Consumer Shell

**Home, Category, Product, Cart**

Uses the full dark Calder consumer header and full marketing footer.

### Checkout Shell

**Checkout**

Intentionally removes the consumer marketing navigation. It uses a white secure-checkout header and compact dark support footer.

Do **not** force the consumer shell onto Checkout merely for component reuse.

### Dealer Portal Shell

**Dealer Dashboard**

Uses a fixed-width dark left sidebar and white account utility bar. It inherits Calder colors, typography, imagery and action language but has a distinct authenticated B2B information architecture.

Do **not** treat it as an unrelated SaaS brand, and do not force the consumer navigation shell into it.

## Cross-Page Implementation Invariants

1. Preserve relationship-based alignment before tuning isolated pixel measurements.
2. Do not average page-specific content widths or gutters into a single forced layout token.
3. Preserve the navy / white / gold hierarchy while verifying exact tokens against approved brand assets.
4. Maintain visible fitment context through browse → product → cart → checkout.
5. Keep supplied wheel renders faithful to the approved product.
6. Use controlled variants for Consumer, Checkout and Dealer shells.
7. Treat shared-component modifications as possible cross-page regressions and rerender affected accepted pages when material.
8. Use bounding boxes as visual evidence—not as instructions to absolutely position the page.
9. Keep gold selective; it is an emphasis/action color.
10. Preserve the restrained low-radius component language.

## Responsive Assumptions

> No approved responsive screenshots were supplied. Every item below is an **ASSUMPTION**, not observed design authority.

- Consumer navigation likely collapses at narrow widths.
- Collection filters likely become a drawer or compact filter trigger.
- PDP, Cart and Checkout desktop columns likely stack.
- Horizontal product/finish/gallery strips likely become swipeable or horizontally scrollable.
- Dealer sidebar likely collapses or becomes off-canvas.
- Wide dealer tables may require horizontal scrolling.

Implementation should use established theme behavior where sensible until responsive references are approved.

## Uncertainties

### Exact Font Family

**Unknown:** Screenshot evidence does not establish the exact family or weight files.

**Resolve with:** Calder brand kit and theme typography assets.

### Exact Color Tokens

**Unknown:** Raster screenshots support only approximate values.

**Resolve with:** approved brand color specification/theme tokens.

### Navigation and Footer Copy

**Unknown:** Minor wording differences exist among page references.

**Resolve with:** authoritative project navigation/content specification while retaining the approved visual treatment.

### Sticky / Fixed Behaviors

**Unknown:** Static screenshots do not establish sticky behavior for most headers, filters, summaries or portal controls.

**Resolve with:** current working theme behavior and functional requirements.

### Responsive System

**Unknown:** No approved mobile/tablet reference exists.

**Resolve with:** future approved responsive references. Until then, responsive behavior remains implementation inference.

## Handoff Rule

This artifact governs **shared visual consistency and component reuse**.

It does not replace:

```text
visual-inspector/visual-specs/{page}.visual-spec.json
visual-inspector/visual-specs/{page}.visual-spec.md
```

When a shared observation and a page-specific approved observation differ, use the page-specific observation for that page.

The implementation agent should use this file to recognize common Calder visual language and reusable component families without erasing legitimate page-specific variants.
