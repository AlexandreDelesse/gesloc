import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Box, Button, CircularProgress, Divider, Paper, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import PageLayout from '../components/layout/PageLayout';
import ActionsMenu from '../components/ui/ActionsMenu';
import PropertyDetails from '../features/property/components/PropertyDetails';
import PropertyForm from '../features/property/components/PropertyForm';
import DeletePropertyDialog from '../features/property/components/DeletePropertyDialog';
import { useProperty } from '../features/property/hooks/useProperty';
import { useUpdateProperty } from '../features/property/hooks/useUpdateProperty';
import { useDeleteProperty } from '../features/property/hooks/useDeleteProperty';
import type { CreatePropertyData } from '../features/property/types/property.types';
import { useTenanciesByProperty } from '../features/tenancy/hooks/useTenanciesByProperty';
import TenancyList from '../features/tenancy/components/TenancyList';
import type { Tenancy } from '../features/tenancy/types/tenancy.types';

const PropertyPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data: property, isLoading, isError } = useProperty(id!);
  const { mutate: updateProperty, isPending: isUpdating } = useUpdateProperty(id!);
  const { mutate: deleteProperty, isPending: isDeleting } = useDeleteProperty();
  const { data: tenancies = [] } = useTenanciesByProperty(id!);

  const handleTenancyClick = (tenancy: Tenancy) =>
    navigate(`/property/${id}/tenancy/${tenancy.id}`);

  const handleUpdate = (data: CreatePropertyData) => {
    updateProperty(
      { ...data, id: id! },
      { onSuccess: () => setIsEditing(false) },
    );
  };

  const handleDelete = () => {
    deleteProperty(id!, {
      onSuccess: () => navigate('/'),
    });
  };

  if (isLoading) return <CircularProgress sx={{ m: 4 }} />;

  if (isError || !property) {
    return (
      <PageLayout title="Bien introuvable">
        <Typography color="text.secondary" mb={2}>
          Ce bien n'existe pas ou a été supprimé.
        </Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')}>
          Retour à la liste
        </Button>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      actions={
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')}>
          Retour
        </Button>
      }
    >
      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h5" fontWeight="bold">{property.name}</Typography>
          {!isEditing && (
            <ActionsMenu
              items={[
                { label: 'Modifier', icon: <EditIcon />, onClick: () => setIsEditing(true) },
                { label: 'Supprimer', icon: <DeleteIcon />, onClick: () => setDeleteDialogOpen(true), color: 'error' },
              ]}
            />
          )}
        </Box>
        <Divider sx={{ mb: 2 }} />
        {isEditing ? (
          <PropertyForm
            initialValues={property}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditing(false)}
            isLoading={isUpdating}
            submitLabel="Enregistrer"
          />
        ) : (
          <>
            <PropertyDetails property={property} />
          </>
        )}
      </Paper>

      <Paper sx={{ p: { xs: 2, sm: 3 }, mt: 3 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h6">Baux de location</Typography>
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => navigate(`/property/${id}/tenancy/new`)}
          >
            Nouveau bail
          </Button>
        </Box>
        <TenancyList tenancies={tenancies} onTenancyClick={handleTenancyClick} />
      </Paper>

      <DeletePropertyDialog
        propertyName={property.name}
        open={deleteDialogOpen}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteDialogOpen(false)}
      />
    </PageLayout>
  );
};

export default PropertyPage;
