#!/usr/bin/env bash
set -euo pipefail

# Gesloc — onboard a new SaaS client
# Usage: ./onboard.sh email@client.fr
# Requires: curl, psql, uuidgen, openssl
# Config:  infra/scripts/.env.onboard (gitignored)

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${SCRIPT_DIR}/.env.onboard"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "ERROR: $ENV_FILE not found. Copy .env.onboard.example and fill in the values." >&2
  exit 1
fi

# shellcheck source=.env.onboard
source "$ENV_FILE"

EMAIL="${1:-}"
if [[ -z "$EMAIL" ]]; then
  echo "Usage: $0 email@client.fr" >&2
  exit 1
fi

echo "==> Onboarding: $EMAIL"

TENANT_ID=$(uuidgen | tr '[:upper:]' '[:lower:]')
TMP_PASS=$(openssl rand -base64 12)

echo "    tenant_id : $TENANT_ID"

# 1 — Get Keycloak admin token
echo "==> Getting Keycloak admin token..."
ADMIN_TOKEN=$(curl -s -f -X POST \
  "${KC_URL}/realms/master/protocol/openid-connect/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=admin-cli&grant_type=password&username=${KC_ADMIN_USER}&password=${KC_ADMIN_PASS}" \
  | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)

if [[ -z "$ADMIN_TOKEN" ]]; then
  echo "ERROR: Failed to get Keycloak admin token. Check KC_URL, KC_ADMIN_USER, KC_ADMIN_PASS." >&2
  exit 1
fi

# 2 — Create user in Keycloak realm "gesloc" with tenant_id attribute
echo "==> Creating Keycloak user..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST \
  "${KC_URL}/admin/realms/gesloc/users" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{
    \"username\": \"${EMAIL}\",
    \"email\": \"${EMAIL}\",
    \"enabled\": true,
    \"emailVerified\": true,
    \"credentials\": [{
      \"type\": \"password\",
      \"value\": \"${TMP_PASS}\",
      \"temporary\": true
    }],
    \"attributes\": {
      \"tenant_id\": [\"${TENANT_ID}\"]
    }
  }")

if [[ "$HTTP_STATUS" != "201" ]]; then
  echo "ERROR: Keycloak user creation failed (HTTP $HTTP_STATUS). User may already exist." >&2
  exit 1
fi

echo "    Keycloak user created."

# 3 — Insert tenant in PostgreSQL
echo "==> Inserting tenant in database..."
psql "${DATABASE_URL}" -c \
  "INSERT INTO tenants (id, email) VALUES ('${TENANT_ID}', '${EMAIL}');"

echo "    Tenant inserted."

# 4 — Send welcome email via Brevo
echo "==> Sending welcome email..."
curl -s -f -X POST "https://api.brevo.com/v3/smtp/email" \
  -H "api-key: ${BREVO_API_KEY}" \
  -H "Content-Type: application/json" \
  -d "{
    \"sender\": {\"name\": \"Gesloc\", \"email\": \"noreply@gesloc.fr\"},
    \"to\": [{\"email\": \"${EMAIL}\"}],
    \"subject\": \"Bienvenue sur Gesloc !\",
    \"htmlContent\": \"<p>Bonjour,</p><p>Votre compte Gesloc a été créé.</p><p>Connectez-vous sur <a href='${APP_URL}'>${APP_URL}</a> avec votre email et le mot de passe temporaire : <strong>${TMP_PASS}</strong></p><p>Vous devrez changer ce mot de passe à la première connexion.</p><p>L'équipe Gesloc</p>\"
  }" > /dev/null

echo "    Welcome email sent."

echo ""
echo "==> Onboarding complete!"
echo "    Email     : $EMAIL"
echo "    Tenant ID : $TENANT_ID"
echo "    Temp pass : $TMP_PASS"
echo "    Login URL : $APP_URL"
