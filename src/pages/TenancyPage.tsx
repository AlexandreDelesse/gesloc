import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Button, CircularProgress, Paper, Stack, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PageLayout from '../components/layout/PageLayout';
import TenancyDetails from '../features/tenancy/components/TenancyDetails';
import TenancyForm from '../features/tenancy/components/TenancyForm';
import DeleteTenancyDialog from '../features/tenancy/components/DeleteTenancyDialog';
import { useTenancy } from '../features/tenancy/hooks/useTenancy';
import { useUpdateTenancy } from '../features/tenancy/hooks/useUpdateTenancy';
import { useDeleteTenancy } from '../features/tenancy/hooks/useDeleteTenancy';
import type { CreateTenancyData } from '../features/tenancy/types/tenancy.types';

const TenancyPage = () => {
  const { id: propertyId, tenancyId } = useParams<{ id: string; tenancyId: string }>();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data: tenancy, isLoading, isError } = useTenancy(tenancyId!);
  const { mutate: updateTenancy, isPending: isUpdating } = useUpdateTenancy(tenancyId!, propertyId!);
  const { mutate: deleteTenancy, isPending: isDeleting } = useDeleteTenancy(propertyId!);

  const handleUpdate = (data: CreateTenancyData) => {
    updateTenancy(
      { ...data, id: tenancyId! },
      { onSuccess: () => setIsEditing(false) },
    );
  };

  const handleDelete = () => {
    deleteTenancy(tenancyId!, {
      onSuccess: () => navigate(`/property/${propertyId}`),
    });
  };

  if (isLoading) return <CircularProgress sx={{ m: 4 }} />;

  if (isError || !tenancy) {
    return (
      <PageLayout title="Bail introuvable">
        <Typography color="text.secondary" mb={2}>
          Ce bail n'existe pas ou a été supprimé.
        </Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(`/property/${propertyId}`)}>
          Retour au bien
        </Button>
      </PageLayout>
    );
  }

  const tenantName = `${tenancy.tenant.firstName} ${tenancy.tenant.lastName}`;

  return (
    <PageLayout
      title={tenantName}
      actions={
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(`/property/${propertyId}`)}
        >
          Retour
        </Button>
      }
    >
      <Paper sx={{ p: 3 }}>
        {isEditing ? (
          <TenancyForm
            initialValues={tenancy}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditing(false)}
            isLoading={isUpdating}
            submitLabel="Enregistrer"
          />
        ) : (
          <>
            <TenancyDetails tenancy={tenancy} />
            <Stack direction="row" gap={2} mt={3}>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => setIsEditing(true)}
              >
                Modifier
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => setDeleteDialogOpen(true)}
              >
                Supprimer
              </Button>
            </Stack>
          </>
        )}
      </Paper>

      <DeleteTenancyDialog
        tenantName={tenantName}
        open={deleteDialogOpen}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteDialogOpen(false)}
      />
    </PageLayout>
  );
};

export default TenancyPage;
