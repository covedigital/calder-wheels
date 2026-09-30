# Calder Wheels --- Approved Mockup Visual Layout & Component Assessment

**Project:** Calder Wheels\
**Phase:** Design-to-Code / Shopify Implementation Planning\
**Source of truth:** Six approved desktop mockups\
**Purpose:** Provide an AI development agent with a page-by-page visual
layout assessment, shared-component map, component hierarchy, reuse
strategy, and implementation guidance.

------------------------------------------------------------------------

## 1. Assessment Scope

This document analyzes the following approved Calder Wheels mockups:

1.  `Calder - 1 - Home.png`
2.  `Calder - 2 - Category.png`
3.  `Calder - 3 - Product.png`
4.  `Calder - 4 - Cart.png`
5.  `Calder - 5 - Checkout.png`
6.  `Calder - 6 - Dealer Dashboard.png`

The objective is **not** to treat these as six isolated screenshots to
reproduce independently. The objective is to identify the underlying
design system and component architecture required to reproduce the
approved experience efficiently, consistently, and safely within the
working Shopify implementation.

The implementation should identify:

-   Global design tokens and primitives
-   Shared public storefront components
-   Shared fitment components and state
-   Shared commerce components
-   Page-specific marketing sections
-   Checkout-specific components
-   Dealer portal application components
-   Component variants
-   Data-driven vs. primarily visual sections
-   Responsive behavior
-   Existing Shopify functionality that should be preserved
-   Missing components that need to be created
-   Existing components that only require visual restyling or extension

------------------------------------------------------------------------

# 2. Core Implementation Principle

The six mockups should be interpreted as a **design system expressed
through three application shells**:

1.  **Public Storefront**
    -   Home
    -   Category / Collection
    -   Product
    -   Cart
2.  **Transactional Checkout**
    -   Checkout
3.  **Authenticated Dealer Portal**
    -   Dealer Dashboard

These shells share Calder's visual identity but should **not** be forced
into identical page structures.

The recommended architecture is:

``` text
Design Tokens
    ↓
UI Primitives
    ↓
Shared Functional Components
    ↓
Shared Section Components
    ↓
Page-Specific Sections
    ↓
Page Templates / Application Shells
```

The AI implementation agent should favor reuse at the **correct level**.
Reuse typography, buttons, fields, badges, cards, status treatments,
fitment state, product data, and layout primitives aggressively. Do not
over-generalize visually or functionally distinct page sections merely
because they share colors or imagery.

------------------------------------------------------------------------

# 3. Global Calder Visual Design System

The six mockups establish a coherent visual language.

## 3.1 Brand Character

The visual direction is:

-   Premium
-   Automotive
-   Precision-engineered
-   Performance-oriented
-   Technical without feeling industrial or utilitarian
-   Editorial rather than generic e-commerce
-   Restrained rather than flashy
-   Luxury-oriented without relying on excessive decoration

The design repeatedly combines:

-   Deep navy / blue-black surfaces
-   Bright white commerce surfaces
-   Champagne / bronze accents
-   Large premium automotive photography
-   Strong uppercase typography
-   Fine borders
-   Minimal outline icons
-   Structured grids
-   Generous whitespace

------------------------------------------------------------------------

## 3.2 Color Roles

Exact values should ultimately come from the supplied Calder brand
kit/theme variables rather than sampling screenshots where possible.

  -----------------------------------------------------------------------
  Role                                Intended Usage
  ----------------------------------- -----------------------------------
  Deep Navy / Blue-Black              Headers, footers, dark banners,
                                      dealer navigation, premium
                                      background surfaces

  White                               Main commerce backgrounds, cards,
                                      forms

  Cool Off-White                      Section differentiation, dashboard
                                      surfaces

  Champagne / Bronze / Gold           Primary accent, highlighted CTAs,
                                      eyebrows, borders, active details

  Steel Blue / Gray                   Secondary copy, inactive states,
                                      subtle UI

  Green                               Fitment confirmation,
                                      account-good-standing, success
                                      states

  Light Gray                          Borders, separators, input
                                      backgrounds, disabled states

  Black / Dark Navy Text              Main body and commerce typography
  -----------------------------------------------------------------------

Avoid inventing additional accent colors unless required by functional
status states.

------------------------------------------------------------------------

# 4. Typography System

The mockups use typography as a major brand element.

## 4.1 Display Headlines

Characteristics:

-   Uppercase
-   Heavy weight
-   Tight line-height
-   High visual contrast
-   Used for hero statements and major section titles

Examples:

-   MADE WITH PRECISION
-   FORGED WHEELS
-   SHOPPING CART
-   ENGINEERED TO PERFORM
-   CUSTOMIZE WITHOUT LIMITS

## 4.2 Eyebrows / Section Labels

Characteristics:

-   Uppercase
-   Small
-   Wide tracking
-   Bronze/gold frequently used
-   Positioned above major headlines

Examples:

-   OUR COLLECTION
-   YOUR ORDER
-   PRODUCT DETAILS
-   AVAILABLE FINISHES
-   DEALER PORTAL

## 4.3 Body Copy

Characteristics:

-   Clean sans-serif
-   Moderate line-height
-   Dark navy/gray on light backgrounds
-   White/light gray on dark surfaces

## 4.4 Labels and Controls

-   Uppercase frequently used for actions and metadata
-   Strong hierarchy between labels and values
-   Button labels are typically uppercase with letter spacing

------------------------------------------------------------------------

# 5. Global UI Primitives

The agent should establish reusable primitives before building
page-specific sections.

Recommended primitives:

``` text
Container
Section
SectionHeader
Eyebrow
Heading
BodyText
Label
TextLink
PrimaryButton
SecondaryButton
OutlineButton
IconButton
Badge
StatusBadge
Card
ImageCard
Divider
FormField
SelectField
RadioControl
Checkbox
RadioCard
QuantitySelector
Tabs
IconFeature
PriceDisplay
ProductImage
Breadcrumbs
ProgressBar
CarouselControls
```

These should use centralized spacing, type, color, border, radius, and
interaction tokens.

------------------------------------------------------------------------

# 6. Spacing and Layout Philosophy

The public site uses a broad centered desktop container with:

-   Large section spacing
-   Clear horizontal alignment
-   Strong grid relationships
-   Relatively restrained card radii
-   Thin borders
-   Minimal decorative shadow
-   Strategic overlap between hero and fitment surfaces

Commerce pages become denser but remain spacious enough to preserve the
premium positioning.

The dealer portal intentionally becomes more information-dense.

The agent should create reusable layout utilities such as:

``` text
.page-container
.content-grid
.section-spacing
.stack
.cluster
.two-column-layout
.three-column-grid
.card-grid
.sticky-column
.full-bleed-section
```

Exact naming can follow the existing theme architecture.

------------------------------------------------------------------------

# 7. Public Storefront Application Shell

The following pages share the main storefront shell:

-   Home
-   Category
-   Product
-   Cart

The shared shell primarily consists of:

``` text
PublicHeader
Page Content
PublicFooter
```

Home and Category additionally use newsletter functionality. Category,
Product, and Cart reuse variants of the Wheel Specialist CTA.

------------------------------------------------------------------------

# 8. Shared Public Header

## Appears On

-   Home
-   Category
-   Product
-   Cart

## Visual Structure

### Left

Calder Wheels logo.

### Center

Primary navigation.

Navigation wording varies slightly across the mockups. This should
therefore be data-driven through Shopify navigation rather than
duplicated or hardcoded per template.

Typical navigation concepts shown include:

-   Wheels
-   Our Collection
-   By Vehicle
-   Gallery
-   Engineering
-   Knowledge / Resources / About
-   Dealers

### Right

Utility/action group:

-   Search
-   Customer account
-   Cart
-   Find Your Fit CTA

## Recommended Components

