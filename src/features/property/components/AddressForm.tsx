import { type ChangeEvent } from 'react';
import { FormGroup, Stack, Typography } from '@mui/material';
import SmallInput from '../../../components/ui/SmallInput';
import type { Address } from '../../../types/address.types';

interface Props {
  address: Address;
  onChange: (address: Address) => void;
}

const AddressForm = ({ address, onChange }: Props) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({ ...address, [name]: value });
  };

  return (
    <FormGroup>
      <Typography color="text.secondary">Adresse</Typography>
      <Stack my={1} gap={2} direction="row">
        <SmallInput name="street" value={address.street} onChange={handleChange} label="Rue / Chemin" />
        <SmallInput name="postCode" value={address.postCode} onChange={handleChange} label="Code postal" />
        <SmallInput name="city" value={address.city} onChange={handleChange} label="Ville" />
      </Stack>
    </FormGroup>
  );
};

export default AddressForm;
