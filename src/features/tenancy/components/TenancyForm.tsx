import { useState, type ChangeEvent } from 'react';
import {
  Alert,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { createTenancySchema } from '../types/tenancy.types';
import type { CreateTenancyData, Tenancy } from '../types/tenancy.types';
import type { Person } from '../../../types/person.types';
import SmallInput from '../../../components/ui/SmallInput';
import TenantForm from './TenantForm';

const EMPTY_PERSON: Person = { lastName: '', firstName: '' };

const EMPTY_VALUES: CreateTenancyData = {
  tenant: { lastName: '', firstName: '' },
  propertyId: '',
  legalFramework: 'meublé-loi-89',
  propertyUse: 'habitation',
  startDate: '',
  durationMonths: 1,
  rentAmount: 0,
  chargesAmount: 0,
  chargesType: 'forfait',
  paymentDueDay: 5,
  securityDeposit: 0,
  status: 'brouillon',
};

interface Props {
  initialValues?: Tenancy;
  onSubmit: (data: CreateTenancyData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  submitLabel?: string;
}

const TenancyForm = ({
  initialValues,
  onSubmit,
  onCancel,
  isLoading,
  submitLabel = 'Enregistrer',
}: Props) => {
  const [values, setValues] = useState<CreateTenancyData>(initialValues ?? EMPTY_VALUES);
  const [hasGuarantor, setHasGuarantor] = useState(!!initialValues?.guarantor);
  const [error, setError] = useState<string | null>(null);

  const handleNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: Number(value) }));
  };

  const handleStringChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleTenantChange = (tenant: Person) => setValues((prev) => ({ ...prev, tenant }));

  const handleGuarantorChange = (guarantor: Person) =>
    setValues((prev) => ({ ...prev, guarantor }));

  const toggleGuarantor = (checked: boolean) => {
    setHasGuarantor(checked);
    setValues((prev) => ({
      ...prev,
      guarantor: checked ? (prev.guarantor ?? EMPTY_PERSON) : undefined,
    }));
  };

  const handleSubmit = () => {
    const result = createTenancySchema.safeParse(values);
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }
    setError(null);
    onSubmit(result.data);
  };

  return (
    <Paper sx={{ p: { xs: 2, sm: 3 } }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Stack gap={3}>
        {/* Cadre légal */}
        <FormGroup>
          <Typography variant="subtitle1" color="text.secondary" mb={1}>
            Cadre légal
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} gap={2}>
            <TextField
              select
              size="small"
              label="Type de bail"
              name="legalFramework"
              value={values.legalFramework}
              onChange={handleStringChange}
              sx={{ minWidth: 220 }}
            >
              <MenuItem value="meublé-loi-89">Meublé – Loi du 6 juillet 1989</MenuItem>
              <MenuItem value="vide-loi-89">Vide – Loi du 6 juillet 1989</MenuItem>
              <MenuItem value="autre">Autre</MenuItem>
            </TextField>
            <TextField
              select
              size="small"
              label="Destination"
              name="propertyUse"
              value={values.propertyUse}
              onChange={handleStringChange}
              sx={{ minWidth: 160 }}
            >
              <MenuItem value="habitation">Habitation</MenuItem>
              <MenuItem value="mixte">Mixte</MenuItem>
            </TextField>
          </Stack>
        </FormGroup>

        {/* Locataire */}
        <TenantForm
          label="Locataire"
          person={values.tenant}
          onChange={handleTenantChange}
          showAddress
        />

        {/* Caution */}
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={hasGuarantor}
                onChange={(e) => toggleGuarantor(e.target.checked)}
              />
            }
            label="Ajouter une caution"
          />
          {hasGuarantor && (
            <TenantForm
              label="Caution"
              person={values.guarantor ?? EMPTY_PERSON}
              onChange={handleGuarantorChange}
            />
          )}
        </FormGroup>

        {/* Durée du bail */}
        <FormGroup>
          <Typography variant="subtitle1" color="text.secondary" mb={1}>
            Durée du bail
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} gap={2}>
            <SmallInput
              type="date"
              name="startDate"
              label="Date de début"
              value={values.startDate}
              onChange={handleStringChange}
              InputLabelProps={{ shrink: true }}
            />
            <SmallInput
              type="number"
              name="durationMonths"
              label="Durée (mois)"
              value={values.durationMonths || ''}
              onChange={handleNumberChange}
              inputProps={{ min: 1 }}
            />
          </Stack>
        </FormGroup>

        {/* Conditions financières */}
        <FormGroup>
          <Typography variant="subtitle1" color="text.secondary" mb={1}>
            Conditions financières
          </Typography>
          <Stack direction="row" gap={2} flexWrap="wrap">
            <SmallInput
              type="number"
              name="rentAmount"
              label="Loyer HC (€/mois)"
              value={values.rentAmount || ''}
              onChange={handleNumberChange}
              inputProps={{ min: 0 }}
            />
            <SmallInput
              type="number"
              name="chargesAmount"
              label="Charges (€/mois)"
              value={values.chargesAmount || ''}
              onChange={handleNumberChange}
              inputProps={{ min: 0 }}
            />
            <TextField
              select
              size="small"
              label="Type de charges"
              name="chargesType"
              value={values.chargesType}
              onChange={handleStringChange}
              sx={{ minWidth: 160 }}
            >
              <MenuItem value="forfait">Forfait</MenuItem>
              <MenuItem value="provision">Provision</MenuItem>
            </TextField>
            <SmallInput
              type="number"
              name="paymentDueDay"
              label="Échéance (jour)"
              value={values.paymentDueDay || ''}
              onChange={handleNumberChange}
              inputProps={{ min: 1, max: 28 }}
            />
          </Stack>
        </FormGroup>

        {/* Dépôt de garantie */}
        <FormGroup>
          <Typography variant="subtitle1" color="text.secondary" mb={1}>
            Dépôt de garantie
          </Typography>
          <SmallInput
            type="number"
            name="securityDeposit"
            label="Montant (€)"
            value={values.securityDeposit || ''}
            onChange={handleNumberChange}
            inputProps={{ min: 0 }}
            sx={{ maxWidth: 200 }}
          />
        </FormGroup>
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

export default TenancyForm;