``` text
PublicHeader
├── BrandLogo
├── DesktopNavigation
│   └── NavigationItem
├── HeaderActions
│   ├── SearchButton
│   ├── AccountButton
│   ├── CartButton
│   └── FitmentCTA
└── MobileNavigation
```

## Required States

-   Default
-   Hover
-   Current page
-   Cart empty
-   Cart with count
-   Mobile open/closed
-   Account logged in/logged out where relevant

## Implementation Rule

Build one configurable public header. Do not create separate header
implementations for Home, Category, Product, and Cart.

------------------------------------------------------------------------

# 9. Shared Public Footer

## Appears On

-   Home
-   Category
-   Product
-   Cart

## Common Structure

### Brand Column

-   Calder logo
-   Short brand statement
-   Social icons

### Navigation Columns

Usually organized around:

-   Shop
-   Explore
-   Support

### Engagement / Brand Column

Depending on page and version:

-   Brand statement
-   Newsletter field
-   Journey/community messaging

### Bottom Legal Bar

-   Copyright
-   Privacy
-   Terms
-   Accessibility
-   Country/region
-   U.S./Florida brand indicator depending on approved variant

## Recommended Architecture

``` text
PublicFooter
├── FooterBrand
├── FooterMenuGroup[]
├── FooterEngagement
├── SocialLinks
└── FooterLegal
```

Menus should use Shopify menu data where practical.

------------------------------------------------------------------------

# 10. Shared Vehicle Fitment System

Vehicle fitment is one of the most important cross-page systems in the
entire design.

It appears directly or indirectly on:

-   Home
-   Category
-   Product
-   Cart
-   Checkout

Dealer functionality may eventually consume related vehicle/application
data as well.

The fitment system should be treated as **shared state with multiple UI
presentations**, not as separate unrelated forms.

------------------------------------------------------------------------

## 10.1 Unselected State

Typical controls:

1.  Year
2.  Make
3.  Model
4.  Trim
5.  Find Wheels

------------------------------------------------------------------------

## 10.2 Selected State

Example:

``` text
2024 BMW M3 Competition xDrive
```

Associated actions/states:

-   Fits Your Vehicle
-   Fitment Confirmed
-   Change Vehicle
-   Reset
-   Selected vehicle shown in catalog toolbar
-   Vehicle carried into product configuration
-   Vehicle carried into cart
-   Vehicle shown in checkout summary

------------------------------------------------------------------------

## 10.3 Recommended Architecture

``` text
VehicleFitmentState / FitmentProvider
│
├── VehicleFitmentSelector
├── VehicleFitmentBar
├── SelectedVehicle
├── VehicleFitmentStatus
├── FitmentBadge
├── ChangeVehicleAction
└── ResetVehicleAction
```

The actual implementation may use the theme's existing JavaScript/data
architecture instead of a literal provider pattern.

The important requirement is that fitment should behave as a **single
logical system**.

------------------------------------------------------------------------

# 11. Shared Product / Wheel Data Model

Across the six designs, wheel products repeatedly expose:

-   Model
-   Construction/type
-   Finish
-   Diameter
-   Width
-   Bolt pattern
-   Vehicle/application
-   Available sizes
-   Product image
-   Installed/lifestyle imagery
-   Price
-   Starting price
-   Dealer price
-   MSRP
-   Fitment status

The agent should identify which values originate from:

-   Shopify product
-   Shopify variant
-   Product option
-   Product metafield
-   Metaobject
-   Fitment integration/database
-   Dealer-specific system

Avoid duplicating the same wheel metadata as hardcoded section settings.

------------------------------------------------------------------------

# 12. Shared Wheel Specialist CTA

Variants appear on:

-   Category
-   Product
-   Cart

Common visual language:

-   Dark navy photographic banner
-   Wheel/automotive imagery
-   White headline
-   Supporting copy
-   Gold/champagne CTA
-   Optional outlined secondary CTA
-   Contact methods on some variants

Recommended component:

``` text
WheelSpecialistCTA
```

Configurable properties:

``` text
eyebrow
headline
body
background/image
primary CTA
secondary CTA
contact actions
layout variant
```

------------------------------------------------------------------------

# 13. Shared Newsletter Banner

Prominent versions appear on:

-   Home
-   Category

Visual characteristics:

-   Full-width landscape/mountain automotive environment
-   Dark overlay
-   White text
-   Email field
-   Champagne/gold subscribe button
-   Supporting benefit strip

Recommended architecture:

``` text
NewsletterBanner
├── NewsletterContent
├── NewsletterForm
└── NewsletterBenefits
    └── IconFeature[]
```

------------------------------------------------------------------------

# 14. Shared Status System

The mockups use status indicators extensively.

Examples include:

-   Fits Your Vehicle
-   Fitment Confirmed
-   Made to Order
-   Account in Good Standing
-   In Production
-   Finishing
-   Quality Check
-   Preparing to Ship
-   Shipped

Recommended primitive:

``` text
StatusBadge
```

Possible semantic variants:

``` text
success
info
warning
production
neutral
special
```

The dealer portal may require more status variants than the public
storefront.

------------------------------------------------------------------------

# 15. PAGE 1 --- HOME

The Home page is the **primary visual authority for the public Calder
brand**.

It establishes:

-   Main brand mood
-   Header behavior
-   Dark navy treatment
-   Photography style
-   Gold accent usage
-   Headline scale
-   CTA style
-   Icon language
-   Section spacing
-   Editorial presentation

------------------------------------------------------------------------

## 15.1 Public Header

**Shared:** Yes\
**Component:** `PublicHeader`

Use the shared storefront implementation.

------------------------------------------------------------------------

## 15.2 Cinematic Home Hero

**Shared:** No --- homepage-specific composition.

### Layout

Large full-width automotive hero.

### Left Content

-   Eyebrow: luxury/performance positioning
-   Large headline: MADE WITH PRECISION
-   Supporting tagline
-   Descriptive copy
-   Primary CTA
-   Secondary CTA

### Right Content

-   Dominant vehicle/wheel photography
-   Large wheel close-up
-   Vertical brand statement
-   Fine gold divider treatment

### Bottom Feature Strip

Three compact proof/value items:

-   Premium Materials
-   Custom Engineered
-   Proven Performance

### Recommended Components

``` text
HomeHero
├── HeroMedia
├── HeroContent
│   ├── Eyebrow
│   ├── Heading
│   ├── BodyText
│   └── HeroActions
├── HeroBrandStatement
└── HeroFeatureStrip
    └── IconFeature[]
```

### Implementation Notes

This should remain a dedicated homepage hero. Do not attempt to make it
the same component as the Collection Hero or Dealer Welcome Hero.

------------------------------------------------------------------------

# 16. Home --- Vehicle Finder

A prominent white panel visually bridges the hero and commerce content.

## Layout

Top tabs:

-   Shop by Vehicle
-   Shop by Wheel Style

Primary vehicle form:

-   Year
-   Make
-   Model
-   Trim
-   Find Wheels

Secondary row:

-   Popular Searches
-   Vehicle brand links

## Components

``` text
VehicleFinder
├── FinderTabs
├── VehicleFitmentSelector
└── PopularVehicleLinks
```

## Shared Logic

Reuse the central fitment system.

The visual shell is homepage-specific; the actual Year/Make/Model/Trim
logic should not be duplicated.

------------------------------------------------------------------------

# 17. Home --- Signature Wheels

## Section Header

-   Eyebrow: OUR COLLECTION
-   Heading: SIGNATURE WHEELS
-   View All Wheels action

## Layout

Three-column editorial product presentation.

Each item contains:

-   Large lifestyle/product image
-   Model
-   Construction
-   Short brand-oriented description
-   View Details

## Component

``` text
SignatureWheels
└── FeaturedWheelCard[]
```

## Important Distinction

`FeaturedWheelCard` should not be forced to use the exact same markup as
the Category `WheelProductCard`.

The homepage card is editorial.

The Category card is transactional/catalog-oriented.

Both can share lower-level product typography, price, image, and
metadata primitives.

