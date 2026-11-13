#!/usr/bin/env bash
# Publish the current version to this repository's GitHub Releases.
set -euo pipefail
cd "$(dirname "$0")/.."

if [ -n "$(git status --porcelain)" ]; then
  echo "Commit all release changes before publishing." >&2
  exit 1
fi
test "$(git branch --show-current)" = main
git remote -v
gh auth status
npm test
for file in lib/*.js; do node --check "$file"; done

VERSION="$(node -p "require('./package.json').version")"
PACKAGE="$(node -p "require('./package.json').name")"
test "$PACKAGE" = dsh-usage-meter
RELEASE_DIR="$(mktemp -d)"
trap 'rm -rf "$RELEASE_DIR"' EXIT
npm pack --pack-destination "$RELEASE_DIR"
(cd "$RELEASE_DIR" && sha256sum *.tgz > SHA256SUMS.txt)

git fetch origin main
git log --oneline origin/main..HEAD
git diff --stat origin/main HEAD
git push origin HEAD:refs/heads/main
git tag "v$VERSION"
git push origin "refs/tags/v$VERSION:refs/tags/v$VERSION"
gh release create "v$VERSION" "$RELEASE_DIR/$PACKAGE-$VERSION.tgz" "$RELEASE_DIR/SHA256SUMS.txt" \
  --repo gaolin89898/dsh-usage-meter --verify-tag --title "$PACKAGE v$VERSION" --generate-notes
