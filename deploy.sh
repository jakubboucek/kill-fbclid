#!/bin/bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
RELEASE_FILE="$DIR/dist/release.zip"

echo -n "Preparing dist... "
rm -rf "$DIR/dist" 2> /dev/null || true
echo "OK"

echo "Creating ZIP release... "
mkdir -p "$DIR/dist"
cd "$DIR"
find . -maxdepth 1 -type f -not -name '.*' -not -name '*.sh' -not -name '*.md' -not -name 'LICENSE' | zip "$RELEASE_FILE" -@
zip -r "$RELEASE_FILE" _locales
echo
echo "Release prepared to $RELEASE_FILE"
