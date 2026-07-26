#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

LOG_DIR="$ROOT/logs"
LOG_FILE="$LOG_DIR/nightly-restart.log"
mkdir -p "$LOG_DIR"

{
  echo "===== $(date -Is) nightly restart begin ====="
  "$ROOT/scripts/docker/restart.sh"
  echo "===== $(date -Is) nightly restart end ====="
  echo
} >>"$LOG_FILE" 2>&1