------------------------------------------------------------------------

# 18. Home --- Customize Without Limits

Full-width dark promotional section.

## Composition

### Left

-   Oversized wheel close-up

### Right

-   Eyebrow
-   CUSTOMIZE WITHOUT LIMITS
-   Supporting copy
-   Build Yours CTA

### Bottom / Right Process

1.  Select Design
2.  Choose Finish
3.  Review Specs
4.  Bring It to Life

## Components

``` text
CustomizationFeature
├── FeatureMedia
├── FeatureContent
└── ProcessSteps
    └── ProcessStep[]
```

`ProcessSteps` can be reusable even if the parent section remains
homepage-specific.

------------------------------------------------------------------------

# 19. Home --- Engineered to Perform

## Layout

Three-part editorial composition.

### Left

-   Eyebrow
-   ENGINEERED TO PERFORM
-   Body copy
-   Engineering CTA

### Center

Manufacturing / machining photograph.

### Right

Precision feature list:

-   Forged Aluminum
-   CNC Machined
-   Strength Tested
-   Real World Proven

## Components

``` text
EngineeringFeature
├── EditorialContent
├── EngineeringMedia
└── EngineeringFeatureList
    └── IconFeature[]
```

The feature vocabulary should be reusable on the Product page.

------------------------------------------------------------------------

# 20. Home --- From Concept to Reality

Image-driven process/storytelling section.

## Content

-   Eyebrow
-   FROM CONCEPT TO REALITY
-   Brand statement
-   Four horizontal automotive/process images

## Component

``` text
ProcessGallery
└── ProcessGalleryItem[]
```

This is an editorial gallery, not a product grid.

------------------------------------------------------------------------

# 21. Home --- Fitted Gallery / Real Builds

## Header

-   Eyebrow: FITTED GALLERY
-   REAL BUILDS. REAL DRIVERS.
-   View Gallery

## Feature Composition

### Left

-   BUILT FOR YOUR VEHICLE
-   Supporting copy
-   Start Your Build CTA
-   Exploded wheel imagery

### Right

-   Automotive lifestyle image
-   Small brand statement

## Component

``` text
FittedGalleryFeature
```

This should support configurable imagery and copy.

------------------------------------------------------------------------

# 22. Home --- Newsletter

Reuse:

``` text
NewsletterBanner
```

Benefit items shown include concepts such as:

-   New Releases
-   Exclusive Builds
-   Events & Partnerships
-   Special Offers

------------------------------------------------------------------------

# 23. Home --- Footer

Reuse:

``` text
PublicFooter
```

------------------------------------------------------------------------

# 24. PAGE 2 --- CATEGORY / COLLECTION

The Category page shifts the system from brand storytelling into
**catalog discovery and fitment-driven shopping**.

The dominant experience is:

``` text
Hero
→ Fitment
→ Collection Navigation
→ Filters + Product Results
→ Support CTA
```

------------------------------------------------------------------------

# 25. Category --- Public Header

Reuse:

``` text
PublicHeader
```

------------------------------------------------------------------------

# 26. Category --- Collection Hero

A shorter, more functional hero than Home.

## Left

-   Eyebrow: OUR COLLECTION
-   FORGED WHEELS
-   Supporting description

## Right / Background

-   Mountains
-   Vehicle/wheel detail
-   Vertical brand statement

## Component

``` text
CollectionHero
```

This may use a generic `InteriorPageHero` primitive internally, but the
approved composition should remain distinct from the homepage hero.

------------------------------------------------------------------------

# 27. Category --- Vehicle Fitment Bar

Large white fitment panel overlapping or immediately following the hero.

## Header Row

-   Vehicle icon
-   FIND WHEELS FOR YOUR VEHICLE
-   Current vehicle
-   Reset

## Form Row

-   Year
-   Make
-   Model
-   Trim
-   Find Wheels

## Component

``` text
VehicleFitmentBar
```

Reuse fitment logic from the shared fitment system.

------------------------------------------------------------------------

# 28. Category --- Collection Navigation

Five visual tiles:

1.  All Wheels
2.  Forged Monoblock
3.  Forged 3-Piece
4.  By Vehicle
5.  By Style

Each tile contains:

-   Background image
-   Icon
-   Label
-   Selected state

## Components

``` text
CollectionNavigation
└── CollectionNavCard[]
```

## States

-   Default
-   Hover
-   Active/selected

------------------------------------------------------------------------

# 29. Category --- Main Catalog Layout

Desktop structure:

``` text
Filter Sidebar | Results Area
```

The results area contains:

``` text
Catalog Toolbar
Product Grid
Pagination
```

Recommended wrapper:

``` text
CatalogLayout
├── FilterSidebar
└── CatalogResults
```

------------------------------------------------------------------------

# 30. Category --- Filter Sidebar

Filter groups shown:

-   Wheel Type
-   Diameter
-   Width
-   Bolt Pattern
-   Finish
-   Vehicle Fitment
-   Collection

## Components

``` text
FilterSidebar
├── FilterHeader
│   └── ClearFilters
└── FilterGroup[]
    └── FilterOption[]
```

## Required Behavior

-   Collapsible groups
-   Checked/unchecked states
-   Counts
-   Clear All
-   Shopify filtering integration
-   Mobile drawer/modal transformation

Do not replace functional Shopify filtering with a visual-only
recreation.

------------------------------------------------------------------------

# 31. Category --- Catalog Toolbar

Contains:

-   Results count
-   Selected vehicle
-   Change Vehicle
-   Sort By
-   Sort dropdown
-   Grid/list view controls

## Components

``` text
CatalogToolbar
├── ResultsCount
├── SelectedVehicleChip
├── SortControl
└── ViewToggle
```

------------------------------------------------------------------------

# 32. Category --- Wheel Product Card

This is the main consumer catalog product component.

## Content

-   Fits Your Vehicle badge
-   Favorite control
-   Large wheel image
-   Model
-   Construction
-   Finish
-   Available sizes
-   Starting price
-   View Details CTA

## Component

``` text
WheelProductCard
├── FitmentBadge
├── FavoriteButton
├── ProductImage
├── ProductIdentity
├── ProductMetadata
├── PriceDisplay
└── ProductCTA
```

## Required States

-   Fits vehicle
-   Unknown/unselected vehicle
-   Favorite/unfavorite
-   Available/unavailable
-   Variable pricing
-   Hover

------------------------------------------------------------------------

# 33. Category --- Product Grid

Three-column desktop grid in the approved mockup.

Recommended:

``` text
ProductGrid
└── WheelProductCard[]
```

Responsive behavior should reduce columns progressively.

------------------------------------------------------------------------

# 34. Category --- Pagination

Contains:

-   Active page
-   Adjacent pages
-   Ellipsis
-   Next arrow

Component:

``` text
Pagination
```

Preserve Shopify collection pagination behavior.

------------------------------------------------------------------------

# 35. Category --- Wheel Specialist CTA

Approved message:

-   Need help finding the right setup?
-   Find Your Fit
-   Contact a Wheel Specialist

Reuse:

``` text
WheelSpecialistCTA
```

------------------------------------------------------------------------

# 36. Category --- Newsletter

Reuse:

``` text
NewsletterBanner
```

------------------------------------------------------------------------

# 37. Category --- Footer

Reuse:

``` text
PublicFooter
```

------------------------------------------------------------------------

# 38. PAGE 3 --- PRODUCT DETAIL

The Product page is the primary **product evaluation + fitment +
configuration + add-to-cart** experience.

The page combines:

-   Product media
-   Product information
-   Fitment
-   Variant/configuration controls
-   Price
-   Add to cart
-   Technical specifications
-   Finish discovery
-   Real-world photography
-   Recommendations

------------------------------------------------------------------------

# 39. Product --- Public Header

Reuse:

``` text
PublicHeader
```

------------------------------------------------------------------------

# 40. Product --- Breadcrumbs

Example:

