# 2C. Listing-to-Product Filter State Persistence

## Requirement
When a shopper opens a product from filtered listings, the destination builder must receive and apply **valid, relevant** selection context.

## Entry paths
- Vehicle-based: retain the chosen vehicle and its verified fitment constraints.
- Design/style-based: retain explicitly selected diameter, bolt pattern and compatible component filters, but **never** carry a stale vehicle from an earlier mode.

## Technical safeguards
- Inspect existing query parameters, URL handling, session state, router, product/variant selection and theme events before choosing a transfer mechanism.
- Prefer explicit, namespaced URL/query state over fragile global or stale browser storage, if compatible with architecture.
- Validate all transferred values against the destination design; ignore invalid values safely.
- Support direct links, back/forward navigation, refresh, reset, and mobile.
- Do not let stale values override deliberate user selections.

## Acceptance
A 22-inch / 6×139 selection remains applied where supported; a vehicle-selected entry remains vehicle-specific; a style entry never inherits an unrelated Range Rover or Lexus selection.
