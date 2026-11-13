#!/usr/bin/env bash
# Bump, verify and publish a GitHub Release to origin/main.
set -euo pipefail
cd "$(dirname "$0")/.."
LEVEL="${1:-patch}"
case "$LEVEL" in
  patch|minor|major) ;;
  *) echo "usage: $0 [patch|minor|major]" >&2; exit 1 ;;
esac
if [ -n "$(git status --porcelain)" ]; then
  echo "Commit existing changes before starting a release." >&2
  exit 1
fi
npm test
NEW_VERSION="$(npm version "$LEVEL" --no-git-tag-version)"
# Keep the two user-facing version references in step with package.json.
node --input-type=module -e '
  import fs from "node:fs";
  import { execFileSync } from "node:child_process";
  const previous = JSON.parse(execFileSync("git", ["show", "HEAD:package.json"], { encoding: "utf8" })).version;
  const version = JSON.parse(fs.readFileSync("package.json", "utf8")).version;
  for (const file of ["README.md", "docs/INSTALL.zh.md"]) {
    const text = fs.readFileSync(file, "utf8").replaceAll(previous, version);
    fs.writeFileSync(file, text);
  }
'
git add package.json README.md docs/INSTALL.zh.md
git commit -m "chore: release $NEW_VERSION"
exec ./scripts/publish.sh
