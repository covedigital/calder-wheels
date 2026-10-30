# Calder Wheels — Client Meeting Summary, 10/9 Delivery Plan & OpenCode Handoff

**Project:** Calder Wheels  
**Platform:** Shopify + Lumia Theme  
**Delivery Deadline:** October 9, 2026  
**Current Sprint Objective:** Convert the approved design direction and client feedback into a controlled implementation sequence that expands the Calder shopping experience without regressing existing working functionality.

---

# 1. Executive Summary

The latest Calder Wheels client meeting confirmed that the project is moving in the correct direction and clarified the next major phase of development.

The Calder website should not behave like a conventional Shopify storefront with a single linear customer journey. The client wants customers to be able to discover and configure wheels in several different ways depending on how they naturally shop.

The experience should support customers who:

1. Know their vehicle and want to see what fits.
2. Want to browse wheel designs visually before entering vehicle information.
3. Discover a wheel through a vehicle/gallery build.
4. Want to customize a wheel before deciding whether to purchase.
5. Want to save or share a custom configuration.
6. Want to take a configured build to a Calder dealer.
7. Want to purchase directly if appropriate.
8. Are dealers using Calder's tools to assist customers.

These journeys should converge around a common system:

> **Discover → Fit → Configure → Visualize → Save/Share → Dealer or Direct Purchase**

The central product object should increasingly become the **configured wheel build**, not simply the base Shopify product.

That configured build can eventually connect:

- Shopify products
- Vehicle fitment
- Build Your Wheel
- Saved builds
- Share links
- Build PDFs
- Gallery vehicles
- Dealer lookup
- Dealer dashboard
- Inventory availability
- Calder part numbers
- Analytics
- QuickBooks / inventory integrations

The immediate objective, however, is to implement the next set of deliverables systematically by **October 9** without destabilizing the Home, Collection, Product, or other working functionality.

---

# 2. Client-Confirmed Experience Direction

## 2.1 Multiple Shopping Paths

The client does not want customers forced through one rigid funnel.

The site should support at least four primary discovery paths.

### Path A — Vehicle First

```text
Year
  ↓
Make
  ↓
Model
  ↓
Trim
  ↓
Compatible Wheels
  ↓
Wheel Product
  ↓
Configure
  ↓
Save / Share / Dealer / Purchase
```

### Path B — Wheel First

```text
Browse Wheels
  ↓
Select Design
  ↓
Configure Wheel
  ↓
Check Vehicle Fitment
  ↓
Save / Share / Dealer / Purchase
```

### Path C — Gallery First

```text
Vehicle Gallery
  ↓
Vehicle Build
  ↓
Exact Wheel / Tire / Fitment Setup
  ↓
Shop This Fitment
  ↓
Customize This Wheel
  ↓
Save / Share / Dealer / Purchase
```

### Path D — Builder First

```text
Build Your Wheel
  ↓
Choose Wheel
  ↓
Center Finish
  ↓
Lip Finish
  ↓
Bolt Finish
  ↓
Vehicle / Fitment
  ↓
Save / Share / Dealer / Purchase
```

These are different entry points into the same Calder product ecosystem.

---

# 3. 10/9 Sprint Deliverables

The following deliverables are due by **October 9, 2026**.

## Delivery Order

Implementation should occur in this order:

1. Confirm inventory products and product attributes.
2. Standalone Fitment Finder.
3. Standalone Build Your Wheel.
4. Gallery.
5. Dealer Dashboard.
6. Cart Page.
7. Remove unsupported / unnecessary vehicles from the fitment tool.
8. Add Save Build and Share Build functionality to the wheel configurator.
9. Regression QA across Home, Collection, Product, Fitment, Builder, Gallery, Dealer, and Cart.

Some tasks can be prepared in parallel, but implementation should respect dependencies.

---

# 4. Deliverable 1 — Product Inventory & Attribute Confirmation

## Objective

Establish the product-data foundation before expanding fitment, filtering, gallery, builder, and dealer functionality.

The implementation should not guess Calder's final product attributes.

The development system should first identify:

- Current Shopify products
- Current variants
- Existing product metafields
- Existing option structure
- Existing fitment attributes
- Missing product information
- Required attributes for filtering
- Required attributes for Build Your Wheel
- Required attributes for gallery builds
- Required attributes for dealer lookup

## Candidate Product Attributes

The client discussion identified the following likely attributes:

