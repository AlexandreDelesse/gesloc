import { Box, Container, Stack, Typography } from "@mui/material";
import { Navigate, useParams } from "react-router";
import { getHouseById } from "../entities/housing/housing.repository";
import HousingInformations from "../entities/housing/components/HousingInformations";
import TenancyList from "../entities/tenancy/components/TenancyList";
import CurrentTenancy from "../entities/tenancy/components/CurrentTenancy";

interface Props {}

function HousePage(props: Props) {
  const {} = props;
  const { id } = useParams();
  const house = getHouseById(id!);

  //TODO: Remplacer le navigate par un bloc d'information "ID n'existe pas" + Boutton retour au menu
  if (!house) return <Navigate to={"/"} replace />;

  //TODO: Ajouter un bouton de retour
  return (
    <Container>
      <Typography variant="h2" my={2}>
        {house.name}
      </Typography>

      <Stack direction={"row"} gap={2}>
        <HousingInformations house={house} />
        <CurrentTenancy house={house} />
      </Stack>
      <Box my={2}>
        <TenancyList houseId={house.id} />
      </Box>
    </Container>
  );
}

export default HousePage;
