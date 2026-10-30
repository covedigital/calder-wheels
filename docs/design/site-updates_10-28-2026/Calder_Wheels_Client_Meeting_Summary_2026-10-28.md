# Calder Wheels — Client Meeting Summary & Implementation Action Plan

**Meeting date:** October 28, 2026  
**Project:** Calder Wheels Shopify Website  
**Service provider:** Cove Digital  
**Target milestone:** November 3, 2026, 12:00 PM Eastern / 9:00 AM Pacific (SEMA)  
**Status:** Client-requested target, subject to completion and validation of launch-critical requirements.

> **Document purpose:** Consolidate the meeting discussion into decisions, required website updates, deliverables, dependencies, launch priorities, and a practical execution plan. Recommendations and open questions are identified separately from confirmed client direction.

## 1. Executive Summary

The central direction from the meeting is to simplify the shopping experience by combining the product detail page (PDP) and the standalone wheel configurator into **one unified, design-specific PDP/configurator**. Shoppers should be able to select a wheel design, customize available components, see accurate previews and specifications, verify fitment, and add the **actual available Shopify product/variant** to the cart without navigating between separate purchase and builder interfaces.

The project also requires improved inventory awareness, vehicle-based fitment filtering, more accurate wheel specifications, a streamlined homepage, and two visual galleries: one for wheel combinations and another for vehicles fitted with Calder wheels.

The November 3 SEMA milestone should prioritize reliable fitment, inventory/product resolution, pricing, and checkout over optional visual enhancements.

## 2. Core Decisions and Website Changes

### 2.1 Unified Product Detail Page and Wheel Configurator

**Client direction**

- Consolidate the existing PDP and separate wheel builder into a single experience.
- Retain **Add to Cart** as the primary purchase action when the selected combination is sellable.
- Open the PDP with the selected wheel design and its existing preset combination loaded.
- Support selection of **diameter**, **center finish**, **barrel & lip finish**, and **hardware & rivet finish**.
- Resolve the selected configuration against actual Shopify inventory/product records rather than assuming every theoretical combination is sellable.
- Update the product image/preview, price, availability, and specifications based on the selected configuration.
- Keep navigation between different wheel designs separate from customization of the current design.
- Preserve useful existing PDP features and saved-build behavior where feasible.

**Implementation requirements**

1. Build a reliable mapping between design codes, component options, Shopify products/variants, and inventory status.
2. Use exact sellable product/variant identifiers for cart submissions; never add a mismatched preset product merely because its page is open.
3. Ensure component thumbnails and layered previews match the selected design code and finish.
4. Handle unavailable combinations with a clear contact/sales CTA rather than an invalid cart action.
5. Restore Add to Cart automatically when the shopper switches back to an available combination.
6. Keep the displayed product title, specifications, pricing, and stock state synchronized with the active selection.
7. Maintain accessibility, mobile usability, and a predictable default configuration.

**Important architectural clarification:** Consolidating the *interface* does not mean deleting or merging distinct inventory-bearing Shopify products or SKUs. Preserve the actual sellable catalog records.

### 2.2 Inventory and Availability

**Client direction**

- Inventory is managed through **QuickBooks**.
- Show a low-stock notice near the purchase CTA rather than publicly displaying exact remaining quantities.
- Use a helpful contact action for unavailable combinations.
- Keep inventory status separate from vehicle compatibility.

**Open decisions**

- Confirm the low-stock threshold; fewer than **10** or **12** units were discussed as potential thresholds, **not approved values**.
- Confirm QuickBooks-to-Shopify synchronization method and update frequency.
- Confirm whether low-stock items remain directly purchasable.
- Confirm how inventory is reserved and how synchronization lag is handled.

**Suggested customer-facing states**

| State | Suggested presentation | Primary action |
| --- | --- | --- |
| Available | Price and purchase controls | Add to Cart |
| Low inventory | “Inventory low — please call to verify availability” | Add to Cart or contact, pending client policy |
| Unavailable combination | Explain that the selected combination is unavailable | Speak With a Representative / Request Availability |
| Vehicle incompatible | Explicit fitment warning, independent of stock | Select a Compatible Configuration |

### 2.3 Collection Browsing and Fitment Filters

**Client direction**