- Wheel design / model
- Diameter
- Width
- Bolt pattern
- Offset
- Finish
- Center finish
- Lip finish
- Bolt finish
- Construction
- Weight
- Lug configuration
- Vehicle fitment
- Front size
- Rear size
- Square / standard fitment
- Staggered fitment
- Part number / SKU
- Inventory status
- Lead time
- Price
- Product imagery
- Configurator component imagery

## Required Output

Before altering the product architecture, OpenCode should produce an inventory/data audit containing:

```text
ATTRIBUTE
CURRENT SOURCE
CURRENTLY POPULATED?
USED BY
MISSING DATA
RECOMMENDED STORAGE LOCATION
IMPLEMENTATION DEPENDENCY
```

No speculative bulk product creation should occur until Calder confirms the actual inventory/product list.

---

# 5. Deliverable 2 — Standalone Fitment Finder

## Objective

Create a dedicated Fitment Finder page that exposes the existing Calder fitment system as a first-class customer tool.

This page should reuse the existing working fitment functionality rather than creating a second fitment engine.

## Required Customer Journey

```text
Find Your Fit
      ↓
Year
      ↓
Make
      ↓
Model
      ↓
Trim
      ↓
Matching Wheels
```

## Required Capabilities

The standalone page should:

- Reuse the existing Calder fitment data flow.
- Preserve vehicle-selection persistence.
- Preserve localStorage behavior.
- Preserve existing API integration.
- Show the currently selected vehicle.
- Allow the vehicle to be reset or changed.
- Return compatible wheel results.
- Link results to the relevant product pages.
- Follow the approved Calder visual system.
- Work responsively.
- Provide a clear route into Build Your Wheel where appropriate.

## Critical Architecture Rule

Do **not** create a duplicate fitment engine.

The existing:

- `fitment-finder.js`
- `CALDER_FITMENT_API`
- `window.__fitmentData`
- localStorage fitment state
- vehicle-selection persistence

should remain the underlying source of truth unless a specific, explicitly authorized modification is required.

The standalone page should preferably act as a new presentation/container around the working system.

---

# 6. Deliverable 3 — Standalone Build Your Wheel

## Objective

Create a dedicated configurator page that allows customers to interact with Calder's customization system without first navigating to a particular product page.

The Build Your Wheel tool should become one of the signature experiences of the Calder website.

## Core Configuration

At minimum:

```text
Wheel Design
+
Size
+
Center Finish
+
Lip Finish
+
Bolt Finish
=
Configured Calder Wheel
```

## Expected Experience

The user should be able to:

1. Select a wheel.
2. Select available configuration attributes.
3. See the visual wheel update.
4. See configuration details.
5. Check or select vehicle fitment.
6. Save the build.
7. Share the build.
8. Continue toward a dealer or purchase flow.

## Standalone Tool Principle

Build Your Wheel should not be permanently married to one PDP.

The same core configurator should eventually be accessible from:

- Homepage
- Product page
- Gallery
- Collection
- Standalone builder
- Dealer experience

The implementation should therefore reuse the existing configuration system rather than create parallel configurator logic.

---

# 7. Deliverable 4 — Gallery

## Objective

Create a Calder-specific vehicle/wheel gallery inspired by high-end wheel manufacturer galleries while remaining visually and structurally unique to Calder.

The gallery is not merely an image gallery.

It should become:

> **Inspiration + Fitment Proof + Product Discovery + SEO Landing System**

## Gallery Index

The gallery index should support browsing real-world or approved vehicle builds.

Potential information displayed on cards:

- Vehicle
- Wheel model
- Wheel size
- Finish
- Featured image
- Build title

Potential filters can be introduced later as content grows.

## Gallery Detail Page

Each gallery build should have a dedicated page.

Suggested structure:

```text
Vehicle Hero
↓
Build Overview
↓
Image Gallery
↓
Vehicle Specifications
↓
Wheel Specifications
↓
Tire Specifications
↓
Fitment Information
↓
Shop This Fitment
↓
Customize This Wheel
↓
Related Builds
↓
Talk to a Wheel Specialist
```

## Key CTA

### Shop This Fitment

The visitor should be able to move from the gallery build to the exact or closest applicable product configuration.

### Customize This Wheel

The visitor should also be able to take the featured wheel into the configurator and change:

- center
- lip
- bolts
- other supported finishes

## SEO Architecture

Gallery detail pages should be structured so they can eventually target long-tail queries involving:

