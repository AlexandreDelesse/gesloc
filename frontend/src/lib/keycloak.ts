import Keycloak from 'keycloak-js';

// Singleton — shared across AuthProvider and api-client
// Config is read from Vite env vars at build time (VITE_* prefix required)
const keycloak = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
});

export default keycloak;
