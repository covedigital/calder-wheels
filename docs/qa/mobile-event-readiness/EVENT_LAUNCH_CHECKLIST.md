# Calder Wheels — Event Launch Checklist & Manual Device Script

**Event**: Calder Wheels sales-rep demonstration · **Site**: https://wvpnpr-t7.myshopify.com
**Verdict (automated QA)**: **CONDITIONAL GO** — see MOBILE_QA_REPORT.md §4 for conditions.

---

## 1. Pre-event gates (complete before handing the site to reps)

- [x] **G1 — A1 settings fix: DONE & VERIFIED (2026-11-03)** — BYW `default_product` = `calder-clm-01-6x135-p30-87-1mm-gloss-black-lip-black-bolts-wheels` (universal CLM-01 variant). Live-verified @375: 0 page errors, 0 broken swatches, preview center layer loads + swaps on finish change. Manual script step 5 now passes.
- [ ] **G2 — Demo scope agreed**: universal PDP configurator is the primary flow; BYW is now also demo-safe (G1 done).
- [ ] **G3 — A2 mobile menu (BLOCKED — needs 5-min admin action)**: Online Store → Navigation → add menu handle `mobile-menu` with Fitment / Wheels / Build Your Wheel / Wheel Gallery / Vehicle Gallery / Contact / Find a Dealer → then set Theme Settings → “Only Mobile Navigation” in the theme editor (or ask the agent to push `config/settings_data.json` `menu_mobile: "mobile-menu"`). Until done: navigate from homepage CTAs, not the drawer. (Probe evidence: only `main-menu` + `footer` menus exist; `footer` links are placeholders.)
- [ ] **G4 — Known-issue brief for reps**: collections/PDP have slight horizontal play on phones (P1-V1/V2, fix pending approval); navigate portrait, scroll vertically.
- [ ] **G5 — No theme pushes within 24 h of the event** without a full regression pass (`npm test`, smoke + functional suites, `node lib/diff-baselines.mjs`).
- [ ] **G6 — Test data**: no test orders/items left in admin (QA cleared its session carts; nothing was checked out).
- [ ] **G7 — Network fallback**: reps use cellular data if venue Wi-Fi throttles (store rate-limits bursts; see PERFORMANCE_RESULTS §5).

## 2. GO / NO-GO reference

| Verdict | Condition |
|---------|-----------|
| **GO** | Zero P0/P1 defects in the critical demonstration flows |
| **CONDITIONAL GO** ← current | P1s exist but are mitigated by settings fixes + demo guidance (this checklist) |
| **NO-GO** | Any P0 (flow cannot complete), or G1 fails verification with BYW in the demo scope |

Current P1 ledger: P1-V1 (collections horizontal scroll), P1-V2 (PDP recs overflow, phones + iPad landscape), P1-V3/F-T3 (BYW broken imagery — fixed by G1), F-T1 (mobile drawer menu sparse — fixed by G3), F-T2 (over-quantity gate bypass — not reachable at demo qty 1; post-event).

## 3. Manual real-device script — ~5 minutes (run on ≥1 iPhone + ≥1 iPad)

Do this exactly as a rep would, on the device they’ll carry:

1. **Homepage (30 s)** — load the site. Hero renders? No sideways wiggle when you swipe left/right? Tap the burger (☰) — menu opens? *(Known: menu is sparse until G3 — navigate from homepage cards instead.)*
2. **Fitment finder (45 s)** — homepage → Fitment. Pick Make → Model → Year, submit. Do you get wheels back? Tap one.
3. **Universal configurator (90 s)** — on any CLM wheel page: tap **Barrel → Polished** — the preview lip changes to polished. Tap **Center → Black Titanium** — the center disk changes color. Tap **Bolts → Black** — bolt heads change. Does the big wheel image always show center + lip + bolts? (No gaps, no broken-image icons?)
4. **Add to cart (45 s)** — set qty 1, tap Add to Cart. Cart count increases? Open cart — correct wheel, correct price? **Remove it. Do NOT check out.**
5. **Build Your Wheel (60 s)** — homepage → Build Your Wheel. Check: all three finish swatches show photos (not broken icons)? The preview wheel shows a full wheel (center disk visible)? Change a finish — preview updates?
   *(A1 applied & verified 2026-11-03 — this step should now PASS. If it fails, fall back to demoing the universal PDP instead.)*
6. **Galleries (30 s)** — Wheel Gallery and Vehicle Gallery from the homepage: images load, tap a build/design → detail opens.
7. **Rotate to landscape (30 s)** — on the configurator page, rotate the phone/iPad. Page still usable? *(Known: slight sideways play near the bottom on iPad landscape — P1-V2.)*
8. **Sanity (10 s)** — refresh the homepage on **cellular** (not venue Wi-Fi). Loads fine?

**Pass criteria**: steps 1–4 + 6–8 clean = **GO for the demo scope** (universal PDP primary). Step 5 clean requires G1; if it fails, keep BYW out of the demo.

## 4. If something breaks mid-demo (rep fallbacks)

| Symptom | Fallback |
|---------|----------|
| BYW looks broken | Demo the universal PDP configurator (same features, verified green) |
| Menu drawer useless | Homepage CTAs reach every route |
| Page won’t load (venue Wi-Fi) | Switch device to cellular — rate limiter is per-IP |
| Collections feel “scroll-happy” | Scroll vertically only; the grid is fully usable |

## 5. Post-event (deferred backlog, in priority order)

1. B2 collection-card mobile layout fix (P1-V1)
2. B3 recs-grid `minmax(0,1fr)` (P1-V2)
3. B4 qty-aware click gate in `calder-universal-cta.js` (F-T2)
4. B1 BYW EmptyDrop guard (hardening behind A1)
5. WOFF2 fonts, self-hosted Ionicons, WebP/AVIF photography, remove BYW external dev API (P3-V7/V8, performance §4)