``` text
Wheels / Forged Monoblock / C1
```

Component:

``` text
Breadcrumbs
```

------------------------------------------------------------------------

# 41. Product --- Main Product Layout

Desktop:

``` text
Product Gallery | Product Information / Configurator
```

Recommended wrapper:

``` text
ProductMain
├── ProductGallery
└── ProductInfo
```

------------------------------------------------------------------------

# 42. Product --- Product Gallery

## Main Media

Large dominant product image.

## Controls

-   Zoom
-   Previous
-   Next

## Thumbnail Row

Examples:

-   Primary wheel
-   Installed vehicle
-   Brand/detail
-   Brake/wheel detail
-   Alternate wheel angle

## Components

``` text
ProductGallery
├── ProductMedia
├── ImageZoom
├── GalleryNavigation
└── ThumbnailCarousel
```

The gallery should be data-driven from Shopify product media and/or
product metafields.

------------------------------------------------------------------------

# 43. Product --- Product Identity

Displays:

-   C1
-   Forged Monoblock
-   Product tagline
-   Description
-   Rating
-   Review count
-   SKU
-   Made to Order badge

## Components

``` text
ProductHeader
├── ProductTitle
├── ProductType
├── ProductTagline
├── ProductDescription
├── ProductRating
├── ProductSKU
└── ProductStatusBadge
```

------------------------------------------------------------------------

# 44. Product --- Fitment Confirmation

Selected vehicle panel:

-   Green confirmation icon
-   Fits Your Vehicle
-   Vehicle name
-   Change Vehicle

Reuse:

``` text
VehicleFitmentStatus
```

This is a display/configuration variant of the global fitment system.

------------------------------------------------------------------------

# 45. Product --- Product Configurator

Controls shown:

-   Diameter
-   Width
-   Finish
-   Finish swatches
-   Vehicle Fitment / Application
-   Quantity

## Components

``` text
ProductConfigurator
├── OptionSelector
├── FinishSelector
│   └── FinishSwatch[]
├── ApplicationSelector
└── QuantitySelector
```

## Critical Requirement

This must be bound to actual Shopify product/variant logic.

Do not recreate the controls as static visual elements if a working
product form already exists.

------------------------------------------------------------------------

# 46. Product --- Price and Add to Cart

Contains:

-   Starting at
-   Price per wheel
-   Add to Cart
-   Save
-   Share

## Components

``` text
ProductPrice
AddToCartButton
ProductActions
```

Product pricing must reflect selected configuration/variant.

------------------------------------------------------------------------

# 47. Product --- Trust Strip

Items include:

-   Made to Order
-   Worldwide Shipping
-   Secure Checkout

Component:

``` text
ProductTrustStrip
└── IconFeature[]
```

------------------------------------------------------------------------

# 48. Product --- Specifications

## Section Header

-   Product Details
-   SPECIFICATIONS

## Table Rows

-   Construction
-   Material
-   Diameter
-   Widths
-   Finishes
-   Bolt Patterns
-   Offsets
-   Load Rating
-   Weight
-   Center Bore

## Components

``` text
ProductSpecifications
└── SpecificationTable
    └── SpecificationRow[]
```

Data should ideally come from product metafields/metaobjects.

------------------------------------------------------------------------

# 49. Product --- Engineering Card

Dark photographic panel:

-   ENGINEERED TO PERFORM
-   Supporting copy
-   Manufacturing imagery

Feature row:

-   Forged Aluminum
-   CNC Machined
-   Strength Tested
-   Real World Proven

## Component

``` text
EngineeringCard
└── IconFeature[]
```

Reuse the same brand/engineering feature vocabulary established on Home.

------------------------------------------------------------------------

# 50. Product --- Choose Your Finish

Horizontal wheel finish carousel.

Examples:

-   Satin Black
-   Gloss Black
-   Brushed Bronze
-   Satin Gunmetal
-   Brushed Silver
-   Gloss Silver

## Components

``` text
FinishGallery
├── CarouselControls
└── FinishGalleryItem[]
```

Selected finish receives a bronze/gold border.

Ideally, selecting a finish should synchronize with the product
configurator where the underlying data supports it.

------------------------------------------------------------------------

# 51. Product --- Real World Gallery

Header:

-   SEE IT IN THE REAL WORLD
-   Supporting description
-   View Gallery

Horizontal vehicle gallery.

## Component

``` text
RealWorldGallery
```

Potential data source:

-   Product metafield
-   Product metaobject relationship
-   Gallery metaobjects
-   Manually assigned section content

------------------------------------------------------------------------

# 52. Product --- Recommendations

Header:

-   YOU MAY ALSO LIKE
-   Supporting description
-   View All Wheels

Four compact product cards.

## Recommended Architecture

``` text
ProductRecommendations
└── WheelProductCard variant="compact"
```

Compact card content:

-   Wheel image
-   Model
-   Construction
-   Price
-   Arrow/link

------------------------------------------------------------------------

# 53. Product --- Wheel Specialist CTA

Reuse:

``` text
WheelSpecialistCTA
```

Approved emphasis:

-   Need help with fitment?
-   Contact a Wheel Specialist
-   Get in Touch
-   Call
-   Live Chat
-   Email

------------------------------------------------------------------------

# 54. Product --- Footer

Reuse:

``` text
PublicFooter
```

------------------------------------------------------------------------

# 55. PAGE 4 --- CART

The Cart intentionally removes most storytelling and concentrates on
transaction confidence.

Primary goals:

-   Review configured products
-   Verify fitment
-   Modify quantity/configuration
-   Understand totals
-   Proceed to checkout

------------------------------------------------------------------------

# 56. Cart --- Public Header

Reuse:

``` text
PublicHeader
```

------------------------------------------------------------------------

# 57. Cart --- Page Header

## Left

-   Eyebrow: YOUR ORDER
-   SHOPPING CART

## Right

Three-step progress:

1.  Cart
2.  Checkout
3.  Confirmation

## Component

``` text
CheckoutProgress
```

The component should accept arbitrary step definitions so Checkout can
use the five-stage version.

------------------------------------------------------------------------

# 58. Cart --- Main Layout

Desktop:

``` text
Cart Items | Order Summary
```

Recommended:

``` text
CartLayout
├── CartItemList
└── CartSummary
```

------------------------------------------------------------------------

# 59. Cart --- Cart Item

Each item includes:

-   Product image
-   Model
-   Construction
-   Finish
-   Size
-   Bolt Pattern
-   Vehicle
-   Fitment confirmation
-   Quantity selector
-   Price
-   Set quantity
-   Edit Configuration
-   Remove

## Component

``` text
CartItem
├── CartProductImage
├── CartItemDetails
├── FitmentStatus
├── QuantitySelector
├── CartItemPrice
└── CartItemActions
```

## Critical Requirement

Preserve actual Shopify cart line-item behavior.

Configuration metadata should be represented through product options
and/or line item properties as appropriate.

------------------------------------------------------------------------

# 60. Cart --- Order Summary

Displays:

-   Subtotal
-   Shipping
-   Taxes
-   Estimated Total
-   Financing/payment message
-   Proceed to Checkout
-   Continue Shopping

## Components

``` text
OrderSummary
├── OrderTotals
├── FinancingMessage
├── CheckoutCTA
└── ContinueShoppingCTA
```

------------------------------------------------------------------------

# 61. Cart --- Commerce Trust Row

Three items:

-   Secure Checkout
-   Fitment Verified
-   Customer Support

Component:

``` text
CommerceTrustRow
└── IconFeature[]
```

This same visual vocabulary is reused in Checkout.

------------------------------------------------------------------------

# 62. Cart --- Continue Shopping

A simple back/continue link appears beneath the cart items.

Use a shared text-link/action primitive rather than a dedicated large
component.

------------------------------------------------------------------------

# 63. Cart --- Wheel Specialist CTA

Reuse:

``` text
WheelSpecialistCTA
```

Approved content direction:

