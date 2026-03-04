import { Box, Chip, Stack, Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import type { Candidate, CandidateStatus } from '../types/candidate.types';
import { candidateStatusLabels, employmentTypeLabels } from '../types/candidate.types';

const statusColor: Record<CandidateStatus, 'default' | 'success' | 'error'> = {
  en_attente: 'default',
  accepté: 'success',
  refusé: 'error',
};

interface Props {
  candidates: Candidate[];
  onCandidateClick: (candidate: Candidate) => void;
}

const CandidateList = ({ candidates, onCandidateClick }: Props) => {
  if (candidates.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        Aucune candidature pour le moment.
      </Typography>
    );
  }

  return (
    <Stack gap={1}>
      {candidates.map((candidate) => (
        <Box
          key={candidate.id}
          onClick={() => onCandidateClick(candidate)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 1.5,
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'divider',
            cursor: 'pointer',
            '&:hover': { bgcolor: 'action.hover' },
          }}
        >
          <Stack direction="row" alignItems="center" gap={1.5}>
            <PersonIcon color="action" fontSize="small" />
            <Box>
              <Typography variant="body2" fontWeight={500}>
                {candidate.person.firstName} {candidate.person.lastName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {employmentTypeLabels[candidate.employmentType]} —{' '}
                {candidate.income.toLocaleString('fr-FR')} €/mois
                {candidate.hasGuarantor ? ' · Avec caution' : ''}
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" alignItems="center" gap={1}>
            <Chip
              label={candidateStatusLabels[candidate.status]}
              size="small"
              color={statusColor[candidate.status]}
            />
            <Typography variant="caption" color="text.disabled">
              {new Date(candidate.submittedAt).toLocaleDateString('fr-FR')}
            </Typography>
          </Stack>
        </Box>
      ))}
    </Stack>
  );
};

export default CandidateList;
