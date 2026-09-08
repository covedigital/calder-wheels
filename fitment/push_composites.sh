#!/usr/bin/env bash
# Calder Wheels — Push composite PNGs to Shopify theme without a full sync.
#
# Usage:
#   SHOPIFY_STORE="my-store.myshopify.com" ./push_composites.sh
#   ./push_composites.sh --dry-run
#
# Requires:
#   - Shopify CLI (shopify) authenticated
#   - Local flattened composites in shopify/assets/composites-flat/
#
# Steps:
#   1. Pull the live theme locally (skipped if already present).
#   2. Copy flattened PNGs into the theme's assets/ directory.
#   3. Push ONLY the PNGs (--only + --nodelete) — no full theme sync/reload.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

STORE="${SHOPIFY_STORE:-}"
DRY_RUN=""
COMPOSITES_DIR="${SCRIPT_DIR}/../shopify/assets/composites-flat"
THEME_DIR="${REPO_ROOT}/theme"

usage() {
  cat <<'EOF'
Usage: SHOPIFY_STORE="your-store.myshopify.com" ./push_composites.sh [--dry-run] [--theme-dir PATH]
EOF
}

# Environment parsing: allow both env var and flags
while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run)
      DRY_RUN="1"
      shift
      ;;
    --theme-dir)
      THEME_DIR="$2"
      shift 2
      ;;
    --theme-dir=*)
      THEME_DIR="${1#*=}"
      shift
      ;;
    --store)
      STORE="$2"
      shift 2
      ;;
    --store=*)
      STORE="${1#*=}"
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      usage
      exit 1
      ;;
  esac
done

if [[ -z "${STORE}" ]]; then
  echo "Error: SHOPIFY_STORE not set. Provide via env var or --store."
  usage
  exit 1
fi

echo "Store:        ${STORE}"
echo "Composites:   ${COMPOSITES_DIR}"
echo "Theme dir:    ${THEME_DIR}"
echo "Mode:         $([[ -n "${DRY_RUN}" ]] && echo "DRY RUN" || echo "PUSH")"
echo

# 1. Ensure the theme directory exists locally.
if [[ ! -d "${THEME_DIR}" ]]; then
  if [[ -n "${DRY_RUN}" ]]; then
    echo "[dry-run] Would pull theme from ${STORE} into ${THEME_DIR}"
  else
    echo "Pulling theme from ${STORE}..."
    mkdir -p "${THEME_DIR}"
    shopify theme pull --store="${STORE}" -n
  fi
fi

if [[ ! -d "${COMPOSITES_DIR}" ]]; then
  echo "Error: composites directory not found at ${COMPOSITES_DIR}"
  echo "Run: python3 fitment/flatten_composites.py"
  exit 1
fi

# 2. Copy flattened PNGs into the theme's assets/.
ASSETS_DIR="${THEME_DIR}/assets"
mkdir -p "${ASSETS_DIR}"

png_files=("${COMPOSITES_DIR}"/*.png)
if [[ ! -e "${png_files[0]}" ]]; then
  echo "Error: no PNGs found in ${COMPOSITES_DIR}"
  exit 1
fi

echo "Copying $(ls "${COMPOSITES_DIR}"/*.png | wc -l | tr -d ' ') PNGs..."
if [[ -n "${DRY_RUN}" ]]; then
  for f in "${COMPOSITES_DIR}"/*.png; do
    echo "  [dry-run] would copy: $(basename "$f")"
  done
else
  cp "${COMPOSITES_DIR}"/*.png "${ASSETS_DIR}/"
fi

# 3. Push only the PNGs.
PUSH_ARGS=(--only="assets/*.png" --nodelete --store="${STORE}")
if [[ -n "${DRY_RUN}" ]]; then
  echo
  echo "[dry-run] Would run:"
  echo "  cd ${THEME_DIR} && shopify theme push ${PUSH_ARGS[*]}"
  echo "Done (dry run). No files pushed."
  exit 0
fi

echo
echo "Pushing PNGs to ${STORE} (--only assets/*.png --nodelete)..."
cd "${THEME_DIR}"
shopify theme push "${PUSH_ARGS[@]}"
echo
echo "Done. Composites available at:"
echo "  {{ 'design-201-center-bk.png' | asset_url }}"
echo "  ..."