-   Questions about your setup?
-   Contact a Wheel Specialist
-   Get in Touch

------------------------------------------------------------------------

# 64. Cart --- Footer

Reuse:

``` text
PublicFooter
```

------------------------------------------------------------------------

# 65. PAGE 5 --- CHECKOUT

Checkout intentionally uses a **different shell** from the public
storefront.

This distinction is important.

Do not force the full public navigation or marketing footer into the
checkout experience.

The checkout is designed for:

-   Focus
-   Trust
-   Clarity
-   Reduced distraction
-   Transaction completion

------------------------------------------------------------------------

# 66. Checkout --- Minimal Header

## Left

Calder logo.

## Center / Right

-   Secure Checkout icon
-   Security reassurance
-   Return to Cart

## Component

``` text
CheckoutHeader
```

This should remain distinct from `PublicHeader`.

------------------------------------------------------------------------

# 67. Checkout --- Progress Indicator

Five stages:

1.  Cart
2.  Information
3.  Shipping
4.  Payment
5.  Confirmation

Reuse:

``` text
CheckoutProgress
```

with configurable steps/current state.

------------------------------------------------------------------------

# 68. Checkout --- Main Layout

Desktop:

``` text
Checkout Forms | Persistent Order Summary
```

Recommended:

``` text
CheckoutLayout
├── CheckoutForms
└── CheckoutSummary
```

The summary may be sticky on desktop.

------------------------------------------------------------------------

# 69. Checkout --- Customer Information

Fields:

-   Email Address
-   Phone Number

## Component

``` text
CheckoutCustomerInformation
```

Uses shared form primitives.

------------------------------------------------------------------------

# 70. Checkout --- Shipping Address

Fields:

-   First Name
-   Last Name
-   Address
-   Apartment / Suite
-   City
-   State
-   ZIP Code
-   Country

## Component

``` text
ShippingAddressForm
```

------------------------------------------------------------------------

# 71. Checkout --- Delivery

Shipping method cards:

### Standard Shipping

-   Estimated delivery
-   Price

### Expedited Shipping

-   Estimated delivery
-   Price

## Components

``` text
ShippingMethods
└── ShippingMethodCard[]
```

The cards use radio selection behavior.

------------------------------------------------------------------------

# 72. Checkout --- Payment

The approved mockup visually includes:

-   Credit or Debit Card
-   PayPal
-   Affirm

with card fields beneath.

## Conceptual Component

``` text
PaymentMethodSelector
```

## Critical Shopify Constraint

Payment functionality must respect the actual Shopify checkout
environment and enabled payment providers.

Do not hardcode payment methods solely because they appear in the
mockup.

Where Shopify controls payment UI, preserve the native/approved checkout
functionality and apply branding only within supported customization
boundaries.

------------------------------------------------------------------------

# 73. Checkout --- Order Summary

Contains:

-   Product thumbnail
-   Product model
-   Finish
-   Size
-   Quantity
-   Vehicle
-   Fitment confirmation
-   Subtotal
-   Shipping
-   Estimated tax
-   Total
-   Place Order

## Components

``` text
CheckoutSummary
├── CheckoutProduct
├── FitmentStatus
├── OrderTotals
└── PlaceOrderAction
```

------------------------------------------------------------------------

# 74. Checkout --- Trust Indicators

Three items:

-   Secure Checkout
-   Fitment Verified
-   Support Available

Reuse shared trust/icon primitives.

------------------------------------------------------------------------

# 75. Checkout --- Minimal Footer

Dark compact footer.

Contains:

-   Calder mark
-   Short brand statement
-   Need Help
-   Phone
-   Support email

## Component

``` text
CheckoutFooter
```

This is intentionally different from `PublicFooter`.

------------------------------------------------------------------------

# 76. PAGE 6 --- DEALER DASHBOARD

The Dealer Portal is a dedicated authenticated B2B application.

It should feel like:

> The private wholesale/operations side of the same Calder Wheels brand.

It should **not** feel like:

-   A generic SaaS dashboard
-   A separate brand
-   A public storefront page with a sidebar attached

The approved Home design remains the visual brand authority, while the
Dealer mockup defines the portal's information architecture and
operational UI.

------------------------------------------------------------------------

# 77. Dealer Application Shell

Desktop architecture:

``` text
DealerSidebar | DealerMain
                  ├── DealerTopbar
                  └── DealerPageContent
```

Recommended root:

``` text
DealerShell
```

------------------------------------------------------------------------

# 78. Dealer --- Persistent Sidebar

Dark navy vertical navigation.

## Brand Area

-   Calder mark
-   Calder Wheels
-   Dealer Portal

## Primary Navigation

-   Dashboard
-   Catalog
-   Quick Order
-   Orders
-   Quotes
-   Invoices
-   Returns
-   Marketing Assets

## Account Navigation

-   Account
-   Users
-   Notifications

## Bottom Navigation

-   Dealer Support
-   Log Out

## Brand Footer

-   Mountain imagery
-   Higher-standard brand statement

## Components

``` text
DealerSidebar
├── DealerSidebarBrand
├── DealerNav
│   └── DealerNavItem[]
├── DealerAccountNav
└── DealerSidebarFooter
```

## Required States

-   Default
-   Hover
-   Active
-   Notification indicator
-   Collapsed/mobile

------------------------------------------------------------------------

# 79. Dealer --- Top Utility Bar

Contains:

-   Dealership selector/name
-   Tier badge
-   Payment terms badge
-   Account standing badge
-   Notifications
-   User avatar
-   User name
-   Dealership name
-   Profile dropdown

## Components

``` text
DealerTopbar
├── DealerSelector
├── DealerAccountBadges
├── NotificationButton
└── DealerProfileMenu
```

------------------------------------------------------------------------

# 80. Dealer --- Welcome Hero

Large branded dashboard header.

## Left

-   Eyebrow: DEALER PORTAL
-   WELCOME BACK
-   Dealership name
-   Supporting copy

## Right

-   Mountain/vehicle/wheel imagery
-   Vertical brand statement

## Component

``` text
DealerWelcomeHero
```

This visually references Calder's public brand but should remain
distinct from `HomeHero` and `CollectionHero`.

------------------------------------------------------------------------

# 81. Dealer --- KPI Summary

Four KPI blocks:

1.  Open Orders
2.  In Production
3.  Pending Quotes
4.  Available Credit

## Available Credit

Additional information:

-   Current available amount
-   Credit limit
-   Utilization percentage
-   Progress bar

## Components

``` text
DealerStats
├── StatCard
└── CreditStatCard
    └── ProgressBar
```

------------------------------------------------------------------------

# 82. Dealer --- Quick Actions

Four large action cards:

1.  Quick Order
2.  Browse Catalog
3.  Create Quote
4.  View Orders

Each contains:

-   Icon
-   Title
-   Description
-   Arrow/action

The primary Quick Order card uses the dark/high-emphasis treatment.

## Components

``` text
QuickActions
└── QuickActionCard[]
```

Support visual variants:

``` text
primary
default
```

------------------------------------------------------------------------

# 83. Dealer --- Recent Orders

Structured data table.

## Columns

-   Order \#
-   PO \#
-   Order Date
-   Vehicle / Application
-   Items
-   Total
-   Status
-   Action

## Components

``` text
DealerDataTable
├── TableHeader
├── TableRow
├── OrderStatusBadge
└── TableAction
```

## Status Examples

-   In Production
-   Finishing
-   Quality Check
-   Preparing to Ship
-   Shipped

Status treatment should be centralized rather than individually styled
in each table.

------------------------------------------------------------------------

# 84. Dealer --- Production Tracker

Highly specialized portal component.

## Header

-   Order number
-   PO number
-   Current status
-   View Order

## Timeline

Stages:

1.  Order Received
2.  In Production
3.  Finishing
4.  Quality Check
5.  Preparing to Ship
6.  Shipped

## Product Summary

