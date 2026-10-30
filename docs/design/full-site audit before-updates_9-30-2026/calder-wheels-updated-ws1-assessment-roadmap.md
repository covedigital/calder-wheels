# Calder Wheels --- Updated WS1 Assessment & Consumer Storefront Completion Roadmap

**Project:** Calder Wheels\
**Assessment date:** October 2, 2026\
**Current milestone:** Consumer Storefront Productionization\
**Next major milestone:** Dealer Portal UX + Integration\
**Reference:** WS1 Assessment & Activation Guide + current Home,
Collection, and Product implementations

------------------------------------------------------------------------

## 1. Executive Summary

Calder Wheels has moved beyond the original storefront status documented
in the WS1 Activation Guide.

The Activation Guide describes the Storefront Foundation as
approximately 50% complete because the homepage was still based on the
stock Lumia fashion demo. The current implementation has progressed
substantially beyond that state. The Home, Collection, and Product pages
now have Calder-specific layouts and branding, and the core Wheel
Configurator and Vehicle Fitment Finder are integrated into the shopping
experience.

The project should therefore no longer be managed primarily as a
page-building project.

The current phase is best described as:

> **Consumer Storefront Productionization**

The goal of this phase is to convert the existing approved design and
working technical systems into a launch-ready commerce experience using:

-   final Calder/client imagery and video;
-   premium iconography;
-   verified product specifications;
-   complete Shopify metafields and variants;
-   functional collection filtering;
-   improved wheel-style discovery;
-   standalone Fitment Finder and Build Your Wheel experiences;
-   a premium product/vehicle gallery;
-   Save Build and Share Build functionality;
-   SEO/AEO foundations;
-   analytics;
-   and complete end-to-end QA.

Once these items reach the feature-complete gate, the consumer
storefront architecture should be frozen and the primary development
focus should move to:

> **Dealer Portal UX + Integration**

The dealer milestone should not begin as a ground-up dashboard build.
The Activation Guide documents that substantial dealer functionality
already exists. The next dealer phase should focus on redesigning,
validating, connecting, and productionizing those existing capabilities.

------------------------------------------------------------------------

# 2. Updated Project Status

## 2.1 High-Level Assessment

  ----------------------------------------------------------------------------
  Area                  Activation Guide   Updated Assessment Primary
                                Baseline                      Remaining Work
  ----------------- -------------------- -------------------- ----------------
  Storefront visual                \~50%            \~85--90% Production
  foundation                                                  assets, final
                                                              content,
                                                              responsive
                                                              polish

  Homepage              Rebuild required                \~90% Final imagery,
                                                              Fitment/Style
                                                              search
                                                              refinement

  Collection page                Partial                \~85% Functional
                                                              filters, final
                                                              product data,
                                                              imagery, QA

  Product page            Functional PDP            \~80--85% Product data,
                                                              gallery/media,
                                                              final polish

  Wheel                            \~90%       \~90--95% core Save/Share,
  Configurator                                         engine production
                                                              data/assets, E2E
                                                              QA

  Vehicle Fitment                  \~95%      \~95% technical Standalone UX,
  Finder                                                      discovery
                                                              enhancements

  Product/catalog      5 seeded products      Prototype-ready Production
  data                                                        catalog
                                                              verification

  Product Gallery      Base architecture                Needs Premium
                                  exists    productionization vehicle/design
                                                              gallery

  SEO/AEO           Not started in guide          Outstanding Metadata,
                                                              schema,
                                                              indexing,
                                                              content

  Dealer Portal        \~100% documented         Functionally UX redesign +
  Phase 1                                         substantial live
                                                              verification

  Dealer Portal         \~70% documented              Partial Quote management
  Phase 2                                                     and workflow
                                                              polish

  Dealer Portal         \~50% documented              Partial QuickBooks/WS2
  Phase 3                                                     dependencies
  ----------------------------------------------------------------------------

### Practical interpretation

The software foundation is farther along than the launch readiness of
the storefront.

A useful distinction is:

-   **Development completion:** approximately 85--90%
-   **Consumer launch readiness:** approximately 70--80%

The remaining gap is primarily production content, product/catalog data,
discovery UX, growth features, SEO, and validation rather than major
page architecture.

------------------------------------------------------------------------

# 3. Current Strategic Priority

The immediate objective should be:

> **Finish and freeze the consumer shopping experience before making the
> Dealer Portal the primary development focus.**

This does **not** mean every possible consumer feature needs to be
developed before dealer work begins.

It means the primary customer journey must be stable:

**Discover → Find Fitment → Select Wheel → Configure → Save/Share →
Purchase or Request Help**

The storefront should reach a point where subsequent work consists
mainly of:

-   product additions;
-   content updates;
-   bug fixes;
-   conversion optimization;
-   and incremental enhancements.

Major structural redesigns should stop after this milestone.

------------------------------------------------------------------------

# 4. Homepage Assessment

## 4.1 Status

The homepage has progressed beyond the original Activation Guide
assessment.

The page now establishes Calder as a premium wheel brand rather than
inheriting the Lumia fashion-store identity.

The current homepage architecture should be considered substantially
approved.

### Recommendation

Do **not** initiate another broad homepage redesign.

Future homepage work should be limited to:

-   final client imagery;
-   final video;
-   premium icons;
-   content refinement;
-   responsive corrections;
-   Fitment Finder improvements;
-   Wheel Style discovery;
-   analytics;
-   SEO;
-   performance optimization.

------------------------------------------------------------------------

# 5. Production Content Integration

Production imagery should now be treated as a formal milestone rather
than miscellaneous cleanup.

## 5.1 Required Asset Categories

### Vehicle lifestyle imagery

Use actual Calder wheels installed on vehicles wherever possible.

Target uses:

-   homepage hero;
-   promotional sections;
-   gallery;
-   PDP real-world sections;
-   collection banners;
-   dealer materials.

### Isolated wheel imagery

Required for:

-   product cards;
-   PDP gallery;
-   configurator;
-   related products;
-   Build Your Wheel;
-   dealer ordering.

### Finish/detail imagery

Required for:

-   finish selectors;
-   configurator;
-   PDP;
-   gallery;
-   finish comparison.

### Manufacturing/detail photography

Useful for communicating:

-   forged construction;
-   machining;
-   finishing;
-   hardware;
-   quality;
-   craftsmanship.

### Video

Prioritize:

-   installed vehicle rolling footage;
-   wheel close-ups;
-   manufacturing footage;
-   finish/detail video.

### Premium iconography

Replace generic or temporary icons with one consistent icon system.

Icons should cover:

-   forged construction;
-   fitment;
-   load rating;
-   lightweight engineering;
-   finish;
-   warranty;
-   shipping;
-   lead time;
-   configurator controls.

------------------------------------------------------------------------

# 6. Product Catalog Productionization

The current seeded products provide the technical foundation, but each
production product should undergo a formal data audit.

## 6.1 Product Identity

Each wheel should include:

-   Design code
-   Design nickname
-   Series
-   Construction type
-   Shopify handle
-   Base SKU
-   Product status
-   Collection assignment

## 6.2 Physical Specifications

Verify:

-   Diameter
-   Width
-   Bolt pattern
-   Offset / offset range
-   Center bore
-   Load rating
-   Weight
-   Material
-   Hardware type
-   Lip/barrel specification
-   Concavity/profile
-   Available finishes

## 6.3 Commercial Data

Verify:

-   Retail price
-   Dealer Tier 1 price
-   Dealer Tier 2 price
-   Dealer Tier 3 price
-   MOQ
-   Lead time
-   Availability
-   Made-to-order status
-   Shipping classification

## 6.4 Configurator Data

Verify:

-   configurable flag;
-   center finish options;
-   barrel finish options;
-   hardware finish options;
-   valid combinations;
-   price adjustments;
-   BOM;
-   composite image layers;
-   final configuration SKU resolution.

## 6.5 Merchandising Metafields

Recommended additions include:

-   wheel style;
-   spoke style;
-   construction;
-   concavity;
-   vehicle segment;
-   featured;
-   new release;
-   gallery references;
-   related wheels;
-   finish family.

These fields can support both merchandising and filtering.

------------------------------------------------------------------------

# 7. Shopify Variant Strategy

Avoid turning every possible custom configuration into a Shopify
variant.

A forged wheel can potentially generate a very large combination matrix:

**Diameter × Width × Offset × Bolt Pattern × Center Finish × Barrel
Finish × Hardware Finish**

Creating all combinations as Shopify variants would make the catalog
unnecessarily difficult to maintain.

## Recommended Architecture

### Shopify Product / Variant

Represents the base purchasable wheel or meaningful base size option.

### Configurator

Captures:

-   center finish;
-   barrel/lip finish;
-   hardware finish;
-   applicable dimensional options;
-   vehicle/fitment context.

### Configuration Resolver

Determines:

-   valid configuration;
-   final price;
-   resolved SKU;
-   BOM;
-   availability;
-   lead time.

### Cart Properties

Persist the customer's selected configuration.

This preserves the architecture already established by the WS1
configurator.

------------------------------------------------------------------------

# 8. Collection Page

## 8.1 Status

The collection page is visually close to its intended structure.

Remaining work should focus more heavily on commerce functionality than
layout redesign.

## 8.2 Collection Filtering

Recommended filters:

### Core filters

-   Series
-   Construction
-   Diameter
-   Width
-   Bolt Pattern
-   Finish
-   Wheel Style

### Additional filters

-   Vehicle compatibility
-   Concavity
-   Price
-   Availability
-   Lead time

Filters should be generated from real Shopify product data/metafields
rather than maintained as purely visual controls.

## 8.3 Product Cards

Final cards should consistently expose:

-   wheel image;
-   design name/code;
-   series;
-   starting price;
-   available finishes;
-   fitment status when a vehicle has been selected;
-   dealer price when dealer context applies.

------------------------------------------------------------------------

# 9. Homepage "Shop by Wheel Style" Experience

The second tab of the homepage fitment/discovery tool should become a
genuine product discovery workflow rather than only a technical wheel
specification form.

## 9.1 Recommended Search Dimensions

### Construction

-   Monoblock
-   2-Piece
-   3-Piece

### Diameter

Examples:

-   18"
-   19"
-   20"
-   21"
-   22"
-   24"

### Spoke Style

Examples:

-   5-Spoke
-   Split-Spoke
-   Multi-Spoke
-   Mesh
-   Directional

### Profile

Examples:

-   Flat
-   Concave
-   Deep Concave

### Lip Style

Examples:

-   No Lip
-   Step Lip
-   Deep Lip

### Finish

Examples:

-   Black
-   Brushed
-   Polished
-   Chrome
-   Custom

### Advanced Specification

Bolt Pattern can remain available but should not necessarily be the
first information requested from a normal consumer.

## 9.2 Result

CTA:

> **View Matching Wheels**

The result should route the customer to a filtered collection/search
result.

------------------------------------------------------------------------

# 10. Standalone Fitment Finder

Create a dedicated route such as:

`/pages/fitment-finder`

The existing fitment engine should remain the source of truth.

Do not build a second fitment engine.

## 10.1 Recommended Flow

### Step 1 --- Vehicle

Year → Make → Model → Trim where available

### Step 2 --- Vehicle Confirmation

Example:

> Your Vehicle\
> 2024 Cadillac Escalade

### Step 3 --- Compatible Wheels

Display matching Calder products.

### Step 4 --- Persistent Vehicle Context

Store the selected vehicle.

When the user later reaches a compatible PDP, show:

> ✓ Fits your 2024 Cadillac Escalade

## 10.2 Navigation

Add clear Fitment Finder access from:

-   primary navigation;
-   homepage;
-   collection page;
-   PDP;
-   Build Your Wheel;
-   mobile menu.

------------------------------------------------------------------------

# 11. Build Your Wheel --- Strategic Role

The standalone Wheel Configurator should be treated as one of the most
important conversion tools on the Calder website.

Create:

`/pages/build-your-wheel`

The PDP configurator should remain available for customers who already
selected a wheel.

The standalone experience should serve customers who want to explore.

------------------------------------------------------------------------

# 12. Build Your Wheel --- Recommended User Flow

## Step 1 --- Select Wheel

Show available Calder designs.

## Step 2 --- Select Size

Choose available dimensions.

## Step 3 --- Customize Wheel

Configure:

-   center finish;
-   barrel/lip finish;
-   hardware finish;
-   applicable construction options.

## Step 4 --- Select Vehicle

Allow the customer to select or restore their vehicle.

## Step 5 --- Verify Fitment

Validate compatibility using the existing Fitment Finder.

## Step 6 --- Review Build

Display:

-   large wheel rendering;
-   wheel name;
-   design code;
-   selected finishes;
-   selected dimensions;
-   vehicle;
-   fitment status;
-   price;
-   lead time;
-   availability.

## Step 7 --- Conversion Actions

Primary actions:

-   Add to Cart
-   Request Quote
-   Save Build
-   Share Build

This final stage turns the configurator from a utility into a sales
experience.

------------------------------------------------------------------------

# 13. NEW --- Save Build

## 13.1 Purpose

Customers configuring premium wheels often do not purchase immediately.

They may want to:

-   compare finishes;
-   show a spouse or friend;
-   ask a shop/dealer;
-   revisit the build later;
-   compare multiple designs;
-   wait until payday;
-   discuss the configuration with Calder.

A **Save Build** feature allows that buying process to continue instead
of being lost when the session ends.

------------------------------------------------------------------------

# 14. Save Build --- MVP Requirements

The first implementation should prioritize reliability and simplicity.

## 14.1 Save Configuration

A saved build should contain at minimum:

-   Build ID
-   Wheel/product ID
-   Design code
-   Design nickname
-   Variant/base configuration
-   Diameter
-   Width
-   Offset where applicable
-   Bolt pattern
-   Center finish
-   Barrel finish
-   Hardware finish
-   Selected vehicle
-   Fitment result
-   Configuration price
-   Lead time
-   Preview/composite state
-   Created timestamp

Do not rely exclusively on visual text or browser state.

The build must be reproducible from structured configuration data.

## 14.2 Generate Build ID

Example:

`CW-A201-8F4K2`

The ID should allow the system to retrieve the configuration.

## 14.3 Generate Build URL

