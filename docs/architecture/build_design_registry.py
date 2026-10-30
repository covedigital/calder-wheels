#!/usr/bin/env python3
"""Calder Wheels design registry generator.

Generates the normalized design registry (amendment 2026-10-28, section C) from:
  - docs/design/mockups/product imports/SUV Data Sheet revised 10-21-26.xlsx  (authoritative part data)
  - docs/design/mockups/product imports/products_import_10-27-2026.csv       (LIVE store catalog cross-reference)
  - SUV Data Sheet 'Fitment Guide' sheet                                      (vehicle groups)

Outputs (next to this script in docs/architecture/):
  - calder_design_registry.json
  - calder_part_catalog_912.csv

SKU scheme (verified against both sources):
  PN = {design}{dia:2d}{width:2d}{lug}{pattern}{bore}{offset}{center}{lip}{bolt}
  center: GB | BT | TT ;  lip digit: 1=Polished 2=Gloss Black ;  bolt digit: 1=Chrome 2=Black
  legacy variant SKU == part_number EXACTLY (verified against the live store
  import - no -BLK/-CHR suffix exists in products_import_10-27-2026.csv).

2026-10-29 rebuild note: the previous build cross-referenced
products_export_10-27-2026.csv (retired catalog generation: vehicle-nickname
handles + '-BLK'/'-CHR' SKU suffixes). The live store was imported from
products_import_10-27-2026.csv (spec-based handles, bare PN SKUs), so every
legacy_ref 404'd at /products/{handle}.js and the universal PDP CTA could
never enable. All legacy_refs now bind to the live catalog and are
canonical_source='verified'.

Refresh ownership: re-run after any data sheet revision or store re-import.
Shopify product/variant IDs are intentionally NOT included - backfill from a
store export or Admin/API after import; never hardcode IDs.

Handle rule (2026-10-29 target scheme, PN-DERIVED): legacy product handles are
not authored free text - they are a pure function of the part_number, so the
handle and the SKU can never drift apart:

    {design-lower}-{pcd}-cb{bore*10}-et{offset:02d}-{lip gb|pl}-{bolt ch|bk}
    e.g. CLB0722105207232GB22 -> clb07-5x120-cb726-et32-gb-ch

Charset is [a-z0-9-] only (Shopify stores such handles verbatim - no
normalization surprises like the 72.6mm -> 72-6mm rewrite). Decimals are
encoded as integers (center bore 72.6mm -> cb726). Offsets use the industry
ET notation, zero-padded (+32mm -> et32, +03mm -> et03). Each legacy_ref also
carries expected_handle; the build emits calder_handle_migration.csv listing
every live handle that does not yet match its PN-derived target, so drift is
detected at BUILD time, never at checkout. Universal products keep
calder-{design}-wheel (customer-facing; do not rename).
"""
import csv, json, re, sys
from collections import defaultdict
from pathlib import Path

import openpyxl

HERE = Path(__file__).resolve().parent
IMPORTS = HERE.parent / 'design' / 'mockups' / 'product imports'
DATA_SHEET = IMPORTS / 'SUV Data Sheet revised 10-21-26.xlsx'
LIVE_IMPORT = IMPORTS / 'products_import_10-27-2026.csv'

DESIGNS = [
    ('CLM-01', '201', 'CLM01'), ('CLM-02', '202', 'CLM02'), ('CLM-03', '203', 'CLM03'),
    ('CLM-05', '205', 'CLM05'), ('CLB-06', '206', 'CLB06'), ('CLB-07', '207', 'CLB07'),
]
MSRP = {'CLM': {22: 1000.0, 24: 1200.0, 26: 1400.0}, 'CLB': {22: 1100.0, 24: 1300.0, 26: 1500.0}}
CENTER_LABEL = {'GB': 'Gloss Black', 'BT': 'Black Titanium', 'TT': 'Titanium Tint'}
CENTER_TOKEN = {'Gloss Black': 'gloss-black', 'Black Titanium': 'black-titanium', 'Titanium Tint': 'titanium-tint'}
CENTER_CSV = {'gloss-black': 'Gloss Black', 'black-titanium': 'Black Titanium', 'titanium-tint': 'Titanium Tint'}
LIP_LABEL = {1: 'Polished', 2: 'Gloss Black'}  # digit -> label (from verified SKU scheme)
BOLT_LABEL = {1: 'Chrome', 2: 'Black'}
LIP_TOKEN = {'Gloss Black': 'gloss-black', 'Polished': 'polished'}
BOLT_TOKEN = {'Chrome': 'chrome', 'Black': 'black'}
LIP_CODE = {'gloss-black': 'GBL', 'polished': 'POL'}
BOLT_CODE = {'chrome': 'CH', 'black': 'BK'}
LIPBOLT_SUFFIX = {(1, 1): 'polished-lip-chrome-bolts', (1, 2): 'polished-lip-black-bolts',
                  (2, 1): 'gloss-black-lip-chrome-bolts', (2, 2): 'gloss-black-lip-black-bolts'}