```text
Vehicle Year
+
Vehicle Make
+
Vehicle Model
+
Wheel Size
+
Wheel Model
+
Wheel Finish
```

The gallery architecture should support clean, descriptive Shopify URLs and metadata.

---

# 8. Deliverable 5 — Dealer Dashboard

## Objective

Create the first presentation-ready dealer portal/dashboard experience.

This sprint should focus on the dashboard foundation and user experience rather than prematurely implementing every future ERP/inventory capability.

## Expected Dealer Areas

Potential dashboard sections:

- Dashboard / overview
- Product catalog
- Fitment lookup
- Build Your Wheel
- Part-number lookup
- Saved configurations
- Orders
- Account
- Support / contact

## Part Number Lookup

The client specifically identified a future dealer workflow where a customer can arrive with a Calder part number and the dealer can retrieve the corresponding configuration.

Concept:

```text
Customer Build
      ↓
Generated Calder Part Number
      ↓
Customer contacts dealer
      ↓
Dealer enters Part Number
      ↓
Exact configuration displayed
```

For the 10/9 sprint, implement only what can safely be supported by the current data architecture.

Do not fabricate QuickBooks/inventory integration.

If live data dependencies are not ready, build the interface and clearly identify the integration boundary.

---

# 9. Deliverable 6 — Cart Page

## Objective

Bring the cart into the approved Calder visual language while preserving native Shopify/Lumia cart functionality.

## Required Information

The cart should clearly communicate:

- Product
- Wheel configuration where available
- Vehicle / fitment confirmation where available
- Quantity
- Price
- Line total
- Order subtotal
- Checkout action

## Critical Pricing Requirement

The client raised concern that customers may interpret a wheel price as the price for a set of four.

The interface must clearly communicate when pricing is:

> **Per Wheel / Each**

Quantity and total price must remain synchronized through Shopify's existing cart behavior.

## Functional Protection

Do not rewrite working Shopify cart behavior simply to achieve the visual design.

Preserve:

- line-item behavior
- quantity behavior
- removal behavior
- cart updates
- product data
- checkout route
- Shopify forms

---

# 10. Deliverable 7 — Vehicle Dataset Cleanup

## Objective

Remove irrelevant vehicles from the customer-facing fitment experience.

The current underlying source includes far more vehicles than Calder intends to support.

The production customer experience should expose only Calder-relevant makes/models/years/trims.

## Known / Discussed Makes

The meeting referenced:

- Cadillac
- GMC
- Chevrolet
- Mercedes-Benz
- Land Rover / Range Rover
- Lexus
- additional Calder-approved makes

This list is not final.

## Important Implementation Constraint

Do not casually rewrite the fitment API or fitment engine to accomplish this.

First determine where the supported vehicle dataset should be constrained:

1. data source
2. API response/filter
3. configuration layer
4. front-end presentation

Use the smallest safe implementation.

If modification of protected fitment functionality is unavoidable, OpenCode should stop and report the exact required change before implementation unless the current task explicitly authorizes that bounded change.

---

# 11. Deliverable 8 — Save Build

## Objective

Allow a visitor to preserve the exact custom wheel they created.

This is different from a conventional Shopify wishlist.

A normal wishlist usually stores:

```text
Product ID
```

Calder needs to store:

```text
Product
+
Wheel Design
+
Size
+
Center Finish
+
Lip Finish
+
Bolt Finish
+
Vehicle / Fitment
+
Part Number when available
+
Rendered Configuration
```

## Save Build Data Object

Recommended conceptual schema:

```json
{
  "build_id": "",
  "product_id": "",
  "variant_id": "",
  "wheel_model": "",
  "size": "",
  "center_finish": "",
  "lip_finish": "",
  "bolt_finish": "",
  "vehicle": {
    "year": "",
    "make": "",
    "model": "",
    "trim": ""
  },
  "part_number": "",
  "render_state": {},
  "created_at": ""
}
```

The exact persistence implementation should be determined from the existing Shopify architecture.

Do not introduce a new external backend merely for convenience unless explicitly approved.

---

# 12. Deliverable 9 — Share Build

## Objective

Allow a configured wheel to become a shareable sales object.

The client requested the ability to share the build through mechanisms such as:

- email
- copied share link
- social sharing where practical
- downloadable/printable Calder Build Sheet

## Shareable Build

A shared build should reproduce the intended configuration rather than merely linking to the unconfigured base product.

