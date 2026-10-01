# CALDER_CROSS_PAGE_DESIGN_SYSTEM_AUDIT

## Audit Scope

Review of:

-   Four current development pages:
    -   Homepage
    -   Collection page
    -   Product page
    -   Cart page
-   Four approved page mockups:
    -   Approved Homepage
    -   Approved Collection
    -   Approved Product
    -   Approved Cart
-   Approved Homepage as the cross-page visual authority

The audit classifies findings into:

-   `GLOBAL`
-   `PAGE`
-   `COMPONENT`
-   `CONTENT`
-   `FUNCTIONAL`
-   `USER_MANAGED`
-   `DEFERRED`

Severity levels:

-   `P0` --- Presentation blocker
-   `P1` --- Highly visible discrepancy
-   `P2` --- Polish issue
-   `P3` --- Post-presentation improvement

Target workflow:

``` text
SITE AUDIT
    ↓
GLOBAL FIXES
    ↓
PAGE FIXES
    ↓
PRESENTATION QA
```

------------------------------------------------------------------------

# 1. Executive Assessment

The main problem is no longer individual CSS discrepancies. The
implementation has multiple visual systems operating simultaneously:

-   the approved Calder design system,
-   legacy Lumia theme styling,
-   page-specific Calder overrides,
-   and, on Product, functional components that visually belong to a
    different system.

That explains why repeated page-by-page corrections have not converged.

The next pass should stop treating these as four isolated pages.

  ------------------------------------------------------------------------------------------------
  Page              Current State     Presentation      Main Issue
                                      Status            
  ----------------- ----------------- ----------------- ------------------------------------------
  Homepage          \~75--85%         Needs targeted    Closest implementation authority, but
                    visually          polish            still differs from approved composition
                    established                         

  Collection        \~65--75%         Recoverable       Structure mostly exists; global styling
                                      quickly           and product/grid treatment diverge

  Product           \~35--45%         **P0 blocker**    Fundamentally different visual
                                                        system/composition from approved design

  Cart              \~25--35%         **P0 blocker**    Primarily Lumia cart styling rather than
                                                        approved Calder cart

  Global system     Fragmented        **P0 blocker**    Header/footer/type/buttons/cards/spacing
                                                        are inconsistent
  ------------------------------------------------------------------------------------------------

## Critical Path

``` text
SITE AUDIT
    ↓
GLOBAL FIXES
    ↓
PRODUCT / CART STRUCTURAL FIXES
    ↓
COLLECTION POLISH
    ↓
HOME POLISH
    ↓
PRESENTATION QA
```

Do not spend the remaining time chasing every pixel equally.

------------------------------------------------------------------------

# 2. GLOBAL AUDIT

