import { Container, Typography } from "@mui/material";
import CreatePropertyForm from "../entities/property/components/CreatePropertyForm";

interface Props {}

function CreatePropertyPage(props: Props) {
  const {} = props;

  return (
    <Container>
      <Typography variant="h2">Nouveau logement</Typography>
      <CreatePropertyForm />
    </Container>
  );
}

export default CreatePropertyPage;
