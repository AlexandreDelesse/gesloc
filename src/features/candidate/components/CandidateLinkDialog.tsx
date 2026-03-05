import { useState } from 'react';
import { useSnackbar } from 'notistack';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import AddLinkIcon from '@mui/icons-material/AddLink';
import CheckIcon from '@mui/icons-material/Check';
import { useCandidateLink } from '../hooks/useCandidateLink';
import { useCreateCandidateLink } from '../hooks/useCreateCandidateLink';
import { useToggleCandidateLink } from '../hooks/useToggleCandidateLink';

interface Props {
  open: boolean;
  onClose: () => void;
  propertyId: string;
  propertyName: string;
}

const CandidateLinkDialog = ({ open, onClose, propertyId, propertyName }: Props) => {
  const [copied, setCopied] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const { data: link, isLoading } = useCandidateLink(propertyId);
  const { mutate: createLink, isPending: isCreating } = useCreateCandidateLink(propertyId);
  const { mutate: toggleLink, isPending: isToggling } = useToggleCandidateLink(propertyId);

  const candidatureUrl = link
    ? `${window.location.origin}/candidature/${link.token}`
    : null;

  const handleCopy = () => {
    if (!candidatureUrl) return;
    navigator.clipboard.writeText(candidatureUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      enqueueSnackbar('Impossible de copier le lien. Copiez-le manuellement.', { variant: 'error' });
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Lien de candidature</DialogTitle>
      <DialogContent>
        {isLoading && <CircularProgress size={24} sx={{ display: 'block', mx: 'auto' }} />}

        {!isLoading && !link && (
          <Stack gap={2} alignItems="flex-start">
            <Typography variant="body2" color="text.secondary">
              Générez un lien unique à envoyer à vos candidats. Chaque candidat pourra déposer
              son dossier via ce lien sans accéder au reste de l'application.
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddLinkIcon />}
              onClick={() => createLink(propertyName)}
              disabled={isCreating}
            >
              Générer un lien
            </Button>
          </Stack>
        )}

        {!isLoading && link && (
          <Stack gap={2}>
            {!link.isActive && (
              <Alert severity="warning">
                Ce lien est actuellement désactivé. Les candidats qui le visitent verront un message
                d'indisponibilité.
              </Alert>
            )}

            <Box>
              <Typography variant="body2" color="text.secondary" mb={1}>
                Envoyez ce lien à vos candidats :
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={candidatureUrl ?? ''}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title={copied ? 'Copié !' : 'Copier'}>
                        <IconButton onClick={handleCopy} size="small">
                          {copied ? <CheckIcon color="success" /> : <ContentCopyIcon />}
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Button
              variant="outlined"
              color={link.isActive ? 'warning' : 'success'}
              startIcon={<LinkOffIcon />}
              onClick={() => toggleLink()}
              disabled={isToggling}
              sx={{ alignSelf: 'flex-start' }}
            >
              {link.isActive ? 'Désactiver le lien' : 'Réactiver le lien'}
            </Button>
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Fermer</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CandidateLinkDialog;
