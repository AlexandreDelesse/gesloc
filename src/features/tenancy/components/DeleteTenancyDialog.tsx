import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

interface Props {
  tenantName: string;
  open: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

const DeleteTenancyDialog = ({ tenantName, open, isLoading, onConfirm, onClose }: Props) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Supprimer le bail</DialogTitle>
    <DialogContent>
      <DialogContentText>
        Êtes-vous sûr de vouloir supprimer le bail de <strong>{tenantName}</strong> ? Cette action est irréversible.
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} disabled={isLoading}>
        Annuler
      </Button>
      <Button onClick={onConfirm} color="error" variant="contained" disabled={isLoading}>
        Supprimer
      </Button>
    </DialogActions>
  </Dialog>
);

export default DeleteTenancyDialog;
