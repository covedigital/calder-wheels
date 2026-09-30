# Calder Wheels — Flagship Homepage Enhancement Reference

**Artifact:** Enhanced homepage concept  
**Project:** Calder Wheels  
**Purpose:** Design-to-code reference for elevating the approved homepage into a flagship interactive automotive ecommerce experience.

## 1. Design Direction

Preserve the approved Calder visual system: midnight navy, white, warm metallic/copper accents, premium automotive photography, bold condensed typography, precise grid alignment, thin technical dividers, and restrained UI ornamentation.

The goal is not to add decorative animation for its own sake. Every premium interaction should reinforce one or more of Calder's core product ideas:

- **Fitment**
- **Customization**
- **Engineering**
- **Craftsmanship**

At rest, the implemented page should remain close to the approved visual design. The additional sophistication should reveal itself through interaction, motion, state, and product visualization.

## 2. Header / Persistent Vehicle State

Retain the primary navigation and premium dark header.

After a visitor selects a vehicle, convert the primary fitment CTA into a persistent vehicle control such as:

**2024 BMW M4 →**

Vehicle selection should persist throughout the shopping session and inform compatible product states across collection cards, PDPs, cart, and related fitment experiences.

Recommended behavior:

- Compact sticky header after scrolling.
- Selected vehicle displayed in the header.
- Change Vehicle action available without restarting the shopping journey.
- Subtle transition when vehicle state changes.
- Do not make the header visually heavy.

## 3. Cinematic Hero

Maintain the approved hero composition: dramatic vehicle/wheel photography, left-aligned headline, supporting copy, primary CTA, and performance credentials.

### Enhancements

Add restrained desktop motion:

- 3–5% slow cinematic image push.
- Subtle foreground/background parallax.
- Controlled headline and CTA entrance.
- Small specular/light movement around the wheel where appropriate.
- Respect `prefers-reduced-motion`.

### Wheel Hotspots

Introduce optional technical hotspots positioned around the hero wheel:

**FORGED 6061-T6**  
Aerospace-grade aluminum

**CNC MACHINED**  
Precision tolerances

**CUSTOM FINISH**  
Unlimited possibilities

Hotspots should reveal compact tooltips and must never obscure the product.

## 4. Find Your Fit

Elevate the existing fitment module into a persistent vehicle-selection system.

Primary fields:

- Year
- Make
- Model
- Trim

After selection, display a vehicle summary:

**YOUR VEHICLE**  
**2024 BMW M4 Competition**  
✓ Fitment enabled across the site

Include **Change Vehicle →**.

The selected vehicle becomes global storefront state.

## 5. Signature Wheels / Product Cards

Increase the product section from a static gallery into a discovery experience.

Each product card can contain:

- Wheel model.
- Construction type.
- Available sizes.
- Starting price.
- Finish swatches.
- Vehicle compatibility badge.
- View Details action.

### Product-card interaction

Desktop hover can transition from:

**wheel studio/render image → installed-on-vehicle image**

Recommended secondary message:

**HOVER TO SEE IT ON VEHICLE**

Finish swatches can change the displayed wheel finish without navigating away.

If a vehicle is selected, compatible cards can show:

**FITS YOUR M4**

Avoid excessive hover scaling.

## 6. 360° Wheel Viewer

Use high-quality rotational renders for flagship wheel models.

Interaction:

**DRAG TO ROTATE ↔**

Recommended implementation:

- 24–36 optimized frames, or an equally performant interactive asset.
- Pointer drag on desktop.
- Touch drag on mobile.
- Lazy-load viewer assets.
- Static fallback image for reduced-data or unsupported environments.

The homepage can preview this capability while the full experience lives on the PDP.

## 7. Build Your Vision — Live Configurator

Transform the current customization section into a lightweight homepage configurator.

### Four-step structure

**01 — Select Design**  
**02 — Choose Finish**  
**03 — Review Specs**  
**04 — Bring It To Life**

The large product visualization should update as selections change.

Example finish controls:

- Satin Black
- Gloss Black
- Brushed Bronze
- Polished
- Gunmetal
- Custom Color

Include:

**START YOUR BUILD →**

and optionally:

**WATCH HOW IT WORKS**

The homepage version should remain intentionally simpler than the final PDP configurator.

## 8. Engineering Storytelling

Turn **Engineered to Perform** into a visual manufacturing sequence.

Suggested progression:

**01 — Aerospace-Grade Aluminum**  
Raw forged material.

**02 — CNC Machining**  
Precision manufacturing.

**03 — Finishing & Assembly**  
Surface treatment and final construction.

**04 — Strength Tested / Road Proven**  
Validation and real-world use.

Recommended behavior:

- Sequential scroll reveal.
- Very restrained image parallax.
- Technical numbering.
- Consistent copper accent.
- No aggressive scroll-jacking.

## 9. From Concept to Reality

Use this area for both transformation and real-build discovery.

### Before / After comparison

One module can provide a draggable comparison:

**OEM ← → CALDER**

Use the same vehicle and camera angle wherever possible.

### Real Builds

Build cards should expose meaningful fitment information, for example:

**BMW M4 Competition**  
C2 · 20"/21" · Satin Black

**Porsche 911 Turbo S**  
C3 · 21"/22" · Brushed Bronze

**Mercedes-AMG GT**  
C1 · 21"/22" · Gloss Black

Each build can link to:

**VIEW BUILD →**

