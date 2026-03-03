import { Grid } from '@mui/material';
import type { Property } from '../types/property.types';
import PropertyCard from './PropertyCard';

interface Props {
  properties: Property[];
  onPropertyClick: (property: Property) => void;
}

const PropertyCardList = ({ properties, onPropertyClick }: Props) => (
  <Grid container spacing={3}>
    {properties.map((property) => (
      <Grid key={property.id} size={{ xs: 12, sm: 6, md: 4 }}>
        <PropertyCard property={property} onClick={onPropertyClick} />
      </Grid>
    ))}
  </Grid>
);

export default PropertyCardList;
