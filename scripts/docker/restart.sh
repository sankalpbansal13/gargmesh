#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

if ! command -v docker >/dev/null 2>&1; then
  echo "ERROR: docker is not installed or not on PATH."
  exit 1
fi

if [[ ! -f .env.prod ]]; then
  echo "ERROR: .env.prod not found. Run start.sh after creating it from .env.prod.example."
  exit 1
fi

COMPOSE=(docker compose --env-file .env.prod)
TOKEN="$(grep -E '^TUNNEL_TOKEN=' .env.prod | head -n1 | cut -d= -f2- | tr -d '[:space:]' | tr -d '\"' | tr -d \"'\" || true)"
if [[ -n "${TOKEN}" ]]; then
  COMPOSE+=(--profile tunnel)
fi

# If the service is not running, bring the stack up; otherwise restart in place.
if "${COMPOSE[@]}" ps --status running --services 2>/dev/null | grep -qx 'web'; then
  echo "Restarting running stack…"
  "${COMPOSE[@]}" restart
else
  echo "Stack not running — starting…"
  "${COMPOSE[@]}" up -d --build
fi

"${COMPOSE[@]}" ps
