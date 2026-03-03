import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

interface Props {
  propertyName: string;
  open: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

const DeletePropertyDialog = ({ propertyName, open, isLoading, onConfirm, onClose }: Props) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Supprimer le bien</DialogTitle>
    <DialogContent>
      <DialogContentText>
        Êtes-vous sûr de vouloir supprimer <strong>{propertyName}</strong> ? Cette action est irréversible.
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

export default DeletePropertyDialog;
