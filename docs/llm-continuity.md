---
---
---
---
## [2026-08-20 00:48] — Codex on GPT-5

### [STATE] Current Status
OpenCode cache has been cleared and the local database now routes the Calder Wheels project to the correct folder.

### [ACTIVITY] Session Mode
EXECUTE

### [COMPLETED] What Was Done
- Updated `~/.local/share/opencode/opencode.db` so the Calder Wheels project row points to `/Users/admin/Projects/Autonomous Agent/1 - Projects/Calder Wheels`
- Updated cached session rows in `opencode.db` to use the Calder Wheels directory
- Cleared cache-heavy OpenCode directories under `~/.local/share/opencode`:
  - `log/`
  - `snapshot/`
  - `tool-output/`
  - `storage/session_diff/`
- Verified the OpenCode database no longer references the old project worktree for the Calder Wheels project

### [IN-PROGRESS] What's Partially Done
- The preserved session history still exists in `opencode.db`; only cache layers were purged

### [BLOCKED] What's Waiting
- Nothing blocking the cache reset

### [NEXT] Recommended Next Steps
1. Fully restart OpenCode and open `Calder Wheels`
2. If the picker still shows stale text, it should now be a UI refresh issue rather than a data-layer issue

### [DECISION] Decisions Made This Session
- Keep `opencode.db` intact to preserve chat/session history
- Purge only the cache layers that were still capable of reviving the old label

### [WARNING] Known Pitfalls & Cautions
- Historical session records can still contain the old project name because they are part of the preserved history
- If OpenCode shows the old label again, the remaining source is likely its UI state, not the database

### [FILES] Files Modified This Session
- `docs/llm-continuity.md`

### [BRANCH] Git Context
- Branch: main
- Working tree: uncommitted changes present

### [AGENT] Session Metadata
- Agent: Codex
- Model: GPT-5
---
## [2026-08-20 00:47] — Codex on GPT-5

### [STATE] Current Status
The compatibility symlink was removed; `Calder Wheels` is now the only live project folder path.

### [ACTIVITY] Session Mode
EXECUTE → BUILD

### [COMPLETED] What Was Done
- Removed the `Ray Shadravan - New Wheel Co` symlink alias from `1 - Projects`
- Kept the project history in the continuity docs instead of the filesystem alias
- Left the OpenCode snapshot cache pointed at `Calder Wheels`

### [IN-PROGRESS] What's Partially Done
- Historical references inside continuity logs still document the rename timeline

### [BLOCKED] What's Waiting
- Nothing blocking the cleanup

### [NEXT] Recommended Next Steps
1. Reopen OpenCode and select `Calder Wheels`
2. If any UI cache still shows the old label, refresh the project picker once more

### [DECISION] Decisions Made This Session
- The compatibility alias was removed because it was still capable of surfacing the old project label
- `Calder Wheels` is now the single canonical path

### [WARNING] Known Pitfalls & Cautions
- Old session logs may still contain historical mentions of the previous name
- The live folder path is now the source of truth for OpenCode routing

### [FILES] Files Modified This Session
- `docs/llm-continuity.md`

### [BRANCH] Git Context
- Branch: main
- Working tree: uncommitted changes present

### [AGENT] Session Metadata
- Agent: Codex
- Model: GPT-5
---
## [2026-08-20 00:45] — Codex on GPT-5

### [STATE] Current Status
Sibling project archives were cleaned so the old project name no longer appears there.

### [ACTIVITY] Session Mode
BUILD

### [COMPLETED] What Was Done
- Updated the AI Coaching archive note to reference `Calder Wheels`
- Updated the E5 Wheels Automation archive note and AGENTS note to reference `Calder Wheels`
- Verified sibling projects no longer contain stale `New Wheel Co` references

### [IN-PROGRESS] What's Partially Done
- Historical references in Calder Wheels continuity remain for the rename timeline and compatibility alias

### [BLOCKED] What's Waiting
- Nothing blocking the sibling archive sweep

### [NEXT] Recommended Next Steps
1. Keep using `Calder Wheels` as the canonical project name in all active work
2. Leave the compatibility alias in place until you are sure no external tool depends on the old folder name

### [DECISION] Decisions Made This Session
- The old project label is now treated as historical only across sibling archives

### [WARNING] Known Pitfalls & Cautions
- The compatibility symlink still exists so legacy lookups continue to work
- Some archive entries are intentionally historical and may mention prior project splits in context

### [FILES] Files Modified This Session
- `../Ray Shadravan - AI Coaching/docs/0 - DO NOT DELETE/llm-continuity.md`
- `../E5 Wheels Automation/AGENTS.md`
- `../E5 Wheels Automation/docs/0 - DO NOT DELETE/llm-continuity.md`
- `docs/llm-continuity.md`

### [BRANCH] Git Context
- Branch: main
- Working tree: uncommitted changes present

### [AGENT] Session Metadata
- Agent: Codex
- Model: GPT-5
---
## [2026-08-20 00:41] — Codex on GPT-5

### [STATE] Current Status
The old project name now resolves to the Calder Wheels folder via a compatibility symlink.

### [ACTIVITY] Session Mode
EXECUTE → BUILD

### [COMPLETED] What Was Done
- Created a backward-compatible alias at `../Ray Shadravan - New Wheel Co` pointing to `Calder Wheels`
- Cleaned the remaining stale `New Wheel Co` branding from the exact mockup HTML
- Verified the old path now resolves to the Calder Wheels root in the project list

