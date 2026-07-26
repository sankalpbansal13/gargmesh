#!/usr/bin/env bash
# Install user cron: every night 04:00 India Standard Time → git pull + restart.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
NIGHTLY="$ROOT/scripts/docker/nightly-restart.sh"
# 4:00 AM IST = 22:30 UTC (server clock is UTC)
CRON_LINE="30 22 * * * /usr/bin/env bash $NIGHTLY"

if [[ ! -x "$NIGHTLY" ]]; then
  chmod +x "$NIGHTLY" "$ROOT/scripts/docker/restart.sh" "$ROOT/scripts/docker/start.sh" 2>/dev/null || true
fi

if ! command -v crontab >/dev/null 2>&1; then
  echo "ERROR: crontab not found. Install cron first, e.g.:"
  echo "  sudo apt-get update && sudo apt-get install -y cron"
  echo "Then re-run: $0"
  echo
  echo "Manual line to add (04:00 IST / 22:30 UTC):"
  echo "  $CRON_LINE"
  exit 1
fi

EXISTING="$(crontab -l 2>/dev/null || true)"
FILTERED="$(printf '%s\n' "$EXISTING" | grep -v 'scripts/docker/nightly-restart.sh' || true)"
{
  printf '%s\n' "$FILTERED"
  echo "$CRON_LINE"
} | grep -v '^$' | crontab -

echo "Installed nightly git pull + restart (04:00 IST / 22:30 UTC):"
echo "  $CRON_LINE"
echo
echo "Current crontab:"
crontab -l
echo
echo "Logs: $ROOT/logs/nightly-restart.log"
