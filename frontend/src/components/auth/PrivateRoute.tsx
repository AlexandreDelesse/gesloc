import { Box, CircularProgress } from '@mui/material';
import { Outlet } from 'react-router';
import { useAuth } from './AuthProvider';

// Used as a React Router layout route — renders <Outlet /> for authenticated users.
// Shows a spinner while Keycloak initializes, then redirects to login if not authenticated.
export function PrivateRoute() {
  const { authenticated, isLoading, keycloak } = useAuth();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!authenticated) {
    keycloak.login();
    return null;
  }

  return <Outlet />;
}
