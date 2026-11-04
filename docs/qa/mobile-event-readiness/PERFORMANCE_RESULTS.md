# Calder Wheels — Mobile Performance & Reliability Results (Pre-Event QA)

**Storefront**: https://wvpnpr-t7.myshopify.com · **Theme**: `calder-theme` (live, t/6)
**Artifacts**: `qa-harness/artifacts/perf-throttled.json`, `qa-harness/artifacts/lighthouse/summary.json`, `qa-harness/artifacts/{smoke-375,layout-audit,visual-audit-*}.json`

Conditions: Playwright throttled-network pass (Slow-4G-class profile: 1.6 Mbps ↓ / 150 ms RTT via CDP) at 375/412 phone profiles, plus Lighthouse mobile (default Moto-G-class throttling, system Chrome 150).

---

## 1. Lighthouse mobile (simulated slow 4G)

| Route | Perf | FCP | LCP | TBT | CLS | SI |
|-------|------|-----|-----|-----|-----|----|
| Home | **54** | 2.7 s | 3.8 s | — | **0.002** | — |
| PDP (CLM-01) | **71** | 2.0 s | 3.0 s | — | **0** | — |
| Fitment | **76** | 2.1 s | 4.5 s | — | **0** | — |
| Collection | **56** | 2.3 s | 4.8 s | — | **0** | — |

**CLS is effectively zero everywhere** — no unexpected layout shift (good for demos). LCP 3–4.8 s under *simulated slow 4G*; on venue Wi-Fi expect roughly 2–4× faster. Scores 54–76 are typical for an unoptimized premium theme with heavy PNG photography — **not event-blocking**, but improvement levers are listed in §4.

## 2. Throttled Playwright pass (real network emulation)

| Route @ device | Wall-clock nav | TTFB | FCP | Resources | Transfer | Console err | Page err | Broken img |
|----------------|--------------|------|-----|-----------|----------|-------------|----------|------------|
| Home @375 | 16.7 s* | 585 ms | 863 ms | 202 | **1,434 KB** | 3 (noise) | 0 | 0 |
| PDP @375 | 17.0 s* | 167 ms | 466 ms | 248 | **3,624 KB** | 3 (noise) | 0 | 0 |
| Fitment @412 | 16.4 s* | 201 ms | 502 ms | 208 | **1,617 KB** | 2 (noise) | 0 | 0 |
| Collection @412 | 19.4 s* | 234 ms | 603 ms | 208 | 1,674 KB | 2 (noise) | 0 | 0 |

\* Wall-clock includes the harness’s rate-limit backoff (the store throttles bursts with literal `local_rate_limited` responses); TTFB/FCP are the true page timing.

**Reliability signals:**
- **Zero uncaught JS exceptions** on all four routes under throttle.
- **Zero broken first-party image requests** under throttle (the BYW 404s are a static defect, not load-related).
- Console errors on every route are the two known platform-noise items (see DEVICE_TEST_MATRIX): `big-skins.com` telemetry XHR (CORS-blocked) and the `sf_private_access_tokens` 401 probe. No theme-source console errors.
- Slowest requests are Shopify telemetry (`otlp-http-production.shopifysvc.com`, 1.5–2.4 s under throttle) — platform, ignorable.

## 3. Smoke pass (all 9 critical routes @375)

| Route | Status | Theme console err | Page err | Broken img |
|-------|--------|-------------------|----------|------------|
| home, collections/wheels, PDP ×2, fitment, wheel-gallery, vehicle-gallery, cart | 200 | 1 (401 noise) | 0 | 0 |
| build-your-wheel | 200 | 4 | **1 — `SyntaxError: Unexpected token ']'`** | **3 (center swatch 404s)** |

All routes serve real pages with titles; only BYW is defective (F-T3 / P1-V3).

## 4. Improvement levers (P3 — do **not** block the event)

1. **Page weight**: PDP transfers **3.6 MB** (248 resources); home 1.4 MB. Biggest contributors: hero/vehicle photography as **PNG at 380–420 KB each** (`F150-Raptor_1.png@645`, `Silverado-Black_1.png@645`, `Tahoe-M-2_1.png@645` …). Convert gallery/hero photography to WebP/AVIF (Shopify serves these automatically when source files are JPG/WebP) → 60–80 % byte cut.
2. **Fonts**: 562 KB of OTF/TTF (`Facundo-SemiBold`, `Garet` ×2, `Poppins` ×2). Convert to WOFF2 (deferred audit item P1-5).
3. **Ionicons from `esm.sh`** (theme.liquid:316) — third-party module CDN; self-host to remove venue-network dependency (deferred item P1-6).
4. DCL on collection is 4.0 s under throttle (248 resources) — consider lazy-loading below-fold card images (theme already lazy-loads most).

## 5. Rate limiting (test-infra note)

The storefront aggressively rate-limits request bursts (`local_rate_limited` body). This affected nothing user-visible at human demo pace (one navigation every few seconds), but the QA harness runs single-worker with 15–35 s backoffs. **Event tip**: if several reps hammer the site simultaneously from the same IP (venue Wi-Fi), throttling could appear — prefer the reps’ own phone connections for the demo if possible.