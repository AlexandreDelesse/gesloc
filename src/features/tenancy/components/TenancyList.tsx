import { Grid, Typography } from '@mui/material';
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
    <Grid container spacing={3}>
      {tenancies.map((tenancy) => (
        <Grid key={tenancy.id} size={{ xs: 12, sm: 6, md: 4 }}>
          <TenancyCard tenancy={tenancy} onClick={onTenancyClick} />
        </Grid>
      ))}
    </Grid>
  );
};

export default TenancyList;
