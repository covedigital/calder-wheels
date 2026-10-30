#!/usr/bin/env python3
"""
Push Calder product metafields (bom + hardware_rivet_finish_options) to Shopify
via the Admin API, creating the metafield definitions first if missing.

Reads: docs/design/mockups/product imports/products_import_metafields_10-27-2026.csv
       (handle, namespace, key, value)

Env required:
  SHOPIFY_SHOP         e.g. calder-dev.myshopify.com
  SHOPIFY_ADMIN_TOKEN  Admin API token (custom app)

Usage:
  SHOPIFY_SHOP=... SHOPIFY_ADMIN_TOKEN=... \
    python3 scripts/push_calder_metafields.py
  python3 scripts/push_calder_metafields.py --file /path/to/file.csv --dry-run
"""

import csv
import json
import os
import sys
import time
import urllib.request
import urllib.error
from pathlib import Path

DEFAULT = Path(__file__).resolve().parent.parent / "docs" / "design" / "mockups" / "product imports" / "products_import_metafields_10-27-2026.csv"
API_VERSION = "2024-10"

DEFINITIONS = [
    {"key": "bom", "name": "Bill of Materials", "namespace": "custom", "ownerType": "PRODUCT", "type": "json",
     "access": {"admin": "MERCHANT_READ_WRITE", "storefront": "PUBLIC_READ"}},
    {"key": "hardware_rivet_finish_options", "name": "Hardware & Rivet Finish Options", "namespace": "custom", "ownerType": "PRODUCT", "type": "single_line_text_field",
     "access": {"admin": "MERCHANT_READ_WRITE", "storefront": "PUBLIC_READ"}},
]


def gql(shop, token, query, variables):
    body = json.dumps({"query": query, "variables": variables or {}}).encode()
    req = urllib.request.Request(
        "https://{}/admin/api/{}/graphql.json".format(shop, API_VERSION),
        data=body,
        headers={"Content-Type": "application/json", "X-Shopify-Access-Token": token},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=60) as resp:
        return json.loads(resp.read().decode())


def rest(shop, token, path):
    req = urllib.request.Request(
        "https://{}/admin/api/{}/{}".format(shop, API_VERSION, path),
        headers={"X-Shopify-Access-Token": token},
    )
    with urllib.request.urlopen(req, timeout=60) as resp:
        return json.loads(resp.read().decode())


def ensure_definitions(shop, token):
    defs = []
    for d in DEFINITIONS:
        defs.append({"definition": {"key": d["key"], "name": d["name"], "namespace": d["namespace"],
                                    "ownerType": d["ownerType"], "type": d["type"], "access": d["access"]}})
    out = gql(shop, token,
        "mutation createDefinitions($definitions: [MetafieldDefinitionInput!]!) {"
        "  metafieldDefinitionsCreate(definitions: $definitions) {"
        "    createdDefinitions { id key namespace type }"
        "    userErrors { field message }"
        "  }"
        "}",
        {"definitions": defs})
    errs = out.get("data", {}).get("metafieldDefinitionsCreate", {}).get("userErrors", [])
    return errs


def all_products(shop, token):
    handle_to_id = {}
    cursor = None
    while True:
        q = ("{ products(first: 250%s) { edges { node { id handle } } "
             "pageInfo { hasNextPage endCursor } } }" % (" after: \"%s\"" % cursor if cursor else ""))
        data = gql(shop, token, q, {})
        pd = data.get("data", {}).get("products", {})
        for e in pd.get("edges", []):
            handle_to_id[e["node"]["handle"]] = e["node"]["id"]
        if not pd.get("pageInfo", {}).get("hasNextPage"):
            break
        cursor = pd["pageInfo"]["endCursor"]
    return handle_to_id


def normalize(handle):
    s = handle.strip().lower()
    return "-".join(part for part in s.replace(".", "-").split("-") if part)


def push(shop, token, records):
    handle_to_id = all_products(shop, token)
    grouped = {}
    for rec in records:
        grouped.setdefault(rec[0], []).append(rec)

    total, ok, failed = 0, 0, 0
    for handle, items in grouped.items():
        gid = handle_to_id.get(handle) or handle_to_id.get(normalize(handle))
        if not gid:
            print("MISS  {} (no product for handle)".format(handle))
            failed += 1
            continue
        pid = gid.rsplit("/", 1)[-1]
        fields = {}
        for _, ns, key, value in items:
            fields[(ns, key)] = value
        metafields = [
            {"ownerId": gid, "namespace": "custom", "key": "bom",
             "type": "json", "value": fields[("custom", "bom")]},
            {"ownerId": gid, "namespace": "custom", "key": "hardware_rivet_finish_options",
             "type": "single_line_text_field", "value": fields[("custom", "hardware_rivet_finish_options")]},
        ]
        out = gql(shop, token,
            "mutation setMeta($metafields: [MetafieldsSetInput!]!) {"
            "  metafieldsSet(metafields: $metafields) {"
            "    metafields { id key namespace type }"
            "    userErrors { field message }"
            "  }"
            "}",
            {"metafields": metafields})
        errs = out.get("data", {}).get("metafieldsSet", {}).get("userErrors", [])
        total += 2
        if errs:
            failed += 1
            print("FAIL  {} -> {}".format(handle, "; ".join(e.get("message", "?") for e in errs)))
        else:
            ok += 2
            print("OK    {} (id {})".format(handle, pid))
        time.sleep(0.05)
    print("\nrecords: {} ok, {} failed".format(ok, failed))
    return ok, failed


def main():
    args = sys.argv[1:]
    src = DEFAULT
    dry = False
    if args and args[0] == "--file":
        src = Path(args[1])
        args = args[2:]
    if args and args[0] == "--dry-run":
        dry = True

    with open(src, newline="", encoding="utf-8-sig") as f:
        rows = list(csv.reader(f))
    records = [r for r in rows[1:] if r and r[0].strip()]

    shop = os.environ.get("SHOPIFY_SHOP", "").strip()
    token = os.environ.get("SHOPIFY_ADMIN_TOKEN", "").strip()
    if not dry and (not shop or not token):
        print("Set SHOPIFY_SHOP and SHOPIFY_ADMIN_TOKEN to run without --dry-run", file=sys.stderr)
        sys.exit(2)
    if not dry and not shop.endswith(".myshopify.com"):
        print("SHOPIFY_SHOP should look like calder-dev.myshopify.com", file=sys.stderr)

    print("source : {}".format(src))
    print("rows   : {}".format(len(records)))
    if dry:
        handles = sorted({r[0] for r in records})
        keys = sorted({r[2] for r in records})
        print("dry-run: {} products, keys {}, first handle {}".format(len(handles), keys, handles[0]))
        return 0

    errs = ensure_definitions(shop, token)
    if errs:
        print("definition create userErrors (usually 'already exists' = fine):")
        for e in errs:
            print("  ", e.get("field"), e.get("message"))
    print("definitions ensured: bom [json], hardware_rivet_finish_options [single_line_text_field]")

    ok, failed = push(shop, token, records)
    sys.exit(1 if failed else 0)


if __name__ == "__main__":
    main()