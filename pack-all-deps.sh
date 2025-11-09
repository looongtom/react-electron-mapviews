#!/bin/bash
set -euo pipefail

mkdir -p npm-tarballs

# Find all unique package.json files in node_modules (excluding .bin)
find node_modules -type f -name package.json ! -path "*/.bin/*" | while read -r pkg_json; do
  pkg_dir=$(dirname "$pkg_json")
  pkg_name=$(node -p "require('$pkg_json').name")
  pkg_version=$(node -p "require('$pkg_json').version")

  echo "Packing $pkg_name@$pkg_version from $pkg_dir"

  (
    cd "$pkg_dir"
    npm pack > /dev/null
    tgz_file=$(ls *.tgz | head -n 1)
    mv "$tgz_file" "$OLDPWD/npm-tarballs/"
  )
done

echo "✅ All tarballs are in npm-tarballs/"
