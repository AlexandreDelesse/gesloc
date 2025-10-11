import { Button, Container, Stack, Typography } from "@mui/material";
import HousingCardList from "../entities/property/components/PropertyCardList";
import { useNavigate } from "react-router";
import type { Property } from "../entities/property/property.model";
import { localPropertyRepository } from "../entities/property/localProperty.repository";
import AddIcon from "@mui/icons-material/Add";

interface Props {}

function HomePage(props: Props) {
  const {} = props;
  const navigate = useNavigate();

  const properties: Property[] = localPropertyRepository.getProperties();

  const handleOnHouseClick = (p: Property) => {
    navigate(`property/${p.id}`);
  };

  const handleNewPropertyClick = () => navigate("create-property");

  //TODO: Faire un composant Page réutilisable pour que les pages soient cohérentes.
  return (
    <Container>
      <Stack direction="row" gap={2} my={2} alignItems="baseline">
        <Typography variant="h2">Logements</Typography>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleNewPropertyClick}
        >
          Ajouter
        </Button>
      </Stack>

      <HousingCardList properties={properties} onClick={handleOnHouseClick} />
    </Container>
  );
}

export default HomePage;
