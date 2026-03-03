import { useState, type ChangeEvent } from 'react';
import { Box, Button, Paper, Stack, Typography, Alert } from '@mui/material';
import { createPropertySchema } from '../types/property.types';
import type { CreatePropertyData, Property } from '../types/property.types';
import type { Address } from '../../../types/address.types';
import type { Person } from '../../../types/person.types';
import AddressForm from './AddressForm';
import OwnerForm from './OwnerForm';
import SmallInput from '../../../components/ui/SmallInput';

const EMPTY_VALUES: CreatePropertyData = {
  name: '',
  surface: 0,
  image: '',
  address: { street: '', postCode: '', city: '' },
  owner: { lastName: '', firstName: '' },
};

interface Props {
  initialValues?: Property;
  onSubmit: (data: CreatePropertyData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  submitLabel?: string;
}

const PropertyForm = ({ initialValues, onSubmit, onCancel, isLoading, submitLabel = 'Enregistrer' }: Props) => {
  const [values, setValues] = useState<CreatePropertyData>(initialValues ?? EMPTY_VALUES);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: name === 'surface' ? Number(value) : value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setValues((prev) => ({ ...prev, image: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const handleAddressChange = (address: Address) => setValues((prev) => ({ ...prev, address }));
  const handleOwnerChange = (owner: Person) => setValues((prev) => ({ ...prev, owner }));

  const handleSubmit = () => {
    const result = createPropertySchema.safeParse(values);
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }
    setError(null);
    onSubmit(result.data);
  };

  return (
    <Paper sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="subtitle1" color="text.secondary" mb={1}>
        Informations
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Stack gap={2}>
        <Stack gap={2} direction={{ xs: 'column', sm: 'row' }}>
          <SmallInput
            name="name"
            label="Nom du bien"
            value={values.name}
            onChange={handleChange}
          />
          <SmallInput
            type="number"
            name="surface"
            label="Surface (m²)"
            value={values.surface || ''}
            onChange={handleChange}
          />
        </Stack>

        <AddressForm address={values.address} onChange={handleAddressChange} />
        <OwnerForm owner={values.owner} onChange={handleOwnerChange} />

        <Box>
          <Typography variant="subtitle1" color="text.secondary" mb={1}>
            Photo de couverture
          </Typography>
          {values.image && (
            <Box
              component="img"
              src={values.image}
              sx={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 1, mb: 1 }}
            />
          )}
          <Stack direction="row" gap={1}>
            <Button variant="outlined" size="small" component="label">
              {values.image ? 'Changer la photo' : 'Ajouter une photo'}
              <input type="file" accept="image/*" hidden onChange={handleImageChange} />
            </Button>
            {values.image && (
              <Button
                size="small"
                color="error"
                onClick={() => setValues((prev) => ({ ...prev, image: '' }))}
              >
                Supprimer
              </Button>
            )}
          </Stack>
        </Box>
      </Stack>

      <Stack direction="row" gap={2} mt={3}>
        <Button variant="contained" onClick={handleSubmit} disabled={isLoading}>
          {submitLabel}
        </Button>
        <Button variant="outlined" color="error" onClick={onCancel} disabled={isLoading}>
          Annuler
        </Button>
      </Stack>
    </Paper>
  );
};

export default PropertyForm;
