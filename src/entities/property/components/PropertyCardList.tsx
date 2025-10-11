import { Stack } from "@mui/material";
import type { Property } from "../property.model";
import PropertyCard from "./PropertyCard";

interface Props {
  properties: Property[];
  onClick?: (h: Property) => void;
}

function PropertyCardList(props: Props) {
  const { properties, onClick } = props;

  return (
    <Stack gap={2} direction="row">
      {properties.map((p) => (
        <PropertyCard key={p.id} onClick={onClick} property={p} />
      ))}
    </Stack>
  );
}

export default PropertyCardList;
