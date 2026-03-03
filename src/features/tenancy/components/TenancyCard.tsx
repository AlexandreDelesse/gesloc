import { Card, CardActionArea, CardContent, Chip, Stack, Typography } from '@mui/material';
import type { Tenancy } from '../types/tenancy.types';
import { getTenancyEndDate, getTotalMonthlyAmount, isTenancyActive } from '../types/tenancy.types';

const formatDate = (isoDate: string) =>
  new Date(isoDate).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });

interface Props {
  tenancy: Tenancy;
  onClick: (tenancy: Tenancy) => void;
}

const TenancyCard = ({ tenancy, onClick }: Props) => {
  const active = isTenancyActive(tenancy);
  const endDate = getTenancyEndDate(tenancy);
  const total = getTotalMonthlyAmount(tenancy);

  return (
    <Card sx={{ width: 300 }}>
      <CardActionArea onClick={() => onClick(tenancy)}>
        <CardContent>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={0.5}>
            <Typography variant="h6">
              {tenancy.tenant.firstName} {tenancy.tenant.lastName}
            </Typography>
            <Chip
              label={active ? 'Actif' : 'Terminé'}
              color={active ? 'success' : 'default'}
              size="small"
            />
          </Stack>
          <Typography variant="body2" color="text.secondary">
            {formatDate(tenancy.startDate)} → {formatDate(endDate.toISOString().split('T')[0])}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {total} €/mois
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default TenancyCard;
