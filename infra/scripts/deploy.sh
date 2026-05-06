#!/usr/bin/env bash
set -euo pipefail

# Gesloc — deploy on VPS
# Run from /opt/gesloc on the VPS after a docker compose pull

COMPOSE_FILE="${1:-docker-compose.prod.yml}"

echo "==> Pulling latest images..."
docker compose -f "$COMPOSE_FILE" pull

echo "==> Restarting services..."
docker compose -f "$COMPOSE_FILE" up -d --remove-orphans

echo "==> Cleaning old images..."
docker image prune -f

echo "==> Deploy complete."
docker compose -f "$COMPOSE_FILE" ps
