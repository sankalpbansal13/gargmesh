#!/usr/bin/env bash
# Nightly: git pull + rebuild/restart Docker stack (web + cloudflared).
# Scheduled for 04:00 Asia/Kolkata via setup-nightly.sh
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

LOG_DIR="$ROOT/logs"
LOG_FILE="$LOG_DIR/nightly-restart.log"
mkdir -p "$LOG_DIR"

{
  echo "===== $(date -Is) nightly pull+restart begin ====="

  if [[ ! -f .env.prod ]]; then
    echo "ERROR: .env.prod not found — aborting."
    exit 1
  fi

  if ! command -v docker >/dev/null 2>&1; then
    echo "ERROR: docker not on PATH — aborting."
    exit 1
  fi

  if [[ -d .git ]]; then
    echo "git fetch + pull…"
    git fetch --prune origin
    BRANCH="$(git rev-parse --abbrev-ref HEAD)"
    REMOTE_REF="origin/${BRANCH}"
    if ! git rev-parse --verify "$REMOTE_REF" >/dev/null 2>&1; then
      REMOTE_REF="origin/main"
    fi
    # Stash local deploy tweaks (e.g. docker-compose tunnel service) so pull can ff.
    STASHED=0
    if ! git diff --quiet || ! git diff --cached --quiet; then
      git stash push -m "nightly-autostash $(date -u +%Y%m%dT%H%M%SZ)" --quiet || true
      STASHED=1
    fi
    if git pull --ff-only "$REMOTE_REF" 2>/dev/null || git merge --ff-only "$REMOTE_REF"; then
      echo "Pulled $REMOTE_REF OK"
    else
      echo "WARN: could not fast-forward to $REMOTE_REF — continuing with current tree"
    fi
    if [[ "$STASHED" -eq 1 ]]; then
      git stash pop --quiet || echo "WARN: stash pop had conflicts — check git status"
    fi
    echo "HEAD: $(git rev-parse --short HEAD) ($(git log -1 --pretty=%s))"
  else
    echo "WARN: not a git repo — skipping pull."
  fi

  chmod +x scripts/docker/*.sh 2>/dev/null || true

  echo "docker compose up -d --build…"
  # shellcheck disable=SC1091
  set -a
  source .env.prod
  set +a
  docker compose --env-file .env.prod up -d --build

  echo "Status:"
  docker compose --env-file .env.prod ps
  echo "===== $(date -Is) nightly pull+restart end ====="
  echo
} >>"$LOG_FILE" 2>&1
