#!/usr/bin/node
/**
 * Baseline regression diff — compares a fresh screenshot run against the
 * committed baseline set. Pixel-level diff via pngjs; flags files whose
 * pixels differ by more than DIFF_THRESHOLD (0.5% of pixels).
 * Usage:
 *   node lib/diff-baselines.mjs            # compare screenshots/ vs screenshots-baseline/
 *   node lib/promote-baselines.mjs         # copy current screenshots/ to screenshots-baseline/ (manual approval step)
 */
import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';

const ROOT = path.resolve('.');
const CURRENT = path.join(ROOT, 'screenshots');
const BASELINE = path.join(ROOT, 'screenshots-baseline');
const DIFF_THRESHOLD_PX = 0.005; // 0.5% of pixels

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, acc);
    else if (entry.name.endsWith('.png')) acc.push(p);
  }
  return acc;
}

function pixelDiff(a, b) {
  const A = PNG.sync.read(fs.readFileSync(a));
  const B = PNG.sync.read(fs.readFileSync(b));
  if (A.width !== B.width || A.height !== B.height) {
    return { changed: 1, dimensionMismatch: true, pct: 1 };
  }
  const total = A.width * A.height;
  let diff = 0;
  for (let i = 0; i < A.data.length; i += 4) {
    if (Math.abs(A.data[i] - B.data[i]) > 12 ||
        Math.abs(A.data[i + 1] - B.data[i + 1]) > 12 ||
        Math.abs(A.data[i + 2] - B.data[i + 2]) > 12 ||
        A.data[i + 3] !== B.data[i + 3]) diff++;
    if (diff > total * DIFF_THRESHOLD_PX) break;
  }
  return { changed: diff / total, dimensionMismatch: false, pct: diff / total };
}

if (!fs.existsSync(BASELINE)) {
  console.error('No baseline directory yet. Run `node lib/promote-baselines.mjs` after human review of current screenshots.');
  process.exit(2);
}

const current = walk(CURRENT).map((p) => path.relative(CURRENT, p));
const baseline = new Set(walk(BASELINE).map((p) => path.relative(BASELINE, p)));

let regressions = 0, missing = 0, added = 0;
const report = { changed: [], missing: [], added: [], same: 0 };

for (const rel of current) {
  if (!baseline.has(rel)) { report.added.push(rel); added++; continue; }
  const d = pixelDiff(path.join(CURRENT, rel), path.join(BASELINE, rel));
  if (d.changed > DIFF_THRESHOLD_PX) { report.changed.push({ file: rel, pct: +(d.pct * 100).toFixed(3), dimensionMismatch: d.dimensionMismatch }); regressions++; }
  else report.same++;
}
for (const rel of baseline) {
  if (!current.includes(rel)) { report.missing.push(rel); missing++; }
}

fs.writeFileSync(path.join(ROOT, 'artifacts', 'baseline-diff.json'), JSON.stringify(report, null, 2));
console.log(`unchanged: ${report.same} | changed: ${regressions} | new: ${added} | missing: ${missing}`);
if (report.changed.length) console.log('CHANGED (needs human review — never auto-approve):');
for (const c of report.changed.slice(0, 30)) console.log(`  ${c.pct}%  ${c.file}${c.dimensionMismatch ? '  [DIMENSION MISMATCH]' : ''}`);
process.exit(regressions > 0 ? 1 : 0);
