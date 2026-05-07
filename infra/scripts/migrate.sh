#!/usr/bin/env bash
set -euo pipefail

# Gesloc — EF Core migrations helper
#
# Usage:
#   ./migrate.sh add <MigrationName>   — generate a new migration
#   ./migrate.sh apply                 — apply pending migrations to the DB
#   ./migrate.sh status                — list applied / pending migrations
#
# Requires: dotnet SDK 8+ installed locally, OR pass --docker to run inside a container.
#
# Examples:
#   ./migrate.sh add InitialCreate
#   ./migrate.sh add AddBailleurSiret
#   ./migrate.sh apply
#   ./migrate.sh apply --docker        # runs dotnet ef inside the backend container

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="${SCRIPT_DIR}/../../backend"

USE_DOCKER=false
COMMAND="${1:-}"
MIGRATION_NAME="${2:-}"

# Parse --docker flag anywhere in args
for arg in "$@"; do
  [[ "$arg" == "--docker" ]] && USE_DOCKER=true
done

if [[ -z "$COMMAND" ]]; then
  echo "Usage: $0 {add <Name>|apply|status} [--docker]" >&2
  exit 1
fi

run_ef() {
  if $USE_DOCKER; then
    echo "==> Running inside Docker (backend container)..."
    docker compose -f "${SCRIPT_DIR}/../docker-compose.yml" run --rm \
      -e ConnectionStrings__DefaultConnection="Host=postgres;Database=gesloc;Username=gesloc;Password=${POSTGRES_PASSWORD:-changeme}" \
      backend dotnet ef "$@"
  else
    cd "$BACKEND_DIR"
    dotnet ef "$@"
  fi
}

case "$COMMAND" in
  add)
    if [[ -z "$MIGRATION_NAME" ]]; then
      echo "ERROR: Migration name required. Usage: $0 add <MigrationName>" >&2
      exit 1
    fi
    echo "==> Generating migration: $MIGRATION_NAME"
    run_ef migrations add "$MIGRATION_NAME" --project "$BACKEND_DIR" --output-dir Migrations
    echo "    Migration files created in backend/Migrations/"
    echo "    Review the generated files before committing."
    ;;
  apply)
    echo "==> Applying pending migrations..."
    run_ef database update --project "$BACKEND_DIR"
    echo "    Done."
    ;;
  status)
    echo "==> Migration status:"
    run_ef migrations list --project "$BACKEND_DIR"
    ;;
  *)
    echo "ERROR: Unknown command '$COMMAND'. Use: add | apply | status" >&2
    exit 1
    ;;
esac