These issues should be fixed once at the design-system/theme level, not
independently on every page.

  ---------------------------------------------------------------------------------------------------
  ID             Category       Severity       Finding                    Required Correction
  -------------- -------------- -------------- -------------------------- ---------------------------
  G-001          GLOBAL         P0             Header changes             Establish one Calder global
                                               dramatically between       header based on approved
                                               pages. Home uses dark      Home authority.
                                               Calder header;             
                                               Collection/Product/Cart    
                                               currently show white       
                                               Lumia-style headers.       

  G-002          GLOBAL         P0             Footer is inconsistent or  Establish one Calder global
                                               absent. Product has        footer and reuse it
                                               effectively incomplete     everywhere.
                                               footer; Cart uses sparse   
                                               legacy layout; Collection  
                                               differs from authority.    

  G-003          GLOBAL         P0             Typography hierarchy is    Enforce global
                                               inconsistent. Product      Garet/Facundo/Poppins stack
                                               especially falls back into and Calder heading/body
                                               serif/Lumia styling.       hierarchy.

  G-004          GLOBAL         P1             Buttons use multiple       Create shared `.calder-btn`
                                               unrelated systems: black,  primary/secondary/outline
                                               blue Lumia, beige,         rules.
                                               outlined, different        
                                               radii/heights.             

  G-005          GLOBAL         P1             Container widths and page  Normalize around the
                                               gutters differ             established Calder content
                                               substantially.             container.

  G-006          GLOBAL         P1             Navy/gold/cream usage is   Restrict
                                               inconsistent. Product      presentation-facing UI to
                                               configurator introduces    approved Calder tokens.
                                               bright Shopify/Lumia blue. 

  G-007          GLOBAL         P1             Section spacing varies     Establish shared vertical
                                               widely, particularly       section rhythm.
                                               Product and Cart.          

  G-008          GLOBAL         P1             Product cards are not      Use the approved card
                                               consistently using the     system everywhere
                                               approved/shared Calder     practical.
                                               card language.             

  G-009          COMPONENT      P1             CTA styling is             Normalize height,
                                               inconsistent across pages. typography, tracking,
                                                                          borders and icon treatment.

  G-010          COMPONENT      P1             Newsletter treatment       Use Homepage newsletter as
                                               differs across             authority where newsletter
                                               Home/Collection and is     appears.
                                               absent from some expected  
                                               experiences.               

  G-011          GLOBAL         P2             Border colors, shadows and Consolidate design tokens.
                                               corner radii vary.         

  G-012          GLOBAL         P2             Iconography mixes Lumia    Normalize visible
                                               and Calder styles.         presentation icons.

  G-013          CONTENT        P2             Navigation labels differ   Standardize presentation
                                               from approved information  navigation labels.
                                               architecture.              

  G-014          GLOBAL         P3             Micro-interactions/hover   Defer until desktop
                                               states have not been       presentation is stable.
                                               visually unified.          
  ---------------------------------------------------------------------------------------------------

## Highest-Leverage Global Fix

`G-001` through `G-008` should happen before further page-specific
visual tweaking.

This is the major lesson from the Product V1--V9 correction loop:
correcting page CSS while the inherited global system remains
uncontrolled causes every iteration to fight upstream Lumia styles.

------------------------------------------------------------------------

# 3. HOMEPAGE AUDIT

The current Homepage is the healthiest page and should now act as the
implementation-side authority, while the approved Home mockup remains
the design authority.

## P0

None that require rebuilding the page.

**Do not destabilize Home before the presentation.**

## P1 Findings

  -----------------------------------------------------------------------
  ID                      Category                Finding
  ----------------------- ----------------------- -----------------------
  HOME-001                PAGE                    Hero composition is
                                                  substantially different
                                                  from approved
                                                  authority: current uses
                                                  Porsche/mountain
                                                  composition while
                                                  approved uses the
                                                  stronger wheel/vehicle
                                                  close-up layout.

  HOME-002                COMPONENT               Current fitment finder
                                                  is a dark floating
                                                  module; approved
                                                  authority uses a wider
                                                  light/white control
                                                  surface integrated
                                                  immediately below hero.

  HOME-003                COMPONENT               Signature Wheels
                                                  currently uses
                                                  ecommerce product
                                                  cards; approved Home
                                                  uses three large
                                                  editorial collection
                                                  cards.

  HOME-004                PAGE                    Approved page has
                                                  substantially stronger
                                                  visual hierarchy and
                                                  larger editorial
                                                  imagery.

  HOME-005                COMPONENT               Header still differs
                                                  from approved final
                                                  navigation/logo
                                                  proportions.

  HOME-006                PAGE                    "Customize Without
                                                  Limits" composition
                                                  differs from approved
                                                  50/50 visual treatment.

  HOME-007                COMPONENT               Engineering section is
                                                  close conceptually but
                                                  proportions/layout
                                                  differ.

  HOME-008                CONTENT                 Process/gallery imagery
                                                  differs from approved
                                                  creative.
  -----------------------------------------------------------------------

