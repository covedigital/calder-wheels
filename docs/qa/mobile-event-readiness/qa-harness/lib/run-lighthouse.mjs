#!/usr/bin/node
/**
 * Mobile Lighthouse pass — runs against the LIVE storefront with system Chrome
 * (Playwright's mac12 Chromium 130 is older; system Chrome 150 gives current metrics).
 * Throttling: Lighthouse default mobile emulation (Moto G Power class, slow 4G).
 * Results -> artifacts/lighthouse/<route>.json + summary printed.
 */
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const BASE = process.env.QA_BASE_URL || 'https://wvpnpr-t7.myshopify.com';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const TARGETS = [
  ['home', '/'],
  ['pdp-clm-01', '/products/calder-clm-01-wheel'],
  ['fitment', '/pages/fitment'],
  ['collection', '/collections/wheels'],
];
const OUT = path.resolve('artifacts/lighthouse');
fs.mkdirSync(OUT, { recursive: true });

console.log('Pacing 20s between runs to respect store rate limits…');
const summary = [];
let first = true;
for (const [key, route] of TARGETS) {
  if (!first) await new Promise((r) => setTimeout(r, 20000));
  first = false;
  const out = path.join(OUT, `${key}.json`);
  try {
    execSync(
      `npx lighthouse "${BASE}${route}" --output=json --output-path="${out}" --chrome-flags="--headless=new --no-sandbox" --chrome-path="${CHROME}" --only-categories=performance,accessibility,best-practices --quiet`,
      { stdio: 'pipe', timeout: 180_000 }
    );
    const j = JSON.parse(fs.readFileSync(out, 'utf8'));
    const cats = j.categories;
    const audits = j.audits || {};
    summary.push({
      route: key,
      perf: Math.round((cats.performance?.score || 0) * 100),
      a11y: Math.round((cats.accessibility?.score || 0) * 100),
      bp: Math.round((cats['best-practices']?.score || 0) * 100),
      metrics: {
        FCP: audits['first-contentful-paint']?.displayValue || '-',
        LCP: audits['largest-contentful-paint']?.displayValue || '-',
        TBT: audits['total-blocking-time']?.displayValue || '-',
        CLS: audits['cumulative-layout-shift']?.displayValue || '-',
        SI: audits['speed-index']?.displayValue || '-',
      },
    });
    console.log(`${key}: perf=${summary.at(-1).perf} fcp=${summary.at(-1).metrics.FCP} lcp=${summary.at(-1).metrics.LCP} cls=${summary.at(-1).metrics.CLS}`);
  } catch (e) {
    console.error(`${key}: FAILED — ${String(e.message).slice(0, 160)}`);
    summary.push({ route: key, error: String(e.message).slice(0, 200) });
  }
}
fs.writeFileSync(path.join(OUT, 'summary.json'), JSON.stringify(summary, null, 2));
console.log('summary written to artifacts/lighthouse/summary.json');