A build detail page should eventually support:

- Vehicle.
- Wheel model.
- Front/rear sizes.
- Offset.
- Finish.
- Tire specification.
- Photography.
- **BUILD THIS FITMENT →**

## 10. Exploded Wheel / Built for Your Vehicle

Use the exploded wheel visual as an engineering interaction.

Suggested animated sequence:

1. Hardware separates.
2. Barrel moves outward.
3. Forged center moves outward.
4. Component labels appear.
5. Assembly settles into the completed wheel.

Potential labels:

- CUSTOM FINISH
- FORGED CENTER
- PRECISION BARREL
- AEROSPACE HARDWARE

Animation should be driven by viewport/scroll progress and remain subtle.

## 11. Microinteractions

Apply premium microinteractions consistently rather than adding large effects everywhere.

### Buttons

On hover:

- Arrow translates approximately 3–5 px.
- Background/foreground transition.
- Minimal elevation or metallic highlight.
- Optional 2–4 px magnetic pointer response on primary desktop CTAs.

### Technical icons

For credentials such as:

- Premium Materials
- Custom Engineered
- Proven Performance

Use a short sequential icon/text reveal when entering the viewport.

### Contextual pointer states

Only where useful:

- **ROTATE ↔**
- **VIEW BUILD →**
- **DRAG ↔**
- **EXPLORE +**

Do not replace the normal cursor globally.

## 12. Page Transitions

For major product-navigation actions, use subtle transitions rather than abrupt page flashes.

Examples:

- Collection → PDP.
- Build Gallery → Build Detail.
- Configurator → configured PDP.

Target approximately **200–350 ms** for interface transitions.

Performance and accessibility take priority over animation.

## 13. Premium Loading States

Avoid generic Shopify loaders where a branded state is appropriate.

Potential visual:

**Calder emblem + machining-ring animation**

Use only when actual waiting occurs. Do not intentionally delay content to display branding.

## 14. The Build Drop

Position the newsletter as an insider product/build channel rather than a generic mailing list.

### Recommended copy

**THE BUILD DROP**

New wheel releases. Featured builds. Behind-the-scenes engineering. Events. Be the first to know.

CTA:

**JOIN THE DROP →**

Supporting benefits:

- New Releases
- Exclusive Builds
- Events & Partnerships
- Special Offers

A very slow background drift can add depth to the scenic photography.

## 15. Visual Breathing Room

The homepage is intentionally content-rich. Add at least one large, dark, low-density moment to improve pacing.

Potential concept:

**ENGINEERED FOR ONE VEHICLE.  
YOURS.**

Use:

- Large isolated wheel.
- Midnight navy field.
- Minimal supporting copy.
- One CTA.
- Slow wheel rotation tied to scroll.

This gives the surrounding photographic sections more visual impact.

## 16. Motion Principles

Motion should feel mechanical, controlled, and premium.

Use:

- Smooth easing.
- Short UI transitions.
- Slow cinematic media movement.
- Scroll-linked product movement only where meaningful.
- Sequenced reveals for technical storytelling.

Avoid:

- Excessive bouncing.
- Large hover zooms.
- Constant looping movement.
- Aggressive scroll hijacking.
- Animation that delays purchasing actions.
- Effects that noticeably reduce Core Web Vitals.

## 17. Responsive Behavior

Desktop can support the richest interactions. Tablet and mobile should simplify gracefully.

### Mobile priorities

1. Fitment selection.
2. Product compatibility.
3. Product imagery.
4. Configuration.
5. Add-to-cart journey.

Replace hover-only interactions with explicit tap controls. Reduce or eliminate parallax and expensive animation on smaller devices when necessary.

## 18. Accessibility / Performance Requirements

All enhancement work should preserve:

- Keyboard navigation.
- Visible focus states.
- Semantic controls.
- Adequate contrast.
- Reduced-motion support.
- Touch-friendly control sizes.
- Lazy-loaded non-critical media.
- Responsive image sizing.
- Stable layout with minimal CLS.
- Fast LCP for the hero.
- Progressive enhancement if JavaScript fails.

## 19. Recommended Implementation Priority

### Phase 1 — Flagship Commerce UX
1. Persistent vehicle/fitment state.
2. Fitment-aware product cards.
3. Interactive finish selection.
4. Real Builds with build-to-fitment path.
5. PDP-compatible 360° viewer architecture.

### Phase 2 — Premium Storytelling
1. Cinematic hero.
2. Engineering sequence.
3. Exploded-wheel animation.
4. Before/after vehicle comparison.
5. Dark visual-breathing section.

### Phase 3 — Polish
1. Button microinteractions.
2. Technical icon reveals.
3. Contextual cursor states.
4. Page transitions.
5. Calder loading states.
6. Newsletter background motion.

## 20. Design-to-Code Rule

The approved Calder mockups remain the visual authority for branding, typography, spacing, hierarchy, photography treatment, borders, navigation, and overall premium automotive character.

These enhancements should be treated as a **behavior and interaction layer on top of the approved visual system**, not permission to redesign the brand or arbitrarily alter the established page hierarchy.

---

## Flagship Experience Goal

The finished storefront should combine four qualities:

**Luxury automotive manufacturer**  
+ **vehicle fitment platform**  
+ **technical engineering company**  
+ **premium ecommerce experience**

The defining principle is:

> **At rest, Calder should look refined. In motion, it should reveal its sophistication.**