These are highly visible, but because the page already reads as a
coherent Calder site, do **not** rebuild them before the presentation
unless the presentation explicitly compares screenshot-to-mockup.

## P2

Polish areas:

-   typography scale,
-   micro-spacing,
-   gold eyebrow placement,
-   CTA sizing,
-   icon spacing,
-   card gutters,
-   footer proportions.

## USER_MANAGED

Hero imagery and other image selections intended for manual replacement
should remain out of OpenCode's correction scope.

## Homepage Decision

**Freeze the architecture.**

Only apply:

-   global-system fixes,
-   safe P1 corrections,
-   P2 polish that cannot destabilize the page.

------------------------------------------------------------------------

# 4. COLLECTION PAGE AUDIT

The Collection page has the correct broad architecture:

``` text
Hero
  ↓
Fitment
  ↓
Categories
  ↓
Filters + Product Grid
  ↓
Help CTA
  ↓
Newsletter
  ↓
Footer
```

It does **not** need another rebuild.

## P0

### COL-001 --- GLOBAL --- Header

Current white header conflicts directly with the approved Calder dark
header.

**Fix through the global header, not Collection-specific CSS.**

### COL-002 --- GLOBAL --- Footer

Current footer/newsletter treatment does not fully align with approved
authority.

Again, this should be a **global correction rather than another
Collection-specific recreation**.

## P1

  ------------------------------------------------------------------------
  ID                      Category                Finding
  ----------------------- ----------------------- ------------------------
  COL-003                 PAGE                    Hero composition does
                                                  not match approved
                                                  wheel-centric Calder
                                                  hero.

  COL-004                 COMPONENT               Fitment finder uses
                                                  older dark
                                                  Homepage-style component
                                                  rather than approved
                                                  Collection fitment bar.

  COL-005                 COMPONENT               Category tiles differ
                                                  substantially in height,
                                                  icon treatment and
                                                  imagery.

  COL-006                 COMPONENT               Product cards still
                                                  resemble the older
                                                  B1/current commerce card
                                                  rather than approved
                                                  Collection cards.

  COL-007                 PAGE                    Product grid
                                                  density/proportions
                                                  differ from approved
                                                  three-column editorial
                                                  grid.

  COL-008                 COMPONENT               Filters are visually
                                                  Lumia-derived and do not
                                                  yet match approved
                                                  Calder filter rail.

  COL-009                 COMPONENT               Results toolbar does not
                                                  carry the same visual
                                                  hierarchy as approved
                                                  mockup.

  COL-010                 PAGE                    Approved vehicle context
                                                  bar above results is
                                                  missing/incomplete.

  COL-011                 COMPONENT               Help CTA differs in
                                                  proportions/background
                                                  composition.
  ------------------------------------------------------------------------

## USER_MANAGED

Previous user-managed decisions remain valid:

-   screenshot scale,
-   final filter configuration,
-   hero imagery,
-   help CTA imagery,
-   footer/newsletter content where inherited globally.

Do not reopen these as development blockers.

## P2

Polish areas:

-   spacing between category navigation and results,
-   filter typography,
-   product-card border treatment,
-   sorting controls,
-   pagination.

These should wait until Product and Cart P0 work is complete.

## Collection Decision

**Do not rebuild.**

Collection needs:

> Global shell correction + component restyling + grid polish.

------------------------------------------------------------------------

# 5. PRODUCT PAGE AUDIT

This is the largest discrepancy and the clearest presentation blocker.

The current Product page is not merely a slightly inaccurate version of
the approved design. It currently reads as a different storefront design
system.

## P0 --- Must Address

### PROD-001 --- GLOBAL --- Header

**Current:** white Lumia-style navigation.

**Approved:** dark Calder navigation matching Homepage authority.

The global Calder header should replace the page-specific/legacy
treatment.

------------------------------------------------------------------------

### PROD-002 --- PAGE --- Top Product Composition

Approved structure:

