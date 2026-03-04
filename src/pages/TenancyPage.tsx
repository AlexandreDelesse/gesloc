import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Button, CircularProgress, Divider, Paper, Stack, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import GavelIcon from '@mui/icons-material/Gavel';
import PageLayout from '../components/layout/PageLayout';
import ActionsMenu from '../components/ui/ActionsMenu';
import TenancyDetails from '../features/tenancy/components/TenancyDetails';
import TenancyForm from '../features/tenancy/components/TenancyForm';
import DeleteTenancyDialog from '../features/tenancy/components/DeleteTenancyDialog';
import SignTenancyDialog from '../features/tenancy/components/SignTenancyDialog';
import { useTenancy } from '../features/tenancy/hooks/useTenancy';
import { useUpdateTenancy } from '../features/tenancy/hooks/useUpdateTenancy';
import { useDeleteTenancy } from '../features/tenancy/hooks/useDeleteTenancy';
import { useProperty } from '../features/property/hooks/useProperty';
import { downloadBailPdf } from '../features/tenancy/pdf/BailDocument';
import PaymentTable from '../features/payment/components/PaymentTable';
import { useCreatePaymentBatch } from '../features/payment/hooks/useCreatePaymentBatch';
import type { CreateTenancyData } from '../features/tenancy/types/tenancy.types';

const TenancyPage = () => {
  const { id: propertyId, tenancyId } = useParams<{ id: string; tenancyId: string }>();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [signDialogOpen, setSignDialogOpen] = useState(false);

  const { data: tenancy, isLoading, isError } = useTenancy(tenancyId!);
  const { data: property } = useProperty(propertyId!);
  const { mutate: updateTenancy, isPending: isUpdating } = useUpdateTenancy(tenancyId!, propertyId!);
  const { mutate: deleteTenancy, isPending: isDeleting } = useDeleteTenancy(propertyId!);
  const { mutate: createPaymentBatch } = useCreatePaymentBatch(tenancyId!);

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

  const handleSign = (signedDocument: string) => {
    if (!tenancy) return;
    updateTenancy(
      { id: tenancyId!, status: 'signé', signedDocument },
      {
        onSuccess: (updated) => {
          setSignDialogOpen(false);
          // Auto-generate monthly payments
          const payments = Array.from({ length: updated.durationMonths }, (_, i) => {
            const d = new Date(updated.startDate);
            d.setMonth(d.getMonth() + i);
            const y = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, '0');
            return {
              tenancyId: updated.id,
              period: `${y}-${m}`,
              rentAmount: updated.rentAmount,
              chargesAmount: updated.chargesAmount,
              dueDate: `${y}-${m}-${String(updated.paymentDueDay).padStart(2, '0')}`,
              status: 'en_attente' as const,
            };
          });
          createPaymentBatch(payments);
        },
      },
    );
  };

  const handleDownloadSigned = () => {
    if (!tenancy?.signedDocument) return;
    const a = document.createElement('a');
    a.href = tenancy.signedDocument;
    a.download = `bail-signé-${tenancy.tenant.lastName}.pdf`;
    a.click();
  };

  const handleDownloadPdf = () => {
    if (!tenancy || !property) return;
    downloadBailPdf(tenancy, property);
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
  const isSigned = tenancy.status === 'signé';

  const menuItems = [
    ...(!isSigned ? [{ label: 'Modifier', icon: <EditIcon />, onClick: () => setIsEditing(true) }] : []),
    { label: 'Télécharger le bail', icon: <DownloadIcon />, onClick: handleDownloadPdf, disabled: !property },
    ...(isSigned && tenancy.signedDocument ? [{ label: 'Voir le bail signé', icon: <DownloadIcon />, onClick: handleDownloadSigned }] : []),
    { label: 'Supprimer', icon: <DeleteIcon />, onClick: () => setDeleteDialogOpen(true), color: 'error' as const },
  ];

  return (
    <PageLayout
      title={tenantName}
      actions={
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(`/property/${propertyId}`)}>
          Retour
        </Button>
      }
    >
      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
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
            <Box display="flex" justifyContent="flex-end" alignItems="center" gap={1} mb={1}>
              {!isSigned && (
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  startIcon={<GavelIcon />}
                  onClick={() => setSignDialogOpen(true)}
                >
                  Signer
                </Button>
              )}
              <ActionsMenu items={menuItems} />
            </Box>
            <TenancyDetails tenancy={tenancy} />
          </>
        )}
      </Paper>

      {isSigned && !isEditing && (
        <Paper sx={{ p: { xs: 2, sm: 3 }, mt: 3 }}>
          <Typography variant="h6" mb={2}>
            Suivi des paiements
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <PaymentTable tenancyId={tenancyId!} tenancy={tenancy} property={property ?? null} />
        </Paper>
      )}

      <DeleteTenancyDialog
        tenantName={tenantName}
        open={deleteDialogOpen}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteDialogOpen(false)}
      />

      <SignTenancyDialog
        open={signDialogOpen}
        isLoading={isUpdating}
        onConfirm={handleSign}
        onClose={() => setSignDialogOpen(false)}
      />
    </PageLayout>
  );
};

export default TenancyPage;
