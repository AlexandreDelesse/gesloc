import { useNavigate, useParams } from 'react-router';
import { Box, Button, CircularProgress, Divider, Paper, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PageLayout from '../components/layout/PageLayout';
import CandidateDetails from '../features/candidate/components/CandidateDetails';
import { useCandidateById } from '../features/candidate/hooks/useCandidateById';
import { useUpdateCandidate } from '../features/candidate/hooks/useUpdateCandidate';
import { useDeleteCandidate } from '../features/candidate/hooks/useDeleteCandidate';
import type { Candidate, CandidateStatus } from '../features/candidate/types/candidate.types';

const CandidateDetailsPage = () => {
  const { id: propertyId, candidateId } = useParams<{ id: string; candidateId: string }>();
  const navigate = useNavigate();

  const { data: candidate, isLoading, isError } = useCandidateById(candidateId!);
  const { mutate: updateCandidate, isPending: isUpdating } = useUpdateCandidate(propertyId!);
  const { mutate: deleteCandidate, isPending: isDeleting } = useDeleteCandidate(propertyId!);

  const handleUpdate = (data: { id: string; status?: CandidateStatus; notes?: string }) => {
    updateCandidate(data);
  };

  const handleDelete = () => {
    deleteCandidate(candidateId!, {
      onSuccess: () => navigate(`/property/${propertyId}`),
    });
  };

  const handleUseForTenancy = (c: Candidate) => {
    navigate(`/property/${propertyId}/tenancy/new`, { state: { candidate: c } });
  };

  if (isLoading) return <CircularProgress sx={{ m: 4 }} />;

  if (isError || !candidate) {
    return (
      <PageLayout title="Candidature introuvable">
        <Typography color="text.secondary" mb={2}>
          Cette candidature n'existe pas ou a été supprimée.
        </Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(`/property/${propertyId}`)}>
          Retour
        </Button>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      actions={
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(`/property/${propertyId}`)}
        >
          Retour
        </Button>
      }
    >
      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h5" fontWeight="bold">
            {candidate.person.firstName} {candidate.person.lastName}
          </Typography>
          <Button
            size="small"
            color="error"
            variant="outlined"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            Supprimer
          </Button>
        </Box>
        <Divider sx={{ mb: 3 }} />
        <CandidateDetails
          candidate={candidate}
          onUpdate={handleUpdate}
          onUseForTenancy={handleUseForTenancy}
          isUpdating={isUpdating}
        />
      </Paper>
    </PageLayout>
  );
};

export default CandidateDetailsPage;
