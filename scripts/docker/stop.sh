#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

if ! command -v docker >/dev/null 2>&1; then
  echo "ERROR: docker is not installed or not on PATH."
  exit 1
fi

echo "Stopping Garg Industrial Mesh…"
if [[ -f .env.prod ]]; then
  docker compose --env-file .env.prod --profile tunnel down
else
  docker compose --profile tunnel down
fi
echo "Stopped."
