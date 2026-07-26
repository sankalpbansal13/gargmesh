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

echo "Starting Garg Industrial Mesh (prod)…"
docker compose up -d --build
echo "Up. Site: http://127.0.0.1:${PORT:-3000} (set SITE_URL in .env.prod for public HTTPS canonicals)"
docker compose ps
