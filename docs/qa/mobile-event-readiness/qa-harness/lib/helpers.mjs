// Shared helpers: rate-limit-aware navigation, diagnostics collection, layout audits.
import fs from 'node:fs';
import path from 'node:path';

export const BASE = process.env.QA_BASE_URL || 'https://wvpnpr-t7.myshopify.com';

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// The store returns a literal "local_rate_limited" body (HTTP 200/429) when throttled.
// gotoPaced retries with backoff so a burst of navigations does not poison the run.
export async function gotoPaced(page, url, opts = {}) {
  const maxAttempts = opts.maxAttempts ?? 4;
  let lastBody = '';
  for (let i = 0; i < maxAttempts; i++) {
    const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 });
    lastBody = await page.content().catch(() => '');
    const rateLimited =
      /local_rate_limited/.test(lastBody) || (resp && (resp.status() === 429 || resp.status() === 503));
    if (!rateLimited) {
      try {
        await page.waitForLoadState('networkidle', { timeout: 15_000 });
      } catch {
        /* long-polling/analytics keep the network busy; domcontentloaded is enough */
      }
      return resp;
    }
    await sleep(15000 + i * 10000); // 15s, 25s, 35s backoff
  }
  throw new Error(`Rate-limited after ${maxAttempts} attempts: ${url} (last body: ${lastBody.slice(0, 80)})`);
}

export async function makeContext(browser, device) {
  return browser.newContext({
    viewport: { width: device.width, height: device.height },
    deviceScaleFactor: device.dpr,
    isMobile: device.isMobile,
    hasTouch: device.hasTouch,
    userAgent: device.ua,
  });
}

// ---- Diagnostics ----
export function attachDiagnostics(page, sink) {
  page.on('console', (msg) => {
    if (msg.type() === 'error') sink.consoleErrors.push({ text: msg.text().slice(0, 500), location: msg.location()?.url?.slice(0, 300) });
  });
  page.on('pageerror', (err) => sink.pageErrors.push(String(err && err.message ? err.message : err).slice(0, 500)));
  page.on('requestfailed', (req) => {
    const failure = req.failure()?.errorText || '';
    // Ignore client-side aborts (navigation/timeout churn) — not theme defects.
    if (/ERR_ABORTED|NS_BINDING_ABORTED|Frame was detached/.test(failure)) return;
    sink.failedRequests.push({ url: req.url().slice(0, 300), failure });
  });
  page.on('response', (resp) => {
    if (resp.status() >= 400 && resp.url().startsWith(BASE)) {
      sink.httpErrors.push({ url: resp.url().slice(0, 300), status: resp.status() });
    }
  });
  return sink;
}

export const newSink = () => ({ consoleErrors: [], pageErrors: [], failedRequests: [], httpErrors: [] });

