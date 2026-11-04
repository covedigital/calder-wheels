# 2B. Vehicle Fitment and Filtering

## Existing behavior to preserve
Two browse modes: **Shop by Vehicle** and **Shop by Wheel Design/Style**. Existing fitment and bolt-pattern compatibility data from the supplied data sheet is approved and must not be rewritten.

## Requested changes
- Make active tab unmistakable via contrast, emphasis, labels and accessible selected state.
- Vehicle mode: a selected vehicle remains locked until the dedicated Reset action; do not allow an individual vehicle chip X to remove it.
- Design/style mode: switching into this mode clears any stale vehicle selection and vehicle-only constraints.
- Add **barrel finish** and **bolt finish** filters to both browsing modes, using real available option data.
- Preserve current diameter, design, finish, and bolt-pattern filters where applicable.
- Remove or replace unrelated BMW placeholder imagery only if it is clearly the identified placeholder; do not modify legitimate vehicle data.

## Acceptance
Changing modes does not leak stale vehicle state; Reset clears the intended state; filter intersections return accurate combinations; disabled/unavailable combinations are not presented as purchasable; keyboard and mobile operation work.
