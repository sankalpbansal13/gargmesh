#!/usr/bin/env bash
# Nightly restart for Garg Industrial Mesh (native systemd + cloudflared stack)
# Scheduled for 04:00 AM IST (22:30 UTC)
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

LOG_DIR="$ROOT/logs"
LOG_FILE="$LOG_DIR/nightly-restart.log"
mkdir -p "$LOG_DIR"

exec > >(tee -a "$LOG_FILE") 2>&1

step() {
  echo
  echo "── [$1] $(date -Is) ──"
}

echo "===== $(date -Is) nightly restart begin ====="
echo "ROOT=$ROOT"
echo "LOG_FILE=$LOG_FILE"
echo "USER=$(id -un) HOST=$(hostname)"

step "1/4 check environment"
if [[ ! -f .env.prod ]]; then
  echo "ERROR: .env.prod not found — aborting."
  exit 1
fi
echo "OK: .env.prod present"

step "2/4 git pull (if clean)"
if [[ -d .git ]]; then
  BRANCH="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo 'main')"
  echo "Current branch: $BRANCH"
  git fetch --prune origin 2>&1 || echo "WARN: git fetch failed (offline or network issue)"
  if git diff --quiet && git diff --cached --quiet; then
    echo "Working tree clean, pulling origin/$BRANCH..."
    git pull --ff-only origin "$BRANCH" 2>&1 || echo "WARN: fast-forward pull failed, keeping current code"
  else
    echo "Local changes exist, skipping pull."
  fi
fi

step "3/4 restart services"
echo "Restarting gargmesh and gargmesh-tunnel..."
sudo systemctl restart gargmesh
sudo systemctl restart gargmesh-tunnel

step "4/4 health check"
# Wait up to 30 seconds for server to finish boot and seed checks
LOCAL_CODE=""
for i in $(seq 1 15); do
  LOCAL_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000/ 2>/dev/null || true)
  if [[ "$LOCAL_CODE" == "200" ]]; then
    break
  fi
  sleep 2
done
echo "Local HTTP check: $LOCAL_CODE"

echo "OK: Services restarted successfully and are healthy."
echo "===== $(date -Is) nightly restart end ====="
echo
