#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
NIGHTLY="$ROOT/scripts/docker/nightly-restart.sh"
CRON_LINE="0 3 * * * $NIGHTLY"

if [[ ! -x "$NIGHTLY" ]]; then
  chmod +x "$NIGHTLY" "$ROOT/scripts/docker/restart.sh" || true
fi

if ! command -v crontab >/dev/null 2>&1; then
  echo "ERROR: crontab not found. Install cron (e.g. apt install cron) on this Linux host."
  echo "Manual line to add:"
  echo "  $CRON_LINE"
  exit 1
fi

# Replace any previous gargmesh nightly line; keep other crontab entries.
EXISTING="$(crontab -l 2>/dev/null || true)"
FILTERED="$(printf '%s\n' "$EXISTING" | grep -v 'scripts/docker/nightly-restart.sh' || true)"
{
  printf '%s\n' "$FILTERED"
  echo "$CRON_LINE"
} | grep -v '^$' | crontab -

echo "Installed nightly restart cron (03:00 local time):"
echo "  $CRON_LINE"
echo
echo "Current crontab:"
crontab -l
