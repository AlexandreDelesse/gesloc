import { useNavigate, useParams } from 'react-router';
import { Button, Divider, Paper, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PageLayout from '../components/layout/PageLayout';
import TenancyForm from '../features/tenancy/components/TenancyForm';
import { useCreateTenancy } from '../features/tenancy/hooks/useCreateTenancy';
import type { CreateTenancyData } from '../features/tenancy/types/tenancy.types';

const CreateTenancyPage = () => {
  const { id: propertyId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { mutate: createTenancy, isPending } = useCreateTenancy(propertyId!);

  const handleSubmit = (data: CreateTenancyData) => {
    createTenancy(
      { ...data, propertyId: propertyId! },
      { onSuccess: (created) => navigate(`/property/${propertyId}/tenancy/${created.id}`) },
    );
  };

  return (
    <PageLayout
      actions={
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(`/property/${propertyId}`)}>
          Retour
        </Button>
      }
    >
      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography variant="h5" fontWeight="bold" mb={2}>Nouveau bail</Typography>
        <Divider sx={{ mb: 2 }} />
        <TenancyForm
          onSubmit={handleSubmit}
          onCancel={() => navigate(`/property/${propertyId}`)}
          isLoading={isPending}
          submitLabel="Créer le bail"
        />
      </Paper>
    </PageLayout>
  );
};

export default CreateTenancyPage;
