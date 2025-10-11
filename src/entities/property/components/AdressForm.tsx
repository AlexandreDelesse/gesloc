import { type ChangeEvent } from "react";
import type { Adress } from "../../../shared/models/Adress.model";
import { FormGroup, Stack, Typography } from "@mui/material";
import SmallInput from "../../../shared/components/form/SmallInput";

interface Props {
  adress: Adress;
  onChange: (adress: Adress) => void;
}

function AdressForm(props: Props) {
  const { adress, onChange } = props;

  const handleOnChanges = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({ ...adress, [name]: value });
  };

  return (
    <FormGroup>
      <Typography color="textSecondary">Adresse</Typography>
      <Stack my={1} gap={2} direction={"row"}>
        <SmallInput
          name="street"
          value={adress.street}
          onChange={handleOnChanges}
          label="Rue/Chemin"
        />
        <SmallInput
          name="postCode"
          value={adress.postCode}
          onChange={handleOnChanges}
          label="Code postal"
        />
        <SmallInput
          name="city"
          value={adress.city}
          onChange={handleOnChanges}
          label="Ville"
        />
      </Stack>
    </FormGroup>
  );
}

export default AdressForm;
