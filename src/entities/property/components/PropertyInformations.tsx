import { Stack } from "@mui/material";
import SimpleFlexCard from "../../../shared/components/containers/SimpleFlexCard";
import DisplayInformation from "../../../shared/components/dataDisplay/displayInformation";
import type { Property } from "../property.model";

interface Props {
  property: Property;
}

function PropertyInformations(props: Props) {
  const { property } = props;

  const surfaceFormatted = `${property.surface} m²`;

  return (
    <SimpleFlexCard>
      <Stack gap={2}>
        <DisplayInformation
          title="Proprietaire"
          content={property.owner.fullName || property.owner.firstName}
        />
        <DisplayInformation title="Adresse" content={property.address.street} />
        <DisplayInformation title="Surface" content={surfaceFormatted} />
      </Stack>
    </SimpleFlexCard>
  );
}

export default PropertyInformations;