-   Wheel thumbnail
-   Model
-   Construction
-   Finish
-   Size
-   Vehicle
-   Quantity
-   Unit/dealer price

## Components

``` text
ProductionTracker
├── ProductionTrackerHeader
├── ProductionTimeline
│   └── ProductionStage[]
└── TrackedOrderProduct
```

## Required States

Production stages should support:

-   Completed
-   Current
-   Upcoming

This must be driven by order/production data rather than static
screenshot values.

------------------------------------------------------------------------

# 85. Dealer --- Recent Activity

Vertical event feed.

Examples:

-   Order moved to Finishing
-   Quote created
-   Order shipped
-   Tracking number available
-   Invoice posted

## Components

``` text
ActivityFeed
└── ActivityItem[]
```

Each item may contain:

-   Event icon
-   Description
-   Timestamp/date
-   Navigation action

------------------------------------------------------------------------

# 86. Dealer --- Featured Wheels

Three dealer-oriented product cards.

Each contains:

-   Wheel image
-   Model
-   Construction
-   Dealer price
-   MSRP
-   View / Configure CTA

## Components

``` text
DealerFeaturedProducts
└── DealerProductCard[]
```

## Important Distinction

Do not automatically reuse the full consumer `WheelProductCard`.

Dealer cards expose:

-   Wholesale/dealer pricing
-   MSRP
-   B2B action language

Share primitives such as:

-   ProductImage
-   ProductIdentity
-   PriceDisplay
-   Button

but allow dealer-specific composition.

------------------------------------------------------------------------

# 87. Cross-Page Component Matrix

  --------------------------------------------------------------------------------------
  Component /      Home     Category   Product      Cart     Checkout       Dealer
  System                                                               
  ------------- ---------- ---------- ---------- ---------- ---------- -----------------
  Public Header     ✓          ✓          ✓          ✓         ---            ---

  Public Footer     ✓          ✓          ✓          ✓         ---            ---

  Checkout         ---        ---        ---        ---         ✓             ---
  Header                                                               

  Checkout         ---        ---        ---        ---         ✓             ---
  Footer                                                               

  Dealer           ---        ---        ---        ---        ---             ✓
  Sidebar                                                              

  Dealer Topbar    ---        ---        ---        ---        ---             ✓

  Shared            ✓          ✓          ✓          ✓      ✓ display      Potential
  Fitment State                                                        

  Fitment           ✓          ✓      ✓ variant     ---        ---         Potential
  Selector                                                             

  Fitment Badge    ---         ✓          ✓          ✓          ✓          Potential
  / Status                                                             

  Featured          ✓         ---        ---        ---        ---            ---
  Wheel Card                                                           

  Wheel Product    ---         ✓       Compact      ---        ---            ---
  Card                                 variant                         

  Dealer           ---        ---        ---        ---        ---             ✓
  Product Card                                                         

  Wheel            ---         ✓          ✓          ✓         ---            ---
  Specialist                                                           
  CTA                                                                  

  Newsletter        ✓          ✓         ---        ---        ---            ---
  Banner                                                               

  Breadcrumbs      ---        ---         ✓         ---        ---            ---

  Quantity         ---        ---         ✓          ✓         ---         Ordering
  Selector                                                             

  Price Display  Optional      ✓          ✓          ✓          ✓              ✓

  Status Badge     ---         ✓          ✓          ✓          ✓              ✓

  Checkout         ---        ---        ---         ✓          ✓             ---
  Progress                                                             

  Order Summary    ---        ---        ---         ✓          ✓       Dealer-specific

  Commerce         ---        ---     ✓ variant      ✓          ✓             ---
  Trust Row                                                            

  Form Controls     ✓          ✓          ✓          ✓          ✓              ✓

  Product           ✓          ✓          ✓          ✓          ✓              ✓
  Imagery                                                              

  Data Table       ---        ---        ---        ---        ---             ✓

  Production       ---        ---        ---        ---        ---             ✓
  Tracker                                                              
  --------------------------------------------------------------------------------------

------------------------------------------------------------------------

# 88. Recommended Component Hierarchy

``` text
Calder Design System
│
├── Tokens
│   ├── Colors
│   ├── Typography
│   ├── Spacing
│   ├── Borders
│   ├── Radius
│   ├── Shadows
│   └── Breakpoints
│
├── Primitives
│   ├── Container
│   ├── Section
│   ├── Typography
│   ├── Button
│   ├── IconButton
│   ├── Badge
│   ├── StatusBadge
│   ├── Card
│   ├── FormField
│   ├── Select
│   ├── Checkbox
│   ├── RadioCard
│   ├── Divider
│   ├── Tabs
│   └── ProgressBar
│
├── Global Storefront
│   ├── PublicHeader
│   ├── PublicFooter
│   ├── NewsletterBanner
│   ├── Breadcrumbs
│   └── WheelSpecialistCTA
│
├── Fitment System
│   ├── VehicleFitmentSelector
│   ├── VehicleFitmentBar
│   ├── SelectedVehicle
│   ├── FitmentBadge
│   └── FitmentStatus
│
├── Product / Commerce
│   ├── FeaturedWheelCard
│   ├── WheelProductCard
│   ├── ProductGallery
│   ├── ProductConfigurator
│   ├── FinishSwatches
│   ├── QuantitySelector
│   ├── PriceDisplay
│   ├── ProductSpecifications
│   ├── CartItem
│   ├── OrderSummary
│   └── CommerceTrustRow
│
├── Home
│   ├── HomeHero
│   ├── VehicleFinder
│   ├── SignatureWheels
│   ├── CustomizationFeature
│   ├── EngineeringFeature
│   ├── ProcessGallery
│   └── FittedGalleryFeature
│
├── Collection
│   ├── CollectionHero
│   ├── CollectionNavigation
│   ├── CatalogLayout
│   ├── CatalogToolbar
│   ├── FilterSidebar
│   ├── ProductGrid
│   └── Pagination
│
├── Product
│   ├── ProductMain
│   ├── ProductGallery
│   ├── ProductInfo
│   ├── ProductConfigurator
│   ├── Specifications
│   ├── EngineeringCard
│   ├── FinishGallery
│   ├── RealWorldGallery
│   └── ProductRecommendations
│
├── Cart
│   ├── CartPageHeader
│   ├── CheckoutProgress
│   ├── CartLayout
│   ├── CartItemList
│   └── CartSummary
│
├── Checkout
│   ├── CheckoutHeader
│   ├── CheckoutProgress
│   ├── CheckoutLayout
│   ├── CustomerInformation
│   ├── ShippingAddress
│   ├── ShippingMethods
│   ├── PaymentMethods
│   ├── CheckoutSummary
│   └── CheckoutFooter
│
└── Dealer Portal
    ├── DealerShell
    ├── DealerSidebar
    ├── DealerTopbar
    ├── DealerWelcomeHero
    ├── DealerStats
    ├── QuickActions
    ├── DealerDataTable
    ├── ProductionTracker
    ├── ActivityFeed
    └── DealerProductCard
```

------------------------------------------------------------------------

# 89. Components vs. Shopify Sections

Do **not** turn every visible UI block into an independent Shopify
section.

Three architectural levels should be distinguished.

## Level 1 --- UI Primitives

Examples:

``` text
Button
Badge
Select
Heading
Icon
Price
Input
Status
```

These belong in the base component/CSS system.

------------------------------------------------------------------------

## Level 2 --- Functional Components / Snippets

Examples:

``` text
WheelProductCard
VehicleFitmentSelector
FitmentStatus
CartItem
QuantitySelector
FinishSwatches
ProductionTracker
```

These should normally be reusable snippets/components rendered by larger
sections or templates.

------------------------------------------------------------------------

## Level 3 --- Merchant-Configurable Page Sections

Good candidates include:

``` text
HomeHero
SignatureWheels
CustomizationFeature
EngineeringFeature
ProcessGallery
FittedGalleryFeature
CollectionHero
CollectionNavigation
RealWorldGallery
WheelSpecialistCTA
NewsletterBanner
```