// ---- In-page audits ----
export const AUDIT_SCRIPT = () => {
  const vw = window.innerWidth;
  const out = {
    viewport: { width: vw, height: window.innerHeight },
    docWidth: Math.max(
      document.documentElement.scrollWidth,
      document.body ? document.body.scrollWidth : 0
    ),
    overflowingElements: [],
    brokenImages: [],
    aspectIssues: [],
    tinyTouchTargets: [],
    stickyElements: [],
  };
  if (out.docWidth > vw + 1) {
    const seen = new Set();
    for (const el of document.querySelectorAll('body *')) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) continue;
      if (r.right > vw + 2 || r.left < -2) {
        // Only leaf-ish culprits to keep signal high.
        const style = getComputedStyle(el);
        if (style.position === 'fixed' || style.position === 'sticky') continue;
        const kidsOverflow = Array.from(el.children || []).some((c) => {
          const cr = c.getBoundingClientRect();
          return cr.right > vw + 2 || cr.left < -2;
        });
        if (!kidsOverflow) {
          const key = el.tagName + '.' + String(el.className && el.className.baseVal !== undefined ? el.className.baseVal : el.className).slice(0, 80);
          if (!seen.has(key)) {
            seen.add(key);
            out.overflowingElements.push({
              tag: el.tagName.toLowerCase(),
              cls: key.split('.').slice(1).join('.').slice(0, 100),
              right: Math.round(r.right),
              left: Math.round(r.left),
              width: Math.round(r.width),
            });
            if (out.overflowingElements.length >= 12) break;
          }
        }
      }
    }
  }
  for (const img of document.images) {
    const r = img.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    if (img.complete && img.naturalWidth === 0 && img.src && !img.src.startsWith('data:')) {
      out.brokenImages.push({ src: img.currentSrc.slice(0, 200) });
    } else if (img.naturalWidth > 0) {
      const naturalRatio = img.naturalWidth / img.naturalHeight;
      const renderedRatio = r.width / r.height;
      if (Math.abs(naturalRatio - renderedRatio) / naturalRatio > 0.18 && !img.closest('[data-cfg-ignore-ratio]')) {
        out.aspectIssues.push({
          src: (img.currentSrc || img.src).slice(0, 200),
          natural: +naturalRatio.toFixed(3),
          rendered: +renderedRatio.toFixed(3),
          cls: String(img.className).slice(0, 80),
        });
      }
    }
  }
  const INTERACTIVE = 'a, button, select, input[type="text"], input[type="tel"], input[type="email"], input[type="number"], input[type="search"], input[type="submit"], [role="button"], [role="tab"], [role="option"], summary, label input';
  for (const el of document.querySelectorAll(INTERACTIVE)) {
    const style = getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden' || style.pointerEvents === 'none') continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    // effective tap area: use padding-box-ish via min of rect and its parent's rect
    if (r.width < 24 || r.height < 24) {
      out.tinyTouchTargets.push({
        tag: el.tagName.toLowerCase(),
        cls: String(el.className).slice(0, 60),
        text: (el.textContent || '').trim().slice(0, 40),
        w: Math.round(r.width),
        h: Math.round(r.height),
      });
      if (out.tinyTouchTargets.length >= 25) break;
    }
  }
  for (const el of document.querySelectorAll('body *')) {
    const style = getComputedStyle(el);
    if (style.position === 'fixed' || (style.position === 'sticky' && style.display !== 'none')) {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) {
        out.stickyElements.push({
          tag: el.tagName.toLowerCase(),
          cls: String(el.className).slice(0, 60),
          id: el.id || '',
          pos: style.position,
          rect: { top: Math.round(r.top), left: Math.round(r.left), w: Math.round(r.width), h: Math.round(r.height) },
        });
      }
    }
  }
  out.stickyElements = out.stickyElements.slice(0, 20);
  return out;
};

// Scroll through the page to trigger lazy-loaded media, then settle for fullPage screenshots.
export async function scrollThrough(page, { maxSteps = 24, stepDelay = 250 } = {}) {
  await page.evaluate(async ({ maxSteps, stepDelay }) => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    let last = -1;
    for (let i = 0; i < maxSteps; i++) {
      window.scrollBy(0, Math.round(window.innerHeight * 0.85));
      await sleep(stepDelay);
      const y = Math.round(window.scrollY);
      const atBottom = y + window.innerHeight >= document.documentElement.scrollHeight - 4;
      if (y === last && atBottom) break;
      last = y;
      if (atBottom) break;
    }
    window.scrollTo(0, 0);
    await sleep(300);
  }, { maxSteps, stepDelay });
}

export function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
  return p;
}

export const shotDir = (engine, deviceKey) =>
  ensureDir(path.resolve('screenshots', engine, deviceKey));

export function saveJson(file, data) {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// Classify console/network errors as theme vs third-party.
const THIRD_PARTY_HINTS = [
  /shopify\.com\/(?:ping|monorail|web-pixels|performance)/i,
  /connect\.facebook|facebook\.net|fbq\(/i,
  /google-analytics|googletagmanager|gtag\(/i,
  /hotjar|clarity\.ms|bing\.com/i,
  /doubleclick|googlesyndication/i,
  /klaviyo|attentive|omnisend/i,
  /judge\.me|loox|yotpo/i,
  // Lumia theme-family author telemetry (big-skins.com / infoportions / gizmotrims):
  /big-skins\.com|infoportions|gizmotrims/i,
];
export function classifyError(textOrUrl) {
  return THIRD_PARTY_HINTS.some((re) => re.test(textOrUrl)) ? 'third-party' : 'theme';
}

export const pad = (n) => String(n).padStart(2, '0');
