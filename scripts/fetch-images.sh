#!/bin/bash
# Fetch authentic imagery for the OLL website redesign via image-search CLI,
# capturing stdout JSON. Single-asset failure is non-fatal.
set -u
OUT=/home/z/my-project/scripts/imgsearch
mkdir -p "$OUT"

declare -A QUERIES=(
  [hero-church]="Church of Our Lady of Lourdes Singapore white gothic church exterior"
  [grotto]="Our Lady of Lourdes grotto Virgin Mary statue shrine candles"
  [interior]="gothic catholic church interior nave arches natural light"
  [stained-glass]="church stained glass window virgin mary blue"
  [liturgical]="catholic mass altar candles incense liturgy"
  [formation]="catholic bible study group reading scripture"
  [pastoral]="volunteers helping community charity hands"
  [community]="church community multicultural gathering people"
)

for name in "${!QUERIES[@]}"; do
  q="${QUERIES[$name]}"
  if [ -s "$OUT/$name.json" ]; then
    echo "[skip] $name"
  else
    echo "[search] $name ..."
    z-ai image-search -q "$q" --count 4 --gl us --no-rank > "$OUT/$name.json" 2>/dev/null || echo "[warn] failed: $name"
    echo "[saved] $name ($(wc -c < "$OUT/$name.json") bytes)"
  fi
done
echo done
