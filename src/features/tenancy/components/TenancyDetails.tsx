import { Chip, Stack, Typography } from '@mui/material';
import type { Tenancy } from '../types/tenancy.types';
import { getTenancyEndDate, getTotalMonthlyAmount, isTenancyActive } from '../types/tenancy.types';

const LEGAL_FRAMEWORK_LABELS: Record<string, string> = {
  'meublé-loi-89': 'Meublé – Loi du 6 juillet 1989',
  'vide-loi-89': 'Vide – Loi du 6 juillet 1989',
  autre: 'Autre',
};

const formatDate = (isoDate: string) =>
  new Date(isoDate).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });

interface Props {
  tenancy: Tenancy;
}

const TenancyDetails = ({ tenancy }: Props) => {
  const active = isTenancyActive(tenancy);
  const endDate = getTenancyEndDate(tenancy);
  const total = getTotalMonthlyAmount(tenancy);

  return (
    <Stack gap={1}>
      <Stack direction="row" alignItems="center" gap={1}>
        <Chip
          label={tenancy.status === 'signé' ? 'Signé' : 'Brouillon'}
          color={tenancy.status === 'signé' ? 'info' : 'warning'}
          size="small"
        />
        <Chip
          label={active ? 'Actif' : 'Terminé'}
          color={active ? 'success' : 'default'}
          size="small"
        />
      </Stack>

      <Typography variant="body1">
        <strong>Locataire :</strong> {tenancy.tenant.firstName} {tenancy.tenant.lastName}
      </Typography>

      {tenancy.guarantor && (
        <Typography variant="body1">
          <strong>Caution :</strong> {tenancy.guarantor.firstName} {tenancy.guarantor.lastName}
        </Typography>
      )}

      <Typography variant="body1">
        <strong>Cadre légal :</strong> {LEGAL_FRAMEWORK_LABELS[tenancy.legalFramework] ?? tenancy.legalFramework}
      </Typography>

      <Typography variant="body1">
        <strong>Destination :</strong> {tenancy.propertyUse === 'habitation' ? 'Habitation' : 'Mixte'}
      </Typography>

      <Typography variant="body1">
        <strong>Début du bail :</strong> {formatDate(tenancy.startDate)}
      </Typography>

      <Typography variant="body1">
        <strong>Durée :</strong> {tenancy.durationMonths} mois (jusqu'au {endDate.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })})
      </Typography>

      <Typography variant="body1">
        <strong>Loyer HC :</strong> {tenancy.rentAmount} €/mois
      </Typography>

      <Typography variant="body1">
        <strong>Charges :</strong> {tenancy.chargesAmount} €/mois ({tenancy.chargesType === 'forfait' ? 'forfait' : 'provision'})
      </Typography>

      <Typography variant="body1">
        <strong>Total mensuel :</strong> {total} €/mois
      </Typography>

      <Typography variant="body1">
        <strong>Échéance :</strong> le {tenancy.paymentDueDay} de chaque mois
      </Typography>

      <Typography variant="body1">
        <strong>Dépôt de garantie :</strong> {tenancy.securityDeposit} €
      </Typography>
    </Stack>
  );
};

export default TenancyDetails;