Example concept:

`/pages/build-your-wheel?build=CW-A201-8F4K2`

Opening the URL should restore the build.

## 14.4 Restore Build

The restoration process should:

1.  identify the saved build;
2.  load the correct wheel;
3.  restore dimensions;
4.  restore finishes;
5.  restore vehicle;
6.  rerun fitment if necessary;
7.  recalculate current price/availability;
8.  render the current configuration.

### Important

Saved configuration and current commerce data should be distinguished.

For example:

> Saved price: \$1,250\
> Current price: \$1,300

if pricing changed after the build was created.

------------------------------------------------------------------------

# 15. Guest vs Account Saved Builds

## Phase 1 --- Guest Save

Allow customers to save without creating an account.

Options include:

-   build stored server-side;
-   unique build ID;
-   build URL;
-   optional email delivery.

This removes friction.

## Phase 2 --- Customer Account

Logged-in customers can receive:

### My Builds

A page containing:

-   thumbnail;
-   wheel;
-   vehicle;
-   finish;
-   date saved;
-   price;
-   fitment status;
-   Edit Build;
-   Share;
-   Add to Cart;
-   Request Quote;
-   Delete.

## Recommendation

Do not require login for the first Save Build action.

Allow the build to be created first, then optionally encourage account
creation:

> **Build Saved**\
> Create an account to keep all of your Calder builds in one place.

------------------------------------------------------------------------

# 16. NEW --- Share Build

The Share Build feature should use the saved Build URL as the canonical
share target.

This makes sharing reliable and prevents excessively long URLs
containing every configurator parameter.

## 16.1 Share Options

Recommended initial options:

-   Copy Link
-   Email
-   SMS / native mobile sharing
-   Facebook
-   X
-   WhatsApp

Instagram does not provide the same conventional URL-sharing workflow as
some platforms, so mobile native sharing should be supported wherever
possible.

## 16.2 Web Share API

On supported devices, use the browser's native share sheet.

This allows users to share through installed apps without Calder
maintaining individual integrations for every platform.

Example experience:

> **Share Your Calder Build**

Then the operating system presents compatible apps.

Desktop can fall back to explicit share buttons and Copy Link.

------------------------------------------------------------------------

# 17. Share Build --- Share Preview

A shared build should look premium when pasted into messages or social
platforms.

Implement dynamic Open Graph/share metadata where practical.

Recommended share card:

**Image**

Rendered wheel or saved build preview

**Title**

> Calder Apex 201 --- Custom Build

**Description**

> 24×10 · Brushed Titanium Center · Polished Barrel

**URL**

Saved build URL

This transforms shared builds into branded Calder marketing assets.

------------------------------------------------------------------------

# 18. Email a Build

Email sharing deserves special attention because it can become both a
sharing and lead-generation channel.

## Customer Flow

User selects:

> **Email Build**

Fields:

-   recipient email;
-   sender name;
-   optional message.

Email contains:

-   Calder branding;
-   wheel rendering;
-   configuration summary;
-   vehicle;
-   fitment status;
-   price;
-   build link;
-   View Build CTA;
-   Request Quote CTA.

### Optional self-send

Include:

> **Email this build to me**

This is useful for customers who want to continue later.

------------------------------------------------------------------------

# 19. Sales and Dealer Handoff

Saved builds can eventually become extremely useful for Calder staff and
dealers.

Instead of a customer saying:

> "I want the black Apex wheel I configured yesterday."

they can provide:

> **Build CW-A201-8F4K2**

A salesperson can retrieve the exact configuration.

## Recommended Dealer/Sales Actions

Eventually support:

-   Open Build
-   Duplicate Build
-   Modify Build
-   Convert Build to Quote
-   Add Dealer Pricing
-   Add Internal Notes
-   Send Updated Build
-   Convert Quote to Order

This creates a direct connection between the consumer configurator and
the upcoming Dealer Portal.

------------------------------------------------------------------------

# 20. Saved Build Data Model

A conceptual saved-build object should include:

``` text
build_id
customer_id (nullable)
session_id
product_id
variant_id
design_code
design_nickname

diameter
width
offset
bolt_pattern

center_finish
barrel_finish
hardware_finish

vehicle_year
vehicle_make
vehicle_model
vehicle_trim

fitment_status

saved_price
current_price
lead_time

preview_asset
configuration_json

created_at
updated_at
expires_at (optional)

source
campaign
dealer_id (optional)
```

The exact persistence layer can be chosen during implementation.

------------------------------------------------------------------------

# 21. Save/Share Analytics

Save Build and Share Build should be tracked as conversion events.

Recommended events:

``` text
configurator_started
wheel_selected
finish_changed
vehicle_selected
fitment_verified
build_completed
build_saved
build_restored
build_shared
build_shared_email
build_shared_social
quote_requested
saved_build_added_to_cart
saved_build_purchased
```

These events will help Calder answer questions such as:

-   Which wheels are configured most often?
-   Which finishes are most popular?
-   Which builds are shared?
-   Which vehicles generate the most interest?
-   What percentage of saved builds return?
-   What percentage convert to quotes?
-   What percentage convert to orders?

------------------------------------------------------------------------

# 22. Future Saved-Build Growth Features

These should **not** block the first release.

Potential later enhancements:

## Build Comparison

Allow:

> Compare Builds

Example:

Apex 201 --- Brushed Titanium

vs.

Vertex 202 --- Gloss Black

## Favorite Builds

Heart/favorite system.

## Dealer Attribution

A dealer sends a customer a build URL containing dealer attribution.

If the customer purchases or requests a quote, Calder can associate the
lead with the dealer.

## Abandoned Build Follow-Up

With proper customer consent:

> Still thinking about your Apex 201 build?

## Build QR Code

Generate a QR code that opens the saved build.

Useful for:

-   dealer showrooms;
-   events;
-   printed quotes;
-   vehicle displays.

## Build PDF

Generate a branded configuration sheet containing:

-   wheel image;
-   specifications;
-   vehicle;
-   finish selections;
-   fitment;
-   price;
-   build ID;
-   QR code.

This would be especially useful in the Dealer Portal.

------------------------------------------------------------------------

# 23. Premium Gallery

The WS1 guide already establishes a Vehicle Gallery + Design Gallery
foundation.

This should be productionized into a major merchandising experience.

Recommended route:

`/pages/gallery`

## 23.1 Vehicle Builds

Filters:

-   Make
-   Model
-   Wheel
-   Finish
-   Diameter

Example project:

> 2026 Cadillac Escalade\
> Calder Apex 201\
> 24×10\
> Brushed Titanium\
> Gloss Black Barrel

CTA:

> **Build This Wheel**

This should prepopulate the Build Your Wheel configurator.

## 23.2 Wheel Designs

Browse by:

-   design;
-   finish;
-   construction;
-   series.

Each design can connect directly to:

-   PDP;
-   Build Your Wheel;
-   compatible vehicles.

------------------------------------------------------------------------

# 24. Product Page

The PDP should remain the primary purchase page for customers who
already know the wheel they want.

Final PDP structure should support:

1.  Product gallery
2.  Product identity
3.  Fitment status
4.  Base variants/options
5.  Price
6.  Add to Cart
7.  Specifications
8.  Engineering/benefits
9.  Build Your Wheel
10. Find Your Perfect Fit
11. Real World Gallery
12. Related Wheels
13. Specialist CTA

## Recommended Configurator Actions on PDP

The embedded configurator should also support:

-   Save Build
-   Share Build
-   Open Full Configurator

CTA:

> **Continue in Build Your Wheel**

This can open the standalone configurator with the current product and
selections already loaded.

------------------------------------------------------------------------

# 25. SEO/AEO Foundation

Before the consumer storefront is considered launch-ready, implement:

-   unique product title tags;
-   unique meta descriptions;
-   collection metadata;
-   canonical URLs;
-   Product structured data;
-   Offer structured data;
-   Breadcrumb schema;
-   Organization schema;
-   descriptive image alt text;
-   Open Graph images;
-   social share metadata;
-   sitemap verification;
-   indexation checks.

Saved Build URLs require special SEO handling.

## Saved Build SEO Recommendation

Saved configuration URLs generally should **not** create thousands of
indexable pages.

Recommended behavior:

-   `noindex` saved build pages;
-   canonical to the primary product/configurator where appropriate;
-   still provide Open Graph/social metadata for sharing.

This prevents configuration URLs from creating SEO duplication while
retaining their sharing value.

------------------------------------------------------------------------

# 26. Performance

The production asset pass should include performance optimization.

Target:

-   WebP/AVIF where appropriate;
-   responsive image sizes;
-   lazy loading below fold;
-   optimized video;
-   minimal blocking JavaScript;
-   no unnecessary duplicate configurator requests;
-   cached configuration assets;
-   optimized composite imagery.

The configurator should feel immediate.

Finish changes should update the preview without noticeable delay
whenever possible.

------------------------------------------------------------------------

# 27. End-to-End Consumer QA

The consumer storefront should not be frozen until these flows pass.

## Flow A --- Vehicle-First

``` text
Homepage
→ Find Your Fit
→ Vehicle
→ Compatible Wheels
→ Collection
→ PDP
→ Configure
→ Save Build
→ Add to Cart
→ Checkout
```

## Flow B --- Style-First

``` text
Homepage
→ Shop by Wheel Style
→ Filter
→ Collection
→ PDP
→ Configure
→ Share Build
```

## Flow C --- Configurator-First

``` text
Build Your Wheel
→ Select Wheel
→ Configure
→ Select Vehicle
→ Verify Fitment
→ Save Build
→ Restore Build
→ Add to Cart
```

## Flow D --- Shared Build

``` text
Customer A
→ Configure
→ Share Build

Customer B
→ Open Build URL
→ Configuration Restores
→ Verify Fitment
→ Modify or Add to Cart
```

## Flow E --- Gallery

``` text
Gallery
→ Vehicle Build
→ Build This Wheel
→ Configurator Prepopulated
→ Save / Quote / Cart
```

## Flow F --- Returning Customer

``` text
Saved Build
→ Return Later
→ Restore
→ Current Price/Availability Revalidated
→ Purchase
```

------------------------------------------------------------------------

# 28. Responsive QA

Test at minimum:

### Desktop

-   1440px
-   1280px

### Tablet

-   1024px
-   768px

### Mobile

-   430px
-   390px
-   375px

Special attention should be paid to:

-   configurator controls;
-   wheel preview;
-   sticky purchase controls;
-   filters;
-   vehicle selector;
-   share modal;
-   saved build page;
-   product gallery;
-   mobile navigation.

------------------------------------------------------------------------

# 29. Consumer Storefront Milestones

## Milestone A1 --- Product Data Audit

**Goal:** Make the five initial wheels production-ready.

### Deliverables

-   Verify specifications
-   Verify variants
-   Verify metafields
-   Verify retail pricing
-   Verify dealer pricing
-   Verify configurator data
-   Verify fitment data
-   Verify BOM
-   Verify images

### Exit Criteria

All five products pass a product-data checklist.

------------------------------------------------------------------------

# 30. Milestone A2 --- Production Assets

### Deliverables

-   final homepage imagery;
-   final collection imagery;
-   final PDP imagery;
-   final wheel images;
-   finish assets;
-   configurator composites;
-   vehicle photography;
-   video;
-   premium icons.

### Exit Criteria

No presentation-critical placeholder media remains.

------------------------------------------------------------------------

# 31. Milestone A3 --- Product Discovery

### Deliverables

-   collection filters;
-   Wheel Style search;
-   product metafield connections;
-   filtered result routing.

### Exit Criteria

Customers can find products by both vehicle and wheel characteristics.

------------------------------------------------------------------------

# 32. Milestone A4 --- Standalone Fitment Finder

### Deliverables

-   dedicated page;
-   vehicle selector;
-   compatibility results;
-   persistent vehicle state;
-   product routing.

### Exit Criteria

Vehicle selection reliably produces compatible Calder products and
persists across relevant pages.

------------------------------------------------------------------------

# 33. Milestone A5 --- Build Your Wheel 2.0

This should be treated as a flagship feature.

### Core Deliverables

-   standalone configurator;
-   wheel selection;
-   dimensional selection;
-   finish customization;
-   vehicle selection;
-   fitment verification;
-   live rendering;
-   pricing;
-   availability;
-   lead time;
-   Add to Cart;
-   Request Quote.

### Interactive Sales Deliverables

-   Save Build;
-   unique Build ID;
-   permanent/recoverable Build URL;
-   Restore Build;
-   Share Build;
-   Copy Link;
-   native sharing;
-   Email Build;
-   social sharing;
-   analytics.

### Exit Criteria

A user can create a configuration, save it, leave the site, return
through the saved link, recover the same configuration, share it with
another person, and successfully continue toward quote/cart.

------------------------------------------------------------------------

# 34. Milestone A6 --- Premium Gallery

### Deliverables

-   Vehicle Builds;
-   Wheel Designs;
-   gallery filters;
-   premium lightbox/project views;
-   Build This Wheel integration;
-   PDP integration.

### Exit Criteria

Gallery content acts as a direct product discovery and configurator
entry point.

------------------------------------------------------------------------

# 35. Milestone A7 --- SEO + Analytics

### Deliverables

-   metadata;
-   schema;
-   OG/social cards;
-   sitemap validation;
-   analytics events;
-   configurator funnel tracking;
-   saved-build tracking.

### Exit Criteria

Primary pages are technically prepared for search indexing and
conversion measurement.

------------------------------------------------------------------------

# 36. Milestone A8 --- End-to-End QA

Test:

-   Home
-   Collection
-   PDP
-   Fitment Finder
-   Build Your Wheel
-   Saved Builds
-   Shared Builds
-   Gallery
-   Cart
-   Checkout

Across desktop, tablet, and mobile.

### Exit Criteria

No critical-path regression remains.

------------------------------------------------------------------------

# 37. Consumer Storefront Feature-Complete Gate

The consumer storefront can be frozen when:

-   [ ] Homepage approved
-   [ ] Collection approved
-   [ ] PDP approved
-   [ ] Final client imagery integrated
-   [ ] Premium icons integrated
-   [ ] Product specifications verified
-   [ ] Variants verified
-   [ ] Metafields verified
-   [ ] Collection filters functional
-   [ ] Wheel Style search functional
-   [ ] Standalone Fitment Finder functional
-   [ ] Standalone Build Your Wheel functional
-   [ ] Save Build functional
-   [ ] Restore Build functional
-   [ ] Share Build functional
-   [ ] Email Build functional
-   [ ] Gallery functional
-   [ ] Configurator → Cart passes
-   [ ] Fitment → Product passes
-   [ ] Shared Build → Restore passes
-   [ ] SEO foundation implemented
-   [ ] Analytics implemented
-   [ ] Desktop QA passes
-   [ ] Tablet QA passes
-   [ ] Mobile QA passes

At this point:

> **Freeze consumer storefront architecture.**

Only bug fixes, content updates, catalog additions, and conversion
optimization should occur while Dealer Portal development becomes the
primary focus.

------------------------------------------------------------------------

# 38. Next Major Milestone --- Dealer Portal UX + Integration

The next milestone should not be framed as simply:

> Develop Dealer Dashboard

A significant amount of dealer functionality already exists according to
the WS1 Activation Guide.

The better milestone is:

> **Dealer Portal UX + Integration**

The goal is to transform existing dealer functionality into a cohesive,
premium B2B experience matching the newly completed consumer storefront.

------------------------------------------------------------------------

# 39. Dealer Portal Target Experience

Recommended dealer navigation:

``` text
Dashboard
Orders
Quick Order
Quotes
Saved Builds
Invoices
Order Guide
Account
Support
```

The addition of **Saved Builds** becomes particularly valuable because
consumer configurations can flow directly into dealer workflows.

------------------------------------------------------------------------

# 40. Dealer Dashboard

Dashboard should summarize:

-   account status;
-   dealer tier;
-   credit limit;
-   available credit;
-   outstanding balance;
-   open orders;
-   quotes;
-   production status;
-   recent orders;
-   saved/customer builds;
-   quick-order shortcuts.

------------------------------------------------------------------------

# 41. Dealer Quick Order

Existing functionality should be visually integrated with the new
system.

Target features:

-   SKU/product search;
-   product selection;
-   quantities;
-   dealer price;
-   MOQ validation;
-   PO number;
-   shipping destination;
-   save draft;
-   submit order.

Future integration:

> **Load Saved Build**

A dealer can enter a customer Build ID and convert the configuration
into a quote/order.

------------------------------------------------------------------------

# 42. Dealer Quotes

This should become one of the highest-priority Dealer Portal
improvements.

Recommended lifecycle:

``` text
Draft
→ Sent
→ Viewed
→ Accepted
→ Converted to Order
→ Expired
```

A quote can originate from:

-   dealer-created configuration;
-   consumer saved build;
-   customer request;
-   Calder sales team.

------------------------------------------------------------------------

# 43. Saved Build → Dealer Quote

This is the strongest strategic connection created by the new Save Build
feature.

Example:

Customer creates:

> Apex 201\
> 24×10\
> Brushed Titanium\
> Polished Barrel\
> Build CW-A201-8F4K2

Customer sends Build ID to dealer.

Dealer enters:

`CW-A201-8F4K2`

Dealer portal retrieves:

-   product;
-   configuration;
-   vehicle;
-   fitment;
-   retail price;
-   dealer cost.

Dealer clicks:

> **Create Quote**

The configuration is now a sales object rather than merely a website
session.

------------------------------------------------------------------------

# 44. Dealer Milestone Sequence

## B1 --- Dealer Portal Design System

Apply Calder storefront brand standards.

## B2 --- Dashboard

Redesign and validate.

## B3 --- Orders

Production status, reorder, details.

## B4 --- Quick Order

Productionize existing functionality.

## B5 --- Quotes

Complete quote management and quote-to-order workflow.

## B6 --- Saved Builds

Build ID lookup and build-to-quote conversion.

## B7 --- Invoices/Credit

Polish existing account and credit views.

## B8 --- Order Guide

Integrate printable/downloadable dealer pricing.

## B9 --- Dealer QA

Validate all dealer roles, pricing tiers, permissions, MOQ rules,
ordering, quotes, and account data.

------------------------------------------------------------------------

# 45. What Should Not Block Dealer Development

After the consumer feature-complete gate, the following can continue
later without preventing Dealer Portal work:

-   additional wheel designs;
-   large gallery expansion;
-   sophisticated build comparison;
-   abandoned-build campaigns;
-   QR build sharing;
-   Build PDF generation;
-   advanced recommendations;
-   AI styling recommendations;
-   expanded fitment datasets beyond launch priorities;
-   advanced CRM automation.

These belong to continuous optimization rather than the critical launch
path.

------------------------------------------------------------------------

# 46. Development Guardrails

From this point forward, preserve the working technical foundation.

## Protected Functionality

Do not rewrite or replace unless explicitly required:

-   Fitment API integration
-   `fitment-finder.js`
-   `CALDER_FITMENT_API`
-   `window.__fitmentData`
-   vehicle localStorage state
-   configuration resolver
-   Build Your Wheel behavior
-   Shopify product form
-   Shopify variant behavior
-   Shopify cart behavior
-   dealer pricing logic
-   dealer gating
-   MOQ enforcement

Visual and UX modifications should wrap around the working systems
whenever possible.

------------------------------------------------------------------------

# 47. Recommended Development Order

The recommended immediate order is:

``` text
1. Product Data Audit
2. Production Client Assets
3. Collection Filters
4. Wheel Style Search
5. Standalone Fitment Finder
6. Build Your Wheel 2.0
7. Save Build
8. Share Build
9. Premium Gallery
10. SEO + Analytics
11. Full Consumer E2E QA
12. CONSUMER FEATURE FREEZE
13. Dealer Portal UX + Integration
```

Save Build and Share Build should be designed as part of Build Your
Wheel rather than bolted onto it after the configurator page is
considered complete.

------------------------------------------------------------------------

# 48. Strategic Outcome

The consumer storefront should ultimately operate as a connected sales
system:

``` text
DISCOVER
   ↓
HOME / GALLERY / COLLECTION
   ↓
FIND YOUR VEHICLE
or
SHOP BY WHEEL STYLE
   ↓
SELECT WHEEL
   ↓
BUILD YOUR WHEEL
   ↓
VERIFY FITMENT
   ↓
SAVE BUILD
   ↓
SHARE BUILD
   ↓
┌─────────────────────┐
│                     │
ADD TO CART      REQUEST QUOTE
│                     │
CHECKOUT          DEALER / SALES
                      │
                 DEALER PORTAL
                      │
                 QUOTE → ORDER
```

This is a stronger commercial model than treating the configurator as a
visual customization widget.

The Build Your Wheel system becomes a persistent sales object that can
move between:

-   customer;
-   friend/family;
-   social media;
-   Calder sales staff;
-   dealer;
-   quote;
-   cart;
-   and order.

------------------------------------------------------------------------

# 49. Final Project Assessment

Calder Wheels is no longer primarily in the page-development stage.

The major foundation is present:

-   redesigned consumer storefront;
-   wheel catalog;
-   product pages;
-   configurator;
-   fitment engine;
-   Shopify integration;
-   product metafields;
-   backend APIs;
-   dealer infrastructure.

