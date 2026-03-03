import { Stack } from '@mui/material';
import type { Property } from '../types/property.types';
import PropertyCard from './PropertyCard';

interface Props {
  properties: Property[];
  onPropertyClick: (property: Property) => void;
}

const PropertyCardList = ({ properties, onPropertyClick }: Props) => (
  <Stack direction="row" flexWrap="wrap" gap={3}>
    {properties.map((property) => (
      <PropertyCard key={property.id} property={property} onClick={onPropertyClick} />
    ))}
  </Stack>
);

export default PropertyCardList;
