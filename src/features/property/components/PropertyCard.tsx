import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material';
import type { Property } from '../types/property.types';

interface Props {
  property: Property;
  onClick: (property: Property) => void;
}

const PropertyCard = ({ property, onClick }: Props) => (
  <Card sx={{ width: '100%' }}>
    <CardActionArea onClick={() => onClick(property)}>
      <CardMedia image={property.image} sx={{ height: 140, bgcolor: 'grey.300' }} />
      <CardContent>
        <Typography variant="h6">{property.name}</Typography>
        <Typography variant="body2" color="text.secondary">
          {property.surface} m²
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {property.address.city}
        </Typography>
      </CardContent>
    </CardActionArea>
  </Card>
);

export default PropertyCard;