### [IN-PROGRESS] What's Partially Done
- External session indexes outside this workspace may still cache the old label until they refresh

### [BLOCKED] What's Waiting
- Nothing blocking the project rename compatibility fix

### [NEXT] Recommended Next Steps
1. Use `Calder Wheels` as the canonical folder name
2. If the session picker still shows the old project title, force a refresh or restart so it re-reads the alias
3. Use `docs/llm-continuity.md` for the live history trail; use `docs/0 - DO NOT DELETE/llm-continuity.md` for archived history

### [DECISION] Decisions Made This Session
- `Ray Shadravan - New Wheel Co` is now a compatibility alias, not the source-of-truth project folder
- The source-of-truth project folder remains `Calder Wheels`

### [WARNING] Known Pitfalls & Cautions
- Any external cache or project selector may need a refresh before it stops showing the old label
- Chat-session history is not stored in the folder name itself; it lives in the continuity logs

### [FILES] Files Modified This Session
- `docs/design/mockups/dealer-portal-mockups-exact.html`
- `docs/llm-continuity.md`

### [BRANCH] Git Context
- Branch: main
- Working tree: uncommitted changes present

### [AGENT] Session Metadata
- Agent: Codex
- Model: GPT-5
---
## [2026-08-20 21:42] — Codex on GPT-5

### [STATE] Current Status
The exact mockup HTML is now code-native and no longer depends on embedding the PNGs.

### [ACTIVITY] Session Mode
BUILD

### [COMPLETED] What Was Done
- Rebuilt `docs/design/mockups/dealer-portal-mockups-exact.html` as HTML/CSS/SVG instead of an image wrapper
- Preserved the screenshot PNGs as reference assets, but the exact HTML now renders the design directly
- Verified the HTML file contains no `<img>` tags pointing at the mockup PNGs

### [IN-PROGRESS] What's Partially Done
- The code-native HTML is still a standalone mockup artifact; it has not been converted into Shopify theme sections yet

### [BLOCKED] What's Waiting
- Nothing blocking the code-native mockup build

### [NEXT] Recommended Next Steps
1. Open the code-native HTML and compare it against the PNGs for any remaining spacing or typography drift
2. Feed the HTML into your local Autonomous Agent as the implementation source for theme extraction

### [DECISION] Decisions Made This Session
- Exact visual mockups should be reproduced as HTML/CSS/SVG, not by embedding the rendered PNGs
- The PNGs remain a visual reference only

### [WARNING] Known Pitfalls & Cautions
- Any future changes to the PNG mockups should be mirrored in the code-native HTML to keep the two in sync

### [FILES] Files Modified This Session
- `docs/design/mockups/dealer-portal-mockups-exact.html`
- `docs/llm-continuity.md`

### [BRANCH] Git Context
- Branch: main
- Working tree: uncommitted changes present

### [AGENT] Session Metadata
- Agent: Codex
- Model: GPT-5
---
## [2026-08-20 21:36] — Codex on GPT-5

### [STATE] Current Status
Exact-visual HTML companion created for the dealer portal mockups.

### [ACTIVITY] Session Mode
BUILD

### [COMPLETED] What Was Done
- Created `docs/design/mockups/dealer-portal-mockups-exact.html` to render the generated PNG mockups directly
- Updated `docs/design/mockups/dealer-portal-mockup-manifest.json` to point at the exact visual HTML
- Kept the semantic HTML source package and the markdown spec in place for the local agent

### [IN-PROGRESS] What's Partially Done
- The exact HTML is a visual layer only; implementation into Shopify theme sections is still pending

### [BLOCKED] What's Waiting
- Nothing blocking this visual alignment step

### [NEXT] Recommended Next Steps
1. Use `dealer-portal-mockups-exact.html` when you need a visual match to the PNGs
2. Use `dealer-portal-mockup-spec.md` when you need implementation guidance for the Shopify theme

### [DECISION] Decisions Made This Session
- Exactness takes priority over semantic reconstruction for the mockup handoff page
- The project now has both a visual exact-match HTML and a machine-readable source/spec set

### [WARNING] Known Pitfalls & Cautions
- The exact HTML depends on the PNG files staying in the same folder
- If the PNGs change, regenerate the exact HTML or it will go stale visually

### [FILES] Files Modified This Session
- `docs/design/mockups/dealer-portal-mockups-exact.html`
- `docs/design/mockups/dealer-portal-mockup-manifest.json`
- `docs/llm-continuity.md`

### [BRANCH] Git Context
- Branch: main
- Working tree: uncommitted changes present

### [AGENT] Session Metadata
- Agent: Codex
- Model: GPT-5
---
## [2026-08-20 21:29] — Codex on GPT-5

### [STATE] Current Status
Dealer portal mockups now have machine-readable source files for local-agent consumption.

### [ACTIVITY] Session Mode
BUILD

### [COMPLETED] What Was Done
- Created `docs/design/mockups/dealer-portal-mockups.html` as a semantic HTML source package for the four dealer portal screens
- Created `docs/design/mockups/dealer-portal-mockup-spec.md` to map each mockup screen to Shopify sections and required UI elements
- Created `docs/design/mockups/dealer-portal-mockup-manifest.json` as a compact screen index
- Preserved the existing PNG mockups for visual reference only

### [IN-PROGRESS] What's Partially Done
- The HTML file is source-friendly but not yet wired into Shopify theme code

### [BLOCKED] What's Waiting
- Nothing blocking the source-package deliverable

