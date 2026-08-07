#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

if [[ ! -f .env.prod ]]; then
  echo "ERROR: .env.prod not found."
  echo "Copy the template and fill secrets first:"
  echo "  cp .env.prod.example .env.prod"
  exit 1
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "ERROR: docker is not installed or not on PATH."
  exit 1
fi

COMPOSE=(docker compose --env-file .env.prod)

# Enable Cloudflare tunnel only when a non-empty token is present in .env.prod
TOKEN="$(grep -E '^TUNNEL_TOKEN=' .env.prod | head -n1 | cut -d= -f2- | tr -d '[:space:]' | tr -d '\"' | tr -d \"'\" || true)"
if [[ -n "${TOKEN}" ]]; then
  COMPOSE+=(--profile tunnel)
  echo "Starting Garg Industrial Mesh (prod + Cloudflare tunnel)…"
else
  echo "Starting Garg Industrial Mesh (prod, no tunnel — set TUNNEL_TOKEN in .env.prod to enable)…"
fi

"${COMPOSE[@]}" up -d --build
echo "Up. Site: http://127.0.0.1:${PORT:-3000} (set SITE_URL in .env.prod for public HTTPS canonicals)"
"${COMPOSE[@]}" ps
