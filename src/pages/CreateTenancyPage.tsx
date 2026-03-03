import { useNavigate, useParams } from 'react-router';
import { Button } from '@mui/material';
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
      title="Nouveau bail"
      actions={
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(`/property/${propertyId}`)}>
          Retour
        </Button>
      }
    >
      <TenancyForm
        onSubmit={handleSubmit}
        onCancel={() => navigate(`/property/${propertyId}`)}
        isLoading={isPending}
        submitLabel="Créer le bail"
      />
    </PageLayout>
  );
};

export default CreateTenancyPage;