The architecture therefore needs a way to serialize or identify the configuration.

Potential mechanisms should be evaluated against the current Shopify implementation before one is selected.

Examples include:

- build ID
- encoded configuration parameters
- customer-account saved build
- Shopify-supported persistence
- another approved storage mechanism

Do not commit to a persistence architecture until the existing project architecture has been inspected.

---

# 13. Calder Build Sheet / PDF

The client strongly supported a professionally formatted Calder document rather than a simple screenshot.

The future Build Sheet should contain:

- Calder branding
- wheel rendering
- wheel model
- selected size
- center finish
- lip finish
- bolt finish
- vehicle information
- fitment information
- Calder part number
- product specifications
- CTA / dealer information
- URL or build identifier

This becomes a useful bridge between the website and physical Calder dealers.

Conceptually:

```text
ONLINE CONFIGURATION
       ↓
CALDER BUILD SHEET
       ↓
CUSTOMER
       ↓
DEALER
       ↓
EXACT CONFIGURATION
```

For the 10/9 deadline, the priority is establishing Save/Share architecture. PDF generation can be completed during the sprint if it can be implemented safely without destabilizing the primary deliverables.

---

# 14. Analytics Requirements

The configurator creates valuable first-party product-interest data.

Future analytics should be capable of measuring:

- builds started
- builds completed
- builds saved
- builds shared
- PDFs generated
- wheel designs selected
- center finishes selected
- lip finishes selected
- bolt finishes selected
- complete combinations
- vehicle combinations
- fitment searches
- dealer searches
- product conversions

This can eventually influence:

- inventory planning
- pre-built wheel combinations
- dealer stocking recommendations
- advertising
- social content
- photography
- video
- geographic dealer expansion

Analytics implementation should not block the 10/9 presentation sprint unless required for Save/Share functionality.

---

# 15. Dealer Strategy

Calder wants to support direct ecommerce while protecting its dealer network.

The site should eventually provide a decision path such as:

```text
READY TO BUY
    │
    ├── Find a Calder Dealer
    │
    └── Buy Direct from Calder
```

Dealer proximity can eventually be determined through ZIP code / geographic coverage.

The client discussed the concept of allowing direct purchase where no dealer exists within an appropriate radius.

That business rule is not yet finalized and should not be hard-coded during this sprint without explicit approval.

---

# 16. Manufacturer Logo Issue

Vehicle-manufacturer logos are visually desirable, but the client raised trademark/permission concerns.

Until this is resolved:

- do not make logo usage a structural dependency;
- keep the interface capable of falling back to manufacturer names or approved imagery;
- treat final logo usage as a legal/brand review item.

---

# 17. SEO Requirements

SEO is an explicit project requirement.

Architecture created during this sprint should avoid preventing later SEO optimization.

Particularly important areas:

- gallery URLs
- gallery titles
- vehicle/wheel combinations
- product URLs
- page titles
- heading structure
- metadata
- image alt text
- internal links
- structured content

The gallery should eventually allow Calder to target highly specific vehicle/wheel searches.

SEO optimization itself should not be allowed to derail the core 10/9 functional deliverables.

---

# 18. OpenCode Governing Guardrails

The file:

`CALDER_OPENCODE_MANDATORY_GUARDRAILS.md`

remains the governing constraint document.

Every OpenCode task must read and apply it before implementation.

## Core Rule

> Preserve functionality. Respect scope. Make bounded corrections. Fix global causes globally and page causes locally. Do not modify protected or locked areas without explicit authorization.

## Important Sprint Interpretation

The existing guardrails were written primarily around a presentation/visual-correction sprint.

The 10/9 deliverables now include **intentional functional development**:

- standalone fitment
- standalone builder
- gallery functionality
- dealer dashboard
- Save Build
- Share Build
- vehicle dataset refinement

Therefore, each OpenCode task must distinguish between:

### Existing protected functionality

Still protected.

Examples:

- existing fitment API behavior
- existing fitment state
- existing Build Your Wheel state
- Shopify product forms
- variants
- cart behavior
- navigation
- working routes

### Explicitly authorized new functionality

Only the feature named in the current task may receive functional implementation.

Example:

If the current task is:

> Implement Save Build.

OpenCode is authorized to add the minimum new persistence/serialization behavior required for Save Build.

It is **not** authorized to refactor the entire configurator.

---

# 19. Mandatory OpenCode Workflow

