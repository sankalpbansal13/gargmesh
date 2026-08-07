#!/usr/bin/env bash
# Nightly: git pull + rebuild/restart Docker stack (web + cloudflared).
# Scheduled for 04:00 Asia/Kolkata via setup-nightly.sh
# All steps log to the terminal AND append to logs/nightly-restart.log
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

LOG_DIR="$ROOT/logs"
LOG_FILE="$LOG_DIR/nightly-restart.log"
mkdir -p "$LOG_DIR"

# Mirror every line to terminal + log file
exec > >(tee -a "$LOG_FILE") 2>&1

step() {
  echo
  echo "── [$1] $(date -Is) ──"
}

echo "===== $(date -Is) nightly pull+restart begin ====="
echo "ROOT=$ROOT"
echo "LOG_FILE=$LOG_FILE"
echo "PWD=$(pwd)"
echo "USER=$(id -un) HOST=$(hostname)"

step "1/6 check .env.prod"
if [[ ! -f .env.prod ]]; then
  echo "ERROR: .env.prod not found — aborting."
  exit 1
fi
echo "OK: .env.prod present"

step "2/6 check docker"
if ! command -v docker >/dev/null 2>&1; then
  echo "ERROR: docker not on PATH — aborting."
  exit 1
fi
echo "OK: $(command -v docker)"
docker version --format 'Client={{.Client.Version}} Server={{.Server.Version}}' || docker version

step "3/6 git fetch + pull"
if [[ -d .git ]]; then
  echo "Remote:"
  git remote -v
  echo "Fetching origin…"
  git fetch --prune origin
  BRANCH="$(git rev-parse --abbrev-ref HEAD)"
  REMOTE_REF="origin/${BRANCH}"
  if ! git rev-parse --verify "$REMOTE_REF" >/dev/null 2>&1; then
    REMOTE_REF="origin/main"
  fi
  echo "Branch=$BRANCH RemoteRef=$REMOTE_REF"
  echo "Status before pull:"
  git status -sb

  STASHED=0
  if ! git diff --quiet || ! git diff --cached --quiet; then
    echo "Local changes detected — stashing…"
    git stash push -m "nightly-autostash $(date -u +%Y%m%dT%H%M%SZ)"
    STASHED=1
  else
    echo "Working tree clean — no stash needed"
  fi

  echo "Pulling $REMOTE_REF (ff-only)…"
  if git pull --ff-only "$REMOTE_REF"; then
    echo "Pulled $REMOTE_REF OK"
  elif git merge --ff-only "$REMOTE_REF"; then
    echo "Merged $REMOTE_REF OK"
  else
    echo "WARN: could not fast-forward to $REMOTE_REF — continuing with current tree"
  fi

  if [[ "$STASHED" -eq 1 ]]; then
    echo "Restoring stash…"
    if git stash pop; then
      echo "Stash pop OK"
    else
      echo "WARN: stash pop had conflicts — check git status"
    fi
  fi

  echo "HEAD: $(git rev-parse --short HEAD) ($(git log -1 --pretty=%s))"
  echo "Status after pull:"
  git status -sb
else
  echo "WARN: not a git repo — skipping pull."
fi

step "4/6 chmod scripts"
chmod -v +x scripts/docker/*.sh || true

step "5/6 docker compose up -d --build"
# shellcheck disable=SC1091
set -a
source .env.prod
set +a
echo "Loaded .env.prod (secrets not printed)"
echo "Running: docker compose --env-file .env.prod up -d --build"
docker compose --env-file .env.prod up -d --build

step "6/6 container status"
docker compose --env-file .env.prod ps
echo
echo "===== $(date -Is) nightly pull+restart end ====="
echo
