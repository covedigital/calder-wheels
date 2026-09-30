# Calder Visual Specification — Collection / Category Page

## Source
- File: `Calder - 2 - Category.png`
- Source dimensions: `1024 × 1536`
- Page type: Shopify Collection Page
- Inspector: GPT-5.6 Sol
- Schema version: 1.0

## Authority
The approved Collection mockup governs page-specific composition. The accepted Home implementation governs shared Calder design language and shared components. Existing brand tokens govern canonical colors/fonts. Existing Lumia behavior should be preserved where compatible.

## Reference dimensions
`1024 × 1536`.

## Homepage design-system values reused
- Container: reuse the established Calder container system; known project context: `--container-max-width: 1178px`.
- Display headings: Facundo.
- UI/body: Garet; Poppins fallback where already established.
- Shared brand tokens: Navy `#0E2A3E`, Blue `#1E4C68`, Gold `#C2A48A`, Slate `#876E5A`, Cream `#F2EFE9`, Near Black `#231F20`, Surface `#1A1A1A`, Dark Background `#0A0A0A`.
- Reuse accepted Home header, lower-page newsletter/benefits/footer, button language, control styling and responsive conventions.
- Exact current accepted Home button dimensions, radii, field metrics, spacing tokens and breakpoints must be recovered from the implementation rather than guessed.

## Collection page region map
| Region | Approx. bbox px | Normalized bbox | Notes |
|---|---|---|---|
| Global header | `[0,0,1024,52]` | `[0,0,1,.0339]` | Dark global navigation |
| Collection hero | `[0,52,1024,216]` | `[0,.0339,1,.1406]` | Full-bleed image hero |
| Vehicle fitment entry | `[43,201,981,304]` | `[.042,.1309,.958,.1979]` | Elevated overlap panel |
| Category navigation | `[46,324,979,386]` | `[.0449,.2109,.9561,.2513]` | Five visual tiles |
| Results region | `[44,407,981,1041]` | `[.043,.265,.958,.6777]` | Filter rail + toolbar + 3-col grid |
| Help CTA | `[241,1089,982,1200]` | `[.2354,.709,.959,.7813]` | Aligns to grid column |
| Newsletter/benefits | `[0,1219,1024,1347]` | `[0,.7936,1,.877]` | Shared lower-page system |
| Footer | `[0,1347,1024,1536]` | `[0,.877,1,1]` | Shared global footer |

## Container analysis
The visible collection content uses approximately 42–48 px gutters in this 1024 px reference, yielding roughly 934 px of working width. This is consistent with a centered shared container rather than a new collection-specific max-width. At production desktop widths, reuse the verified `1178px` Calder container. Full-bleed exceptions are the hero, newsletter/benefits and footer backgrounds.

## Typography analysis
The hero eyebrow is compact uppercase gold UI text with wide tracking. The H1 is large uppercase display typography, approximately 40–44 px at this reference scale, with “WHEELS” emphasized in gold. Supporting hero copy is compact light-on-dark body copy. Collection navigation, filter headings, toolbar labels and buttons use uppercase UI styling. Product-card typography must come from the accepted B1 component rather than being re-derived from this screenshot.

## Color / token mapping
Map screenshot colors to existing Calder tokens rather than introducing near-duplicates. Primary dark navy/near-black surfaces correspond to existing Calder dark tokens; gold accents map to `#C2A48A`; light content areas remain white/cream-neutral; green “fits your vehicle” state remains the shared B1 state treatment.

## Category navigation specification
Five horizontal image-backed tiles appear below fitment: All Wheels, Forged Monoblock, Forged 3-Piece, By Vehicle, By Style. Tiles are approximately equal width, ~62 px tall at reference scale, separated by ~14 px gaps. “All Wheels” is active and receives a gold accent/border treatment. Preserve imagery/icon hierarchy and do not substitute default Shopify collection tabs.

## Filter / sort specification
Desktop filtering is a left sidebar, not a horizontal filter bar. Visible groups include Wheel Type, Diameter, Width, Bolt Pattern, Finish, Vehicle Fitment and Collection. Groups use compact uppercase headings, thin separators, checkbox rows and disclosure chevrons. A “Clear All” control sits at the rail top. The results toolbar includes result count, selected-vehicle chip/change action, sort select and grid/list toggles. Preserve dynamic Shopify facets and sorting.

## Product grid specification
The listing uses a 3-column desktop grid to the right of the filter rail. The outer results region is approximately a 181 px filter rail plus flexible listing column. Card gaps are visually compact (~10–12 px at reference scale). Rows maintain consistent card heights. Pagination is centered under the grid. Product content must remain dynamic.

## Shared B1 product card integration
B1 is authoritative for internal card structure, image treatment, labels, metadata, price, badge, surface, border/radius and CTA. The Collection reference governs grid width, column count, card placement and surrounding spacing only. Do not create a Collection Product Card v2.

## Shared components reused
Reuse the accepted global header, fitment functionality, B1 product card, newsletter/benefits and global footer. Shared components should not be forked or modified in ways that regress Home or other accepted consumers.

## Responsive inferences
**ASSUMPTION:** Collapse the desktop filter rail into a filter trigger/drawer on narrower viewports while retaining Shopify facet behavior. **ASSUMPTION:** Reduce the 3-column product grid according to accepted B1 minimum width and existing Calder/Lumia conventions. **ASSUMPTION:** Preserve all five category destinations via wrapping or horizontal scrolling rather than illegible compression. **ASSUMPTION:** Reuse accepted Home header and fitment responsive behavior. No responsive collection reference was supplied, so desktop remains authoritative.

## Implementation constraints
Inspect before editing. Preserve Shopify collection data, facets, sorting, pagination, product links and Theme Editor compatibility. Do not hard-code mockup product names, prices, counts or vehicle state. Do not alter accepted Home. Scope collection CSS. Reuse existing typography/tokens/container. Do not modify fitment functionality. Any shared-component change must be verified against existing consumers.

## QA targets
Primary QA should verify: hero height/crop and title placement; fitment overlap; five-tile nav geometry; sidebar/listing split; toolbar alignment; 3-column grid; B1 card placement; pagination; help CTA alignment to listing column; shared lower-page continuity; no Home/shared regressions.

## Uncertainties
Exact accepted Home runtime metrics beyond the known 1178 px container are not present in the supplied evidence and must be recovered by OpenCode from the current accepted implementation. Live filter values/counts depend on Shopify data. Tablet/mobile collection composition remains inferred until approved responsive references exist.
