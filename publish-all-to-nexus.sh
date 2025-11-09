#!/bin/bash
set -euo pipefail

NEXUS_REPO_URL="http://localhost:8081/repository/nexus-postboard-client/"
NODE_MODULES_PATH="./node_modules"
LOG_FILE="publish-errors.log"

# Clear previous log file
: > "$LOG_FILE"

echo "=== Attempting to publish all node_modules to Nexus ==="

find "$NODE_MODULES_PATH" -type f -name package.json ! -path "*/.bin/*" | while read -r pkg_json; do
  pkg_dir=$(dirname "$pkg_json")
  
  # Validate JSON before parsing
  if ! node -e "JSON.parse(require('fs').readFileSync('$pkg_json', 'utf8'))" 2>/dev/null; then
    echo "⏭️  Skipping package with malformed JSON: $pkg_json"
    continue
  fi
  
  pkg_name=$(node -p "require('$pkg_json').name")
  pkg_version=$(node -p "require('$pkg_json').version")
  is_private=$(node -p "Boolean(require('$pkg_json').private)")

  if [[ "$pkg_name" == "undefined" || "$pkg_version" == "undefined" ]]; then
    echo "⏭️  Skipping package with undefined name/version: $pkg_name@$pkg_version"
    continue
  fi

  if [[ "$is_private" == "true" ]]; then
    echo "⏭️  Skipping private package $pkg_name@$pkg_version"
    continue
  fi

  (
    cd "$pkg_dir"

    if ! npm_config_ignore_scripts=true npm pack > /dev/null; then
      echo "⚠️ Pack failed for $pkg_name@$pkg_version (logged)"
      echo "$pkg_name@$pkg_version" >> "$OLDPWD/$LOG_FILE"
      exit 0
    fi

    tgz_file=$(ls *.tgz 2>/dev/null | head -n 1)
    if [[ -z "$tgz_file" ]]; then
      echo "⚠️ No tarball produced for $pkg_name@$pkg_version (logged)"
      echo "$pkg_name@$pkg_version" >> "$OLDPWD/$LOG_FILE"
      exit 0
    fi

    echo "🚀 Publishing $tgz_file to Nexus..."
    if ! npm_config_ignore_scripts=true npm publish "$tgz_file" --registry="$NEXUS_REPO_URL" --access public; then
      echo "$pkg_name@$pkg_version" >> "$OLDPWD/$LOG_FILE"
      echo "⚠️ Failed to publish $pkg_name@$pkg_version (logged)"
    fi
    rm -f "$tgz_file" || true
  )
done

echo "✅ Done. See $LOG_FILE for failed packages."