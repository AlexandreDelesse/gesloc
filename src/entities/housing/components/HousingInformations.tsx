import { Stack } from "@mui/material";
import SimpleFlexCard from "../../../shared/components/containers/SimpleFlexCard";
import DisplayInformation from "../../../shared/components/dataDisplay/displayInformation";
import type { Housing } from "../housing.models";

interface Props {
  house: Housing;
}

function HousingInformations(props: Props) {
  const { house } = props;

  const surfaceFormatted = `${house.surface} m²`;

  return (
    <SimpleFlexCard>
      <Stack gap={2}>
        <DisplayInformation
          title="Proprietaire"
          content={house.owner.fullName || house.owner.firstName}
        />
        <DisplayInformation title="Adresse" content={house.address} />
        <DisplayInformation title="Surface" content={surfaceFormatted} />
      </Stack>
    </SimpleFlexCard>
  );
}

export default HousingInformations;