SHEETS = {'SUV Data GB Lip Ch Bolts': ('Gloss Black', 'Chrome'), 'SUV Data GB Lip BK Bolts': ('Gloss Black', 'Black'),
          'SUV Data Pol Lip Ch Bolts': ('Polished', 'Chrome'), 'SUV Data Pol Lip BK Bolts': ('Polished', 'Black')}
GROUP_LABEL = {
    (6, 139, '78.1', 25): 'GM SUV/Truck +25mm (Silverado 1500, Sierra 1500, Tahoe, Suburban, Yukon, Escalade - 2015-2026)',
    (6, 139, '78.1', 3): 'GM SUV/Truck +03mm (Silverado 1500, Sierra 1500, Tahoe, Suburban, Yukon, Escalade - 2015-2026)',
    (6, 135, '87.1', 30): 'Ford F-150/Expedition/Navigator +30mm (2003-2026)',
    (5, 130, '84.1', 25): 'Mercedes-Benz G-Wagon +25mm (2019-2026)',
    (5, 120, '72.6', 32): 'Range Rover Sport / SV L460 +32mm (2012-2026)',
    (6, 139, '106.1', 30): 'Lexus GX / Infiniti QX56/QX80 +30mm (2010-2026)',
}
BORE_BY_DIGITS = {'78': 78.1, '84': 84.1, '87': 87.1, '72': 72.6, '06': 106.1}

LIP2 = {'gloss-black': 'gb', 'polished': 'pl'}
BOLT2 = {'chrome': 'ch', 'black': 'bk'}


def pn_handle(p):
    """Target product handle, derived 1:1 from the part_number (2026-10-29 scheme).

    {design-lower}-{pcd}-cb{bore*10}-et{offset:02d}-{lip2}-{bolt2}
    e.g. CLB0722105207232GB22 -> clb07-5x120-cb726-et32-gb-ch
    Charset [a-z0-9-] only: Shopify stores it verbatim (no dot/underscore
    rewrites). One handle per legacy product grain (design, pcd, bore, offset,
    lip, bolt); the 9 diameter/center variants on the product share it."""
    return (f"{p['design'].lower()}-{p['lug']}x{p['pattern']}"
            f"-cb{int(round(p['bore'] * 10))}-et{p['offset']:02d}"
            f"-{LIP2[LIP_TOKEN[LIP_LABEL[p['lip_digit']]]]}"
            f"-{BOLT2[BOLT_TOKEN[BOLT_LABEL[p['bolt_digit']]]]}")


def shopify_handleize(handle):
    """Shopify's import handle normalization, verified against the live store
    (2026-10-29): the CSV Handle 'calder-clb-07-5x120-p32-72.6mm-...' imported
    as 'calder-clb-07-5x120-p32-72-6mm-...' - every dot became a hyphen.
    Rule: lowercase; collapse runs of non [a-z0-9] into one hyphen; trim edges."""
    h = re.sub(r'[^a-z0-9]+', '-', str(handle).lower()).strip('-')
    return h or handle


