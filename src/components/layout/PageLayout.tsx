import { Box, Container, Typography } from '@mui/material';
import { ReactNode } from 'react';

interface PageLayoutProps {
  title: string;
  actions?: ReactNode;
  children: ReactNode;
}

const PageLayout = ({ title, actions, children }: PageLayoutProps) => (
  <Container maxWidth="lg" sx={{ py: 4 }}>
    <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
      <Typography variant="h4" fontWeight="bold">
        {title}
      </Typography>
      {actions && <Box>{actions}</Box>}
    </Box>
    {children}
  </Container>
);

export default PageLayout;
