import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import type { Property } from "../property.model";

interface Props {
  property: Property;
  onClick?: (h: Property) => void;
}

function PropertyCard(props: Props) {
  const { property, onClick } = props;

  const handleOnCardClick = () => {
    if (onClick) onClick(property);
    else alert("Clicked on card : " + property.address);
  };

  return (
    <Card sx={{ width: 340 }}>
      <CardActionArea onClick={handleOnCardClick}>
        <CardMedia image={property.image} sx={{ height: 140 }} />
        <CardContent>
          <Typography variant="h6">{property.name}</Typography>
          <Typography variant="body1">{property.surface} m²</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default PropertyCard;
