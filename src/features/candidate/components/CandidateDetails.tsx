import { useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Divider,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import GavelIcon from '@mui/icons-material/Gavel';
import type { Candidate, CandidateStatus } from '../types/candidate.types';
import {
  candidateStatusLabels,
  candidateStatusValues,
  documentTypeLabels,
  employmentTypeLabels,
} from '../types/candidate.types';
import { exportDossier } from '../export/exportDossier';

const statusColor: Record<CandidateStatus, 'default' | 'success' | 'error'> = {
  en_attente: 'default',
  accepté: 'success',
  refusé: 'error',
};

interface Props {
  candidate: Candidate;
  onUpdate: (data: { id: string; status?: CandidateStatus; notes?: string }) => void;
  onUseForTenancy: (candidate: Candidate) => void;
  isUpdating?: boolean;
}

const CandidateDetails = ({ candidate, onUpdate, onUseForTenancy, isUpdating }: Props) => {
  const [notes, setNotes] = useState(candidate.notes ?? '');

  const downloadDocument = (file: string, fileName: string) => {
    const a = document.createElement('a');
    a.href = file;
    a.download = fileName;
    a.click();
  };

  return (
    <Stack gap={3}>
      {/* Header row: status + actions */}
      <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1}>
        <Stack direction="row" alignItems="center" gap={1}>
          <Chip
            label={candidateStatusLabels[candidate.status]}
            color={statusColor[candidate.status]}
          />
          <Typography variant="caption" color="text.disabled">
            Reçu le {new Date(candidate.submittedAt).toLocaleDateString('fr-FR')}
          </Typography>
        </Stack>
        <Stack direction="row" gap={1}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={() => exportDossier(candidate)}
          >
            Télécharger le dossier
          </Button>
          <Button
            size="small"
            variant="contained"
            startIcon={<GavelIcon />}
            onClick={() => onUseForTenancy(candidate)}
          >
            Utiliser pour un bail
          </Button>
        </Stack>
      </Box>

      <Divider />

      {/* Personal info */}
      <Box>
        <Typography variant="subtitle2" color="text.secondary" mb={1}>
          Informations personnelles
        </Typography>
        <Stack gap={0.5}>
          <Typography variant="body2">
            <strong>Nom :</strong> {candidate.person.firstName} {candidate.person.lastName}
          </Typography>
          <Typography variant="body2">
            <strong>Email :</strong> {candidate.person.email}
          </Typography>
          <Typography variant="body2">
            <strong>Téléphone :</strong> {candidate.person.phone}
          </Typography>
          {candidate.person.address && (
            <Typography variant="body2">
              <strong>Adresse :</strong>{' '}
              {candidate.person.address.number ? candidate.person.address.number + ' ' : ''}
              {candidate.person.address.street}, {candidate.person.address.postCode}{' '}
              {candidate.person.address.city}
            </Typography>
          )}
        </Stack>
      </Box>

      {/* Professional situation */}
      <Box>
        <Typography variant="subtitle2" color="text.secondary" mb={1}>
          Situation professionnelle
        </Typography>
        <Stack gap={0.5}>
          <Typography variant="body2">
            <strong>Statut :</strong> {employmentTypeLabels[candidate.employmentType]}
          </Typography>
          <Typography variant="body2">
            <strong>Revenus nets :</strong> {candidate.income.toLocaleString('fr-FR')} €/mois
          </Typography>
        </Stack>
      </Box>

      {/* Candidate documents */}
      {candidate.documents.length > 0 && (
        <Box>
          <Typography variant="subtitle2" color="text.secondary" mb={1}>
            Documents fournis
          </Typography>
          <Stack gap={0.5}>
            {candidate.documents.map((doc) => (
              <Box key={doc.id} display="flex" alignItems="center" gap={1}>
                <Typography variant="caption" color="text.secondary" sx={{ minWidth: 160 }}>
                  {documentTypeLabels[doc.type]}
                </Typography>
                <Button
                  size="small"
                  variant="text"
                  onClick={() => downloadDocument(doc.file, doc.fileName)}
                  sx={{ textTransform: 'none', fontSize: '0.8rem' }}
                >
                  {doc.fileName}
                </Button>
              </Box>
            ))}
          </Stack>
        </Box>
      )}

      {/* Guarantor */}
      {candidate.hasGuarantor && candidate.guarantor && (
        <>
          <Divider />
          <Box>
            <Typography variant="subtitle2" color="text.secondary" mb={1}>
              Caution
            </Typography>
            <Stack gap={0.5}>
              <Typography variant="body2">
                <strong>Nom :</strong> {candidate.guarantor.person.firstName}{' '}
                {candidate.guarantor.person.lastName}
              </Typography>
              <Typography variant="body2">
                <strong>Statut :</strong>{' '}
                {employmentTypeLabels[candidate.guarantor.employmentType]}
              </Typography>
              <Typography variant="body2">
                <strong>Revenus nets :</strong>{' '}
                {candidate.guarantor.income.toLocaleString('fr-FR')} €/mois
              </Typography>
            </Stack>
          </Box>
          {candidate.guarantor.documents.length > 0 && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary" mb={1}>
                Documents de la caution
              </Typography>
              <Stack gap={0.5}>
                {candidate.guarantor.documents.map((doc) => (
                  <Box key={doc.id} display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" color="text.secondary" sx={{ minWidth: 160 }}>
                      {documentTypeLabels[doc.type]}
                    </Typography>
                    <Button
                      size="small"
                      variant="text"
                      onClick={() => downloadDocument(doc.file, doc.fileName)}
                      sx={{ textTransform: 'none', fontSize: '0.8rem' }}
                    >
                      {doc.fileName}
                    </Button>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}
        </>
      )}

      {/* Cover letter */}
      {candidate.coverLetter && (
        <>
          <Divider />
          <Box>
            <Typography variant="subtitle2" color="text.secondary" mb={1}>
              Lettre de motivation
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
              {candidate.coverLetter}
            </Typography>
          </Box>
        </>
      )}

      <Divider />

      {/* Status + notes */}
      <Stack gap={2}>
        <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
          <TextField
            select
            size="small"
            label="Statut"
            value={candidate.status}
            onChange={(e) =>
              onUpdate({ id: candidate.id, status: e.target.value as CandidateStatus })
            }
            disabled={isUpdating}
            sx={{ minWidth: 160 }}
          >
            {candidateStatusValues.map((val) => (
              <MenuItem key={val} value={val}>
                {candidateStatusLabels[val]}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <TextField
          label="Notes internes"
          multiline
          rows={3}
          size="small"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Remarques visibles uniquement par vous..."
        />
        <Button
          variant="outlined"
          size="small"
          onClick={() => onUpdate({ id: candidate.id, notes })}
          disabled={isUpdating || notes === (candidate.notes ?? '')}
          sx={{ alignSelf: 'flex-start' }}
        >
          Enregistrer les notes
        </Button>
      </Stack>
    </Stack>
  );
};

export default CandidateDetails;
