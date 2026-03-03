import { type ChangeEvent } from 'react';
import { FormGroup, Stack, Typography } from '@mui/material';
import SmallInput from '../../../components/ui/SmallInput';
import AddressForm from '../../property/components/AddressForm';
import type { Person } from '../../../types/person.types';
import type { Address } from '../../../types/address.types';

interface Props {
  label: string;
  person: Person;
  onChange: (person: Person) => void;
  showAddress?: boolean;
}

const TenantForm = ({ label, person, onChange, showAddress = false }: Props) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({ ...person, [name]: value });
  };

  const handleAddressChange = (address: Address) =>
    onChange({ ...person, address });

  return (
    <FormGroup>
      <Typography color="text.secondary">{label}</Typography>
      <Stack my={1} gap={2} direction="row">
        <SmallInput name="lastName" value={person.lastName} onChange={handleChange} label="Nom" />
        <SmallInput name="firstName" value={person.firstName} onChange={handleChange} label="Prénom" />
      </Stack>
      {showAddress && (
        <AddressForm
          address={person.address ?? { street: '', postCode: '', city: '' }}
          onChange={handleAddressChange}
        />
      )}
    </FormGroup>
  );
};

export default TenantForm;