def decode_pn(pn):
    if len(pn) not in (20, 21) or not re.match(r'^CL[MB]\d{2}', pn) or not re.match(r'(GB|BT|TT)\d{2}$', pn[-4:]):
        return None
    tail = pn[12:-4]                      # bore digits + 2-digit offset
    if len(tail) not in (4, 5):
        return None
    bore_digits, offset_digits = tail[:-2], tail[-2:]
    if bore_digits not in BORE_BY_DIGITS:
        return None
    return {'design': pn[0:5], 'diameter': int(pn[5:7]), 'width': int(pn[7:9]),
            'lug': int(pn[9]), 'pattern': 100 + int(pn[10:12]),
            'bore': BORE_BY_DIGITS[bore_digits], 'offset': int(offset_digits),
            'center': pn[-4:-2], 'lip_digit': int(pn[-2]), 'bolt_digit': int(pn[-1])}


def group_id(d):
    return f"{d['lug']}x{d['pattern']}-{d['offset']:02d}mm-{d['bore']:g}"


def group_key_from_id(g):
    lugpat, off, bore = g.split('-')
    lug, pat = lugpat.split('x')
    return (int(lug), int(pat), bore.replace('mm', ''), int(off.replace('mm', '')))


def load_parts(wb):
    """Read all 4 sheets; validate decoded PN against row columns. Returns parts list."""
    parts, errors = [], []
    for sn, (lip_label, bolt_label) in SHEETS.items():
        ws = wb[sn]
        hdr = next(ws.iter_rows(values_only=True))
        for row in ws.iter_rows(min_row=2, values_only=True):
            if row[1] is None:
                continue
            r = dict(zip(hdr, row))
            pn = str(r['Part Number']).strip()
            d = decode_pn(pn)
            if not d:
                errors.append(f'undecodable PN {pn} in {sn}')
                continue
            lip_d = 2 if lip_label == 'Gloss Black' else 1
            bolt_d = 1 if bolt_label == 'Chrome' else 2
            ok = (CENTER_LABEL[d['center']] == str(r['Center Finish']).strip()
                  and d['lip_digit'] == lip_d and d['bolt_digit'] == bolt_d
                  and d['width'] == int(r['Width'])
                  and f"{d['lug']}X{d['pattern']}" == str(r['Bolt Pattern']).upper()
                  and d['offset'] == int(str(r['Offset']).strip('+mm '))
                  and abs(d['bore'] - float(r['Center Bore'])) < 0.05
                  and d['diameter'] == int(r['Diameter'])
                  and abs(float(r['MSRP']) - MSRP[d['design'][:3]][d['diameter']]) < 0.01)
            if not ok:
                errors.append(f'PN/column mismatch: {pn}')
                continue
            d['pn'], d['lip'], d['bolt'] = pn, lip_label, bolt_label
            d['msrp'] = float(r['MSRP'])
            d['bom'] = {k: r[v] for k, v in (('center_pn', 'Center Part Number'), ('barrel_pn', 'Barrel Part Number'),
                                             ('bolt_pn', 'Bolt Part Number'), ('cap_pn', 'Cap Part Number')) if r.get(v)}
            parts.append(d)
    return parts, errors