``` text
Large lifestyle wheel gallery
        │
        └──────────────→ Structured C1 product/configuration panel
```

Current structure:

``` text
Isolated wheel image
        │
        └──────────────→ Apex 201 generic ecommerce information
```

The approved layout needs to become the governing shell.

------------------------------------------------------------------------

### PROD-003 --- COMPONENT --- Build Your Wheel

The existing Build Your Wheel functionality should remain.

Visually, however, the current component introduces:

-   bright blue controls,
-   oversized empty whitespace,
-   unrelated typography,
-   different button styling,
-   weak grid alignment,
-   a separate product rendering style.

This is the strongest example of:

> **Preserve functionality; replace presentation.**

Do **not** remove or rewrite the underlying logic unless necessary.

Wrap/restyle the existing configurator so it appears to belong inside
the approved Calder product configuration system.

------------------------------------------------------------------------

### PROD-004 --- COMPONENT --- Fitment

The separate **Find Your Perfect Fit** section does not correspond to
the approved top-level fitment experience.

Approved fitment is tightly integrated into the purchase/configuration
panel.

Preserve underlying functionality where required, but eliminate the
visual feeling of two unrelated fitment systems.

------------------------------------------------------------------------

### PROD-005 --- PAGE --- Specifications / Engineering

The approved **Specifications + Engineered to Perform** composition is
only partially implemented.

Current dark engineering card is directionally correct, but:

-   undersized,
-   imagery missing,
-   hierarchy weak,
-   proportions incorrect.

This section can be salvaged rather than rebuilt.

------------------------------------------------------------------------

### PROD-006 --- COMPONENT --- Choose Your Finish

**Choose Your Finish is effectively missing.**

The approved page has a prominent horizontal wheel finish selector.

Current page only has a heading/empty region.

This is a presentation blocker.

------------------------------------------------------------------------

### PROD-007 --- COMPONENT --- Real World Gallery

The current Real World gallery is empty.

The approved design relies heavily on this section for premium visual
credibility.

Even temporary representative assets are preferable to four empty
placeholders for the presentation.

------------------------------------------------------------------------

### PROD-008 --- COMPONENT --- Recommendations

**You May Also Like is empty.**

The approved design shows a complete four-card recommendation row.

For presentation purposes this must visually render.

------------------------------------------------------------------------

### PROD-009 --- GLOBAL --- Footer

The footer is effectively absent/incomplete.

The Product page must inherit the global Calder footer.

## P1

Align the following with the approved design:

-   product title hierarchy,
-   pricing presentation,
-   rating/SKU layout,
-   Made to Order badge,
-   fitment confirmation,
-   gallery thumbnails,
-   finish swatches,
-   Save/Share,
-   purchase CTA,
-   service assurances,
-   Wheel Specialist CTA.

## FUNCTIONAL --- Preserve

Do **not** sacrifice:

-   Build Your Wheel logic,
-   finish selection,
-   fitment logic,
-   variant/configuration state,
-   cart integration,
-   availability logic,
-   request quote functionality.

This is a **visual-shell correction**, not a functional rewrite.

## Product Decision

This page should receive the **largest portion of remaining development
time**.

Do not attempt another correction cycle as a collection of tiny
screenshot discrepancies.

The next implementation pass should be:

> **PRODUCT SYSTEM RECONSTRUCTION --- preserve existing functionality,
> rebuild the presentation shell around the approved mockup.**

------------------------------------------------------------------------

# 6. CART PAGE AUDIT

Cart is simpler to recover than Product.

The current page is overwhelmingly inherited Lumia presentation, while
the approved mockup provides a straightforward Calder shell.

## P0

### CART-001 --- GLOBAL --- Header

Header does not match Calder authority.

### CART-002 --- PAGE --- Title Region

Approved **SHOPPING CART / YOUR ORDER** title region is absent.

### CART-003 --- PAGE --- Cart Item Architecture

Approved cart item:

``` text
Large Product Image
    +
Wheel Specification
    +
Fitment Confirmation
    +
Edit / Remove
    +
Quantity
    +
Price
```

Current cart uses a small generic ecommerce line item.

### CART-004 --- COMPONENT --- Order Summary

Order Summary needs complete Calder styling.

The current Lumia card is functionally usable but visually unrelated.

### CART-005 --- COMPONENT --- Checkout Progress

Approved progression:

``` text
1 CART
  ↓
2 CHECKOUT
  ↓
3 CONFIRMATION
```

This is missing.

### CART-006 --- COMPONENT --- Fitment Confirmation

Fitment confirmation needs to be visible on each wheel configuration.

This is especially important because fitment is one of Calder's major UX
differentiators.

### CART-007 --- PAGE --- Recently Viewed

The current Recently Viewed section is not part of the approved
presentation and visually reinforces Lumia.

**Hide it for presentation rather than spending time redesigning it.**

### CART-008 --- GLOBAL --- Footer

Footer is absent/incomplete and must inherit the global Calder footer.

## P1

Implement approved treatment for:

-   Continue Shopping,
-   Edit Configuration,
-   Remove,
-   security assurances,
-   Fitment Verified,
-   Customer Support,
-   Wheel Specialist CTA,
-   pricing hierarchy.

## FUNCTIONAL

Preserve Shopify functionality:

-   quantity update,
-   remove,
-   cart totals,
-   checkout,
-   shipping calculation where required,
-   cart persistence.

## Cart Decision

Perform a **controlled visual replacement of the cart shell**.

The underlying Shopify cart behavior stays.

------------------------------------------------------------------------

# 7. CONTENT AUDIT

Some visible discrepancy is not CSS and needs a separate content pass.

## P1 Content Required for Presentation

### Product

Provide representative content for:

-   finish selector,
-   lifestyle gallery,
-   related wheels,
-   engineering image,
-   product gallery,
-   specification values where available.

### Collection

Configure enough product/filter content that the page does not visibly
appear unfinished.

### Cart

Use a presentation configuration that demonstrates:

``` text
Wheel
  ↓
Selected Finish
  ↓
Dimensions
  ↓
Vehicle
  ↓
Fitment Confirmed
```

That story is much stronger in the demo than a generic Shopify cart
item.

------------------------------------------------------------------------

# 8. FUNCTIONAL AUDIT

Do not confuse visual fidelity with functional completeness.

For the presentation, verify this exact customer journey:

``` text
HOME
Find Your Fit
      ↓
COLLECTION
Vehicle retained
Compatible wheels displayed
      ↓
PRODUCT
Vehicle retained
Fits Your Vehicle
Configure wheel
      ↓
CART
Configuration retained
Fitment Confirmed
      ↓
CHECKOUT
```

This should become the presentation narrative.

If this flow works, the project feels substantially more complete than
four disconnected screenshots.

------------------------------------------------------------------------

# 9. USER_MANAGED

Keep the following explicitly outside the automated correction loop:

-   final hero imagery,
-   Collection hero imagery,
-   Collection CTA imagery,
-   exact filter configuration/data population,
-   content assets intended for manual replacement,
-   screenshot capture scaling,
-   nonessential copy refinement,
-   decorative imagery that does not affect layout.

This prevents OpenCode from repeatedly "fixing" intentional temporary
content.

------------------------------------------------------------------------

# 10. DEFERRED

These should **not consume the presentation critical path**.

## P3 / Post-Presentation

-   perfect mobile fidelity,
-   advanced hover animation,
-   micro transitions,
-   full accessibility refinement,
-   every filter state,
-   perfect empty states,
-   wishlist polish,
-   complete review functionality,
-   every gallery carousel state,
-   final product metadata,
-   secondary navigation states,
-   sophisticated pagination,
-   minor 1--4 px differences,
-   exhaustive cross-browser QA,
-   perfect real product photography.

Functional defects affecting the demo are exceptions.