These are appropriate for Shopify section configuration where merchant
customization provides value.

------------------------------------------------------------------------

# 90. Data-Driven vs. Primarily Visual Components

## Primarily Visual / Content-Driven

-   Home Hero
-   Collection Hero
-   Customize Without Limits
-   Engineering promotional sections
-   Process Gallery
-   Fitted Gallery
-   Wheel Specialist CTA
-   Newsletter Banner
-   Dealer Welcome Hero

These still require responsive implementation but are primarily driven
by images/copy/settings.

------------------------------------------------------------------------

## Shopify / Commerce Data-Driven

-   Product grid
-   Product card pricing
-   Collection filters
-   Sorting
-   Pagination
-   Product media
-   Product options
-   Product variants
-   Finish selection
-   Quantity
-   Add to cart
-   Cart line items
-   Cart totals
-   Recommendations
-   Customer/account state
-   Checkout

These should be built around working Shopify functionality rather than
visual-only replacements.

------------------------------------------------------------------------

## Custom / External Operational Data

Dealer functionality likely requires dedicated data sources for:

-   Dealer tier
-   Payment terms
-   Account standing
-   Available credit
-   Credit limit
-   Wholesale pricing
-   Quotes
-   Invoices
-   Production stages
-   Order status
-   Tracking
-   Activity
-   Dealer users

The visual implementation should not invent fake persistence or
operational state.

------------------------------------------------------------------------

# 91. Components That Should Not Be Over-Merged

Visually related does not always mean structurally identical.