For each deliverable:

```text
REQUIREMENT
   ↓
INSPECT CURRENT IMPLEMENTATION
   ↓
IDENTIFY REUSABLE COMPONENTS
   ↓
CLASSIFY FILES
   ↓
IDENTIFY PROTECTED FUNCTIONALITY
   ↓
DEFINE BOUNDED IMPLEMENTATION
   ↓
IMPLEMENT
   ↓
SHOPIFY RENDER
   ↓
FUNCTIONAL QA
   ↓
VISUAL QA
   ↓
FIX P0/P1 ONLY
   ↓
ACCEPT
   ↓
LOCK
   ↓
NEXT DELIVERABLE
```

Do not attempt to implement the entire 10/9 roadmap in one uncontrolled code pass.

---

# 20. File Classification

Before editing, classify every relevant file as:

```text
AUTHORIZED_EDIT
AUTHORIZED_VISUAL_ONLY
READ_ONLY_REFERENCE
PROTECTED_FUNCTIONAL
PRESENTATION_LOCKED
USER_MANAGED
DEFERRED
```

Anything not explicitly authorized remains read-only.

---

# 21. Existing Protected Functionality

Unless explicitly authorized for a named bounded change, preserve:

- `fitment-finder.js`
- `CALDER_FITMENT_API`
- `window.__fitmentData`
- localStorage fitment state
- vehicle persistence
- fitment data flow
- Build Your Wheel state
- Shopify variant logic
- Shopify product data bindings
- product form submission
- cart behavior
- cart line items
- quantity behavior
- Lumia product form
- navigation
- working routes
- working Liquid bindings
- functional event listeners

---

# 22. Presentation-Locked Pages

Any page that has already reached presentation quality should remain locked unless:

1. the current deliverable explicitly requires a named modification; or
2. a regression is discovered.

New development must not casually reopen:

- Homepage
- Collection
- Product page sections already accepted
- other accepted shared components

If a shared/global change could affect a locked page, regression verification is mandatory.

---

# 23. Functional Development Rule

When new functionality is required:

1. Inspect the current architecture first.
2. Reuse existing systems.
3. Extend rather than replace.
4. Keep the change scoped.
5. Preserve existing contracts.
6. Avoid new dependencies unless necessary.
7. Do not rename existing storage keys, IDs, data attributes, globals, routes, or events without explicit authorization.
8. Report dependencies instead of guessing.

---

# 24. Definition of Done for Each Deliverable

A deliverable is complete only when:

### Functional

- intended feature works;
- existing related functionality still works;
- no critical JS errors;
- Shopify behavior remains intact.

### Visual

- follows Calder design language;
- desktop layout is presentation-ready;
- mobile/responsive behavior is usable;
- no major overflow, clipping, or broken grids.

### Architecture

- no unnecessary duplicate system was created;
- existing source-of-truth components are reused where possible;
- protected functionality was preserved.

### QA

- P0 issues: zero;
- material P1 issues: zero;
- P2/P3 issues may be deferred;
- affected presentation-locked pages have been regression checked.

---

# 25. 10/9 Execution Board

## Phase 0 — Audit & Data Confirmation

### CW-109-001 — Product Inventory Audit

**Priority:** P0

**Goal:** Determine the products and attributes required for the launch inventory.

**Output:** Product/attribute matrix and missing-data report.

**Do not:** fabricate final product data.

---

### CW-109-002 — Vehicle Dataset Audit

**Priority:** P0

**Goal:** Determine how the current fitment vehicle list is generated and identify the safest filtering layer.

**Output:** Supported vehicle strategy.

**Do not:** rewrite the fitment engine during the audit.

---

# Phase 1 — Standalone Fitment

### CW-109-010 — Fitment Page Architecture

**Priority:** P0

Create a standalone Fitment Finder using the existing working fitment system.

**Acceptance:**

- existing fitment still works;
- vehicle state persists;
- matching products appear;
- page matches Calder visual system;
- no duplicate fitment engine.

---

# Phase 2 — Standalone Builder

### CW-109-020 — Builder Page Architecture

**Priority:** P0

Create the standalone Build Your Wheel page around the existing configurator.

**Acceptance:**

- current wheel configuration still works;
- finish layers update correctly;
- existing configuration state is preserved;
- page can be reached independently of PDP.

---

# Phase 3 — Gallery

### CW-109-030 — Gallery Index

**Priority:** P0

