#!/usr/bin/env bash
set -euo pipefail

# Sync committed product photos into the writable uploads volume without
# overwriting files that were later uploaded via admin (cp -n = no-clobber).
BUNDLED="/app/public/uploads-bundled"
DEST="/app/public/uploads"
mkdir -p "$DEST"
if [[ -d "$BUNDLED" ]]; then
  cp -an "$BUNDLED"/. "$DEST"/ 2>/dev/null || true
fi

exec node src/server.js
