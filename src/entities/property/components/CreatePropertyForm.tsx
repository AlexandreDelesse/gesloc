import { Button, FormGroup, Stack, Typography } from "@mui/material";
import { useState, type ChangeEvent } from "react";
import OwnerForm from "./OwnerForm";
import type { People } from "../../../shared/models/People.model";
import AdressForm from "./AdressForm";
import type { Adress } from "../../../shared/models/Adress.model";
import SmallInput from "../../../shared/components/form/SmallInput";
import { useNavigate } from "react-router";
import type { CreatePropertyCmd, Property } from "../property.model";
import { localPropertyRepository } from "../localProperty.repository";

interface Props {}

function CreatePropertyForm(props: Props) {
  const {} = props;

  const navigate = useNavigate();

  const [values, setValues] = useState({
    address: { city: "", street: "", postCode: "" },
    image: "",
    name: "",
    owner: { lastName: "", firstName: "" },
    surface: "",
  });

  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((old) => ({ ...old, [name]: value }));
  };

  const handleOwnerChanges = (person: People) =>
    setValues((old) => ({ ...old, owner: person }));

  const handleAdressChanges = (address: Adress) =>
    setValues((old) => ({ ...old, address }));

  //TODO: Faire un mapper propre
  //TODO: Incorporer le mapper dans un service (useService)
  const handleSubmit = () => {
    const property: CreatePropertyCmd = {
      address: values.address,
      image: "",
      name: values.name,
      owner: values.owner,
      surface: parseInt(values.surface),
    };
    localPropertyRepository.createProperty(property);
    navigate(-1);
  };

  const handleOnCancel = () => navigate(-1);

  return (
    <FormGroup
      sx={{ bgcolor: "lightgrey", padding: 2, my: 2, borderRadius: 2 }}
    >
      <Typography color="textSecondary">Informations</Typography>

      <Stack direction="column" gap={2} my={1}>
        <Stack gap={2} direction={"row"}>
          <SmallInput
            type="text"
            name="name"
            value={values.name}
            onChange={handleFormChange}
            label="Nom du logement"
          />
          <SmallInput
            type="number"
            name="surface"
            value={values.surface}
            onChange={handleFormChange}
            label="Surface (m²)"
          />
        </Stack>

        <AdressForm adress={values.address} onChange={handleAdressChanges} />

        <OwnerForm owner={values.owner} onChange={handleOwnerChanges} />
      </Stack>

      <Stack direction={"row"} gap={2} my={2}>
        <Button variant="contained" onClick={handleSubmit}>
          Ajouter
        </Button>
        <Button variant="outlined" color="error" onClick={handleOnCancel}>
          Annuler
        </Button>
      </Stack>
    </FormGroup>
  );
}

export default CreatePropertyForm;