Create the Calder vehicle gallery index - reference: https://vossenwheels.com/vehicle-galleries/
Create the Calder wheel gallery index - reference: https://vossenwheels.com/wheel-galleries/

---

### CW-109-031 — Gallery Detail

**Priority:** P0

Create a dedicated vehicle build page.

**Acceptance:**

- vehicle information;
- wheel information;
- imagery;
- specifications;
- Shop This Fitment;
- Customize This Wheel.

---

# Phase 4 — Dealer Dashboard

### CW-109-040 — Dealer Dashboard Shell

**Priority:** P0/P1

Create the dealer account/dashboard foundation.

Do not fabricate backend capabilities that do not exist.

---

# Phase 5 — Cart

### CW-109-050 — Calder Cart Presentation

**Priority:** P0

Bring cart presentation into the Calder design system while preserving Shopify cart functionality.

Explicitly communicate **per-wheel pricing**.

---

# Phase 6 — Fitment Dataset Cleanup

### CW-109-060 — Supported Vehicle Filtering

**Priority:** P0

Apply the approved vehicle list using the safest identified layer.

Regression-test fitment after implementation.

---

# Phase 7 — Save & Share

### CW-109-070 — Save Build

**Priority:** P0

Persist the complete wheel configuration.

---

### CW-109-071 — Share Build

**Priority:** P0/P1

Create a reproducible shareable representation of the build.

---

### CW-109-072 — Build Sheet

**Priority:** P1

Generate a Calder-branded build summary if feasible within the sprint after Save/Share architecture is stable.

---

# Phase 8 — Final QA

### CW-109-090 — Cross-Page Regression

Check:

- Home
- Collection
- Product
- Fitment
- Builder
- Gallery
- Dealer
- Cart

Validate:

- navigation
- fitment
- builder
- product variants
- quantity
- add-to-cart
- cart
- responsive layout
- shared styling
- routes
- saved configuration where implemented

---

# 26. Recommended Daily Sequence Through 10/9

## Day 1

- inventory/product attribute audit
- vehicle dataset audit
- confirm page/file architecture
- establish exact authorized files for Fitment page

## Day 2

- standalone Fitment Finder
- QA
- lock after acceptance

## Day 3

- standalone Build Your Wheel
- QA
- lock after acceptance

## Day 4

- Gallery index
- Gallery detail template
- connect gallery → product/configurator

## Day 5

- Dealer Dashboard foundation
- dealer catalog/part-number interface shell where supported

## Day 6

- Cart page
- per-wheel pricing clarity
- supported vehicle filtering

## Day 7

- Save Build
- Share Build
- Build Sheet if time permits
- full regression pass
- presentation cleanup
- lock accepted pages

The exact day allocation can shift based on implementation complexity, but the **dependency order should remain stable**.

---

# 27. OpenCode Follow-Up Prompt

Copy the prompt below into OpenCode with the mandatory guardrails file attached/referenced.

---

## OPENCODE PROMPT — CALDER 10/9 DELIVERY SPRINT: PHASE 0 + CONTROLLED IMPLEMENTATION PLAN

You are beginning the next Calder Wheels implementation sprint.

### GOVERNING FILE

Before doing anything, read and apply:

`CALDER_OPENCODE_MANDATORY_GUARDRAILS.md`

This remains the governing project constraint document.

If this prompt conflicts with the guardrails, STOP and identify the conflict.

However, note the following important clarification:

The new 10/9 sprint includes intentional **new functional development**.

The guardrails continue to protect all existing working functionality, but this prompt explicitly authorizes analysis and planning for the following new features:

1. Standalone Fitment Finder page
2. Standalone Build Your Wheel page
3. Gallery index
4. Gallery detail page
5. Dealer Dashboard foundation
6. Cart page visual implementation while preserving Shopify cart behavior
7. Supported vehicle dataset refinement
8. Save Build functionality
9. Share Build functionality

This authorization DOES NOT permit broad refactoring of the existing fitment engine, configurator, Shopify product forms, cart architecture, navigation, or global theme.

---

### DEADLINE

Target delivery:

**October 9, 2026**

---

### REQUIRED IMPLEMENTATION ORDER

Follow this order:

1. Confirm products to be added to inventory and required product attributes.
2. Create standalone Fitment Finder.
3. Create standalone Build Your Wheel.
4. Create Gallery.
5. Create Dealer Dashboard.
6. Complete Cart page.
7. Remove unsupported/extraneous vehicles from the customer-facing fitment experience.
8. Add Save Build.
9. Add Share Build.
10. Perform cross-page regression QA.