### [NEXT] Recommended Next Steps
1. Feed `dealer-portal-mockups.html` and `dealer-portal-mockup-spec.md` to the local Autonomous Agent as the implementation source
2. Translate the screen map into `sections/*.liquid` files in the Shopify theme

### [DECISION] Decisions Made This Session
- Use semantic HTML plus a markdown spec as the interchange format for the agent
- Keep the PNGs as visual references, not the primary handoff artifact

### [WARNING] Known Pitfalls & Cautions
- The local agent should not rely on the PNGs if it cannot inspect images
- Keep the HTML/spec in sync if the mockups change

### [FILES] Files Modified This Session
- `docs/design/mockups/dealer-portal-mockups.html`
- `docs/design/mockups/dealer-portal-mockup-spec.md`
- `docs/design/mockups/dealer-portal-mockup-manifest.json`
- `docs/llm-continuity.md`

### [BRANCH] Git Context
- Branch: main
- Working tree: uncommitted changes present

### [AGENT] Session Metadata
- Agent: Codex
- Model: GPT-5
---
## [2026-08-20 21:22] — Codex on GPT-5

### [STATE] Current Status
Project root folder renamed to `Calder Wheels` and embedded path references were updated.

### [ACTIVITY] Session Mode
EXECUTE → BUILD

### [COMPLETED] What Was Done
- Moved the project root from `Ray Shadravan - Calder Wheels` to `Calder Wheels`
- Updated hard-coded project path references in `brand/brand.md`
- Updated the archived continuity note in `docs/0 - DO NOT DELETE/llm-continuity.md`
- Verified the renamed project tree no longer contains `New Wheel Co` or the old root folder string

### [IN-PROGRESS] What's Partially Done
- Historical proposal and archive content may still reflect older naming where it is part of the original record

### [BLOCKED] What's Waiting
- Nothing blocking the folder rename

### [NEXT] Recommended Next Steps
1. Use `Calder Wheels` as the canonical project path in future edits
2. If any external integrations or scripts reference the old path, update them separately

### [DECISION] Decisions Made This Session
- The canonical project folder is now `Calder Wheels`
- Old path strings should not be used in active docs

### [WARNING] Known Pitfalls & Cautions
- The renamed path is now the source of truth; stale references outside this workspace are not affected

### [FILES] Files Modified This Session
- `brand/brand.md`
- `docs/0 - DO NOT DELETE/llm-continuity.md`
- `docs/llm-continuity.md`

### [BRANCH] Git Context
- Branch: main
- Working tree: uncommitted changes present

### [AGENT] Session Metadata
- Agent: Codex
- Model: GPT-5
---
## [2026-08-20 21:15] — Codex on GPT-5

### [STATE] Current Status
Project renamed in the primary docs and root folder to Calder Wheels.

### [ACTIVITY] Session Mode
BUILD

### [COMPLETED] What Was Done
- Updated the core project docs to use the new name Calder Wheels
- Renamed the project identity in `AGENTS.md`, `brand/brand.md`, `docs/discovery/requirements.md`, `docs/discovery/inspiration-analysis.md`, and the SOP index files
- Recorded this rename in project continuity so future sessions inherit the updated name

### [IN-PROGRESS] What's Partially Done
- Historical archive entries were renamed in this sweep, but older session meaning is preserved

### [BLOCKED] What's Waiting
- Nothing blocking the rename update

### [NEXT] Recommended Next Steps
1. Update any external references outside this workspace to use Calder Wheels
2. If you introduce new assets, keep the folder-name convention aligned with Calder Wheels

### [DECISION] Decisions Made This Session
- The active project name is now Calder Wheels
- The filesystem folder name now matches the project name

### [WARNING] Known Pitfalls & Cautions
- Historical session notes were updated to Calder Wheels during this sweep

### [FILES] Files Modified This Session
- `AGENTS.md`
- `brand/brand.md`
- `docs/discovery/requirements.md`
- `docs/discovery/inspiration-analysis.md`
- `docs/llm-continuity.md`
- `sops/SOP-Index.md`
- `sops/META/Activity-Modes.md`
- `sops/META/PRIME-Prompting.md`

### [BRANCH] Git Context
- Branch: main
- Working tree: uncommitted changes present

### [AGENT] Session Metadata
- Agent: Codex
- Model: GPT-5
---
## [2026-08-20 21:06] — Codex on GPT-5

### [STATE] Current Status
Three additional dealer portal mockups were generated and saved in the project workspace.

### [ACTIVITY] Session Mode
BUILD

### [COMPLETED] What Was Done
- Generated the Quick Order mockup at `docs/design/mockups/dealer-portal-quick-order-mockup.png`
- Generated the Quotes / Payment Terms mockup at `docs/design/mockups/dealer-portal-quotes-payment-terms-mockup.png`
- Generated the Dealer Landing / Application Pending mockup at `docs/design/mockups/dealer-portal-pending-landing-mockup.png`
- Kept the visual language aligned with the existing dealer dashboard mockup: dark luxury palette, gold accents, premium Shopify portal feel

### [IN-PROGRESS] What's Partially Done
- Mockups are concept visuals only; no theme implementation has been started from these images

### [BLOCKED] What's Waiting
- Nothing blocking the current deliverable

### [NEXT] Recommended Next Steps
1. If needed, turn one or more of these screens into Shopify theme sections or Figma frames
2. Add component-level annotations if these images will be used as implementation references