def main():
    wb = openpyxl.load_workbook(DATA_SHEET, data_only=True)
    parts, errors = load_parts(wb)
    if errors:
        print('VALIDATION ERRORS:', *errors[:20], sep='\n  ')
        sys.exit(1)

    # ---- live-store cross-reference index ---------------------------------
    # products_import_10-27-2026.csv is the LIVE store catalog (client-confirmed
    # 2026-10-29): 96 products, 864 unique variant SKUs, SKU == part_number.
    # Shopify normalizes handles at import (dots -> hyphens; verified live:
    # '...-p32-72.6mm-...' imported as '...-p32-72-6mm-...'), so handles from
    # the CSV are shopify_handleize()d to match what the store actually serves.
    legacy_variants = defaultdict(list)   # sku -> [(handle, o1, o2, o3)]
    legacy_import_errors = []
    with open(LIVE_IMPORT) as f:
        for r in csv.DictReader(f):
            if r['Handle'] and r['Variant SKU']:
                legacy_variants[r['Variant SKU'].strip()].append(
                    (shopify_handleize(r['Handle']), r['Option1 Value'], r['Option2 Value'], r['Option3 Value']))
    for sku, entries in legacy_variants.items():
        if len(entries) > 1:
            legacy_import_errors.append(f'live SKU {sku} appears on {len(entries)} variant rows')
        if not decode_pn(sku):
            legacy_import_errors.append(f'live SKU {sku} does not decode as a part number')
    if legacy_import_errors:
        print('LIVE IMPORT VALIDATION ERRORS:', *legacy_import_errors[:20], sep='\n  ')
        sys.exit(1)
    legacy_by_design_group = defaultdict(set)      # (design, group) -> {live handles}
    for sku, entries in legacy_variants.items():
        d = decode_pn(sku)
        if not d:
            continue
        for h, _o1, _o2, _o3 in entries:
            legacy_by_design_group[(d['design'], group_id(d))].add(h)

    # ---- build registry ----------------------------------------------------
    designs_out, flat_rows = [], []
    handle_migrations = set()   # (live handle, PN-derived target handle)
    for disp, number, code in DESIGNS:
        dp = [p for p in parts if p['design'] == code]
        groups = sorted({group_id(p) for p in dp}, key=group_key_from_id)
        diams = sorted({p['diameter'] for p in dp})
        centers = sorted({CENTER_TOKEN[CENTER_LABEL[p['center']]] for p in dp})
        combos = sorted({(LIP_TOKEN[LIP_LABEL[p['lip_digit']]], BOLT_TOKEN[BOLT_LABEL[p['bolt_digit']]]) for p in dp})
        configs = []
        center_code_by_token = {'gloss-black': 'GB', 'black-titanium': 'BT', 'titanium-tint': 'TT'}
        for dia in diams:
            for c in centers:
                for lip, bolt in combos:
                    uvs = f"CFG-{code}-{dia}-{center_code_by_token[c]}-{LIP_CODE[lip]}-{BOLT_CODE[bolt]}"
                    by_group = []
                    for g in groups:
                        hits = [p for p in dp if p['diameter'] == dia
                                and CENTER_TOKEN[CENTER_LABEL[p['center']]] == c
                                and LIP_TOKEN[LIP_LABEL[p['lip_digit']]] == lip
                                and BOLT_TOKEN[BOLT_LABEL[p['bolt_digit']]] == bolt
                                and group_id(p) == g]
                        if len(hits) > 1:
                            entry = {'group': g, 'part_numbers': sorted(x['pn'] for x in hits), 'state': 'ambiguous'}
                        elif not hits:
                            entry = {'group': g, 'part_number': None, 'msrp': MSRP[code[:3]][dia], 'bom': None,
                                     'legacy_refs': None, 'state': 'no_catalog_part'}
                        else:
                            p = hits[0]
                            # Live-store binding (verified 2026-10-29): the live catalog
                            # carries each part_number as a variant SKU exactly once.
                            # Bind ONLY on the exact PN, then verify the row really is
                            # this configuration (diameter option, center option, and the
                            # lip/bolt fragment + design slug embedded in the live handle).
                            suffix = LIPBOLT_SUFFIX[(p['lip_digit'], p['bolt_digit'])]
                            design_slug = disp.lower()          # e.g. 'clb-06' in calder-clb-06-...
                            expected = pn_handle(p)              # target PN-derived handle (see pn_handle docstring)
                            legacy_center_labels = {CENTER_LABEL[p['center']], {'BT': 'Black Tint'}.get(p['center'], CENTER_LABEL[p['center']])}
                            refs = []
                            for h, o1, o2, o3 in legacy_variants.get(p['pn'], []):
                                if o1 == f'{dia}"' and o2 in legacy_center_labels and suffix in h and design_slug in h:
                                    refs.append({'handle': h, 'sku': p['pn'], 'legacy_barrel_option': o3,
                                                 'canonical': True, 'canonical_source': 'verified',
                                                 'expected_handle': expected})
                                    handle_migrations.add((h, expected))
                            if len(refs) > 1:
                                entry = {'group': g, 'part_number': p['pn'], 'msrp': p['msrp'], 'bom': p['bom'],
                                         'legacy_refs': refs, 'state': 'ambiguous',
                                         'message': f'{len(refs)} live variants carry PN {p["pn"]}'}
                            else:
                                entry = {'group': g, 'part_number': p['pn'], 'msrp': p['msrp'],
                                         'bom': p['bom'], 'legacy_refs': refs or None,
                                         'state': 'mapped' if refs else ('no_legacy_product' if not legacy_by_design_group.get((code, g)) else 'legacy_bundle_without_variant')}
                            flat_rows.append({
                                'part_number': p['pn'], 'design': disp, 'design_number': number,
                                'diameter': dia, 'width': p['width'], 'bolt_pattern': f"{p['lug']}x{p['pattern']}",
                                'offset': f"+{p['offset']:02d}mm", 'center_bore': p['bore'],
                                'center': CENTER_LABEL[p['center']], 'center_token': c,
                                'barrel_lip': LIP_LABEL[p['lip_digit']], 'hardware': BOLT_LABEL[p['bolt_digit']] + ' bolts',
                                'group': g, 'group_label': GROUP_LABEL.get(group_key_from_id(g), ''),
                                'msrp': p['msrp'], 'center_pn': p['bom'].get('center_pn', ''),
                                'barrel_pn': p['bom'].get('barrel_pn', ''), 'bolt_pn': p['bom'].get('bolt_pn', ''),
                                'cap_pn': p['bom'].get('cap_pn', ''),
                                'universal_variant_sku': uvs,
                                'legacy_mapped': bool(refs)})
                        by_group.append(entry)
                    configs.append({'diameter': str(dia), 'center': c, 'barrel': lip, 'hardware': bolt,
                                    'universal_variant_sku': uvs, 'msrp': MSRP[code[:3]][dia], 'by_group': by_group})
        designs_out.append({
            'design_id': disp, 'design_number': number, 'legacy_design_code': code,
            'canonical_handle': 'calder-' + disp.lower() + '-wheel',
            'default_configuration': {'diameter': '22', 'center': 'gloss-black', 'barrel': 'gloss-black', 'hardware': 'chrome'},
            'title': f'Calder {disp}', 'series': 'SUV Wheel - Spun Forged', 'construction': 'Spun Forged',
            'width_in': 10, 'diameters': [str(x) for x in diams], 'centers': centers,
            'barrel_finishes': sorted({x[0] for x in combos}), 'hardware_finishes': sorted({x[1] for x in combos}),
            'msrp_by_diameter': {str(x): MSRP[code[:3]][x] for x in diams},
            'fitment_groups': [{'id': g, 'label': GROUP_LABEL.get(group_key_from_id(g), '')} for g in groups],
            'legacy_bundles': sorted({h for (dc, _), hs in legacy_by_design_group.items() if dc == code for h in hs}),
            'configurations': configs,
        })

    registry = {
        'version': 1, 'generated': '2026-10-29',
        'generator': 'docs/architecture/build_design_registry.py',
        'sources': ['SUV Data Sheet revised 10-21-26.xlsx (authoritative part data)',
                    'products_import_10-27-2026.csv (LIVE store catalog cross-reference, client-confirmed 2026-10-29)',
                    'SUV Data Sheet Fitment Guide sheet (vehicle groups)'],
        'option_tokens': {
            'diameter': ['22', '24', '26'],
            'center': {'gloss-black': 'Gloss Black', 'black-titanium': 'Black Titanium', 'titanium-tint': 'Titanium Tint'},
            'barrel': {'gloss-black': 'Gloss Black Lip', 'polished': 'Polished Lip'},
            'hardware': {'chrome': 'Chrome Bolts', 'black': 'Black Bolts'},
        },
        'url_contract': '/products/{canonical_handle}?diameter={22|24|26}&center={token}&barrel={token}&hardware={token}  (canonical_handle = calder-{design}-wheel, matching calder_universal_products_import_10-29-2026.csv)',
        'handle_scheme': {
            'legacy_products': '{design-lower}-{pcd}-cb{bore*10}-et{offset:02d}-{lip gb|pl}-{bolt ch|bk} — DERIVED from the part_number (CLB0722105207232GB22 -> clb07-5x120-cb726-et32-gb-ch); charset [a-z0-9-] only so Shopify stores it verbatim; every legacy_ref.expected_handle recomputes this rule and calder_handle_migration.csv lists live handles that have not been renamed to it yet.',
            'universal_products': 'calder-{design}-wheel (customer-facing design PDPs; do not rename).',
        },
        'sku_scheme': {
            'part_number': '{design}{dia:2d}{width:2d}{lug}{pattern}{bore}{offset:2d}{center GB|BT|TT}{lip 1|2}{bolt 1|2}',
            'lip_digit': {'1': 'Polished', '2': 'Gloss Black'}, 'bolt_digit': {'1': 'Chrome', '2': 'Black'},
            'universal_variant_sku': 'CFG-{design}{dia}{center GB|BT|TT}-{lip GBL|POL}-{bolt CH|BK}',
            'legacy_variant_sku': 'identical to part_number EXACTLY (live-store verified; no -BLK/-CHR suffix exists)',
            'legacy_handle_rule': 'Shopify import normalization applied: dots -> hyphens (verified live 2026-10-29: calder-clb-07-5x120-p32-72-6mm-...). Fallback-only in purchase resolution.'},
        'resolution_rule': 'PURCHASE LOOKUP IS SKU-FIRST (2026-10-29): the part_number variant SKU is the single purchase identifier. The theme resolver looks variants up by SKU alone via the Storefront API when calder_storefront_access_token is set; legacy_ref.handle is fallback-only (no token / SKU query failure) and must never be treated as authoritative. Full tuple (design, diameter, center, barrel, hardware) + vehicle fitment group -> exactly one part_number; zero parts = "Request Custom Configuration".',
        'shopify_ids': 'Intentionally excluded. Backfill product_id/variant_id from store export or Admin/API after the universal products import; never hardcode.',
        'default_configuration_note': 'Matches variant 1 of calder_universal_products_import_10-29-2026.csv (22" Gloss Black center, Gloss Black lip, Chrome bolts) for every design.',
        'open_items': [
            'Canonical legacy binding is VERIFIED against the live store import (2026-10-29): each live variant SKU equals its part_number exactly; handle lip/bolt fragment and product options are cross-checked per cell. canonical_source=verified, so resolver strict mode no longer blocks mapped cells.',
            'CLM-01 and CLM-05: no 26-inch parts exist in group 6x139-03mm-78.1 (all 12 combos) -> resolver must show Request Custom Configuration.',
            'CLM-01 and CLM-05: the whole 6x139-03mm-78.1 group (22"/24") exists in the data sheet but is NOT in the live store import (48 parts) -> resolver shows Request Custom Configuration (NO_SELLABLE_RECORD) until the client imports or approves those SKUs.',
            'Legacy center label uses "Black Tint"; revised data sheet says "Black Titanium" - token is black-titanium, display label needs client pick.',
            'Dealer tier pricing not yet supplied for universal products.',
            'Universal products images: none (no fabricated URLs).',
            'canonical_handle is calder-{design}-wheel (client-approved 2026-10-29): import calder_universal_products_import_10-29-2026.csv to make the six design PDPs live. Legacy product handles are internal sellable records and are FALLBACK-ONLY in purchase resolution (SKU-first via Storefront API once calder_storefront_access_token is set).',
        ],
        'designs': designs_out,
    }
    (HERE / 'calder_design_registry.json').write_text(json.dumps(registry, indent=1))
    with open(HERE / 'calder_part_catalog_912.csv', 'w', newline='') as f:
        w = csv.DictWriter(f, fieldnames=list(flat_rows[0].keys()))
        w.writeheader()
        w.writerows(flat_rows)
    with open(HERE / 'calder_handle_migration.csv', 'w', newline='') as f:
        w = csv.writer(f)
        w.writerow(['current_handle', 'pn_derived_handle'])
        for current, target in sorted(handle_migrations):
            w.writerow([current, target])

    states = defaultdict(int)
    for dsg in designs_out:
        for cfg in dsg['configurations']:
            for e in cfg['by_group']:
                states[e['state']] += 1
    print(f'parts: {len(flat_rows)} | designs: {len(designs_out)}')
    print('group-entry states:', dict(states))
    print(f'handle migrations pending (live handle != PN-derived): {len(handle_migrations)} of 96 products -> calder_handle_migration.csv')
    for dsg in designs_out:
        tot = sum(len(c['by_group']) for c in dsg['configurations'])
        nomap = sum(1 for c in dsg['configurations'] for e in c['by_group'] if e['state'] != 'mapped')
        print(f"  {dsg['design_id']}: groups={len(dsg['fitment_groups'])} configs={len(dsg['configurations'])} entries={tot} non_mapped={nomap}")


if __name__ == '__main__':
    main()
