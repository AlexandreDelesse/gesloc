import { type ChangeEvent } from "react";
import type { People } from "../../../shared/models/People.model";
import { FormGroup, Stack, Typography } from "@mui/material";
import SmallInput from "../../../shared/components/form/SmallInput";

interface Props {
  onChange: (person: People) => void;
  owner: People;
}

// TODO: Peut-être le deplacer dans shared
function OwnerForm(props: Props) {
  const { owner, onChange } = props;

  const handleOnChanges = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({ ...owner, [name]: value });
  };

  return (
    <FormGroup>
      <Typography color="textSecondary">Proprietaire</Typography>
      <Stack my={1} gap={2} direction={"row"}>
        <SmallInput
          name="lastName"
          value={owner.lastName}
          onChange={handleOnChanges}
          label="LastName"
        />
        <SmallInput
          name="firstName"
          value={owner.firstName}
          onChange={handleOnChanges}
          label="FirstName"
        />
      </Stack>
    </FormGroup>
  );
}

export default OwnerForm;
