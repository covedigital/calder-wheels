#!/usr/bin/env python3
"""
Calder Wheels — Center Bore metafield Matrixify import generator (2026-10-30).

Builds a Matrixify "Products" update file that sets the product metafield
custom.center_bore on every LIVE legacy Calder product, using the
authoritative center-bore values from the SUV Data Sheet (10-21-26)
via the generated design registry (docs/architecture/calder_design_registry.json,
which the registry builder validates against the sheet's Center Bore column).

Scope:
  - 96 live legacy spec-handle products (each encodes one bolt/bore/offset
    group, so one product = one center bore).
  - Universal calder-*-wheel products are INTENTIONALLY excluded: their
    center bore varies by selected fitment group and is rendered
    selection-aware on the PDP via the registry (not a fixed metafield).

Matrixify column contract (per Matrixify-Import-Demo-Products.xlsx template):
  Handle | Command=MERGE | Metafield: custom.center_bore [number_decimal]

If the store's center_bore metafield definition is NOT number_decimal,
regenerate with:  python3 build_center_bore_import.py --type single_line_text_field
"""
import argparse
import csv
import json
import sys
from pathlib import Path

import openpyxl

HERE = Path(__file__).parent
ARCH = HERE.parent.parent.parent / 'architecture'
REGISTRY = ARCH / 'calder_design_registry.json'
LIVE_IMPORT = HERE / 'products_import_10-27-2026.csv'
MIGRATION_CSV = ARCH / 'calder_handle_migration.csv'
OUT_XLSX = HERE / 'calder_center_bore_metafield_import_10-30-2026.xlsx'
OUT_CSV = HERE / 'calder_center_bore_metafield_import_10-30-2026.csv'


def bore_from_group(group_id: str) -> float:
    parts = group_id.split('-')
    if len(parts) != 3:
        raise ValueError(f'unexpected fitment group id: {group_id}')
    return float(parts[2])


def collect_rows():
    reg = json.loads(REGISTRY.read_text())
    by_handle = {}
    for design in reg['designs']:
        for cfg in design.get('configurations', []):
            for cell in cfg.get('by_group', []):
                if cell.get('state') != 'mapped' or not cell.get('part_number'):
                    continue
                bore = bore_from_group(cell['group'])
                for ref in cell.get('legacy_refs', []):
                    if not ref.get('canonical'):
                        continue
                    handle = ref['handle']
                    if handle in by_handle and abs(by_handle[handle] - bore) > 0.001:
                        raise SystemExit(
                            f'DATA ERROR: handle {handle} maps to two bores '
                            f'({by_handle[handle]} and {bore}) — refusing to import')
                    by_handle[handle] = bore
    return by_handle


def verify_against_live_store(by_handle):
    live = set()
    with open(LIVE_IMPORT, newline='') as f:
        for r in csv.DictReader(f):
            if r.get('Handle') and r.get('Variant SKU'):
                live.add(r['Handle'].strip().lower().replace('.', '-'))
    missing = sorted(set(by_handle) - live)
    if missing:
        raise SystemExit(f'DATA ERROR: registry handles not found in live import CSV: {missing[:5]}...')
    with open(MIGRATION_CSV, newline='') as f:
        migration_handles = {row['current_handle'] for row in csv.DictReader(f)}
    extra = sorted(set(by_handle) - migration_handles)
    print(f'live-store check OK ({len(by_handle)} products match the {len(migration_handles)}-product migration CSV set)')
    if extra:
        print(f'  note: {len(extra)} handles outside migration set: {extra[:3]}')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--type', default='number_decimal',
                    help='Matrixify metafield type (must match the store definition)')
    args = ap.parse_args()

    by_handle = collect_rows()
    print(f'collected {len(by_handle)} live products with center bores '
          f'({min(by_handle.values())}–{max(by_handle.values())}mm)')
    verify_against_live_store(by_handle)

    col_meta = f'Metafield: custom.center_bore [{args.type}]'
    header = ['Handle', 'Command', col_meta]
    rows = sorted((h, 'MERGE', b) for h, b in by_handle.items())

    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = 'Products'
    ws.append(header)
    for row in rows:
        ws.append(list(row))
    wb.save(OUT_XLSX)

    with open(OUT_CSV, 'w', newline='') as f:
        w = csv.writer(f)
        w.writerow(header)
        w.writerows(rows)

    print(f'wrote {OUT_XLSX.name} and {OUT_CSV.name} ({len(rows)} rows, Command=MERGE)')
    bores = {}
    for _, _, b in rows:
        bores[b] = bores.get(b, 0) + 1
    print('bore distribution:', dict(sorted(bores.items())))


if __name__ == '__main__':
    sys.exit(main())
