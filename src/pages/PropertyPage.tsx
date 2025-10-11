import { Box, Container, Stack, Typography } from "@mui/material";
import { Navigate, useParams } from "react-router";
import HousingInformations from "../entities/property/components/PropertyInformations";
import TenancyList from "../entities/tenancy/components/TenancyList";
import CurrentTenancy from "../entities/tenancy/components/CurrentTenancy";
import { localPropertyRepository } from "../entities/property/localProperty.repository";
import PropertyInformations from "../entities/property/components/PropertyInformations";

interface Props {}

function PropertyPage(props: Props) {
  const {} = props;
  const { id } = useParams();
  const property = localPropertyRepository.getPropertyById(id!);

  //TODO: Remplacer le navigate par un bloc d'information "ID n'existe pas" + Boutton retour au menu
  if (!property) return <Navigate to={"/"} replace />;

  //TODO: Ajouter un bouton de retour
  return (
    <Container>
      <Typography variant="h2" my={2}>
        {property.name}
      </Typography>

      <Stack direction={"row"} gap={2}>
        <PropertyInformations property={property} />
        <CurrentTenancy property={property} />
      </Stack>
      <Box my={2}>
        <TenancyList propertyId={property.id} />
      </Box>
    </Container>
  );
}

export default PropertyPage;
