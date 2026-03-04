import { useState } from 'react';
import { useParams } from 'react-router';
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Divider,
  Paper,
  Typography,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useCandidateLinkByToken } from '../features/candidate/hooks/useCandidateLink';
import { useSubmitCandidate } from '../features/candidate/hooks/useSubmitCandidate';
import CandidateForm from '../features/candidate/components/CandidateForm';
import type { SubmitCandidateData } from '../features/candidate/types/candidate.types';

const CandidatePage = () => {
  const { token } = useParams<{ token: string }>();
  const [submitted, setSubmitted] = useState(false);

  const { data: link, isLoading, isError } = useCandidateLinkByToken(token ?? '');
  const { mutate: submit, isPending } = useSubmitCandidate();

  const handleSubmit = (data: SubmitCandidateData) => {
    submit(data, {
      onSuccess: () => setSubmitted(true),
    });
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box
        sx={{
          bgcolor: 'background.paper',
          borderBottom: '1px solid #e2e8f0',
          py: 1.5,
          px: 3,
        }}
      >
        <Typography variant="h6" fontWeight="bold" color="primary">
          Gesloc
        </Typography>
      </Box>

      <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 }, px: { xs: 2, md: 3 } }}>
        {isLoading && <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 6 }} />}

        {(isError || (!isLoading && !link)) && (
          <Alert severity="error">
            Ce lien de candidature est invalide ou a expiré.
          </Alert>
        )}

        {!isLoading && link && !link.isActive && (
          <Alert severity="warning">
            Ce lien de candidature a été désactivé par le propriétaire.
          </Alert>
        )}

        {!isLoading && link && link.isActive && !submitted && (
          <Paper sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h5" fontWeight="bold" mb={0.5}>
              Déposer ma candidature
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Logement : <strong>{link.propertyName}</strong>
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <CandidateForm
              propertyId={link.propertyId}
              onSubmit={handleSubmit}
              isLoading={isPending}
            />
          </Paper>
        )}

        {submitted && (
          <Paper sx={{ p: { xs: 3, sm: 4 }, textAlign: 'center' }}>
            <CheckCircleOutlineIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Dossier envoyé !
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Votre candidature a bien été transmise au propriétaire. Il vous contactera directement.
            </Typography>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default CandidatePage;