- **Shop by Wheel** should be the default browsing mode.
- **Shop by Vehicle** should show only compatible wheel options based on the selected vehicle.
- Bring filters closer to results and simplify the overall filter UI.
- Improve the visual distinction between active tabs.
- Place **Reset** near **Find Wheels**; remove the redundant **Change Vehicle** control where applicable.
- Remove unnecessary price/date sorting and prioritize in-stock results.
- Remove redundant “All Wheels” messaging when vehicle mode is active.
- Use the WELD Wheels experience as a UX reference, while retaining Calder's preferred filter-first approach.

**Wheel-mode filters under consideration**

- Diameter
- Bolt pattern
- Offset
- Center finish
- Barrel & lip finish
- Hardware finish

**Vehicle-mode behavior**

- Determine bolt pattern from the selected vehicle and lock/hide it as appropriate.
- Restrict selectable diameters, offsets, and other values to verified compatible options.
- Avoid showing impossible combinations.
- Show relevant fitment guidance close to the selected vehicle and filtered results.

### 2.4 Fitment Data Accuracy and Product Specifications

**Issues identified**

- Demonstration fitment data included incorrect or mismatched bolt patterns, offsets, vehicle images, and wheel sizes.
- Examples raised included a Nissan Armada / Range Rover imagery mismatch.
- Specifications must change with the active configuration rather than remain fixed to the original preset.

**Required updates**

- Validate year, make, model, and trim against the authoritative client-provided data.
- Verify bolt pattern, offset, diameter, width, and center bore.
- Add **Center Bore** between **Bolt Pattern** and **Offset** in the specifications display.
- Make the specs selection-aware throughout the PDP/configurator.
- Work with **Sergio** to validate the fitment spreadsheet and mapping.
- Do not invent or infer fitment values from generic vehicle data or AI-generated content.

**Future consideration:** Keep the data model extensible for staggered front/rear wheel sizing, but do not treat a full staggered-fitment workflow as a launch requirement without approval.

### 2.5 Homepage

**Client direction**

- Use a short hero video, approximately **8–15 seconds**, showing a vehicle in motion and changing wheel designs.
- Include clear **Explore Wheels** and/or **Build Your Wheel** CTAs.
- Follow the hero with a **Why We're Different** section emphasizing two-piece spun-forged construction, customization, and 24-hour assembly.
- Avoid quick-view/wishlist UI covering important wheel imagery on product cards.
- Correct exploded-wheel visual assets so they faithfully represent Calder's actual construction.

**Implementation notes**

- Optimize hero media for load performance and mobile display.
- Preserve wheel-design fidelity in all generated or composited media.
- Provide a static fallback image and respect reduced-motion preferences where feasible.

### 2.6 Wheel Gallery

**Client direction**

- Treat this as a visual discovery experience rather than a second fitment finder.
- Filter by **Wheel Design**, **Center Finish**, and **Barrel & Lip Finish**.
- Hide the **Series** filter for possible future use.
- Remove diameter, bolt pattern, construction, and excessive sorting controls.
- Show all available imagery when no filters are selected.
- Include the six initial wheel designs and visually distinct combinations.
- Avoid duplicating essentially identical imagery solely for bolt-pattern differences.

**Expected outcome:** Customers can explore finishes and designs visually and continue into the relevant product/configurator experience.

### 2.7 Vehicle Gallery

**Client direction**

- Launch with approximately **12 real vehicle images**, subject to supplied assets.
- Provide filters for **Make**, **Model**, **Wheel Design**, **Center Finish**, and **Barrel & Lip Finish**.
- Present a vehicle detail view with multiple photos and relevant specifications.
- Include **Shop This Fitment**, linking to the appropriate wheel PDP/configurator with the photographed combination selected.
- Do not frame this gallery as a live vehicle visualizer.

**Administrative requirements**

- Associate each uploaded vehicle image with the correct vehicle metadata.
- Associate the displayed wheel with exact design and finish selections, ideally the underlying sellable product/SKU.
- Validate links and preselected configurations before publishing.

**Post-launch candidates:** More sophisticated related galleries and cross-linking features.

### 2.8 Fitment Guide Placement

**Client direction**