Keep these distinct:

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
≠ Dealer order/production card
```

These components can share primitives and tokens while retaining
purpose-specific markup.

------------------------------------------------------------------------

# 92. Responsive Design Requirements

The supplied mockups primarily represent desktop layouts.

Responsive implementation must preserve hierarchy and usability rather
than simply scaling the screenshots.

------------------------------------------------------------------------

## 92.1 Public Header

Desktop: - Full navigation - Utility icons - Find Your Fit CTA

Mobile: - Calder logo - Essential actions - Menu trigger -
Drawer/navigation overlay

------------------------------------------------------------------------

## 92.2 Hero Sections

Desktop: - Split content/media composition

Mobile: - Stack intelligently - Preserve headline prominence - Maintain
CTA visibility - Avoid important wheel/vehicle focal points being
cropped

------------------------------------------------------------------------

## 92.3 Vehicle Fitment

Desktop: - Four selectors in one row

Tablet/mobile: - Two-column or one-column fields - Full-width Find
Wheels CTA - Selected vehicle remains highly visible

------------------------------------------------------------------------

## 92.4 Category Filters

Desktop: - Persistent left sidebar

Mobile: - Filter button - Drawer/modal - Active filter count - Clear
filters - Sort accessible separately

------------------------------------------------------------------------

## 92.5 Product Grid

Expected responsive behavior:

``` text
Desktop: 3 columns
Tablet: 2 columns
Mobile: 1 column
```

Depending on available width, mobile may support a compact two-column
mode only if legibility remains strong.

------------------------------------------------------------------------

## 92.6 Product Page

Desktop: - Gallery left - Configurator right

Mobile: - Gallery first - Product identity - Fitment - Configuration -
Price - Add to Cart - Trust indicators

Consider sticky Add to Cart behavior only if compatible with the theme
and not disruptive.

------------------------------------------------------------------------

## 92.7 Finish Gallery

Mobile: - Horizontal swipe/scroll - Preserve selected-state visibility -
Do not shrink wheel images excessively

------------------------------------------------------------------------

## 92.8 Cart

Desktop: - Items left - Summary right

Mobile: - Items first - Summary beneath or strategically sticky -
Quantity and edit/remove actions remain accessible

------------------------------------------------------------------------

## 92.9 Checkout

Desktop: - Forms left - Sticky summary right

Mobile: - Single-column - Summary may become collapsible or move
according to Shopify checkout behavior - Progress should remain
understandable without consuming excessive vertical space

------------------------------------------------------------------------

## 92.10 Dealer Portal

Desktop: - Persistent sidebar - Topbar - Dashboard grids/tables

Mobile/tablet: - Collapsed sidebar/drawer - KPI cards wrap - Quick
actions stack - Tables become horizontally scrollable or responsive
cards - Production tracker may become vertical - Topbar account
information condenses

------------------------------------------------------------------------

# 93. Interaction States Required

The design-to-code implementation should account for more than
screenshot-default states.

## Buttons

-   Default
-   Hover
-   Focus
-   Active
-   Disabled
-   Loading where relevant

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
-   Changed/reset

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
-   Warning/attention if required

Accessibility-visible focus states should not be removed to match the
screenshots.

------------------------------------------------------------------------

# 94. Accessibility Requirements

The screenshots are visual authorities, but implementation must remain
accessible.

The agent should ensure:

-   Semantic heading hierarchy
-   Keyboard navigation
-   Visible focus states
-   Accessible form labels
-   Sufficient color contrast
-   Alt text strategy
-   Buttons vs. links used semantically
-   Accessible carousel controls
-   Status conveyed by text, not color alone
-   Tables retain semantic structure
-   Mobile navigation is keyboard/screen-reader accessible
-   Form errors are announced appropriately
-   Icon-only actions receive accessible labels

------------------------------------------------------------------------

# 95. Asset Categories Required

The design requires several asset classes.

## Brand Assets

-   Primary Calder logo
-   Compact Calder mark
-   Light/dark variants
-   Social icons

## Product Assets

-   Isolated wheel renders
-   Finish variants
-   Product detail images
-   Installed-on-vehicle images

## Editorial / Marketing Assets

-   Hero vehicle images
-   Mountain/road imagery
-   Manufacturing/CNC imagery
-   Real-world builds
-   Dealer portal hero imagery

## UI Assets

Prefer SVG/icon system for:

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

------------------------------------------------------------------------

# 96. Highest-Priority Reusable Systems

Implementation should prioritize these systems because they affect
multiple pages.

1.  Calder design tokens
2.  Typography system
3.  Layout/container system
4.  Public Header
5.  Public Footer
6.  Buttons and form controls
7.  Vehicle fitment state and selectors
8.  Product metadata model
9.  Wheel Product Card
10. Product/variant configuration
11. Fitment/status badge system
12. Commerce trust elements
13. Wheel Specialist CTA
14. Checkout progress
15. Dealer application shell
16. Dealer status/data table system

------------------------------------------------------------------------

# 97. Recommended Page Assembly

## Home

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

## Category

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

## Product

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

## Cart

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

## Checkout

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

## Dealer Dashboard

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

------------------------------------------------------------------------

# 98. Existing Theme Audit Strategy

Before generating new code, the AI development agent should audit the
working Shopify theme.

For each approved component, determine:

1.  Does a corresponding implementation already exist?
2.  Is it functionally complete?
3.  Does it only require styling?
4.  Does it require markup extension?
5.  Is it partially implemented?
6.  Is it completely missing?
7.  Does modifying it risk breaking existing Shopify functionality?

Recommended status values:

``` text
EXISTS + MATCHES
EXISTS + NEEDS STYLING
EXISTS + NEEDS EXTENSION
PARTIAL
MISSING
DO NOT REPLACE / WORKING FUNCTIONALITY
```

------------------------------------------------------------------------

# 99. Recommended Audit Matrix

The agent should produce an implementation matrix similar to:

  ----------------------------------------------------------------------------------------------------------------------------
  Page       Approved       Shared?    Existing         Status                Required       Proposed               Risk
             Component                 Implementation                         Action         File/Component         
  ---------- -------------- ---------- ---------------- --------------------- -------------- ---------------------- ----------
  Home       Public Header  Global     Existing theme   Needs styling         Modify         Header                 High
                                       header                                                section/snippets       

  Home       Home Hero      Unique     None             Missing               Create         `home-hero`            Low

  Home       Fitment Finder Shared     Existing fitment Partial               Extend/style   `vehicle-fitment`      High

  Category   Filters        Commerce   Shopify          Working               Preserve +     Existing collection    Critical
                                       filtering                              style          facets                 

  Category   Product Grid   Commerce   Shopify          Working               Preserve +     Existing product grid  High
                                       collection                             style                                 

  Product    Product        Commerce   Existing product Working               Style/extend   Existing product       High
             Gallery                   media                                                 gallery                

  Product    Configurator   Commerce   Shopify product  Working               Preserve +     Existing product form  Critical
                                       form                                   style                                 

  Cart       Cart Items     Commerce   Shopify cart     Working               Preserve +     Existing cart          Critical
                                                                              style          components             

  Checkout   Payment        Platform   Shopify checkout Platform-controlled   Brand within   Checkout customization Critical
                                                                              limits                                

  Dealer     Production     Portal     None             Missing               Create         `production-tracker`   Medium
             Tracker                                                                                                
  ----------------------------------------------------------------------------------------------------------------------------

------------------------------------------------------------------------

# 100. Risk Classification

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

-   Dealer tables
-   Production tracker
-   Quick order UI
-   Dashboard state
-   Newsletter integration

## Low Risk

Mostly visual/content-driven:

-   Marketing heroes
-   Editorial galleries
-   Promotional banners
-   Section headers
-   Static brand statements

------------------------------------------------------------------------

# 101. Design-to-Code Rules for the AI Agent

The AI implementation agent should follow these rules.

## Rule 1 --- Do Not Rebuild Working Functionality Without Cause

If Shopify or the current theme already provides correct functionality,
preserve it and adapt the visual layer.

------------------------------------------------------------------------

## Rule 2 --- Approved Mockups Are the Visual Authority

Where the current theme visually conflicts with the approved mockups,
the approved mockups define:

-   hierarchy
-   composition
-   spacing intent
-   component appearance
-   image treatment
-   CTA hierarchy
-   brand character

unless a platform/accessibility limitation requires adjustment.

------------------------------------------------------------------------

## Rule 3 --- Existing Functional Architecture Is the Technical Authority

Do not discard proven theme architecture simply because the screenshot
suggests different markup.

The target is visual fidelity **plus** functional stability.

------------------------------------------------------------------------

## Rule 4 --- Build Shared Components Before Duplicating Markup

If the same pattern appears repeatedly, identify the shared abstraction
before implementing the second copy.

------------------------------------------------------------------------

## Rule 5 --- Do Not Over-Generalize

A component should only be shared when it has a genuinely shared
responsibility.

Do not merge unique heroes, product cards, headers, or footers solely
because they look related.

------------------------------------------------------------------------

## Rule 6 --- Separate Data From Presentation

Product, fitment, cart, dealer, and account data should remain
data-driven.

Avoid hardcoded screenshot values.

------------------------------------------------------------------------

## Rule 7 --- Use Real Assets

The final implementation should use approved/source assets, not
flattened screenshot crops for UI components.

Screenshot cropping should only be considered for temporary visual
reference, never as the production implementation of interactive UI.

------------------------------------------------------------------------

## Rule 8 --- Preserve Responsive Intent

Desktop screenshots are not instructions to make fixed-width pages.

Build responsive layouts that preserve the approved hierarchy.

------------------------------------------------------------------------

## Rule 9 --- Centralize Design Tokens

Do not scatter arbitrary colors, spacing values, and typography
declarations throughout individual sections.

------------------------------------------------------------------------

## Rule 10 --- Validate Page-to-Page Consistency

A component that appears on several pages should not drift visually
because each page was coded independently.

------------------------------------------------------------------------

# 102. Recommended Design-to-Code Implementation Sequence

## Phase 1 --- Audit

-   Inspect current theme architecture
-   Identify templates
-   Identify sections/snippets
-   Identify CSS architecture
-   Identify JS architecture
-   Identify working Shopify features
-   Identify fitment implementation
-   Identify dealer implementation
-   Compare current state to approved mockups

## Phase 2 --- Design Foundation

Implement/refine:

-   Design tokens
-   Typography
-   Containers
-   Buttons
-   Forms
-   Cards
-   Badges
-   Icons
-   Status system

## Phase 3 --- Global Storefront

Implement/refine:

-   Public Header
-   Public Footer
-   Newsletter
-   Wheel Specialist CTA
-   Fitment UI

## Phase 4 --- Core Commerce

Implement/refine:

-   Product cards
-   Collection grid
-   Filters
-   Product gallery
-   Product configurator
-   Finish selection
-   Cart
-   Fitment persistence

## Phase 5 --- Marketing Sections

Implement:

-   Home Hero
-   Signature Wheels
-   Customization
-   Engineering
-   Process Gallery
-   Fitted Gallery
-   Collection Hero

## Phase 6 --- Product Supporting Sections

Implement:

-   Specifications
-   Engineering Card
-   Finish Gallery
-   Real World Gallery
-   Recommendations

## Phase 7 --- Checkout Branding

Apply supported Calder styling without breaking Shopify checkout
behavior.

## Phase 8 --- Dealer Portal

Implement:

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

## Phase 9 --- Responsive Pass

Validate:

-   Mobile
-   Tablet
-   Laptop
-   Wide desktop

## Phase 10 --- QA

Test:

-   Fitment
-   Product variants
-   Add to cart
-   Cart updates
-   Checkout
-   Account
-   Dealer state
-   Filtering
-   Sorting
-   Pagination
-   Responsive behavior
-   Accessibility
-   Browser compatibility

------------------------------------------------------------------------

# 103. Definition of Visual Completion

A page should not be considered complete merely because all visible
sections exist.

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

------------------------------------------------------------------------

# 104. Final Architectural Summary

The six approved mockups resolve into the following primary systems:

### Global Calder Design System

Typography, colors, spacing, buttons, fields, cards, icons, status
treatments.

### Public Storefront Shell

Header, footer, navigation, global CTAs.

### Vehicle Fitment System

Selection, selected vehicle, compatibility, persistence, change/reset.

### Consumer Commerce System

Collections, filters, product cards, PDP configuration, cart, checkout
summary.

### Marketing / Editorial System

Heroes, galleries, engineering storytelling, newsletter, support
banners.

### Checkout Shell

Minimal header/footer, progress, transaction forms, order summary.

### Dealer Application System

Sidebar, topbar, dashboard cards, data tables, production status,
activity, wholesale product presentation.

The key design-to-code objective is therefore **not six screenshot
recreations**.

It is the implementation of a reusable Calder component system capable
of producing all six approved experiences while preserving existing
Shopify functionality and supporting future Calder pages consistently.

------------------------------------------------------------------------

# 105. Directive for the AI Development Agent

Use this document and the six approved mockups as the visual/component
reference for the Calder Wheels design-to-code phase.

Before writing substantial new code:

1.  Audit the existing Shopify theme.
2.  Map existing templates, sections, snippets, assets, CSS, JavaScript,
    and integrations to this component inventory.
3.  Compare the current theme against the project's activation/setup
    documentation.
4.  Identify working functionality that must be preserved.
5.  Classify every required component as existing, style-only,
    extension, partial, missing, or protected working functionality.
6.  Produce an implementation plan ordered by dependency and risk.
7.  Establish shared design primitives and global components before
    page-specific implementation.
8.  Apply the approved visual system progressively to working Shopify
    functionality.
9.  Do not hardcode product, fitment, cart, checkout, dealer, pricing,
    or account state simply to match screenshot content.
10. Validate the completed implementation against all six approved
    mockups at desktop and responsive breakpoints.

**Primary success criterion:** achieve high visual fidelity to the
approved Calder Wheels mockups while maintaining a reusable
architecture, real Shopify functionality, responsive behavior, and a
stable foundation for subsequent Calder pages and dealer workflows.
