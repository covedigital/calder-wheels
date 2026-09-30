# CALDER WHEELS --- DESIGN-TO-CODE PHASE

## Existing Shopify Theme Audit + Approved Design Architecture + Gap Analysis + Implementation Plan

**Project:** Calder Wheels\
**Phase:** Design-to-Code / Shopify Implementation Planning\
**Primary Objective:** Apply the approved Calder Wheels visual design to
the existing working Shopify theme without undoing, overwriting,
duplicating, or destabilizing completed development work.

------------------------------------------------------------------------

# 1. Mission

You are working on the existing Calder Wheels Shopify implementation.

This is an **existing working implementation**, not a greenfield build.

Your first task is to understand four things simultaneously:

1.  What currently exists and works in the Shopify theme.
2.  What the approved Calder Wheels designs require visually.
3.  What component architecture has already been identified from those
    approved designs.
4.  What previous implementation/activation work has already been
    completed.

The objective is to determine the **smallest, safest, maintainable set
of changes** required to transform the working Shopify theme into the
approved Calder Wheels experience.

> **Do not begin implementing design changes during this first pass.**

The first pass is an audit, reconciliation, gap analysis, risk
assessment, and implementation-planning exercise.

------------------------------------------------------------------------

# 2. Project Sources

## 2.1 Working Shopify Theme --- Functional / Technical Authority

The known working Shopify theme is located at:

``` text
/Users/admin/Projects/Autonomous Agent/1 - Projects/Calder Wheels/docs/design/Shopify Themes/Working Theme-via-CLI
```

This directory is the **FUNCTIONAL SOURCE OF TRUTH**.

It determines:

-   What currently exists.
-   What currently works.
-   How Shopify functionality is implemented.
-   Which sections, snippets, templates, scripts, styles, schemas, and
    integrations are already in use.
-   Which technical contracts must be preserved.
-   Which working systems should be adapted rather than replaced.

Start the technical investigation from this directory.

Do not assume another Shopify theme, archived theme, prototype,
development copy, experiment, or similarly named directory represents
the current working implementation.

------------------------------------------------------------------------

## 2.2 Approved Calder Wheels Mockups --- Visual / UX Authority

The client-approved Calder Wheels mockups/layout images are located at:

``` text
/Users/admin/Projects/Autonomous Agent/1 - Projects/Calder Wheels/docs/design/mockups/approved-mockups
```

This directory is the **VISUAL / UX SOURCE OF TRUTH**.

The approved set currently represents:

1.  Home
2.  Category / Collection
3.  Product
4.  Cart
5.  Checkout
6.  Dealer Dashboard

Actually inspect the image files.

Do not rely exclusively on filenames, previous descriptions, or
documentation when determining visual requirements.

Do not substitute:

-   Older mockups
-   Rejected concepts
-   Experimental layouts
-   Non-approved designs
-   Temporary prototypes

when an approved equivalent exists in this directory.

------------------------------------------------------------------------

## 2.3 Approved Mockup Layout & Component Assessment --- Architectural Reference

Locate and fully review:

``` text
calder-wheels-approved-mockup-layout-component-assessment.md
```

This document is the **DESIGN ARCHITECTURE / COMPONENT INTERPRETATION
REFERENCE**.

It has already analyzed the six approved desktop mockups and identifies:

-   Global Calder design system
-   Design tokens
-   UI primitives
-   Application shells
-   Shared storefront components
-   Shared fitment components and state
-   Shared commerce components
-   Page-specific marketing sections
-   Checkout-specific components
-   Dealer portal components
-   Component variants
-   Data-driven vs. primarily visual components
-   Page assembly
-   Cross-page reuse strategy
-   Responsive expectations
-   Interaction states
-   Accessibility requirements
-   Asset categories
-   Component risk classifications
-   Recommended implementation sequencing

### Important

Do **not** treat this document as proof that a component must be newly
created.

Instead, use it as the **target conceptual component model that must be
mapped onto the existing Shopify architecture**.

The component names in this document are conceptual architectural names.

They do not require the existing theme to use those exact:

-   Filenames
-   Liquid section names
-   Snippet names
-   CSS classes
-   JavaScript modules
-   Schema IDs
-   Implementation patterns

For example, a conceptual component named:

``` text
VehicleFitmentSelector
```

may already exist under a completely different filename or JavaScript
implementation.

Likewise:

``` text
WheelProductCard
```

may already map to an existing Shopify product-card snippet.

The objective is to map concepts to existing code before proposing new
code.

------------------------------------------------------------------------

## 2.4 `ws1-activation-guide.md` --- Implementation Status Reference

Locate and fully review:

``` text
ws1-activation-guide.md
```

This document is the **IMPLEMENTATION / ACTIVATION STATUS REFERENCE**.

Use it to understand:

-   Previously implemented functionality
-   Activation requirements
-   Configuration requirements
-   Previous implementation decisions
-   Incomplete work
-   Dependencies
-   Known limitations
-   Manual setup
-   Intended Shopify configuration
-   Components that may exist but are not currently active

Verify everything it says against the actual working theme.

Do not assume documentation is more current than the codebase.

------------------------------------------------------------------------

# 3. Authority Hierarchy

Use the following authority hierarchy throughout the design-to-code
phase.

## 3.1 Functional / Technical Questions

The actual working theme wins.

``` text
Working Theme-via-CLI
```

determines what currently exists, how functionality works, and which
technical contracts must be protected.

------------------------------------------------------------------------

## 3.2 Visual Questions

The approved mockup images win.

``` text
approved-mockups
```

determine what the final implementation should visually resemble.

They are the final authority for:

-   Composition
-   Visual hierarchy
-   Spacing intent
-   Typography presentation
-   Color roles
-   Imagery treatment
-   CTA hierarchy
-   Page structure
-   Brand character
-   Section relationships

subject to legitimate Shopify platform, accessibility, and responsive
constraints.

