import { Box, Stack, Typography } from '@mui/material';
import type { Property } from '../types/property.types';

interface Props {
  property: Property;
}

const PropertyDetails = ({ property }: Props) => {
  const { owner, address, surface, image } = property;
  const ownerName = `${owner?.firstName ?? ''} ${owner?.lastName ?? ''}`.trim();
  const addressLine = [
    address?.number ? String(address.number) : null,
    address?.street,
    address?.postCode && address?.city ? `${address.postCode} ${address.city}` : null,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <Stack gap={1}>
      {image && (
        <Box
          component="img"
          src={image}
          sx={{ width: '100%', maxHeight: 300, objectFit: 'cover', borderRadius: 1, mb: 1 }}
        />
      )}
      <Typography variant="body1">
        <strong>Propriétaire :</strong> {ownerName || '—'}
      </Typography>
      <Typography variant="body1">
        <strong>Adresse :</strong> {addressLine || '—'}
      </Typography>
      {address?.residence && (
        <Typography variant="body1">
          <strong>Résidence :</strong> {address.residence}
        </Typography>
      )}
      <Typography variant="body1">
        <strong>Surface :</strong> {surface} m²
      </Typography>
    </Stack>
  );
};

export default PropertyDetails;