------------------------------------------------------------------------

# 11. CORRECT FIX ORDER

The workflow should change from the previous page-by-page correction
approach.

## Phase 1 --- Freeze Authority

Create one immutable hierarchy:

``` text
APPROVED HOME MOCKUP
        ↓
Global Design Authority

APPROVED PAGE MOCKUP
        ↓
Page Composition Authority

EXISTING WORKING SHOPIFY FUNCTIONALITY
        ↓
Functional Authority
```

This resolves conflicts immediately.

OpenCode should **never redesign based on the current Lumia rendering
when an approved Calder reference exists**.

------------------------------------------------------------------------

# 12. Phase 2 --- GLOBAL FIXES

Do this before another Product iteration.

Lock:

-   header,
-   footer,
-   fonts,
-   color tokens,
-   containers,
-   buttons,
-   headings,
-   eyebrow labels,
-   section spacing,
-   card borders,
-   CTA patterns,
-   form controls.

## Target Architecture

``` text
CALDER GLOBAL DESIGN SYSTEM
        ↓
Header
Typography
Containers
Buttons
Forms
Cards
Footer
        ↓
HOME / COLLECTION / PRODUCT / CART
```

Avoid:

``` text
Home CSS
Collection CSS
Product CSS
Cart CSS
      ↓
Four competing systems
```

This should eliminate a large percentage of discrepancies automatically.

------------------------------------------------------------------------

# 13. Phase 3 --- PAGE FIXES

## Priority 1 --- Product

Allocate approximately **40% of remaining visual-development time**.

Focus only on:

1.  Header
2.  Product/gallery hero
3.  Configuration card
4.  Restyle Build Your Wheel
5.  Specs/Engineering
6.  Finish selector
7.  Real World gallery
8.  Recommendations
9.  Specialist CTA
10. Footer

Do not spend another cycle adjusting isolated 4px discrepancies before
these areas exist and are visually coherent.

------------------------------------------------------------------------

## Priority 2 --- Cart

Allocate approximately **25%**.

Cart is structurally simple enough that one strong implementation pass
could move it dramatically closer to the mockup.

Build:

``` text
Title + Progress
      ↓
Cart Items
      ↓
Order Summary
      ↓
Assurances
      ↓
Wheel Specialist CTA
      ↓
Footer
```

Remove or hide presentation-irrelevant Lumia sections.

------------------------------------------------------------------------

## Priority 3 --- Collection

Allocate approximately **20%**.

No reconstruction.

Fix:

``` text
Global Shell
    ↓
Fitment Treatment
    ↓
Cards
    ↓
Toolbar
    ↓
Spacing
```

Leave user-managed imagery and filter configuration alone.

------------------------------------------------------------------------

## Priority 4 --- Home

Allocate approximately **15%**.

Home is already presentation-capable.

Do not risk breaking it.

Apply shared global changes and obvious polish only.

------------------------------------------------------------------------

# 14. PRESENTATION QA

Once implementation stops, **freeze development**.

Do not continue coding until the presentation unless a P0 issue is
found.

Perform one final QA at a standardized desktop viewport.

Recommended:

**1440 × 900**

Inspect the journey rather than only isolated screenshots.

------------------------------------------------------------------------

## Gate 1 --- Brand Consistency

Every page should immediately look like the same website.

Check:

``` text
Header
  ↓
Typography
  ↓
Navy
  ↓
Gold
  ↓
Buttons
  ↓
Containers
  ↓
Footer
```

Any failure here is P0/P1.

------------------------------------------------------------------------

## Gate 2 --- Above the Fold

Inspect only the first viewport of:

-   Home
-   Collection
-   Product
-   Cart

If those four screenshots look polished side-by-side, the presentation
becomes significantly stronger.

------------------------------------------------------------------------

## Gate 3 --- Customer Journey

Run:

``` text
Home
 ↓
Collection
 ↓
Product
 ↓
Cart
```