------------------------------------------------------------------------

## 3.3 Component / Architecture Questions

Use:

``` text
calder-wheels-approved-mockup-layout-component-assessment.md
```

as the preferred architectural interpretation of the approved designs.

However, adapt its conceptual architecture to the actual working theme
rather than unnecessarily rebuilding the theme around the document's
naming conventions.

------------------------------------------------------------------------

## 3.4 Implementation History / Activation Questions

Use:

``` text
ws1-activation-guide.md
```

as the implementation history/status reference.

Verify its claims against the current repository.

------------------------------------------------------------------------

# 4. Core Implementation Principle

The target is **not**:

> Rebuild the Shopify theme according to the component assessment.

The target is:

> Map the component architecture identified in the assessment onto the
> existing working Shopify implementation and determine what can be
> preserved, configured, restyled, extended, or must genuinely be
> created.

Use this priority order:

``` text
PRESERVE
   ↓
CONFIGURE / ACTIVATE
   ↓
RESTYLE
   ↓
EXTEND
   ↓
CREATE
```

Creating a replacement should be the final option.

------------------------------------------------------------------------

# 5. Primary Safety Rule

**Do not overwrite, rebuild, remove, revert, or replace working
functionality simply because the current storefront does not visually
match an approved mockup.**

Before eventually modifying any existing component, determine:

-   What it currently does.
-   Which files implement it.
-   What other files depend on it.
-   Whether JavaScript depends on its markup, IDs, classes, or data
    attributes.
-   Whether Shopify Theme Editor settings depend on its schema.
-   Whether metafields or metaobjects feed it.
-   Whether Shopify apps interact with it.
-   Whether other sections/snippets/templates render it.
-   Whether it is referenced in `ws1-activation-guide.md`.
-   Whether the approved appearance can be achieved through restyling.
-   Whether it can be safely extended instead of replaced.

Separate:

``` text
FUNCTIONAL LAYER
```

from:

``` text
PRESENTATION LAYER
```

Whenever possible, preserve the functional layer and adapt the
presentation layer.

------------------------------------------------------------------------

# 6. Phase 1 --- Verify the Working Baseline

Begin at:

``` text
/Users/admin/Projects/Autonomous Agent/1 - Projects/Calder Wheels/docs/design/Shopify Themes/Working Theme-via-CLI
```

Before making any changes:

1.  Confirm the directory exists and is accessible.
2.  Confirm it contains the expected Shopify theme structure.
3.  Determine the Git repository root, if applicable.
4.  Identify the current Git branch.
5.  Check `git status`.
6.  Identify modified files.
7.  Identify untracked files.
8.  Identify uncommitted development work.
9.  Identify the Shopify CLI configuration.
10. Identify relevant build tooling or package configuration.
11. Establish the current implementation baseline.

Inspect:

-   `/layout`
-   `/templates`
-   `/sections`
-   `/snippets`
-   `/assets`
-   `/config`
-   `/locales`
-   JSON templates
-   Liquid files
-   CSS / SCSS
-   JavaScript
-   Section schemas
-   Theme settings
-   App blocks
-   App embeds
-   Custom sections
-   Reusable snippets
-   Metafield references
-   Metaobject references
-   Custom integrations
-   Responsive logic

### Do not modify anything during this phase.

------------------------------------------------------------------------

# 7. Phase 2 --- Review `ws1-activation-guide.md`

Read the complete activation guide.

Do not merely search for keywords or read excerpts.

Determine:

-   What has already been built.
-   What was activated.
-   What remains inactive.
-   What is partially implemented.
-   What requires Theme Editor configuration.
-   What requires Shopify configuration.
-   What requires metafields/metaobjects.
-   What requires assets.
-   What requires manual activation.
-   Known limitations.
-   Dependencies.
-   Previous implementation decisions.
-   Outstanding tasks.

Do not assume something is missing merely because it is not visible on
the storefront.

A component may already exist but require:

-   Theme Editor activation
-   JSON template inclusion
-   Template assignment
-   Metafield configuration
-   Metaobject configuration
-   Menu assignment
-   Content population
-   Image assignment
-   CSS refinement
-   JavaScript initialization
-   Shopify Admin configuration

Produce a comparison such as:

  --------------------------------------------------------------------------
  Component /    Guide Says     Codebase Shows Actual Status  Recommended
  System                                                      Action
  -------------- -------------- -------------- -------------- --------------
  Example        Implemented    File verified  Existing       PRESERVE

  Example        Requires       Code exists    Inactive       CONFIGURE /
                 activation                                   ACTIVATE
  --------------------------------------------------------------------------

Report discrepancies between documentation and actual code.

------------------------------------------------------------------------

# 8. Phase 3 --- Review the Component Assessment

Read the complete:

``` text
calder-wheels-approved-mockup-layout-component-assessment.md
```

Do this **before independently proposing a new component architecture**.

## 8.1 Application Shells

The assessment interprets the six approved mockups as three application
shells.

### Public Storefront

-   Home
-   Category / Collection
-   Product
-   Cart

### Transactional Checkout

-   Checkout

### Authenticated Dealer Portal

-   Dealer Dashboard

Do not force these three shells into identical structures.

They share the Calder visual identity while serving different functional
purposes.

------------------------------------------------------------------------

## 8.2 Shared Systems

Pay particular attention to the identified:

-   Calder design tokens
-   Typography system
-   Layout/container system
-   UI primitives
-   Public Header
-   Public Footer
-   Vehicle Fitment System
-   Wheel/Product data model
-   Wheel Specialist CTA
-   Newsletter Banner
-   Status System
-   Product/Commerce components
-   Checkout Progress
-   Dealer application shell
-   Dealer status/data system

------------------------------------------------------------------------

## 8.3 Important Component Boundaries

Preserve the assessment's distinction between related but intentionally
separate components.

``` text
HomeHero
≠ CollectionHero
≠ DealerWelcomeHero
```

