import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import { Link as RouterLink } from 'react-router';

interface PageLayoutProps {
  title: string;
  actions?: ReactNode;
  children: ReactNode;
}

const PageLayout = ({ title, actions, children }: PageLayoutProps) => (
  <>
    <AppBar
      position="sticky"
      sx={{
        bgcolor: 'background.paper',
        color: 'text.primary',
        borderBottom: '1px solid #e2e8f0',
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          fontWeight="bold"
          component={RouterLink}
          to="/"
          sx={{ textDecoration: 'none', color: 'inherit' }}
        >
          Gesloc
        </Typography>
      </Toolbar>
    </AppBar>
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 }, px: { xs: 2, md: 3 } }}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={{ xs: 2, md: 3 }}
        flexWrap="wrap"
        gap={1}
      >
        <Typography variant="h5" fontWeight="bold">
          {title}
        </Typography>
        {actions && <Box>{actions}</Box>}
      </Box>
      {children}
    </Container>
  </>
);

export default PageLayout;