### [DECISION] Decisions Made This Session
- Used the existing dealer dashboard as the visual baseline for all companion views
- Named the assets by screen purpose so they can be referenced independently in the project

### [WARNING] Known Pitfalls & Cautions
- Image-generated UI text is approximate; verify exact labels before implementation
- The legacy continuity archive remains in `docs/0 - DO NOT DELETE/llm-continuity.md`

### [FILES] Files Modified This Session
- `docs/design/mockups/dealer-portal-quick-order-mockup.png`
- `docs/design/mockups/dealer-portal-quotes-payment-terms-mockup.png`
- `docs/design/mockups/dealer-portal-pending-landing-mockup.png`
- `docs/llm-continuity.md`

### [BRANCH] Git Context
- Branch: main
- Working tree: uncommitted changes present

### [AGENT] Session Metadata
- Agent: Codex
- Model: GPT-5
---
## [2026-08-20 21:06] — Codex on GPT-5

### [STATE] Current Status
Dealer portal mockup generated from `docs/design/dealer-portal-design.md` and saved in the project workspace.

### [ACTIVITY] Session Mode
BUILD

### [COMPLETED] What Was Done
- Reviewed project instructions in `AGENTS.md`, `brand/brand.md`, and the dealer portal design brief
- Generated a high-fidelity desktop UI mockup for the dealer dashboard
- Copied the rendered asset into the project at `docs/design/mockups/dealer-portal-dashboard-mockup.png`
- Created the standard project continuity file at `docs/llm-continuity.md`

### [IN-PROGRESS] What's Partially Done
- Only one portal view is rendered so far: the main dealer dashboard concept

### [BLOCKED] What's Waiting
- Nothing blocking the current deliverable

### [NEXT] Recommended Next Steps
1. Generate additional portal views if needed: quick order, quotes, application pending, payment terms
2. Compare the mockup against the Lumia theme implementation details if the design needs to be converted into theme code

### [DECISION] Decisions Made This Session
- Used the dealer dashboard as the primary mockup because it is the clearest summary view in the design brief
- Kept the visual direction dark/luxury with restrained gold accents to match the project brand guidance

### [WARNING] Known Pitfalls & Cautions
- Image-generation text fidelity may soften small UI copy; use this asset as a visual concept, not a pixel-perfect spec
- The legacy continuity archive remains at `docs/0 - DO NOT DELETE/llm-continuity.md`; do not treat it as deleted history

### [FILES] Files Modified This Session
- `docs/design/mockups/dealer-portal-dashboard-mockup.png`
- `docs/llm-continuity.md`

### [BRANCH] Git Context
- Branch: main
- Working tree: uncommitted changes present

### [AGENT] Session Metadata
- Agent: Codex
- Model: GPT-5

---
## [2026-09-08] — WS1 Activation: Metafield bugfix + composite image path alignment

### [STATE] Current Status
WS1 activation guide updated. Configurator BOM `image` path bug fixed. Theme code resolves images via `asset_url`. All 117 tests passing.

### [COMPLETED] What Was Done
- Updated `ws1-activation-guide.md` — 6 tasks moved from pending to completed
- Fixed `seed_metafields.py` BOM image path to flat naming (`design-{code}-{layer}-{finish}.png`)
- `configurator-data.liquid`: asset_url resolution + CALDER_ASSET_BASE + _calderDesignCode globals
- `configurator-api.js`: middleware path constructs proper asset URLs
- Regenerated metafields at `fitment/calder-metafields.{csv,json}`
- Products + theme pushed to live Shopify

### [IN-PROGRESS]
- Homepage rebuild — last WS1 launch blocker
- SEO foundation — not started

### [NEXT]
1. Verify configurator preview on live PDP
2. Homepage rebuild (4-6 hrs)
3. SEO foundation (2 hrs)
4. Wire dealer application form to backend (1-2 hrs)
---
## [2026-09-30] — Presentation Baseline Checkpoint

### [ACTIVITY] Session Mode
EXECUTE

### [COMPLETED] What Was Done
- Created checkpoint branch `presentation-baseline-2026-09-30` from `design-to-code-home`
- Staged and committed all 106 uncommitted files (modified theme sections + untracked brand assets, fonts, SVG logos, visual inspector artifacts)
- Created annotated tag `presentation-baseline-2026-09-30` at commit 6b988a3
- Working tree is clean — ready for presentation

### [BRANCH] Git Context
- Branch: presentation-baseline-2026-09-30 (active)
- Other branches: design-to-code-home, main
- Tags: presentation-baseline-2026-09-30
- Last commit: 6b988a3 ("presentation-baseline-2026-09-30 — 183 files: theme sections, brand assets, visual inspector specs, QA corrections, font files, removed stitch discovery artifacts")
- No remote configured

### [AGENT] Session Metadata
- Agent: OpenCode
- Model: DeepSeek V4 Flash

---
## [2026-10-29] — Universal PDP Add-to-Cart Fix: registry rebound to LIVE catalog + dashed design-code gates

### [ACTIVITY] Session Mode
BUILD

### [STATE] Current Status
Root cause of the non-functional Add to Cart on the universal PDP found and fixed in the repo (not yet deployed). All 6 node test files (57 tests) + configurator python suite (77 tests) pass.

