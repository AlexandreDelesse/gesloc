import { Button, CircularProgress, Divider, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import AddIcon from '@mui/icons-material/Add';
import { Box } from '@mui/material';
import PageLayout from '../components/layout/PageLayout';
import PropertyCardList from '../features/property/components/PropertyCardList';
import { useProperties } from '../features/property/hooks/useProperties';
import type { Property } from '../features/property/types/property.types';

const HomePage = () => {
  const navigate = useNavigate();
  const { data: properties, isLoading, isError } = useProperties();

  const handlePropertyClick = (property: Property) => navigate(`/property/${property.id}`);

  return (
    <PageLayout>
      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h5" fontWeight="bold">Mes biens</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/create-property')}>
            Ajouter
          </Button>
        </Box>
        <Divider sx={{ mb: 2 }} />
        {isLoading && <CircularProgress />}
        {isError && <Typography color="error">Impossible de charger les biens.</Typography>}
        {properties && (
          <PropertyCardList properties={properties} onPropertyClick={handlePropertyClick} />
        )}
      </Paper>
    </PageLayout>
  );
};

export default HomePage;
