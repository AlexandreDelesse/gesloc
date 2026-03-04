import { useNavigate, useParams, useLocation } from 'react-router';
import { Button, Divider, Paper, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PageLayout from '../components/layout/PageLayout';
import TenancyForm from '../features/tenancy/components/TenancyForm';
import { useCreateTenancy } from '../features/tenancy/hooks/useCreateTenancy';
import type { CreateTenancyData } from '../features/tenancy/types/tenancy.types';
import type { Candidate } from '../features/candidate/types/candidate.types';

const CreateTenancyPage = () => {
  const { id: propertyId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { mutate: createTenancy, isPending } = useCreateTenancy(propertyId!);

  const candidate = location.state?.candidate as Candidate | undefined;

  const prefilledValues: Partial<CreateTenancyData> | undefined = candidate
    ? {
        tenant: {
          lastName: candidate.person.lastName,
          firstName: candidate.person.firstName,
          address: candidate.person.address,
        },
        guarantor:
          candidate.hasGuarantor && candidate.guarantor
            ? {
                lastName: candidate.guarantor.person.lastName,
                firstName: candidate.guarantor.person.firstName,
                address: candidate.guarantor.person.address,
              }
            : undefined,
      }
    : undefined;

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
          prefilledValues={prefilledValues}
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
