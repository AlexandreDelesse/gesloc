import { Stack, Typography } from '@mui/material';
import type { Tenancy } from '../types/tenancy.types';
import TenancyCard from './TenancyCard';

interface Props {
  tenancies: Tenancy[];
  onTenancyClick: (tenancy: Tenancy) => void;
}

const TenancyList = ({ tenancies, onTenancyClick }: Props) => {
  if (tenancies.length === 0) {
    return (
      <Typography color="text.secondary">Aucun bail enregistré pour ce bien.</Typography>
    );
  }

  return (
    <Stack direction="row" flexWrap="wrap" gap={3}>
      {tenancies.map((tenancy) => (
        <TenancyCard key={tenancy.id} tenancy={tenancy} onClick={onTenancyClick} />
      ))}
    </Stack>
  );
};

export default TenancyList;
