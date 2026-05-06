import axios from 'axios';
import keycloak from './keycloak';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Before every request: refresh token if expiring within 30s, then inject it
apiClient.interceptors.request.use(async (config) => {
  if (keycloak.authenticated) {
    await keycloak.updateToken(30).catch(() => keycloak.login());
    config.headers.Authorization = `Bearer ${keycloak.token}`;
  }
  return config;
});

export default apiClient;
