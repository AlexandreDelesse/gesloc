import { type ChangeEvent } from 'react';
import { FormGroup, Stack, Typography } from '@mui/material';
import SmallInput from '../../../components/ui/SmallInput';
import type { Person } from '../../../types/person.types';

interface Props {
  owner: Person;
  onChange: (owner: Person) => void;
}

const OwnerForm = ({ owner, onChange }: Props) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({ ...owner, [name]: value });
  };

  return (
    <FormGroup>
      <Typography color="text.secondary">Propriétaire</Typography>
      <Stack my={1} gap={2} direction="row">
        <SmallInput name="lastName" value={owner.lastName} onChange={handleChange} label="Nom" />
        <SmallInput name="firstName" value={owner.firstName} onChange={handleChange} label="Prénom" />
      </Stack>
    </FormGroup>
  );
};

export default OwnerForm;
