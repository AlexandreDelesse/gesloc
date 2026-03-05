import { useRef, useState } from 'react';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

interface Props {
  open: boolean;
  isLoading: boolean;
  onConfirm: (signedDocument: string) => void;
  onClose: () => void;
}

const SignTenancyDialog = ({ open, isLoading, onConfirm, onClose }: Props) => {
  const [base64, setBase64] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileError(null);
    if (file.size > MAX_FILE_SIZE) {
      setFileError('Le fichier dépasse la limite de 10 Mo.');
      e.target.value = '';
      return;
    }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setBase64(reader.result as string);
    };
    reader.onerror = () => {
      setFileError('Impossible de lire le fichier. Veuillez réessayer.');
      setFileName(null);
    };
    reader.readAsDataURL(file);
  };

  const handleConfirm = () => {
    if (base64) onConfirm(base64);
  };

  const handleClose = () => {
    setBase64(null);
    setFileName(null);
    setFileError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Signer le bail</DialogTitle>
      <DialogContent>
        <DialogContentText mb={2}>
          Uploadez le scan du bail signé (PDF ou image). Une fois confirmé, le contrat sera
          verrouillé et ne pourra plus être modifié.
        </DialogContentText>
        <Stack gap={2}>
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf,image/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <Button
            variant="outlined"
            startIcon={<UploadFileIcon />}
            onClick={() => inputRef.current?.click()}
          >
            Choisir un fichier
          </Button>
          {fileError && <Alert severity="error">{fileError}</Alert>}
          {fileName && !fileError && (
            <Typography variant="body2" color="text.secondary">
              Fichier sélectionné : {fileName}
            </Typography>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isLoading}>
          Annuler
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={handleConfirm}
          disabled={!base64 || isLoading}
          loading={isLoading}
        >
          Confirmer la signature
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SignTenancyDialog;
