# Calder Wheels — Mobile & Tablet Device Test Matrix

**Storefront**: https://wvpnpr-t7.myshopify.com
**Theme under test**: `calder-theme` (live, ID `191023546677`, asset path `/cdn/shop/t/6/`)
**Verified**: local working theme (`docs/design/Shopify Themes/Working Theme-via-CLI/`) is byte-identical to the live theme on the 15 most-recently-modified files (configurator, fitment, design-nav, product-card, recommendations). The live published theme IS the intended preview theme.

---

## Emulation environment

| Item | Value |
|------|-------|
| Playwright | **1.48.2** — pinned; the latest line (1.64) does not ship macOS 12 browser builds |
| Chromium build | 130.0.6723.31 (Playwright mac12 build) |
| WebKit build | 18.0 (Playwright mac12 build, `webkit_mac12_special-2009`) |
| Host | macOS 12.7.6 (Intel) |
| System Chrome (Lighthouse only) | 150.0.7871.125 |

> **Emulation disclaimer (required by the brief):** browser emulation does **not** replace physical-device testing. Emulated WebKit is a close-but-not-identical approximation of iOS Safari: it cannot reproduce real touch latency, momentum scrolling, iOS zoom behavior around `<16px` inputs, safe-area insets, device rotation timing, or WebKit-on-device rendering differences (fonts, compositing, 100vh behavior). The automated matrix below de-risks the event but the **manual real-device script (EVENT_LAUNCH_CHECKLIST.md §6) remains mandatory** before the event.

## Viewport matrix

| # | Target width | Device profile | Viewport (CSS px) | DPR | Engine coverage |
|---|--------------|----------------|------------------|-----|-----------------|
| 1 | 320px narrow mobile | iPhone SE class | 320×568 | 2 | Chromium + WebKit |
| 2 | 360px Android | Galaxy S8 class | 360×740 | 3 | Chromium |
| 3 | 375px compact iPhone | iPhone 8 / SE2 class | 375×667 | 2 | Chromium + WebKit (primary functional width) |
| 4 | 393px standard iPhone | iPhone 14/15 class | 393×852 | 3 | Chromium + WebKit |
| 5 | 412px large Android | Pixel 7 class | 412×915 | 2.625 | Chromium |
| 6 | 768px small tablet | iPad Mini portrait | 768×1024 | 2 | Chromium + WebKit |
| 7 | 820px large tablet | iPad Air portrait | 820×1180 | 2 | Chromium |
| 8 | 1024px tablet landscape | iPad Mini landscape | 1024×768 | 2 | Chromium |
| 9 | 1180px large tablet landscape | iPad Air landscape | 1180×820 | 2 | Chromium + WebKit |

Notes:
- Playwright device **presets** were used where geometry matches (`iPhone SE`, `Galaxy S8`, `Pixel 7`, `iPad Mini`); other widths use custom contexts with mobile UA, `isMobile`, `hasTouch`, and the DPR listed above.
- Orientation transitions are exercised by resizing (portrait↔landscape pairs 768→1024 and 375→667). True rotation (accelerometer) is not emulatable — covered by the manual device script.
- Store rate limiting: the storefront returns literal `local_rate_limited` bodies under request bursts. The harness runs single-worker with paced navigation and exponential backoff (15/25/35 s). A 429 observed during testing is **infra throttling, not a site defect**.

## Route matrix (critical demonstration routes)

| Route key | Path | Purpose |
|-----------|------|---------|
| home | `/` | Homepage, nav, hero, ticker |
| collection-wheels | `/collections/wheels` | Product listing cards |
| pdp-clm-01 | `/products/calder-clm-01-wheel` | Universal configurator (design 201) |
| pdp-clm-06 | `/products/calder-clm-06-wheel` | Universal configurator (renamed CLM-06 — prior 404 risk area) |
| fitment | `/pages/fitment` | Vehicle fitment finder (guide) |
| wheel-gallery | `/pages/wheel-gallery` | Wheel gallery v2 |
| vehicle-gallery | `/pages/vehicle-gallery` | Vehicle gallery v2 |
| build-your-wheel | `/pages/build-your-wheel` | Build-Your-Wheel configurator page |
| cart | `/cart` | Cart page |

Full-page + above-the-fold screenshots are captured for every viewport×route cell on Chromium (81 cells) and a WebKit subset (5 viewports × 4 routes = 20 cells). Baselines live in `qa-harness/screenshots/` and are diffed with `lib/diff-baselines.mjs` (0.5 % pixel threshold) — **changed screenshots are never auto-approved**; promote manually via `lib/promote-baselines.mjs` after human review.

## Known platform noise (not defects)

| Signal | Seen on | Classification |
|--------|---------|-----------------|
| `POST /sf_private_access_tokens` → 401 | every route | Shopify storefront private-access framework probe — platform behavior |
| `big-skins.com/sales/…` XHR blocked (CORS) | every route | Lumia theme-family author telemetry (phone-home) — pre-existing third-party, harmless to storefront function |
| `local_rate_limited` body under bursts | any route | Store rate limiter — test-infra constraint |
