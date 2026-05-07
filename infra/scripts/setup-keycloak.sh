#!/usr/bin/env bash
set -euo pipefail

# Gesloc — import Keycloak realm in production (non-Docker or existing Keycloak)
# Usage: ./setup-keycloak.sh
# Requires: curl
# Config:  infra/scripts/.env.onboard (same file as onboard.sh)

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${SCRIPT_DIR}/.env.onboard"
REALM_FILE="${SCRIPT_DIR}/../keycloak/gesloc-realm.json"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "ERROR: $ENV_FILE not found. Copy .env.onboard.example and fill in the values." >&2
  exit 1
fi

source "$ENV_FILE"

echo "==> Keycloak setup: ${KC_URL}"
echo "    Realm file: ${REALM_FILE}"

# 1 — Get admin token
echo "==> Authenticating as admin..."
ADMIN_TOKEN=$(curl -s -f -X POST \
  "${KC_URL}/realms/master/protocol/openid-connect/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=admin-cli&grant_type=password&username=${KC_ADMIN_USER}&password=${KC_ADMIN_PASS}" \
  | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)

if [[ -z "$ADMIN_TOKEN" ]]; then
  echo "ERROR: Failed to get admin token. Check KC_URL, KC_ADMIN_USER, KC_ADMIN_PASS." >&2
  exit 1
fi

# 2 — Check if realm already exists
REALM_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  "${KC_URL}/admin/realms/gesloc")

if [[ "$REALM_STATUS" == "200" ]]; then
  echo "    Realm 'gesloc' already exists — updating client and mappers..."
  HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X PUT \
    "${KC_URL}/admin/realms/gesloc" \
    -H "Authorization: Bearer ${ADMIN_TOKEN}" \
    -H "Content-Type: application/json" \
    -d @"$REALM_FILE")
  echo "    PUT /admin/realms/gesloc → HTTP $HTTP_STATUS"
else
  echo "    Creating realm 'gesloc'..."
  HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST \
    "${KC_URL}/admin/realms" \
    -H "Authorization: Bearer ${ADMIN_TOKEN}" \
    -H "Content-Type: application/json" \
    -d @"$REALM_FILE")
  if [[ "$HTTP_STATUS" != "201" ]]; then
    echo "ERROR: Realm creation failed (HTTP $HTTP_STATUS)." >&2
    exit 1
  fi
  echo "    Realm created."
fi

# 3 — Verify
ISSUER=$(curl -s "${KC_URL}/realms/gesloc" | grep -o '"issuer":"[^"]*"' | cut -d'"' -f4)
echo ""
echo "==> Keycloak setup complete!"
echo "    Issuer   : ${ISSUER}"
echo "    Client   : gesloc-frontend (public, PKCE S256)"
echo "    Mapper   : tenant_id (user attribute → JWT claim)"
echo ""
echo "    Next: run ./onboard.sh <email> to create your first user."
