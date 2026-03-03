import { Button, CircularProgress, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import AddIcon from '@mui/icons-material/Add';
import PageLayout from '../components/layout/PageLayout';
import PropertyCardList from '../features/property/components/PropertyCardList';
import { useProperties } from '../features/property/hooks/useProperties';
import type { Property } from '../features/property/types/property.types';

const HomePage = () => {
  const navigate = useNavigate();
  const { data: properties, isLoading, isError } = useProperties();

  const handlePropertyClick = (property: Property) => navigate(`/property/${property.id}`);

  return (
    <PageLayout
      title="Mes biens"
      actions={
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/create-property')}>
          Ajouter
        </Button>
      }
    >
      {isLoading && <CircularProgress />}
      {isError && <Typography color="error">Impossible de charger les biens.</Typography>}
      {properties && (
        <PropertyCardList properties={properties} onPropertyClick={handlePropertyClick} />
      )}
    </PageLayout>
  );
};

export default HomePage;
