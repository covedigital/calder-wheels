# Launch QA and Cove Digital Deliverables Checklist

## Required Cove Digital deliverables

- [ ] Six-design registry with verified underlying Shopify product and variant mapping.
- [ ] PDP-only universal configurator, with old standalone builder retired safely.
- [ ] Collection cards and wheel gallery links preload the exact clicked configuration.
- [ ] Full-tuple resolver synchronizes imagery, specifications, price, inventory and cart.
- [ ] Available, sold-out, not-in-catalog and invalid states have distinct appropriate CTAs.
- [ ] Inventory messaging uses approved threshold and documented QuickBooks/Shopify authority.
- [ ] Shop by Wheel and Shop by Vehicle flows with verified filters and compatible results.
- [ ] Sergio-validated fitment data and selected-configuration specifications including center bore where known.
- [ ] Fitment guide positioned in vehicle browsing without falsely asserting verification.
- [ ] Homepage hero/feature updates using approved accurate assets.
- [ ] Wheel gallery filtering and links; vehicle gallery with real images and validated Shop This Fitment.
- [ ] Card overlay/imagery polish, scoped responsive/accessibility fixes.
- [ ] Analytics foundation with consent and event deduplication.
- [ ] URL migration/SEO compatibility plan and truthful offer markup.
- [ ] Full QA, rollback plan and documented launch blockers.

## Critical end-to-end test matrix

| Test | Expected result |
| --- | --- |
| Every design direct URL | Correct fixed design, verified default selection |
| Every card preset | Exact four options loaded |
| Wheel gallery image | Matching design and photographed preset |
| Vehicle gallery CTA | Exact mapped configuration and compatible vehicle |
| Change each of four controls | Design fixed, state/URL/price/preview/specs synchronized |
| Valid in-stock tuple | Correct Shopify variant added to cart |
| Valid sold-out tuple | Purchase blocked; contact CTA |
| No matching tuple | Custom configuration CTA, not sold-out label |
| Ambiguous/missing mapping | Safe disabled cart and diagnostic |
| Browser back/forward | Restored selection and purchase state |
| Fresh-tab deep link | No default flash with active wrong cart variant |
| Legacy preset URL | Original selection retained or migrated safely |
| Low-stock state | Approved threshold, no unapproved public quantity |
| Fitment unknown | Not labeled verified |
| Vehicle incompatible | Independent fitment warning |
| Missing preview asset | Safe fallback, no wrong finish image |
| Rapid selection changes | No stale response or incorrect cart |
| Mobile/keyboard/screen reader | Functional controls, labels and feedback |
| Cart errors / sold-through | Shopify error surfaced, no false success |
| Existing unrelated site features | No regressions |

## Go/no-go rules

**No-go** if an incorrect variant can enter the cart, a known incompatible fitment is presented as verified, an unknown inventory mapping is purchasable, or core checkout fails. Optional galleries, advanced media and postlaunch enhancements may be staged if incomplete. Do not deploy without explicit approval.

## Client / owner handoffs

- **Calder:** product mapping, inventory policy, verified imagery, approvals.
- **Sergio:** fitment spreadsheet validation; follow-up session targeted November 9–13 (date TBD).
- **Dante + Cove Digital:** gallery UX review after 5 PM on mutually agreed date.
- **Cove Digital:** implementation, testing, reporting, deployment recommendation.