``` text
PublicHeader
≠ CheckoutHeader
≠ DealerTopbar
```

``` text
PublicFooter
≠ CheckoutFooter
```

``` text
FeaturedWheelCard
≠ WheelProductCard
≠ DealerProductCard
```

``` text
VehicleFinder
≠ VehicleFitmentBar
≠ VehicleFitmentStatus
```

``` text
Cart OrderSummary
≠ Dealer order/production components
```

Share lower-level primitives and tokens where appropriate without
over-generalizing purpose-specific higher-level components.

------------------------------------------------------------------------

# 9. Phase 4 --- Verify the Component Assessment Against the Approved Mockups

Inspect every approved image inside:

``` text
/Users/admin/Projects/Autonomous Agent/1 - Projects/Calder Wheels/docs/design/mockups/approved-mockups
```

Use the component assessment as the starting interpretation.

Do **not** blindly accept the written assessment without checking the
actual approved images.

For every page:

1.  Inspect the approved image.
2.  Compare it to the component assessment.
3.  Confirm the identified sections.
4.  Identify visual details the assessment omitted.
5.  Identify assessment assumptions not clearly supported by the image.
6.  Confirm shared vs. page-specific components.
7.  Confirm component variants.
8.  Confirm visual hierarchy.
9.  Confirm the intended application shell.
10. Note any implementation implications visible in the design.

Report meaningful discrepancies.

The approved mockup remains the final visual authority.

------------------------------------------------------------------------

# 10. Phase 5 --- Map the Proposed Component Architecture to the Existing Theme

This is one of the most important phases of the audit.

For every component/system identified in the component assessment,
determine whether an equivalent already exists in the working theme.

Produce:

  --------------------------------------------------------------------------------
  Assessment   Page /     Existing     File(s)    Current    Required   Risk
  Component    System     Theme                   Status     Action     
                          Equivalent                                    
  ------------ ---------- ------------ ---------- ---------- ---------- ----------

  --------------------------------------------------------------------------------

Use the following classifications.

## EXISTS + MATCHES

Functionality and presentation substantially exist.

**Action:** `PRESERVE`

## EXISTS + NEEDS STYLING

Functionality exists but presentation differs from the approved design.

**Action:** `RESTYLE`

## EXISTS + NEEDS CONFIGURATION

Code exists but requires Theme Editor, Shopify, metafield, asset, menu,
template, or other configuration.

**Action:** `CONFIGURE / ACTIVATE`

## EXISTS + NEEDS EXTENSION

Existing component provides the correct foundation but lacks something
required by the approved design.

**Action:** `EXTEND`

## PARTIAL

Implementation exists but is incomplete.

Determine whether configuration or extension is preferable to
replacement.

## MISSING

No reasonable implementation exists.

**Action:** `CREATE`

## PROTECTED WORKING FUNCTIONALITY

Functionality is operational and replacement presents unnecessary
regression risk.

**Action:** `PRESERVE FUNCTIONAL LAYER`

Restyle or wrap it where necessary.

------------------------------------------------------------------------

# 11. Phase 6 --- Classify the Correct Shopify Implementation Level

For every conceptual component identified in the assessment, determine
its appropriate implementation level.

Do not turn every visible UI block into an independent Shopify section.

## Level 1 --- Design Tokens / UI Primitives

Examples:

-   Colors
-   Typography
-   Spacing
-   Borders
-   Radius
-   Shadows
-   Breakpoints
-   Buttons
-   Icon buttons
-   Badges
-   Status badges
-   Form fields
-   Selects
-   Checkboxes
-   Radio controls
-   Cards
-   Dividers
-   Tabs
-   Progress bars

These should normally live within the shared design/CSS/component
system.

## Level 2 --- Functional Components / Snippets

Examples:

-   WheelProductCard
-   VehicleFitmentSelector
-   FitmentStatus
-   CartItem
-   QuantitySelector
-   FinishSwatches
-   PriceDisplay
-   Product metadata
-   ProductionTracker
-   Dealer status treatments

These should generally be reusable functional components/snippets
rendered by larger sections/templates.

## Level 3 --- Merchant-Configurable Shopify Sections

Potential examples identified by the assessment:

-   HomeHero
-   SignatureWheels
-   CustomizationFeature
-   EngineeringFeature
-   ProcessGallery
-   FittedGalleryFeature
-   CollectionHero
-   CollectionNavigation
-   RealWorldGallery
-   WheelSpecialistCTA
-   NewsletterBanner

Before creating any of these, determine whether equivalent
merchant-configurable sections already exist.

------------------------------------------------------------------------

# 12. Phase 7 --- Current Component Inventory

Before proposing implementation work, inventory the relevant current
components.

For each component identify:

-   Component
-   File(s)
-   Purpose
-   Current functionality
-   Dependencies
-   Theme Editor configuration
-   JavaScript dependencies
-   Data dependencies
-   Current design status
-   Recommended action

Pay particular attention to:

-   Global header
-   Navigation
-   Announcement/header utilities
-   Hero systems
-   Vehicle fitment
-   Year / Make / Model / Trim controls
-   Product discovery
-   Collection navigation
-   Product cards
-   Collection filters
-   Search
-   Product page
-   Product gallery
-   Product configuration
-   Fitment confirmation
-   Cart
-   AJAX cart behavior
-   Checkout-related handoff
-   CTAs
-   Content sections
-   Dealer-related functionality
-   Footer
-   Responsive behavior

------------------------------------------------------------------------

# 13. Phase 8 --- Data Source Audit

The component assessment identifies several systems that must remain
data-driven.

Map each required value to its actual data source.

Use:

  --------------------------------------------------------------------------
  Data           Current Source File / System  Valid?         Change
  Requirement                                                 Required?
  -------------- -------------- -------------- -------------- --------------

  --------------------------------------------------------------------------

