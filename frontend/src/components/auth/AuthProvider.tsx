import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type Keycloak from 'keycloak-js';
import keycloak from '../../lib/keycloak';

interface AuthContextValue {
  authenticated: boolean;
  isLoading: boolean;
  keycloak: Keycloak;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    keycloak
      .init({
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
        pkceMethod: 'S256',
      })
      .then((auth) => {
        setAuthenticated(auth);
      })
      .catch(() => {
        setAuthenticated(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ authenticated, isLoading, keycloak }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
