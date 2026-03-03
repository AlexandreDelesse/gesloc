import { useRef, useState } from 'react';
import {
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

interface Props {
  open: boolean;
  isLoading: boolean;
  onConfirm: (signedDocument: string) => void;
  onClose: () => void;
}

const SignTenancyDialog = ({ open, isLoading, onConfirm, onClose }: Props) => {
  const [base64, setBase64] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleConfirm = () => {
    if (base64) onConfirm(base64);
  };

  const handleClose = () => {
    setBase64(null);
    setFileName(null);
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
          {fileName && (
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