Do NOT implement all items in one uncontrolled pass.

---

### CURRENT TASK — PHASE 0 AUDIT ONLY

For this first pass, **DO NOT begin broad implementation yet.**

Inspect the current theme/repository and produce a bounded implementation plan.

#### A. PRODUCT INVENTORY AUDIT

Identify:

- existing products
- variants
- options
- product metafields
- fitment-related data
- wheel specification fields
- configurator-related fields/assets
- current SKU/part-number handling
- inventory availability sources

Determine what is currently available for:

- wheel model/design
- diameter
- width
- bolt pattern
- offset
- finish
- center finish
- lip finish
- bolt finish
- construction
- weight
- lug configuration
- staggered fitment
- vehicle fitment
- part number/SKU
- inventory status

Do not fabricate missing data.

Produce a matrix:

ATTRIBUTE | CURRENT SOURCE | POPULATED? | USED BY | MISSING DATA | RECOMMENDED STORAGE | DEPENDENCY

---

#### B. FITMENT ARCHITECTURE AUDIT

Inspect the current fitment implementation.

Treat the following as `PROTECTED_FUNCTIONAL` during this audit:

- `fitment-finder.js`
- `CALDER_FITMENT_API`
- `window.__fitmentData`
- localStorage vehicle/fitment state
- vehicle-selection persistence
- existing fitment event flow

Identify:

- where vehicle data originates;
- how Year / Make / Model / Trim options are populated;
- where vehicle filtering can be safely applied;
- how product results are mapped to fitment;
- how the current component can be reused on a standalone page;
- which files would need modification for the standalone page;
- whether any protected functional file actually needs a bounded change.

DO NOT modify protected fitment functionality during this audit.

---

#### C. BUILD YOUR WHEEL ARCHITECTURE AUDIT

Treat existing Build Your Wheel functional JavaScript/state as `PROTECTED_FUNCTIONAL`.

Identify:

- existing configurator Liquid;
- existing configurator CSS;
- existing JavaScript/state;
- component-layer image system;
- center/lip/bolt selection logic;
- product dependencies;
- local state/storage;
- how the current configurator can be reused on a standalone page;
- how a complete build can be serialized for Save/Share without replacing existing behavior.

Do NOT rewrite the configurator.

---

#### D. GALLERY ARCHITECTURE

Determine the safest Shopify architecture for:

1. Gallery Index
2. Gallery Detail

The detail page needs to support:

- vehicle
- featured imagery
- image gallery
- wheel model
- wheel size
- wheel finish
- tire information when available
- fitment
- Shop This Fitment
- Customize This Wheel
- related builds
- specialist CTA

Recommend whether this should use:

- metaobjects,
- metafields,
- pages,
- products,
- blog/articles,
- or another existing Shopify-native structure.

Prefer the architecture that is maintainable and SEO-friendly without creating unnecessary custom backend infrastructure.

Do not implement until the architecture recommendation is reported.

---

#### E. DEALER DASHBOARD AUDIT

Inspect the existing dealer portal/dashboard work.

Identify:

- existing dealer files;
- existing login/auth assumptions;
- existing dashboard components;
- catalog components;
- potential part-number lookup location;
- what is functional today;
- what is presentation-only;
- what requires future backend/inventory integration.

Do not fabricate QuickBooks, inventory, dealer authentication, or API behavior that does not exist.

---

#### F. CART AUDIT

Inspect current Shopify/Lumia cart implementation.

Treat native cart functionality as `PROTECTED_FUNCTIONAL`.

Identify:

- cart template/section;
- line-item rendering;
- quantity controls;
- removal behavior;
- cart update JS;
- checkout route;
- product option/property rendering;
- where Calder visual styling can safely be applied;
- how configured-wheel data could eventually appear as line-item properties.

Do not rewrite cart behavior.

---

#### G. SAVE BUILD / SHARE BUILD ARCHITECTURE

Inspect the existing configurator and determine the smallest safe architecture for saving a complete build.

A saved build may eventually contain:

```text
product_id
variant_id
wheel_model
size
center_finish
lip_finish
bolt_finish
year
make
model
trim
part_number
render/configuration state
created_at
```

Determine:

1. what information already exists;
2. what can be serialized;
3. what persistence mechanisms are available;
4. whether customer login is required;
5. how anonymous builds could work;
6. how a share link could reproduce the build;
7. whether Shopify line-item properties can carry the configuration into cart;
8. what is required for a future branded PDF Build Sheet.

DO NOT introduce a new external backend during this audit.

---

### FILE CLASSIFICATION

Before recommending modifications, classify every relevant file as:

- `AUTHORIZED_EDIT`
- `AUTHORIZED_VISUAL_ONLY`
- `READ_ONLY_REFERENCE`
- `PROTECTED_FUNCTIONAL`
- `PRESENTATION_LOCKED`
- `USER_MANAGED`
- `DEFERRED`

Anything not explicitly authorized remains read-only.

---

### PRESENTATION LOCKS

Assume currently accepted Home, Collection, and working Product sections are regression-sensitive.

Do not modify them during this audit.

If a future shared/global change could affect them, flag the regression risk.

---

### REQUIRED OUTPUT

Do not simply give me general recommendations.

Return a concrete implementation report containing:

#### 1. REPOSITORY FINDINGS

Exact files/components discovered.

#### 2. CURRENT ARCHITECTURE MAP

Show how:

```text
FITMENT
BUILDER
PRODUCT
CART
GALLERY
DEALER
```

currently relate.

#### 3. PRODUCT DATA MATRIX

Use the requested attribute matrix.

#### 4. FILE CLASSIFICATION TABLE

Exact file path + classification + reason.

#### 5. 10/9 IMPLEMENTATION PLAN

Break work into these IDs:

```text
CW-109-001 Product Inventory Audit
CW-109-002 Vehicle Dataset Audit
CW-109-010 Standalone Fitment
CW-109-020 Standalone Builder
CW-109-030 Gallery Index
CW-109-031 Gallery Detail
CW-109-040 Dealer Dashboard
CW-109-050 Cart
CW-109-060 Vehicle Filtering
CW-109-070 Save Build
CW-109-071 Share Build
CW-109-072 Build Sheet
CW-109-090 Cross-Page Regression
```

For every item provide:

```text
ID:
CLASSIFICATION:
SEVERITY:
FILES:
CURRENT STATE:
EXPECTED RESULT:
IMPLEMENTATION APPROACH:
PROTECTED DEPENDENCIES:
DO NOT MODIFY:
ACCEPTANCE TEST:
DEPENDENCIES:
ESTIMATED COMPLEXITY:
```

#### 6. DEPENDENCY GRAPH

Show which tasks block other tasks.

#### 7. RISKS / BLOCKERS

Report only real architectural or data dependencies.

Do not invent blockers.

#### 8. RECOMMENDED FIRST IMPLEMENTATION PROMPT

After completing the audit, generate the exact bounded OpenCode prompt that should be used for:

`CW-109-010 — Standalone Fitment`

Do not implement CW-109-010 during this first audit unless I explicitly authorize the next step.

---

### NON-NEGOTIABLE RULES

- Preserve existing working functionality.
- Do not rewrite the fitment engine.
- Do not rewrite Build Your Wheel.
- Do not rewrite Shopify/Lumia product-form behavior.
- Do not rewrite Shopify cart behavior.
- Do not perform unrelated refactors.
- Do not change existing storage keys without explicit authorization.
- Do not rename working IDs/data attributes/globals/events.
- Do not create duplicate fitment or configurator engines.
- Reuse existing Calder components.
- Reuse Calder design tokens.
- Respect presentation-locked pages.
- Prefer Shopify-native architecture.
- Report dependencies instead of guessing.
- Keep changes bounded and individually testable.

### SUCCESS CONDITION FOR THIS PASS

This pass is successful when we have a verified repository-level implementation map and can begin `CW-109-010` without guessing, duplicating systems, or risking regression.

Do not claim implementation completion during this audit.

---

# 28. Final Sprint Principle

The next week should not be treated as:

> "Build all remaining Calder features."

It should be treated as:

> **Complete one bounded customer journey at a time, verify it, lock it, and move to the next dependency.**

The target is a cohesive Calder ecosystem by 10/9 without sacrificing the stability already achieved on the existing presentation pages.

The priority order is:

> **Data → Fitment → Builder → Gallery → Dealer → Cart → Vehicle Cleanup → Save/Share → Regression QA**

This sequence provides the clearest path toward meeting the deadline while respecting the Calder OpenCode guardrails.