Verify fitment/configuration persistence.

------------------------------------------------------------------------

## Gate 4 --- Broken / Empty Presentation Surfaces

Search specifically for:

-   blank cards,
-   missing images,
-   empty galleries,
-   oversized whitespace,
-   broken grids,
-   blue Lumia controls,
-   serif fallback typography,
-   missing footer,
-   missing recommendations,
-   unfinished placeholders.

------------------------------------------------------------------------

## Gate 5 --- Presentation Freeze

After the final pass:

> **No architectural changes. Only P0 fixes.**

------------------------------------------------------------------------

# 15. FINAL SEVERITY QUEUE

## P0 --- Presentation Blockers

These belong in the next implementation sprint:

1.  Global Calder header across all four pages
2.  Global Calder footer across all four pages
3.  Global font/token/button/container enforcement
4.  Product top-half reconstruction
5.  Product Build Your Wheel visual integration
6.  Product Finish selector
7.  Product Real World gallery
8.  Product recommendations
9.  Cart Calder shell
10. Cart product/configuration treatment
11. Cart order summary
12. Cart fitment confirmation
13. Remove/hide obvious unfinished Lumia presentation elements

Everything else waits until these pass.

------------------------------------------------------------------------

## P1 --- Highly Visible Discrepancies

-   Collection cards/filter styling
-   Collection fitment treatment
-   Home component discrepancies
-   Product secondary sections
-   Cart specialist CTA
-   Global section rhythm
-   Remaining component consistency

------------------------------------------------------------------------

## P2 --- Polish

-   spacing,
-   typography micro-adjustments,
-   borders,
-   shadows,
-   icon sizing,
-   letter spacing,
-   alignment,
-   small responsive discrepancies.

------------------------------------------------------------------------

## P3 --- Post-Presentation

-   animation,
-   complete responsive perfection,
-   exhaustive filter behavior,
-   hover states,
-   final asset/content refinement,
-   secondary ecommerce functionality.

------------------------------------------------------------------------

# 16. RECOMMENDED NEW WORKFLOW

The biggest process change is:

> **Stop doing another V10/V11/V12 screenshot correction loop
> page-by-page.**

Use this workflow instead:

``` text
CALDER SITE AUDIT
        │
        ▼
GLOBAL DESIGN SYSTEM LOCK
        │
        ├── Header
        ├── Footer
        ├── Typography
        ├── Colors
        ├── Containers
        ├── Buttons
        ├── Forms
        └── Shared Cards
        │
        ▼
PAGE CORRECTIONS
        │
        ├── PRODUCT ───── P0
        ├── CART ──────── P0
        ├── COLLECTION ── P1
        └── HOME ──────── P1/P2
        │
        ▼
CROSS-PAGE QA
        │
        ▼
PRESENTATION FREEZE
```

------------------------------------------------------------------------

# 17. KEY PROJECT CONCLUSION

The project is **not four pages away from the presentation**.

It is better understood as:

> **One global design-system correction + two major page corrections +
> two polish passes.**

The Homepage proves that the Calder visual language can already exist
inside the Lumia theme.

The Collection page proves that the architecture can be brought
reasonably close to the approved design without a full rebuild.

The true blockers are:

1.  **Global cross-page design-system inconsistency**
2.  **Product page**
3.  **Cart page**

Therefore, the next OpenCode operation should be:

``` text
CALDER_GLOBAL_DESIGN_SYSTEM_CORRECTION_V1
```

---not another Product V11 micro-correction cycle.

Once the global correction is applied:

``` text
GLOBAL DESIGN SYSTEM
        ↓
SHORT CROSS-PAGE QA
        ↓
PRODUCT
        ↓
CART
        ↓
COLLECTION
        ↓
HOME
        ↓
PRESENTATION QA
        ↓
FREEZE
```

That is the recommended path to bring the Calder Wheels development site
under control for the presentation deadline.
