import { useNavigate } from 'react-router';
import { Divider, Paper, Typography } from '@mui/material';
import PageLayout from '../components/layout/PageLayout';
import PropertyForm from '../features/property/components/PropertyForm';
import { useCreateProperty } from '../features/property/hooks/useCreateProperty';
import type { CreatePropertyData } from '../features/property/types/property.types';

const CreatePropertyPage = () => {
  const navigate = useNavigate();
  const { mutate: createProperty, isPending } = useCreateProperty();

  const handleSubmit = (data: CreatePropertyData) => {
    createProperty(data, {
      onSuccess: (created) => navigate(`/property/${created.id}`),
    });
  };

  return (
    <PageLayout>
      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography variant="h5" fontWeight="bold" mb={2}>Nouveau bien</Typography>
        <Divider sx={{ mb: 2 }} />
        <PropertyForm
          onSubmit={handleSubmit}
          onCancel={() => navigate(-1)}
          isLoading={isPending}
          submitLabel="Ajouter"
        />
      </Paper>
    </PageLayout>
  );
};

export default CreatePropertyPage;