## 13.1 Shopify Product Data

Investigate:

-   Product title/model
-   Product type
-   Description
-   Pricing
-   Variants
-   Options
-   Product media
-   SKU
-   Availability

## 13.2 Wheel Metadata

Determine the actual source for:

-   Construction
-   Finish
-   Diameter
-   Width
-   Bolt pattern
-   Offsets
-   Load rating
-   Weight
-   Center bore
-   Available sizes

Determine whether values originate from:

-   Shopify product
-   Variant
-   Product option
-   Metafield
-   Metaobject
-   External data source

Do not duplicate real product data as hardcoded section settings.

## 13.3 Fitment Data

Determine the existing source and persistence mechanism for:

-   Year
-   Make
-   Model
-   Trim
-   Selected vehicle
-   Compatibility
-   Fitment confirmation
-   Change vehicle
-   Reset vehicle
-   Cross-page persistence

## 13.4 Cart Configuration

Determine how the following are represented in Shopify cart lines:

-   Finish
-   Size
-   Vehicle
-   Fitment
-   Quantity
-   Configuration metadata
-   Line item properties
-   Product options / variants

## 13.5 Dealer Data

Determine whether real data sources currently exist for:

-   Dealer tier
-   Payment terms
-   Account standing
-   Available credit
-   Credit limit
-   Wholesale pricing
-   Quotes
-   Invoices
-   Production status
-   Tracking
-   Activity
-   Dealer users
-   Dealer authentication

Do not invent operational persistence or fake backend state merely to
reproduce the Dealer Dashboard mockup.

------------------------------------------------------------------------

# 14. Phase 9 --- Protect Critical Shopify Functionality

Use the component assessment's risk model as a starting point, then
refine it based on actual repository dependencies.

## Critical Risk

Do not casually replace:

-   Product form
-   Variant selection
-   Add to Cart
-   Cart updates
-   Checkout
-   Payment
-   Collection filtering
-   Fitment logic
-   Customer authentication
-   Dealer authentication
-   Existing integrations

## High Risk

Modify carefully:

-   Header/cart indicators
-   Product gallery
-   Search
-   Account UI
-   Dynamic pricing
-   Recommendations
-   Persistent fitment state

## Medium Risk

Potential examples:

-   Dealer tables
-   Production tracker
-   Quick Order UI
-   Dashboard state
-   Newsletter integration

## Low Risk

Primarily visual/content-driven:

-   Marketing heroes
-   Editorial galleries
-   Promotional banners
-   Section headers
-   Static brand statements

Adjust these classifications if the actual codebase justifies doing so.

For every MEDIUM, HIGH, or CRITICAL change identify:

-   What could break.
-   What depends on it.
-   How the risk can be minimized.
-   What must be regression-tested afterward.

------------------------------------------------------------------------

# 15. Phase 10 --- Global Design System Gap Analysis

Compare the working theme against the component assessment and approved
mockups.

Determine the existing state of:

-   Color variables
-   Typography
-   Heading scale
-   Body typography
-   Spacing
-   Containers
-   Borders
-   Border radii
-   Shadows
-   Breakpoints
-   Buttons
-   Form controls
-   Cards
-   Badges
-   Status indicators
-   Icon system
-   Image treatments

For each classify:

-   `PRESERVE`
-   `MODIFY`
-   `EXTEND`
-   `CREATE`

Prefer updating/reusing existing theme variables and design foundations
over layering a conflicting second design system onto the theme.

------------------------------------------------------------------------

# 16. Phase 11 --- Page-by-Page Gap Analysis

Use the approved page assembly from the component assessment as the
initial expected structure.

Then verify each item against both the mockup and actual theme.

## 16.1 Home

Expected conceptual assembly:

``` text
PublicHeader
→ HomeHero
→ VehicleFinder
→ SignatureWheels
→ CustomizationFeature
→ EngineeringFeature
→ ProcessGallery
→ FittedGalleryFeature
→ NewsletterBanner
→ PublicFooter
```

For every item determine:

-   Existing equivalent
-   Existing file(s)
-   Current functionality
-   Visual gap
-   Required action
-   Risk
-   Dependencies

The Home page is the primary visual authority for the public Calder
brand.

------------------------------------------------------------------------

## 16.2 Category / Collection

Expected conceptual assembly:

``` text
PublicHeader
→ CollectionHero
→ VehicleFitmentBar
→ CollectionNavigation
→ CatalogLayout
    ├── FilterSidebar
    └── CatalogResults
         ├── CatalogToolbar
         ├── ProductGrid
         └── Pagination
→ WheelSpecialistCTA
→ NewsletterBanner
→ PublicFooter
```

Preserve existing Shopify:

-   Collection data
-   Filtering
-   Sorting
-   Pagination
-   Product cards
-   Fitment
-   URLs
-   Search/discovery behavior

Do not replace functional filtering with visual-only controls.

------------------------------------------------------------------------

## 16.3 Product Detail

Expected conceptual assembly:

``` text
PublicHeader
→ Breadcrumbs
→ ProductMain
    ├── ProductGallery
    └── ProductInfo
         ├── ProductHeader
         ├── VehicleFitmentStatus
         ├── ProductConfigurator
         ├── ProductPrice
         ├── AddToCart
         └── ProductTrustStrip
→ ProductSpecifications + EngineeringCard
→ FinishGallery
→ RealWorldGallery
→ ProductRecommendations
→ WheelSpecialistCTA
→ PublicFooter
```

Preserve existing:

-   Product data
-   Variant logic
-   Product forms
-   Pricing
-   Inventory
-   Product media
-   Fitment
-   Line item properties
-   Cart integration

Do not recreate working product controls as static visual elements.

------------------------------------------------------------------------

## 16.4 Cart

Expected conceptual assembly:

``` text
PublicHeader
→ CartPageHeader + CheckoutProgress
→ CartLayout
    ├── CartItemList
    └── OrderSummary
→ Continue Shopping
→ WheelSpecialistCTA
→ PublicFooter
```