### [COMPLETED] What Was Done
**Root cause (three stacked failures):**
1. Registry legacy refs were built against `products_export_10-27-2026.csv` (retired generation: `calder-clb06-range-rover-l460-...` handles + `-BLK/-CHR` SKU suffixes). The LIVE store (client-confirmed this session) is `products_import_10-27-2026.csv`: 96 spec-handle products, 864 variants, SKU == part_number exactly. Every `/products/{handle}.js` fetch 404'd → resolver state ERROR → CTA could never enable.
2. Live design_code metafield is DASHED (`CLB-06`), but `calder-product.liquid` / `calder-specs.liquid` gates compare against undashed `CLB06` → `is_universal_design=false` → universal experience never rendered on live legacy products.
3. `calder-universal-controls.liquid` computed the registry filename from the dashed code → `calder-design-registry-clb-06.js` (404; real asset is `...clb06.js`) → resolver never booted → CTA inert.

**Fixes:**
- `docs/architecture/build_design_registry.py`: cross-reference switched to `products_import_10-27-2026.csv`; exact PN match + row verification (diameter option, center option, handle lip/bolt fragment, design slug); refs now `canonical_source='verified'`; live-import integrity validation is fatal.
- Regenerated: `calder_design_registry.json`, `calder_part_catalog_912.csv`, 7 theme registry assets. Coverage: **864/912 mapped** (was 756), 48 no_legacy (CLM-01/CLM-05 6x139-03mm-78.1 22"/24" not in live store), 24 no_catalog (26" gap in +03 group), 0 ambiguous.
- Liquid: `calder-product.liquid`, `calder-specs.liquid` gates normalize via `| remove: '-'`; `calder-universal-controls.liquid` registry filename uses undashed key; `calder-design-url.liquid` accepts dashed codes and deep-links to the product's own LIVE URL + config params (canonical `/products/calder-clb-06` products are NOT in the live store — noted as client dependency).
- Tests updated to live-catalog truth; new live-store integrity test asserts every mapped cell binds to a real products_import SKU/handle.

### [DECISION] Decisions Made
- Live-store cross-reference source = products_import_10-27-2026.csv (client-confirmed).
- Card deep links target the live legacy product URL with config params (not the nonexistent canonical design URL) until universal products are imported.
- The 48 +03-group parts stay no_legacy → resolver shows NO_SELLABLE_RECORD ("Request Custom Configuration") — matches part catalog `legacy_mapped=False`.

### [IN-PROGRESS] What's Partially Done
- Theme changes are **not pushed to Shopify** (needs client approval — deploy step pending).
- Hardcoded placeholder support phone "(305) 555-1234" in `calder-universal-cta.js` NO_STOCK message violates the "never invent contact details" guardrail — left as-is (possibly client-requested copy); needs client confirmation before launch.

### [BLOCKED] What's Waiting
- Client decision: import universal products (restores 6-canonical-URL model + `-wheel` handles) vs keep legacy URLs.
- Client decision: 6x139-03mm-78.1 group (CLM-01/CLM-05 22"/24") — import those SKUs or keep "Request Custom Configuration".
- QuickBooks inventory sync (n8n) still a demo dataset (`calder-demo-inventory.js`).

### [FILES] Files Modified This Session
- `docs/architecture/build_design_registry.py`
- `docs/architecture/calder_design_registry.json` + `calder_part_catalog_912.csv` (regenerated)
- `docs/design/Shopify Themes/Working Theme-via-CLI/assets/calder-design-registry*.js` (7 files, regenerated)
- `docs/design/Shopify Themes/Working Theme-via-CLI/sections/calder-product.liquid`
- `docs/design/Shopify Themes/Working Theme-via-CLI/sections/calder-specs.liquid`
- `docs/design/Shopify Themes/Working Theme-via-CLI/snippets/calder-universal-controls.liquid`
- `docs/design/Shopify Themes/Working Theme-via-CLI/snippets/calder-design-url.liquid`
- `docs/architecture/tests/calder-config-resolver.test.mjs`, `calder-universal-cta.test.mjs`, `calder-card-links.test.mjs` (rewritten)
- `docs/llm-continuity.md` (this entry)

### [BRANCH] Git Context
- Branch: presentation-polish
- Uncommitted: this session's changes + prior session's uncommitted work

### [AGENT] Session Metadata
- Agent: OpenCode (build)
- Model: DeepSeek V4 Pro

---
## [2026-10-29 #2] — SKU-first purchase lookup + universal calder-*-wheel import prep

### [ACTIVITY] Session Mode
BUILD

### [STATE] Current Status
Purchase resolution is now SKU-first (mismatch-proof): the part_number variant SKU is the single purchase identifier, resolved via the Storefront API with the handle+SKU fetch demoted to fallback. Universal `calder-*-wheel` import file regenerated with the fixes it needed. All 63 node tests + 77 python tests pass. Awaiting client's manual theme push + product import.

### [COMPLETED] What Was Done
**Identifier strategy (client question: "how to simplify handles / which unique identifier?"):**
- The part_number variant SKU IS the identifier — already unique and shared with QuickBooks (864/864 verified). Do NOT rename SKUs. Handles are now OUT of the purchase path entirely.
- Legacy handle renames/reimports can never break Add to Cart again: the resolver looks variants up by SKU alone via Storefront GraphQL `productVariants(query:"sku:<PN>")` when a token is configured; falls back to `/products/{handle}.js` + SKU match otherwise (or on GraphQL failure — never fail-open).
- Live legacy handles: left as-is (internal sellable records once universal products are live; renaming = 96 redirects for zero customer value).

**Code changes:**
- `calder-config-resolver.js`: `storefrontSkuProvider` (exported, deps-injectable), `create({storefrontToken})` chains SKU-first → handle fallback. **Fixed latent UMD bug found by the new provider tests:** the factory body never had `root` in scope (browser default provider would have thrown a swallowed ReferenceError on every resolve — a 4th Add-to-Cart blocker). UMD now passes `root` into the factory.
- `calder-universal-pdp.js` passes `data-storefront-token` into the resolver; `calder-universal-controls.liquid` renders it from new theme setting `calder_storefront_access_token` (added to settings_schema "Calder Wheels — API" group).
- `calder-universal-cta.js`: placeholder phone "(305) 555-1234" removed from NO_STOCK message (client-confirmed placeholder).
- `build_design_registry.py`: `canonical_handle` = `calder-{design}-wheel` (matches import); resolution_rule documents SKU-first; regenerated registry + 7 theme assets.
- `build_universal_products_import.py`: Template suffix `calder` (was missing — universal PDPs would not have rendered), dashed design codes ('CLM-01'), design_nickname=number, `-wheel` handles, output `calder_universal_products_import_10-29-2026.csv` (216 rows verified).
- `calder-design-url.liquid`: card deep links restored to the six canonical design PDPs (`/products/calder-clb-06-wheel?...`).

### [DECISION] Decisions Made
- SKU = part_number is the single purchase identifier; handles are fallback-only.
- Canonical design PDPs are the six `calder-*-wheel` products (client will import).
- Placeholder phone removed per client confirmation.
- Client pushes theme and imports products manually (no deploy from agent).

### [BLOCKED] What's Waiting (client actions)
1. Push theme (assets: 7× calder-design-registry*.js, calder-config-resolver.js, calder-universal-pdp.js, calder-universal-cta.js; snippets: calder-universal-controls.liquid, calder-design-url.liquid; sections: calder-product.liquid, calder-specs.liquid; config: settings_schema.json).
2. Import `docs/design/mockups/product imports/calder_universal_products_import_10-29-2026.csv`.
3. Optional but recommended: create a public/headless Storefront access token and paste into Theme settings → Calder Wheels — API → "Storefront access token" (SKU-first mode). Without it, the handle+SKU fallback still works.
4. Review collection membership/SEO of the 6 universal products after import (they will appear in collections/search; consider whether they should be in customer-facing collections alongside the 96 legacy products).

### [FILES] Files Modified This Session
- `assets/calder-config-resolver.js`, `assets/calder-universal-pdp.js`, `assets/calder-universal-cta.js`
- `assets/calder-design-registry*.js` (7, regenerated)
- `snippets/calder-universal-controls.liquid`, `snippets/calder-design-url.liquid`
- `sections/calder-product.liquid`, `sections/calder-specs.liquid` (gates — from session #1; unchanged this session)
- `config/settings_schema.json` (new token setting)
- `docs/architecture/build_design_registry.py`, `calder_design_registry.json`, `calder_part_catalog_912.csv` (regenerated)
- `docs/design/mockups/product imports/build_universal_products_import.py` + generated `calder_universal_products_import_10-29-2026.csv`
- `docs/architecture/tests/calder-config-resolver.test.mjs` (+3 SKU-provider tests), `calder-universal-cta.test.mjs`, `calder-card-links.test.mjs`, `calder-pdp-e2e.test.mjs`
- `docs/llm-continuity.md` (this entry)

### [AGENT] Session Metadata
- Agent: OpenCode (build)
- Model: DeepSeek V4 Pro

---
## [2026-10-29 #3] — Live ERROR diagnosed: Shopify handle normalization (dots -> hyphens)

### [ACTIVITY] Session Mode
BUILD / DEBUG

### [STATE] Current Status
Client pushed the theme + imported the 6 universal products (live: calder-*-wheel). Dev panel on CLB-07 showed CTA state ERROR, variant ID missing. Diagnosed against the live store (wvpnpr-t7.myshopify.com): registry carried CSV handles with DOTS (`...-p32-72.6mm-...`) but Shopify normalizes handles at import — the live handle is `...-p32-72-6mm-...`. The resolver's handle fallback fetched the dotted handle → 404 → availability unknown → ERROR (Storefront token not configured yet, so the handle fallback was the active path).

### [COMPLETED] What Was Done
- Verified live store via products.json: 107 products, all 5 bore/offset fragments dot-hyphenated (`72-6mm`, `84-1mm`, `87-1mm`, `106-1mm`, `78-1mm`), SKUs intact.
- `build_design_registry.py`: added `shopify_handleize()` (lowercase; non-alnum runs -> single hyphen; trim) applied at CSV ingestion; registry metadata documents `legacy_handle_rule`.
- Regenerated registry + 7 theme assets.
- **Verified ALL 864 mapped registry refs against the live store SKU map: 864/864 exact matches, 0 missing, 0 mismatches.**
- `calder-pdp-state.js`: fixed `setOption` to accept the documented `{source}` object (dev panel showed "[object Object]" as source).
- Tests updated with the same handleize rule; all 61 node + 77 python tests pass.

### [DECISION] Decisions Made
- Registry handles are Shopify-normalized at build time (rule verified against the live store 2026-10-29).
- Storefront token remains optional-but-recommended; with it, handles exit the purchase path entirely.

### [FILES] Files Modified This Session
- `docs/architecture/build_design_registry.py`, `calder_design_registry.json`, `calder_part_catalog_912.csv` (regenerated)
- `assets/calder-design-registry*.js` (7, regenerated), `assets/calder-pdp-state.js`
- `docs/architecture/tests/calder-config-resolver.test.mjs`, `calder-card-links.test.mjs`
- `docs/llm-continuity.md` (this entry)

### [NEXT] Client must re-push
- `assets/calder-design-registry.js`, `assets/calder-design-registry-{clm01,clm02,clm03,clm05,clb06,clb07}.js`, `assets/calder-pdp-state.js`
- After push: CLB-07 22"/gloss-black/gloss-black/black should resolve AVAILABLE with variant ID 67971197075765 on the default group.
- Note: 5 non-Calder legacy products (apex-201, vertex-202, striker-203, turbine-205, vortex-207) are still live in the store — cleanup candidate for the client.

### [AGENT] Session Metadata
- Agent: OpenCode (build)
- Model: DeepSeek V4 Pro

---
## [2026-10-29 #4] — PN-derived legacy handle scheme (handle = f(part_number))

### [ACTIVITY] Session Mode
BUILD

### [STATE] Current Status
Target handle scheme implemented: legacy product handles become a pure function of the part_number, so handle and SKU can never drift. Builder emits expected_handle per ref + calder_handle_migration.csv (96 pending renames). Rename script delivered (Admin API; CSV renames would duplicate products). No re-push required for the current fix to work (refs still bind live handles); the rename is a one-time, client-run cleanup.

### [DECISION] The scheme
`{design-lower}-{pcd}-cb{bore*10}-et{offset:02d}-{lip gb|pl}-{bolt ch|bk}`
- e.g. CLB0722105207232GB22 -> clb07-5x120-cb726-et32-gb-ch
- Charset [a-z0-9-] only — Shopify stores verbatim (no dot/underscore rewrites possible)
- Decimals encoded as integers (72.6mm -> cb726; 106.1mm -> cb1061)
- ET = industry-standard offset notation, zero-padded (+03mm -> et03)
- Derived 1:1 from the part_number at build time; unique per product grain by construction; max 29 chars (was 73)
- Universal calder-*-wheel handles unchanged (customer-facing; never rename)
- Registry refs keep binding the LIVE store handle (truth); expected_handle is the build-time drift guard — after a rename, re-export, point LIVE_IMPORT at the new CSV, regenerate (migration count must be 0).

### [COMPLETED] What Was Done
- `build_design_registry.py`: `pn_handle()` derivation; `expected_handle` on every legacy_ref; `calder_handle_migration.csv` output (96 rows); metadata `handle_scheme` documents the format; summary prints pending migration count.
- `docs/design/mockups/product imports/rename_legacy_handles.py`: dry-run-by-default Admin API rename script (SHOPIFY_SHOP + SHOPIFY_ACCESS_TOKEN env, --apply to execute, idempotent — skips already-renamed).
- Resolver test recomputes the PN derivation independently for all 864 mapped refs + charset assertion. All 61 node + 77 python tests pass.
- Verified: 96/96 unique targets, all [a-z0-9-], max 29 chars.

### [NEXT] Client steps (optional but recommended cleanup)
1. `python3 rename_legacy_handles.py` (dry run) → review → `--apply` with Admin token
2. Re-export store products → replace LIVE_IMPORT CSV → `python3 build_design_registry.py && python3 build_theme_registry_asset.py` (expect "handle migrations pending: 0") → re-push registry assets
3. Storefront token setting still recommended (SKU-first lookup — handles exit purchase path entirely)

### [FILES] Files Modified This Session
- `docs/architecture/build_design_registry.py`, `calder_design_registry.json`, `calder_part_catalog_912.csv` (regenerated), `calder_handle_migration.csv` (new)
- `assets/calder-design-registry*.js` (7, regenerated with expected_handle)
- `docs/design/mockups/product imports/rename_legacy_handles.py` (new)
- `docs/architecture/tests/calder-config-resolver.test.mjs`
- `docs/llm-continuity.md` (this entry)

### [AGENT] Session Metadata
- Agent: OpenCode (build)
- Model: DeepSeek V4 Pro

---
## [2026-10-29 #5] — Minicart fix: theme-delegated cart rendering + items[] add.js format

### [ACTIVITY] Session Mode
BUILD / DEBUG

### [STATE] Current Status
Client locked the launch state (commit f88ccb8) and reported: after CTA add on the universal PDP, #dropdnMinicartPopup renders only a small cart icon + qty badge; console showed "Required parameter missing or invalid: items" on add.js. Both diagnosed against the live store (wvpnpr-t7.myshopify.com) and fixed. Commit eb51627.

### [COMPLETED] What Was Done
**Minicart root cause:** calder-universal-cta.js's addSectionResponses injected the RAW Section-Rendering response (a whole `<div id="shopify-section-header-cart">` wrapper containing the cart-icon link + a fresh `#dropdnMinicartPopup` + another `cart-items#header-cart`) into `#header-cart`. Result: nested duplication, duplicate IDs, and the visible popup content = the header icon link ("small cart icon with qty indicator, upper left corner"). Lumia never renders this way — cart.js `renderContents()` extracts per-selector zones (.js-contents-cart-items/.js-contents-subtotal/.js-contents-buttons/.header-cart-count).
**Fix:** the CTA now calls `cart-items.renderContents(json)` + `toggleEmptyClass` + `setParsedState` + `setCartJs` + shipping-calculator update — the exact tail of product-form.js's success path for normal products. Fallback (no cart-items): swap `#shopify-section-{key}` wrapper innerHTML in place; never nest. Sections request filters undefined section names.
**items[] error root cause:** modern /cart/add.js rejects JSON bodies without `items[]` ("Required parameter missing or invalid: items"). Three theme posters sent bare JSON `{id, quantity}`: dealer-backend.js (dealer order submission), configurator-app.js + configurator-api.js (old build-your-wheel page — still live, so its add button produces exactly this error). All three converted to `items: [{id, quantity, properties}]`. The CTA itself already used items[] and its adds succeeded (cart showed the added wheels).
**Verification:** live PDP script set confirmed (no old configurator JS on the PDP); 63 node + 77 python tests pass, incl. 3 new CTA tests (delegation, undefined-section filter, wrapper-swap fallback).

### [FILES] Files Modified This Session
- `assets/calder-universal-cta.js` (renderCartLikeTheme + extractSectionInner fallback + sections filter)
- `assets/dealer-backend.js`, `assets/configurator-app.js`, `assets/configurator-api.js` (items[] format)
- `docs/architecture/tests/calder-universal-cta.test.mjs` (+3 tests)
- `docs/llm-continuity.md` (this entry)

### [NEXT] Client re-push (4 assets)
- `calder-universal-cta.js`, `dealer-backend.js`, `configurator-app.js`, `configurator-api.js`
- After push: CTA add should open a fully-rendered minicart (items, subtotal, buttons) identical to normal products. "Clear-Site-Data header found" console line is a benign dev-store response header warning — ignore.
- Open item: old build-your-wheel page still live — amendment requires retiring it and unlinking nav (P0 checklist "old standalone builder retired safely"). It now works again post-fix, but decide retirement before SEMA.

### [AGENT] Session Metadata
- Agent: OpenCode (build)
- Model: DeepSeek V4 Pro

---
## [2026-10-29 #6] — SKU presentation: two-line spec cell + .calder-pdp__sku block

### [ACTIVITY] Session Mode
BUILD

### [COMPLETED] What Was Done
Client-confirmed the minicart fix works; requested new SKU/Part# presentation (commit 2ad78d5):
- Spec table cell `[data-calder-spec="sku"]`: `SKU: CFG-CLB07-22-GB-GBL-CH<br />Universal Part#: CLB0722105207232GB21` (was single-line "SKU: X | Universal Part#: Y").
- PDP `.calder-pdp__sku` block: `<span class="sku"><span>SKU:</span> CFG-...</span><br /><span class="universal-part"><span>Universal Part#:</span> CLB...</span>` — BOTH values update dynamically on every calder-uc selection (calder:universal-resolved handler in calder-universal-pdp.js).
- calder-product.liquid renders the same structure server-side (variant CFG SKU; Part# = "—" until the registry resolves on load). data-render="sku-{form_id}" preserved for Lumia.
- Values sanitized to [A-Za-z0-9#-] before innerHTML writes; e2e extended (two-line cell, block spans, dynamic 22"→24" updates on both targets). 63 node + 77 python green.

### [FILES] Files Modified This Session
- `assets/calder-universal-pdp.js`
- `sections/calder-product.liquid`
- `docs/architecture/tests/calder-pdp-e2e.test.mjs`

### [NEXT] Client re-push (2 files)
- `assets/calder-universal-pdp.js`, `sections/calder-product.liquid`

### [AGENT] Session Metadata
- Agent: OpenCode (build)
- Model: DeepSeek V4 Pro

---
## [2026-10-29 #7] — Universal gallery zoom (native Lumia parity)

### [COMPLETED] What Was Done
Client asked why the universal gallery lacks the native Lumia zoom. Answer: the universal gallery is a deliberately self-contained controller (the approved thumbs strip lives OUTSIDE <product-gallery>, which Lumia's Swiper-based ProductGallery cannot manage), and the native zoom layer (app.js addZoom → ezPlus inner hover-zoom + .js-prd-zoom-link icon → jq_lumia.fancybox gallery) was never ported into it. Implemented now (commit 0d3f4b0), scoped to the gallery only per client instruction:
- Hover zoom: ezPlus inner zoom on the active product-media slide, native options mirrored (respond 100-1024 disabled, zoomReserve 1.1, zoom-init one-time guard). Gated by settings.product_media_zoom like product-media-main.liquid. Preview slide (layered composite) intentionally unzoomed.
- Lightbox: native .js-prd-zoom-link icon markup reuses Lumia CSS; opens jq_lumia.fancybox with full-size sources (zoom animation, thumbs strip, light skin) — zoomLinkEvent options mirrored. Icon hidden when no media/fancybox.
- Slider behavior (slides/arrows/thumbs/active-sync), calder-uc, PDP, and buying flow untouched — zoom hooks are additive.
- Tests: 64 node + 77 python green (+1 structural zoom test).

### [FILES] Files Modified This Session
- `snippets/calder-universal-gallery.liquid`, `assets/calder-universal-pdp.js`
- `docs/architecture/tests/calder-universal-controls.test.mjs`

### [NEXT] Client re-push (2 files)
- `snippets/calder-universal-gallery.liquid`, `assets/calder-universal-pdp.js`
- Note: ezPlus hover zoom needs the theme's jquery.ez-plus.js + jq_lumia loaded on the PDP (they are part of the theme's global script stack; if hover zoom doesn't fire, verify those two assets load on the product template).

### [AGENT] Session Metadata
- Agent: OpenCode (build)
- Model: DeepSeek V4 Pro