The current priority should be:

> **Productionize the consumer experience and connect its systems into a
> complete conversion funnel.**

The addition of **Save Build + Share Build** should be considered part
of that completion milestone because it significantly increases the
commercial usefulness of the configurator.

After the Consumer Storefront Feature-Complete Gate is reached, the
development focus should shift decisively to:

> **Dealer Portal UX + Integration**

At that stage, the dealer system can reuse the same product, fitment,
configuration, and saved-build data that powers the consumer storefront,
producing a much more cohesive Calder commerce platform.

---

# 50. Gallery Benchmark — Vossen Reference Analysis

The Vossen gallery model provides a useful benchmark for Calder because it treats gallery content as structured product and vehicle discovery rather than as a simple image archive.

The useful concept to borrow is the **relationship between vehicles, wheels, specifications, media, and conversion actions**.

Calder should not reproduce Vossen's design or content structure literally. The opportunity is to build a Calder-specific system around the technical assets that already exist: Shopify products, product metafields, Vehicle Fitment Finder, Build Your Wheel configurator, Save Build, Share Build, dealer workflows, and quote/cart conversion.

---

# 51. What the Vossen Gallery System Does Well

Vossen separates its gallery into two complementary discovery paths:

```text
GALLERY
├── Vehicle Gallery
└── Wheel Gallery
```

This allows two different customer intents.

A customer can ask:

> "What wheels look good on my Escalade?"

or:

> "Show me this particular wheel in different finishes and applications."

That distinction should also exist in Calder's gallery.

## Vehicle Gallery Pattern

The vehicle gallery is organized around real vehicle applications.

Gallery cards associate a vehicle with:

- vehicle make/model;
- wheel series;
- wheel model;
- installation imagery.

Individual vehicle gallery pages then expand the entry into a detailed build profile.

Observed vehicle-gallery detail data includes:

- vehicle make/model;
- wheel model;
- wheel series;
- multiple installation photographs;
- front wheel size;
- rear wheel size;
- front tire size where applicable;
- rear tire size where applicable;
- finish;
- installer/dealer attribution;
- related galleries for the vehicle make;
- related galleries for the vehicle model;
- related galleries using the wheel;
- wheel details;
- quote CTA.

This makes each gallery item useful for both inspiration and purchasing research.

## Wheel Gallery Pattern

The wheel gallery organizes imagery around the wheel itself.

Gallery cards expose:

- wheel model;
- wheel series;
- finish.

Individual wheel-gallery entries can include:

- multiple wheel photographs;
- wheel model;
- series;
- component-specific finishes;
- center finish;
- inner barrel finish;
- outer barrel finish;
- related galleries;
- vehicle applications;
- quote path.

This is especially useful for forged multi-piece products because a customer can inspect actual finish combinations rather than relying only on a product rendering.

---

# 52. Calder Opportunity — Build Profiles Instead of Gallery Posts

Calder should introduce a concept called:

> **Calder Build Profile**

A Build Profile represents a documented wheel installation or curated configuration.

It should be a structured commerce object rather than only an image gallery entry.

Conceptually:

```text
CALDER BUILD PROFILE

Vehicle
   +
Wheel
   +
Wheel Configuration
   +
Fitment
   +
Media
   +
Installer / Dealer
   +
Saved Build
   +
Conversion Actions
```

This creates a major advantage over a traditional gallery.

A customer viewing an inspiring vehicle can recreate the configuration directly.

---

# 53. Proposed Calder Gallery Architecture

Recommended primary route:

`/pages/gallery`

Page title:

> **CALDER GALLERY**

Supporting copy:

> Explore Calder Wheels on real vehicles, discover custom finishes, and build the setup for your own vehicle.

Primary navigation:

```text
VEHICLE BUILDS
WHEEL DESIGNS
```

Optional future third category:

```text
FEATURED BUILDS
```

---

# 54. Vehicle Builds Gallery

Recommended route:

`/pages/gallery/vehicles`

The Vehicle Builds gallery should focus on real-world applications.

## Card Content

Each card should show:

- hero vehicle image;
- vehicle make/model;
- Calder wheel;
- wheel size;
- finish;
- optional build badge.

Example:

```text
[ESCALADE IMAGE]

CADILLAC ESCALADE

APEX 201
24 × 10
BRUSHED TITANIUM

VIEW BUILD →
```

## Vehicle Gallery Filters

Recommended filters:

### Make

Examples:

- Cadillac
- Chevrolet
- GMC
- Ford
- Mercedes-Benz
- Land Rover

### Model

Dynamic based on Make.

Examples:

- Escalade
- Tahoe
- Yukon
- F-150
- G-Class
- Range Rover

### Wheel

Examples:

- Apex 201
- Vertex 202
- Striker 203
- Turbine 205
- Vortex 207

### Diameter

Examples:

- 20"
- 22"
- 24"
- 26"

### Finish

Examples:

- Gloss Black
- Brushed Titanium
- Polished
- Chrome
- Custom

### Construction

Examples:

- Monoblock
- 2-Piece
- 3-Piece

The filters should use structured gallery/build data.

---

# 55. Wheel Designs Gallery

Recommended route:

`/pages/gallery/wheels`

This section should allow customers to browse physical wheel executions independent of vehicle.

## Card Content

Example:

```text
[WHEEL IMAGE]

APEX 201

3-PIECE FORGED

CENTER
Brushed Titanium

BARREL
Polished

VIEW CONFIGURATION →
```

## Wheel Gallery Filters

Recommended:

- Wheel Design
- Series
- Construction
- Center Finish
- Barrel Finish
- Hardware Finish
- Diameter

This gallery becomes particularly valuable once Calder has photographed actual finished wheel sets before shipment.

---

# 56. Calder Build Detail Page

Each vehicle installation should receive a dedicated Build Profile page.

Recommended URL concept:

`/pages/gallery/builds/2026-cadillac-escalade-apex-201`

Depending on Shopify implementation constraints, the public route may be implemented through metaobjects/templates while preserving clean SEO-friendly URLs where possible.

## Recommended Page Structure

### Section 1 — Cinematic Build Hero

Large full-width image.

Overlay:

```text
2026 CADILLAC ESCALADE

APEX 201
24 × 10 · BRUSHED TITANIUM

BUILD THIS SETUP →
```

Secondary action:

> VIEW WHEEL

---

### Section 2 — Build Gallery

Premium image presentation.

Support:

- landscape images;
- portrait images;
- detail shots;
- wheel close-ups;
- rolling shots;
- optional video.

Use a combination of:

- large editorial image;
- two-column image grids;
- full-width images;
- lightbox.

Avoid displaying every image as identical thumbnails.

The page should feel closer to an automotive editorial feature.

---

### Section 3 — Build Specifications

Example:

```text
BUILD SPECIFICATIONS

VEHICLE
2026 Cadillac Escalade

WHEEL
Calder Apex 201

CONSTRUCTION
3-Piece Forged

FRONT
24 × 10

REAR
24 × 10

CENTER FINISH
Brushed Titanium

BARREL FINISH
Polished

HARDWARE
Chrome

FITMENT
Calder Verified
```

Where tire data is available:

```text
FRONT TIRE
285/40R24

REAR TIRE
285/40R24
```

---

# 57. Build This Setup — Key Calder Differentiator

This should be one of the most important differences between Calder's gallery and a traditional gallery.

CTA:

> **BUILD THIS SETUP**

The CTA should launch:

`/pages/build-your-wheel`

with the gallery configuration preloaded.

Conceptually:

```text
Gallery Build
     ↓
Build This Setup
     ↓
Build Your Wheel
     ↓
Wheel preselected
Size preselected
Finish preselected
Vehicle preselected
     ↓
Fitment revalidated
     ↓
Customer modifies or accepts
     ↓
Save / Share / Quote / Cart
```

The customer should not have to manually recreate what they just saw.

---

# 58. Build Profile → Saved Build

Where appropriate, each Build Profile can contain a canonical configurator configuration.

Example:

```text
Gallery Build:
CALDER-GALLERY-ESCALADE-001

Configuration:
Apex 201
24 × 10
Brushed Titanium Center
Polished Barrel
Chrome Hardware
2026 Cadillac Escalade
```

When the visitor clicks:

> BUILD THIS SETUP

the system creates or restores the corresponding configuration in Build Your Wheel.

The customer can then modify it.

If modified and saved, it becomes the customer's own Build ID.

Example:

```text
Gallery inspiration:
CALDER-GALLERY-ESCALADE-001

Customer variation:
CW-A201-8F4K2
```

This creates traceable movement from inspiration to configuration.

---

# 59. Vehicle Fitment Integration

Gallery pages should connect directly to the existing Fitment Finder.

If the gallery vehicle is:

> 2026 Cadillac Escalade

the page can display:

```text
OWN AN ESCALADE?

Find Calder wheels verified for your vehicle.

[SELECT YOUR YEAR]
[FIND MY FITMENT]
```

Alternatively:

> **See All Wheels for Cadillac Escalade**

This routes to a Fitment Finder result with the vehicle context preselected where technically appropriate.

---

# 60. Product Integration

Every Build Profile should link to its underlying Shopify product.

Example:

```text
FEATURED WHEEL

APEX 201
3-Piece Forged

Starting at $X,XXX

VIEW WHEEL
BUILD YOURS
```

The relationship should be stored as a product reference rather than manually maintained URL text.

This allows Shopify to remain the source of truth for:

- product availability;
- pricing;
- product title;
- current imagery;
- product status.

---

# 61. Installer / Dealer Attribution

Vossen's gallery pages sometimes identify the shop that outfitted the vehicle.

Calder should adopt this idea because it aligns naturally with the upcoming Dealer Portal.

A Build Profile can optionally contain:

```text
INSTALLED BY

Calder Authorized Dealer

Dealer Name
Miami, Florida

VIEW DEALER →
```

Future dealer features can allow approved dealers to submit builds for review.

This creates a dealer marketing incentive:

> Sell/install Calder wheels → submit the vehicle → receive exposure in the Calder Gallery.

---

# 62. Future Dealer-Submitted Builds

This should be considered a post-launch Dealer Portal enhancement.

Dealer workflow:

```text
Dealer Portal
   ↓
Submit Vehicle Build
   ↓
Vehicle information
Wheel configuration
Customer-approved photography
Installer information
   ↓
Calder Review
   ↓
Approved
   ↓
Published to Gallery
```

Recommended statuses:

```text
Draft
Submitted
Under Review
Approved
Published
Rejected
Archived
```

This could eventually help Calder scale its gallery without Calder staff manually creating every build.

---

# 63. Customer Build Submissions

A later growth feature can allow customers to submit their own Calder-equipped vehicles.

CTA:

> **SHOW US YOUR CALDER BUILD**

Submission:

- vehicle;
- wheel;
- configuration;
- images;
- Instagram handle optional;
- location optional;
- photographer credit;
- permission/usage agreement.

Approved submissions could receive:

> **OWNER BUILD**

badges.

This creates community content without making user-generated content part of the initial critical path.

---

# 64. Recommended Shopify Data Architecture

The gallery should not be built as dozens or hundreds of manually coded Shopify pages.

Use structured Shopify data.

The recommended architecture is:

```text
Shopify Product
      ↑
      |
Gallery Build Metaobject
      |
      ↓
Vehicle / Fitment Data
```

## Recommended Metaobject

Create:

`calder_build`

Suggested fields:

```text
title
handle
status

vehicle_year
vehicle_make
vehicle_model
vehicle_trim

product_reference
design_code

front_diameter
front_width
front_offset

rear_diameter
rear_width
rear_offset

bolt_pattern

front_tire
rear_tire

center_finish
barrel_finish
hardware_finish

fitment_status

hero_image
gallery_images
video_url

dealer_reference
dealer_name
dealer_location

photographer
photo_credit

configurator_payload
canonical_build_reference

featured
published_date

seo_title
seo_description
```

---

# 65. Why Metaobjects Are Recommended

Using Shopify metaobjects allows gallery builds to become structured reusable records.

Benefits:

- no duplicate Liquid templates per build;
- easier admin editing;
- product references remain connected;
- gallery filters can use structured data;
- build detail pages can use one shared template;
- dealers/customer submissions can eventually populate the same schema;
- data can be consumed by JavaScript/API workflows;
- n8n can automate publishing workflows later.

The design template remains consistent while the content changes.

---

# 66. Gallery Build Template

Create one reusable Shopify template.

Concept:

```text
templates/metaobject/calder_build.json
```

or the equivalent architecture supported by the active Shopify theme/configuration.

Sections could include:

```text
calder-build-hero
calder-build-gallery
calder-build-specs
calder-build-wheel
calder-build-fitment
calder-build-configurator-cta
calder-build-related
calder-build-dealer
calder-specialist-cta
```

The exact implementation should follow the Lumia theme's supported metaobject/template conventions.

---

# 67. Gallery Index Template

Recommended components:

```text
sections/calder-gallery-hero.liquid
sections/calder-gallery-tabs.liquid
sections/calder-gallery-filters.liquid
sections/calder-gallery-grid.liquid
snippets/calder-gallery-card.liquid
assets/calder-gallery.css
assets/calder-gallery.js
```

Reuse the existing Calder design system.

Do not import Vossen styling.

---

# 68. Related Gallery Intelligence

One particularly useful Vossen pattern is connecting each gallery entry to multiple related discovery paths.

Calder should implement this more systematically.

A Build Profile should automatically produce:

```text
MORE [VEHICLE MODEL] BUILDS

MORE BUILDS WITH [WHEEL]

MORE [VEHICLE MAKE] BUILDS

SIMILAR CALDER WHEELS
```

Example:

```text
2026 Cadillac Escalade / Apex 201
```

could show:

```text
MORE ESCALADE BUILDS
MORE APEX 201 BUILDS
MORE CADILLAC BUILDS
SIMILAR 3-PIECE WHEELS
```

This creates a strong internal discovery network.

---

# 69. Gallery SEO Opportunity

Unlike Saved Build URLs, public Gallery Build Profiles should generally be indexable when they contain unique real-world content.

Example SEO title:

> 2026 Cadillac Escalade on Calder Apex 201 Wheels

Example description:

> View this Cadillac Escalade featuring Calder Apex 201 forged wheels in Brushed Titanium, including wheel specifications, fitment details and build photography.

Gallery build pages can target valuable long-tail searches involving:

```text
[vehicle] + wheels
[vehicle] + forged wheels
[vehicle] + 24 inch wheels
[vehicle] + Calder wheels
[wheel model] + [vehicle]
```

Use:

- unique title;
- unique description;
- image alt text;
- Breadcrumb schema;
- ImageObject where appropriate;
- VideoObject where applicable;
- product links;
- canonical URLs.

Do not create thin pages with only one image.

---

# 70. Gallery Social Sharing

Every Build Profile should be shareable.

Actions:

- Copy Link
- Native Share
- Email
- Facebook
- X
- WhatsApp

Social preview:

```text
2026 Cadillac Escalade
Calder Apex 201
24 × 10 · Brushed Titanium
```

Hero imagery should become the Open Graph image.

This gives Calder two shareable object types:

```text
PUBLIC GALLERY BUILD
Curated / published / indexable

CUSTOMER SAVED BUILD
Personal configuration / noindex
```

These should remain technically distinct.

---

# 71. Gallery → Build Your Wheel Analytics

Track:

```text
gallery_view
gallery_filter_used
gallery_build_opened
gallery_image_expanded
gallery_video_played
gallery_product_clicked
gallery_fitment_clicked
gallery_build_this_setup
gallery_build_saved
gallery_quote_requested
gallery_add_to_cart
```

Most importantly, measure:

> **Gallery Build → Build Your Wheel conversion**

and:

> **Gallery Build → Purchase/Quote conversion**

This will identify which vehicles, wheels and finishes actually drive sales interest.

---

# 72. Gallery MVP vs Future Scope

## Launch / MVP

Build:

- Gallery landing page;
- Vehicle Builds tab;
- Wheel Designs tab;
- filters;
- structured Build Profiles;
- dedicated Build Detail pages;
- premium image galleries;
- build specifications;
- product connection;
- Build This Setup;
- Fitment Finder connection;
- Save/Share connection;
- related builds;
- SEO;
- analytics.

## Post-Launch

Add:

- dealer build submissions;
- customer build submissions;
- owner profiles;
- Instagram/social integrations;
- build comparison;
- advanced recommendations;
- geographic/dealer discovery;
- automated gallery ingestion;
- gallery moderation dashboard.

---

# 73. Initial Calder Gallery Content Strategy

Do not wait until Calder has hundreds of photographed vehicles.

Launch with a small, highly curated set.

Recommended initial target:

```text
12–20 Vehicle Build Profiles
+
5 Wheel Design Galleries
```

Prioritize vehicles that align with Calder's brand and current fitment work.

Examples could include:

- Cadillac Escalade
- Chevrolet Tahoe
- GMC Yukon
- Ford F-150
- Ford Expedition
- Mercedes-Benz G-Class
- Range Rover

Only publish real Calder installations or client-approved production imagery as actual builds.

If concept/rendered content is used, label it clearly as a render or concept rather than presenting it as a photographed customer installation.

---

# 74. Wheel Design Gallery Content Strategy

Each initial Calder wheel should receive a design gallery.

Example:

```text
APEX 201 GALLERY
```

Include:

- isolated front view;
- three-quarter view;
- detail/machining shot;
- center detail;
- barrel detail;
- hardware detail;
- multiple real finishes;
- installed vehicle examples.

This gallery should be linked from the Apex 201 PDP.

Likewise, the PDP Real World section should link back to:

> **VIEW ALL APEX 201 BUILDS**

This creates bidirectional navigation:

```text
PRODUCT
↔
GALLERY
↔
CONFIGURATOR
```

---

# 75. Revised Premium Gallery Milestone

Replace the previous simplified Gallery milestone with:

## Milestone A6 — Calder Gallery & Build Profiles

### A6.1 Data Architecture

- create `calder_build` metaobject;
- define vehicle fields;
- define wheel/product reference;
- define wheel/tire specifications;
- define finish configuration;
- define media;
- define dealer attribution;
- define configurator payload;
- define SEO fields.

### A6.2 Gallery Index

- Vehicle Builds;
- Wheel Designs;
- filters;
- responsive gallery cards;
- pagination/load-more strategy.

### A6.3 Build Detail Template

- cinematic hero;
- premium media gallery;
- vehicle details;
- wheel specifications;
- tire specifications;
- finish details;
- fitment status;
- dealer attribution;
- related builds.

### A6.4 Commerce Integration

- View Wheel;
- Build This Setup;
- Find My Fitment;
- Save Build;
- Share Build;
- Request Quote;
- Add to Cart where appropriate.

### A6.5 Cross-Linking

- vehicle → related vehicle builds;
- wheel → related wheel builds;
- gallery → PDP;
- PDP → gallery;
- gallery → configurator;
- gallery → fitment.

### A6.6 SEO

- indexable curated build pages;
- metadata;
- schema;
- alt text;
- OG cards;
- internal linking.

### A6.7 Analytics

- gallery engagement;
- filter usage;
- Build This Setup;
- quote;
- cart;
- saved-build conversion.

### Exit Criteria

A customer must be able to:

```text
Browse Gallery
→ Find a vehicle/setup they like
→ Open Build Profile
→ Understand exact setup
→ Open the associated Calder wheel
→ Recreate the setup in Build Your Wheel
→ Verify fitment
→ Save or Share it
→ Request Quote or Purchase
```

---

# 76. Revised Consumer Storefront Completion Sequence

The recommended sequence is now:

```text
1. Product Data Audit
2. Production Client Assets
3. Collection Filters
4. Wheel Style Search
5. Standalone Fitment Finder
6. Build Your Wheel 2.0
7. Save Build
8. Share Build
9. Calder Gallery Data Architecture
10. Vehicle Builds Gallery
11. Wheel Designs Gallery
12. Build Profile Detail Pages
13. Gallery → Configurator/Fitment Integration
14. SEO + Analytics
15. Full Consumer E2E QA
16. CONSUMER FEATURE FREEZE
17. Dealer Portal UX + Integration
```

The Gallery should therefore be implemented **after the configurator Save/Share model is defined**, because Gallery Build Profiles should be able to hand exact configurations into Build Your Wheel rather than creating a separate configuration format.

---

# 77. Gallery Relationship to Dealer Portal

The Gallery should be considered part of the bridge between consumer and dealer commerce.

Long-term system:

```text
REAL VEHICLE INSTALLATION
        ↓
CALDER BUILD PROFILE
        ↓
GALLERY
        ↓
CUSTOMER CLICKS BUILD THIS SETUP
        ↓
BUILD YOUR WHEEL
        ↓
CUSTOMER SAVES BUILD
        ↓
BUILD ID
        ↓
DEALER PORTAL
        ↓
QUOTE
        ↓
ORDER
        ↓
NEW INSTALLATION
        ↓
NEW GALLERY BUILD
```

This creates a useful commercial flywheel.

Every completed installation can become future sales content.

Every gallery entry can create a new configuration.

Every saved configuration can become a dealer quote.

Every completed dealer installation can potentially become another gallery entry.

That is the unique Calder implementation opportunity.