- Retain the useful information and visual style of the existing fitment guide.
- Move or integrate it into the **Shop by Vehicle** experience, near the selected vehicle and above relevant results.
- Show relevant specifications and, eventually, a vehicle image with the wheel configuration.

**Open question:** Whether to retain a separate standalone fitment guide after the integrated experience is live.

## 3. Prioritized Deliverables

| Priority | Deliverable | Acceptance criteria |
| --- | --- | --- |
| P0 — Launch critical | Unified PDP/configurator | All supported selections update the correct configuration and maintain a coherent purchase flow |
| P0 — Launch critical | Product/SKU/variant resolution | Every Add to Cart action references the exact sellable item selected |
| P0 — Launch critical | Inventory-aware CTAs | In-stock, low-stock, and unavailable combinations display appropriate actions |
| P0 — Launch critical | Vehicle fitment validation | Compatibility is based on verified client data; invalid combinations are excluded or clearly warned |
| P0 — Launch critical | Selection-aware specifications | Diameter, bolt pattern, center bore, offset, and other specs reflect active selection |
| P0 — Launch critical | Checkout and responsive QA | Mobile/desktop selection, cart, and checkout scenarios work end to end |
| P1 — Target for SEMA | Collection/filter UX | Shop by Wheel and Shop by Vehicle function as agreed with simplified controls |
| P1 — Target for SEMA | Homepage presentation | Accurate hero and differentiation section, without significant performance regression |
| P1 — Target if feasible | Wheel gallery | Six designs, relevant finish filters, and working navigation |
| P1 — Target if feasible | Vehicle gallery | Approximately 12 verified images and working Shop This Fitment links |
| P2 — After launch | Advanced related galleries | Richer vehicle/wheel cross-linking and discovery |
| P2 — After launch | Exploded-wheel animation | Refined, technically accurate animation |
| P2 — After launch | Extended media and fitment | Additional photography, expanded scenarios, and staggered-sizing workflow if approved |

## 4. Action Items by Owner

### Cove Digital — Website Development

- [ ] Audit current PDP, builder, collection finder, gallery, product-card, and fitment-guide implementations.
- [ ] Create a unified PDP/configurator plan that reuses working functionality and avoids unrelated theme changes.
- [ ] Implement exact product/variant matching and cart validation.
- [ ] Repair design-code-specific component thumbnails and previews.
- [ ] Implement inventory-dependent purchase states and low-stock notice placement.
- [ ] Update specifications when selected components or dimensions change.
- [ ] Add Center Bore to the specification hierarchy.
- [ ] Simplify collection filters and vehicle-based compatibility filtering.
- [ ] Move/integrate fitment guide into Shop by Vehicle.
- [ ] Implement homepage hero and differentiation section.
- [ ] Complete wheel and vehicle gallery changes as time and assets permit.
- [ ] Verify analytics/conversion tracking foundation.
- [ ] Run cross-device regression tests and checkout QA.
- [ ] Prepare a launch/no-launch decision against P0 acceptance criteria.

### Calder Wheels — Client / Operations

- [ ] Supply authoritative, current fitment spreadsheets.
- [ ] Confirm inventory source, synchronization workflow, and low-stock threshold.
- [ ] Confirm low-stock checkout policy and unavailable-combination contact CTA.
- [ ] Supply approved wheel construction references and accurate media.
- [ ] Supply and approve approximately 12 vehicle-gallery images and metadata.
- [ ] Confirm which wheel/finish combinations should be showcased at launch.
- [ ] Review and approve key customer-facing wording and final visual presentation.

### Sergio — Fitment Review

- [ ] Review the authoritative fitment spreadsheet and sample vehicle combinations.
- [ ] Validate year/make/model/trim, bolt pattern, offset, diameter, width, and center bore mappings.
- [ ] Resolve discrepancies found in demonstration data.
- [ ] Participate in a detailed fitment working session during **November 9–13**, exact date to be confirmed.

### Dante / Cove Digital — Gallery UX

- [ ] Coordinate a gallery-specific discussion **after 5 PM** on a mutually convenient day.
- [ ] Confirm gallery filter behavior, visual hierarchy, detail-page presentation, and links to preconfigured wheel selections.

## 5. Proposed Timeline

