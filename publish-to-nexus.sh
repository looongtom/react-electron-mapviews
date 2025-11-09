#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

LOG_FILE="publish-errors.log"

# Clear previous log file
: > "$LOG_FILE"

NEXUS_REPO_URL="http://localhost:8081/repository/nexus-postboard-client/"
NODE_MODULES_PATH="./node_modules"

echo "=== Publish từng module trong node_modules lên Nexus ==="

find "${NODE_MODULES_PATH}" -mindepth 1 -maxdepth 2 -type d | while read -r pkg_path; do
  if [[ -f "${pkg_path}/package.json" ]]; then
    # Validate JSON before parsing
    if ! node -e "JSON.parse(require('fs').readFileSync('${pkg_path}/package.json', 'utf8'))" 2>/dev/null; then
      echo "⏭️  Bỏ qua package với malformed JSON: ${pkg_path}/package.json"
      continue
    fi
    
    pkg_name=$(node -p "require('${pkg_path}/package.json').name")
    pkg_version=$(node -p "require('${pkg_path}/package.json').version")
    is_private=$(node -p "Boolean(require('${pkg_path}/package.json').private)")
    if [[ "$pkg_name" == "undefined" || "$pkg_version" == "undefined" ]]; then
      echo "⏭️  Bỏ qua package với name/version undefined: ${pkg_name}@${pkg_version}"
      continue
    fi
    if [[ "$is_private" == "true" ]]; then
      echo "⏭️  Bỏ qua private package ${pkg_name}@${pkg_version}"
      continue
    fi
    echo "📦 Đang publish ${pkg_name}@${pkg_version} ..."

    (
      cd "${pkg_path}"

      if ! npm_config_ignore_scripts=true npm pack > /dev/null; then
        echo "⚠️  Pack failed for ${pkg_name}@${pkg_version} (logged)"
        echo "${pkg_name}@${pkg_version}" >> "$OLDPWD/$LOG_FILE"
        exit 0
      fi

      tgz_file=$(ls *.tgz 2>/dev/null | head -n 1)
      if [[ -z "$tgz_file" ]]; then
        echo "⚠️  No tarball produced for ${pkg_name}@${pkg_version} (logged)"
        echo "${pkg_name}@${pkg_version}" >> "$OLDPWD/$LOG_FILE"
        exit 0
      fi

      if ! npm_config_ignore_scripts=true npm publish "${tgz_file}" --registry="${NEXUS_REPO_URL}" --access public; then
        echo "⚠️  Failed to publish ${pkg_name}@${pkg_version} (logged)"
        echo "${pkg_name}@${pkg_version}" >> "$OLDPWD/$LOG_FILE"
      fi

      rm -f *.tgz || true
    )
  fi
done

echo "✅ Hoàn tất publish."