Preserve:

-   Shopify cart line behavior
-   Quantity updates
-   Item removal
-   Product options
-   Line item properties
-   Fitment metadata
-   AJAX cart behavior
-   Checkout handoff

------------------------------------------------------------------------

## 16.5 Checkout

Expected conceptual assembly:

``` text
CheckoutHeader
→ CheckoutProgress
→ CheckoutLayout
    ├── CheckoutForms
    │    ├── CustomerInformation
    │    ├── ShippingAddress
    │    ├── ShippingMethods
    │    └── Payment
    └── CheckoutSummary
→ CheckoutFooter
```

Explicitly determine what is technically controlled by:

-   The Shopify theme
-   Shopify Checkout
-   Checkout extensibility
-   The current Shopify plan/account capabilities
-   Enabled payment providers

Do not assume normal theme Liquid can control areas outside the theme's
scope.

Do not hardcode payment methods merely because they appear in the
approved mockup.

------------------------------------------------------------------------

## 16.6 Dealer Dashboard

Expected conceptual assembly:

``` text
DealerShell
├── DealerSidebar
└── DealerMain
     ├── DealerTopbar
     ├── DealerWelcomeHero
     ├── DealerStats
     ├── QuickActions
     ├── DashboardGrid
     │    ├── RecentOrders
     │    └── ProductionTracker
     └── DashboardGrid
          ├── RecentActivity
          └── FeaturedWheels
```

Determine what dealer/B2B functionality already exists before creating
presentation around it.

Do not invent:

-   Authentication
-   Dealer pricing
-   Credit state
-   Production state
-   Quotes
-   Invoices
-   Order tracking
-   User permissions

simply to make the screenshot appear functional.

------------------------------------------------------------------------

# 17. Phase 12 --- Cross-Page Reuse Audit

Use the component assessment's cross-page matrix as a starting point.

Verify which components truly should be shared in the existing
architecture.

Prioritize safe reuse of:

-   Design tokens
-   Typography
-   Buttons
-   Form controls
-   Layout/container primitives
-   Fitment state
-   Fitment status
-   Price displays
-   Product imagery primitives
-   Status badges
-   CheckoutProgress
-   CommerceTrustRow
-   WheelSpecialistCTA
-   NewsletterBanner
-   PublicHeader
-   PublicFooter

Do not over-generalize unique components merely to maximize reuse.

Reuse should occur at the correct architectural level.

------------------------------------------------------------------------

# 18. Phase 13 --- Responsive Implementation Analysis

The approved mockups primarily establish desktop layouts.

Responsive implementation must preserve hierarchy and usability rather
than simply scaling screenshots.

For each component determine:

-   Current responsive behavior
-   Required responsive behavior
-   Existing breakpoints
-   Whether current breakpoints can be reused
-   Whether markup changes are required
-   Whether CSS-only adaptation is sufficient
-   Mobile interaction changes

Specifically evaluate:

## Public Header

Desktop: - Full navigation - Utility actions - Find Your Fit CTA

Mobile: - Calder logo - Essential actions - Menu trigger - Accessible
drawer/overlay

## Hero Sections

Desktop: - Split content/media composition

Mobile: - Intelligent stacking - Headline prominence - CTA visibility -
Appropriate image focal-point handling

## Vehicle Fitment

Desktop: - Four selectors in one row

Tablet/mobile: - Two-column or one-column controls - Full-width CTA -
Selected vehicle remains prominent

## Category Filters

Desktop: - Persistent sidebar

Mobile: - Filter trigger - Drawer/modal - Active filter count - Clear
filters - Separate sort access

## Product Grid

Expected starting behavior:

``` text
Desktop: 3 columns
Tablet: 2 columns
Mobile: 1 column
```

Only use compact two-column mobile layouts where legibility and
interaction remain strong.

## Product Page

Desktop: - Gallery left - Configurator right

Mobile: - Gallery - Product identity - Fitment - Configuration - Price -
Add to Cart - Trust indicators

## Cart

Desktop: - Items left - Summary right

Mobile: - Items first - Summary below or appropriately sticky -
Quantity/edit/remove controls remain usable

## Checkout

Respect actual Shopify checkout responsive behavior.

## Dealer Portal

Desktop: - Persistent sidebar - Topbar - Dashboard grids/tables

Tablet/mobile: - Collapsed sidebar/drawer - Wrapping KPI cards - Stacked
quick actions - Responsive tables/cards - Vertical production tracker
where appropriate - Condensed topbar

------------------------------------------------------------------------

# 19. Phase 14 --- Interaction State Audit

The approved screenshots show only default/static states.

Implementation planning must account for real application states.

## Buttons

-   Default
-   Hover
-   Focus
-   Active
-   Disabled
-   Loading

## Form Fields

-   Default
-   Focus
-   Filled
-   Disabled
-   Error
-   Success where appropriate

## Product Options

-   Available
-   Selected
-   Unavailable
-   Sold out

## Fitment

-   No vehicle
-   Loading
-   Vehicle selected
-   Compatible
-   Incompatible
-   Unknown
-   Changed
-   Reset

## Cart

-   Updating
-   Removing
-   Empty cart
-   Error

## Dealer Status

-   Completed
-   Current
-   Upcoming
-   Good standing
-   Warning/attention where actually supported

Map these states to existing functionality before proposing new state
logic.

------------------------------------------------------------------------

# 20. Phase 15 --- Accessibility Audit

Visual fidelity must not remove required accessibility.

Evaluate:

-   Semantic heading hierarchy
-   Keyboard navigation
-   Visible focus states
-   Accessible form labels
-   Color contrast
-   Image alt strategy
-   Buttons vs. links semantics
-   Accessible carousel controls
-   Status conveyed through text, not color alone
-   Table semantics
-   Mobile navigation accessibility
-   Form error handling
-   Screen-reader announcements where required
-   Accessible names for icon-only controls