| Window | Focus | Exit criteria |
| --- | --- | --- |
| **Oct 28–30** | Core configurator integration, product matching, inventory behavior, and fitment data corrections | Core purchase paths function with verified test products |
| **Oct 31–Nov 2** | Collection UX, launch media, gallery essentials, mobile QA, checkout and regression testing | Critical issues resolved; launch checklist reviewed |
| **Nov 3, 12 PM ET / 9 AM PT** | SEMA target milestone | Launch only if P0 purchase, inventory, and fitment criteria pass |
| **Nov 9–13** | Sergio fitment working session | Data discrepancies reconciled; next fitment improvements scoped |
| **Post-launch** | Gallery enhancements, richer media, advanced fitment | Prioritized separately based on impact and available assets |

**Schedule note:** This is a proposed execution sequence aligned with the client-requested deadline, not a promise that every feature will be complete by November 3.

## 6. Risks, Dependencies, and Mitigations

| Risk / dependency | Why it matters | Mitigation |
| --- | --- | --- |
| Unverified product-to-component mapping | Could add the wrong wheel to cart | Build explicit matching logic and test each supported combination |
| QuickBooks inventory uncertainty | Could show stale stock or allow overselling | Confirm sync source/timing and define safe fallback states |
| Incorrect fitment records | Could recommend incompatible wheels | Use authoritative data and Sergio's validation; block unsupported assumptions |
| Insufficient gallery assets | Prevents accurate gallery-to-product links | Publish only approved, fully mapped photos; defer missing items |
| Aggressive SEMA deadline | Raises regression risk | Gate launch on P0 acceptance criteria and defer P2 items |
| Image/preview mismatch | Undermines customer trust | Validate asset naming and design-code relationships |
| Hero media weight | Could slow homepage and mobile experience | Optimize video, use fallback imagery, and test performance |

## 7. Launch Acceptance Checklist

- [ ] Each of the six launch wheel designs opens the intended PDP/configurator.
- [ ] Preset selections match the actual starting product.
- [ ] Diameter and finish changes update the correct previews and specifications.
- [ ] A valid alternative combination resolves to its real Shopify product/variant and price.
- [ ] Add to Cart adds the exact selected configuration, not the page's original preset.
- [ ] An unavailable combination cannot be incorrectly purchased.
- [ ] Switching from unavailable back to available restores the correct purchase action.
- [ ] Low-stock copy appears only under the agreed threshold and policy.
- [ ] Shop by Vehicle returns only verified compatible combinations.
- [ ] Vehicle fitment state and inventory state are clearly distinct.
- [ ] Center Bore appears in the requested specifications position.
- [ ] Collection reset/filter interactions work on mobile and desktop.
- [ ] Gallery links, if launched, open the correct preselected configurations.
- [ ] Hero and product media accurately represent Calder wheels.
- [ ] Cart, checkout, and tracking work end to end.
- [ ] Existing unrelated theme sections and features show no regressions.

## 8. Outstanding Decisions to Confirm

1. **Inventory:** What exact low-stock threshold and purchasing policy should apply?
2. **Sync:** What is the approved QuickBooks → Shopify inventory integration and refresh cadence?
3. **Configuration:** Which combinations are actually stocked/sellable, and what identifier is the source of truth?
4. **Unavailable selections:** Should the CTA be “Speak With a Representative,” “Request Availability,” or another approved action?
5. **Fitment guide:** Should the standalone guide remain after the Shop by Vehicle integration?
6. **Media:** Which hero footage, wheel imagery, and vehicle-gallery photos are approved for SEMA?
7. **Launch scope:** Which P1 gallery features are mandatory for November 3 versus acceptable as staged releases?
8. **Meetings:** Confirm the gallery review with Dante and fitment working session with Sergio.

## 9. Recommended Immediate Next Step

Convert these requirements into a **file-by-file OpenCode implementation plan** covering the existing Shopify Liquid sections/snippets, JavaScript assets, CSS, product metafields, and inventory/fitment data mappings. The plan should identify which code can be reused, specify minimal targeted edits, preserve unrelated theme behavior, and separate launch-critical work from post-launch enhancements.

---

*Prepared from the October 28, 2026 Calder Wheels client-meeting summary. Items explicitly labeled “suggested,” “proposed,” “under consideration,” or “open” require confirmation before being treated as final requirements.*