Where accessibility requires a minor deviation from a static mockup,
preserve accessibility and document the reason.

------------------------------------------------------------------------

# 21. Phase 16 --- Asset Audit

Compare the working theme and available project assets against the
approved mockups and component assessment.

Classify assets as:

-   `AVAILABLE`
-   `AVAILABLE BUT NEEDS OPTIMIZATION`
-   `MISSING`
-   `CLIENT REQUIRED`
-   `NEEDS CREATION`
-   `CAN BE IMPLEMENTED WITH CSS / CODE`

## Brand Assets

Evaluate:

-   Primary Calder logo
-   Compact Calder mark
-   Light/dark variants
-   Social icons

## Product Assets

Evaluate:

-   Isolated wheel renders
-   Finish variants
-   Product detail images
-   Installed-on-vehicle images

## Editorial / Marketing Assets

Evaluate:

-   Hero vehicle photography
-   Mountain/road imagery
-   Manufacturing/CNC imagery
-   Real-world builds
-   Dealer portal hero imagery

## UI Assets

Prefer SVG/icon systems for:

-   Search
-   Account
-   Cart
-   Fitment
-   Engineering features
-   Support
-   Secure checkout
-   Status icons
-   Dealer navigation

Do not rasterize UI icons unnecessarily.

Existing client-supplied Calder wheel/product renderings are
authoritative.

Do not generatively recreate Calder wheel designs when authoritative
product renders exist.

------------------------------------------------------------------------

# 22. Phase 17 --- Master Implementation Matrix

Create one master matrix combining all four project authorities:

1.  Working theme
2.  Approved mockups
3.  Component assessment
4.  Activation guide

Use:

  ----------------------------------------------------------------------------------------------------
  Page    Assessment   Existing         Guide    Actual   Required   Proposed   Risk    Dependencies
          Component    Implementation   Status   Status   Action     File(s)            
  ------- ------------ ---------------- -------- -------- ---------- ---------- ------- --------------

  ----------------------------------------------------------------------------------------------------

This matrix should become the primary implementation planning artifact.

------------------------------------------------------------------------

# 23. Phase 18 --- Determine Safe Implementation Order

Do not automatically follow the component assessment's implementation
sequence if actual repository dependencies indicate a safer order.

Use the following as the starting framework.

## Stage 0 --- Baseline / Checkpoint

Verify:

-   Correct working theme
-   Git state
-   Uncommitted changes
-   Functional baseline
-   Rollback/checkpoint strategy

## Stage 1 --- Design Foundation

Implement/refine:

-   Design tokens
-   Typography
-   Containers
-   Spacing
-   Buttons
-   Forms
-   Cards
-   Badges
-   Icons
-   Status system

## Stage 2 --- Global Storefront

Implement/refine:

-   Public Header
-   Public Footer
-   Newsletter
-   Wheel Specialist CTA
-   Fitment presentation

## Stage 3 --- Core Commerce

Implement/refine:

-   Product cards
-   Collection grid
-   Filters
-   Sorting
-   Pagination
-   Product gallery
-   Product configurator
-   Finish selection
-   Cart
-   Fitment persistence

## Stage 4 --- Marketing Sections

Implement/refine:

-   Home Hero
-   Signature Wheels
-   Customization
-   Engineering
-   Process Gallery
-   Fitted Gallery
-   Collection Hero
-   Collection Navigation

## Stage 5 --- Product Supporting Sections

Implement/refine:

-   Specifications
-   Engineering Card
-   Finish Gallery
-   Real World Gallery
-   Recommendations

## Stage 6 --- Checkout Branding

Apply supported Calder styling/customization without breaking Shopify
Checkout behavior.

## Stage 7 --- Dealer Portal

Implement only against verified dealer functionality/data:

-   Dealer Shell
-   Sidebar
-   Topbar
-   Dashboard
-   KPI cards
-   Quick actions
-   Orders table
-   Production tracker
-   Activity
-   Dealer product cards

## Stage 8 --- Responsive Pass

Validate:

-   Mobile
-   Tablet
-   Laptop
-   Standard desktop
-   Wide desktop

## Stage 9 --- Functional Regression QA

Test all critical working functionality.

## Stage 10 --- Visual Fidelity QA

Compare implementation directly against all six approved mockups.

For each stage provide:

-   Objective
-   Components
-   Existing files affected
-   Files potentially created
-   Dependencies
-   Risk
-   Functional tests
-   Visual validation required
-   Completion criteria
-   Stop condition before proceeding

------------------------------------------------------------------------

# 24. Change-Safety / Git Rules

Before future implementation begins:

1.  Identify the current Git branch.
2.  Check `git status`.
3.  Identify modified/uncommitted files.
4.  Preserve existing changes.
5.  Determine whether a safe checkpoint/commit exists.
6.  Report the baseline before editing.

Do not:

-   Reset the repository.
-   Force checkout over modified files.
-   Discard modifications.
-   Delete untracked project files.
-   Force pull.
-   Overwrite files wholesale when targeted edits are sufficient.
-   Remove existing sections simply because they do not appear in one
    mockup.
-   Rename referenced files without dependency analysis.
-   Replace working Shopify functionality with static markup.
-   Hardcode product data.
-   Hardcode fitment state.
-   Hardcode cart state.
-   Hardcode checkout/payment state.
-   Hardcode dealer operational state.
-   Duplicate existing components without cause.
-   Introduce an unnecessary second design system.

Prefer:

``` text
surgical edits > file replacement
reuse > duplication
configuration > recreation
CSS/presentation changes > functional rewrites
extension > replacement
```

------------------------------------------------------------------------

# 25. Required Regression Protection

Before eventually changing a working component, identify its regression
surface.

Pay particular attention to:

-   Product data
-   Product variants
-   Product option handling
-   Vehicle fitment
-   Year / Make / Model / Trim selectors
-   Fitment persistence
-   Collection filtering
-   Collection URLs
-   Search
-   Predictive search
-   Cart
-   AJAX cart behavior
-   Cart attributes
-   Line item properties
-   Forms
-   App blocks
-   App embeds
-   Metafields
-   Metaobjects
-   Section schemas
-   Theme Editor settings
-   JavaScript selectors
-   JavaScript event handlers
-   Custom integrations
-   Responsive logic
-   Customer authentication
-   Dealer authentication

Do not change selectors, IDs, classes, data attributes, form field
names, Liquid variables, schema IDs, or other implementation contracts
without tracing dependencies first.

------------------------------------------------------------------------

# 26. Stop Condition --- Critical

## DO NOT IMPLEMENT YET

This first operation is:

``` text
INSPECTION
+
DOCUMENT REVIEW
+
MOCKUP VERIFICATION
+
COMPONENT MAPPING
+
DATA-SOURCE MAPPING
+
GAP ANALYSIS
+
RISK ANALYSIS
+
IMPLEMENTATION PLANNING
```

Do not:

-   Edit Liquid
-   Edit CSS
-   Edit JavaScript
-   Edit JSON templates
-   Modify schemas
-   Create sections
-   Delete files
-   Rename files
-   Modify assets
-   Change Shopify configuration
-   Activate components
-   Change Git state

Return the audit first.

Implementation will be authorized separately after the audit has been
reviewed.

------------------------------------------------------------------------

# 27. Required Audit Output

Return the following structured report.

## 27.1 Source Verification

Confirm inspection of:

### Working Theme

``` text
/Users/admin/Projects/Autonomous Agent/1 - Projects/Calder Wheels/docs/design/Shopify Themes/Working Theme-via-CLI
```

### Approved Mockups

``` text
/Users/admin/Projects/Autonomous Agent/1 - Projects/Calder Wheels/docs/design/mockups/approved-mockups
```

### Component Assessment

``` text
calder-wheels-approved-mockup-layout-component-assessment.md
```

### Activation Guide

``` text
ws1-activation-guide.md
```

------------------------------------------------------------------------

## 27.2 Repository / Git Status

Report:

-   Repository root
-   Current branch
-   Working-tree status
-   Modified files
-   Untracked files
-   Important existing changes
-   Baseline concerns

------------------------------------------------------------------------

## 27.3 Existing Functional Systems

Document what is already implemented and working.

------------------------------------------------------------------------

## 27.4 Activation Guide Findings

Compare documented state against actual code.

------------------------------------------------------------------------

## 27.5 Component Assessment Verification

Report:

-   Architecture confirmed
-   Components confirmed
-   Assumptions requiring adjustment
-   Discrepancies with actual mockups
-   Discrepancies with actual theme architecture

------------------------------------------------------------------------

## 27.6 Current Component Inventory

Inventory relevant:

-   Sections
-   Snippets
-   Templates
-   Assets
-   Scripts
-   Styles
-   Shared components
-   Schemas
-   Data integrations

------------------------------------------------------------------------

## 27.7 Design System Gap Analysis

Determine what already exists versus what must be:

-   Preserved
-   Modified
-   Extended
-   Created

------------------------------------------------------------------------

## 27.8 Approved Mockup Inventory

List each approved mockup and identify:

-   Filename
-   Page represented
-   Application shell
-   Relevant Shopify page/template type
-   Major design characteristics

------------------------------------------------------------------------

## 27.9 Approved Mockup Breakdown

For each approved page list every major section from top to bottom.

------------------------------------------------------------------------

## 27.10 Component Mapping

Map every relevant conceptual component from the assessment to actual
Shopify code.

------------------------------------------------------------------------

## 27.11 Page-by-Page Gap Analysis

Cover:

-   Home
-   Category
-   Product
-   Cart
-   Checkout
-   Dealer Dashboard

------------------------------------------------------------------------

## 27.12 PRESERVE List

Identify working systems/components that should remain functionally
intact.

Explain important dependencies.

------------------------------------------------------------------------

## 27.13 CONFIGURE / ACTIVATE List

Identify existing functionality requiring configuration or activation.

------------------------------------------------------------------------

## 27.14 RESTYLE List

Identify working components requiring primarily visual changes.

------------------------------------------------------------------------

## 27.15 EXTEND List

Identify existing components requiring additional capabilities.

------------------------------------------------------------------------

## 27.16 CREATE List

Identify only genuinely missing components.

For every proposed new component explain why reuse, configuration,
restyling, or extension is insufficient.

------------------------------------------------------------------------

## 27.17 Data Source Map

Identify actual sources for:

-   Product
-   Variant
-   Wheel metadata
-   Fitment
-   Cart configuration
-   Customer/account
-   Dealer
-   Operational status

------------------------------------------------------------------------

## 27.18 Cross-Page Reuse Plan

Identify:

-   Shared systems
-   Shared primitives
-   Shared functional components
-   Deliberate page-specific variants
-   Components that should not be over-merged

------------------------------------------------------------------------

## 27.19 Asset Requirements

Separate assets into:

### AVAILABLE

### AVAILABLE BUT NEEDS OPTIMIZATION

### MISSING

### CLIENT REQUIRED

### NEEDS CREATION

### CAN BE CSS / CODE

------------------------------------------------------------------------

## 27.20 Responsive Requirements

Map desktop-approved designs to required responsive implementation.

------------------------------------------------------------------------

## 27.21 Interaction State Requirements

Document required states not visible in static mockups.

------------------------------------------------------------------------

## 27.22 Accessibility Requirements

Identify implementation requirements or visual conflicts.

------------------------------------------------------------------------

## 27.23 Risk Register

Classify each important implementation area:

-   `CRITICAL`
-   `HIGH`
-   `MEDIUM`
-   `LOW`

Include:

-   Dependencies
-   Potential regressions
-   Mitigation
-   Required tests

------------------------------------------------------------------------

## 27.24 Proposed File Changes

Separate anticipated files into:

### PRESERVE / DO NOT TOUCH

Working files/systems that should remain unchanged unless a demonstrated
dependency requires modification.

### VERIFY BEFORE CHANGING

Files that may need changes but have important dependencies requiring
further verification.

### MODIFY

Existing files likely requiring targeted changes.

### CREATE

New files genuinely required.

Do not actually modify them yet.

------------------------------------------------------------------------

## 27.25 Master Implementation Matrix

Provide:

  -----------------------------------------------------------------------------------------
  Page     Component   Existing         Current   Action   Files    Risk     Dependencies
                       Implementation   Status                               
  -------- ----------- ---------------- --------- -------- -------- -------- --------------

  -----------------------------------------------------------------------------------------

------------------------------------------------------------------------

## 27.26 Recommended Implementation Sequence

Provide a staged execution plan.

For each stage identify:

-   Goal
-   Scope
-   Components
-   Dependencies
-   Affected files
-   Potential new files
-   Risk
-   Functional regression tests
-   Visual validation
-   Completion criteria
-   Stop condition

------------------------------------------------------------------------

## 27.27 Blockers / Questions

Only ask questions that cannot reasonably be answered by inspecting:

-   The working repository
-   Approved mockups
-   Component assessment
-   Activation guide
-   Existing assets
-   Existing Shopify configuration represented in the project

Do not ask the user to manually provide information that is already
available in those sources.

------------------------------------------------------------------------

# 28. Core Decision Framework

For every conceptual component identified in:

``` text
calder-wheels-approved-mockup-layout-component-assessment.md
```

do not begin with:

> How should I build this component?

Begin with:

> What existing code already performs this responsibility?

Then apply the following decision tree.

## Already correct?

``` text
PRESERVE
```

## Exists but inactive or unconfigured?

``` text
CONFIGURE / ACTIVATE
```

## Functionally correct but visually different?

``` text
RESTYLE
```

## Correct foundation but insufficient?

``` text
EXTEND
```

## Truly absent?

``` text
CREATE
```

Creation is the final option, not the default.

------------------------------------------------------------------------

# 29. Page-Level Decision Framework

For every visible section in every approved mockup ask:

1.  What is the conceptual component according to the assessment?
2.  Does an equivalent exist in the working theme?
3.  Does the activation guide mention it?
4.  Is it currently active?
5.  Is the underlying functionality correct?
6.  Is the difference primarily visual?
7.  Can CSS alone achieve the approved result?
8.  Are minor markup changes required?
9.  Does the component require schema/settings extension?
10. Does it require additional data?
11. Does it genuinely require a new component?
12. What could break if it is modified?
13. How will the result be validated?

------------------------------------------------------------------------

# 30. Definition of Visual Completion

A page is not complete merely because all visible sections exist.

Completion requires:

-   Correct overall composition
-   Correct component hierarchy
-   Consistent spacing
-   Correct typography
-   Correct CTA hierarchy
-   Correct dark/light surface treatment
-   Correct imagery
-   Correct borders
-   Correct icons
-   Correct interactive states
-   Functional Shopify behavior
-   Responsive behavior
-   Accessibility
-   Shared components remaining visually consistent across pages

Visual fidelity must be achieved without sacrificing functional
stability.

------------------------------------------------------------------------

# 31. Final Success Criteria

The final implementation should achieve:

## Visual

High visual fidelity to all six approved Calder Wheels mockups.

## Functional

Preservation of:

-   Existing Shopify functionality
-   Existing integrations
-   Fitment behavior
-   Product/variant behavior
-   Collection/filter behavior
-   Cart behavior
-   Checkout constraints
-   Customer/account behavior
-   Dealer functionality where actually supported

## Architectural

Maintain:

-   Reusable architecture
-   Correct component boundaries
-   Centralized design tokens
-   Theme Editor compatibility
-   Data-driven commerce behavior
-   Minimal duplication
-   Maintainability

## Experience

Maintain:

-   Responsive behavior
-   Accessibility
-   Interaction states
-   Cross-page consistency
-   Premium Calder automotive character

------------------------------------------------------------------------

# 32. Final Directive

The four project authorities serve different purposes:

### Working Shopify Theme

Defines the **technical starting point and functional reality**.

### Approved Mockups

Define the **target appearance and UX**.

### Approved Mockup Layout & Component Assessment

Defines the **target conceptual architecture and reuse strategy**.

### `ws1-activation-guide.md`

Defines the **known implementation history and activation context**.

Your task is to reconcile all four into one safe implementation plan.

Do not rebuild working systems merely because conceptual component names
differ.

Do not create duplicate components when equivalent functionality exists.

Do not hardcode dynamic commerce or operational data simply to reproduce
screenshot content.

Do not sacrifice Shopify functionality for visual fidelity.

Do not sacrifice the approved design unnecessarily because the current
theme looks different.

The target is:

> **The smallest, safest, maintainable set of changes that transforms
> the existing working Shopify theme into the client-approved Calder
> Wheels experience.**

------------------------------------------------------------------------

# 33. Begin

Begin by inspecting:

## Functional Baseline

``` text
/Users/admin/Projects/Autonomous Agent/1 - Projects/Calder Wheels/docs/design/Shopify Themes/Working Theme-via-CLI
```

## Approved Visual References

``` text
/Users/admin/Projects/Autonomous Agent/1 - Projects/Calder Wheels/docs/design/mockups/approved-mockups
```

## Component Architecture Reference

``` text
calder-wheels-approved-mockup-layout-component-assessment.md
```

## Implementation / Activation Documentation

``` text
ws1-activation-guide.md
```

Then perform the complete audit described in this document.

**Do not implement or modify anything yet. Return the audit and proposed
implementation plan first.**
