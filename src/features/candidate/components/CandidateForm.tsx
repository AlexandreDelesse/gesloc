import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  MenuItem,
  MobileStepper,
  Stack,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SendIcon from '@mui/icons-material/Send';
import { candidatePersonSchema, employmentTypeLabels, employmentTypeValues, guarantorProfileSchema } from '../types/candidate.types';
import type { CandidateDocument, CandidatePerson, EmploymentType, GuarantorProfile, SubmitCandidateData } from '../types/candidate.types';
import type { Person } from '../../../types/person.types';
import SmallInput from '../../../components/ui/SmallInput';
import TenantForm from '../../tenancy/components/TenantForm';
import DocumentsSection from './DocumentsSection';

const STEPS = [
  'Informations personnelles',
  'Situation & documents',
  'Caution',
  'Récapitulatif',
];

const EMPTY_PERSON: Person = { lastName: '', firstName: '' };

const EMPTY_PERSON_CANDIDATE: CandidatePerson = {
  lastName: '',
  firstName: '',
  email: '',
  phone: '',
};

const EMPTY_GUARANTOR: GuarantorProfile = {
  person: EMPTY_PERSON,
  employmentType: 'cdi',
  income: 0,
  documents: [],
};

interface FormState {
  person: CandidatePerson;
  employmentType: EmploymentType;
  income: number | '';
  documents: CandidateDocument[];
  hasGuarantor: boolean;
  guarantor: GuarantorProfile;
  coverLetter: string;
  gdprConsent: boolean;
}

interface Props {
  propertyId: string;
  onSubmit: (data: SubmitCandidateData) => void;
  isLoading?: boolean;
}

const CandidateForm = ({ propertyId, onSubmit, isLoading }: Props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const [values, setValues] = useState<FormState>({
    person: EMPTY_PERSON_CANDIDATE,
    employmentType: 'cdi',
    income: '',
    documents: [],
    hasGuarantor: false,
    guarantor: EMPTY_GUARANTOR,
    coverLetter: '',
    gdprConsent: false,
  });

  // ─── Handlers ───────────────────────────────────────────────────────────────

  const handlePersonChange = (field: keyof CandidatePerson, value: string) => {
    setValues((prev) => ({ ...prev, person: { ...prev.person, [field]: value } }));
  };

  const handlePersonAddressChange = (person: Person) => {
    setValues((prev) => ({ ...prev, person: { ...prev.person, ...person } }));
  };

  const handleGuarantorPersonChange = (person: Person) => {
    setValues((prev) => ({
      ...prev,
      guarantor: { ...prev.guarantor, person },
    }));
  };

  // ─── Step validation ─────────────────────────────────────────────────────────

  const validateStep = (): boolean => {
    setError(null);

    if (step === 0) {
      const result = candidatePersonSchema.safeParse(values.person);
      if (!result.success) {
        setError(result.error.issues[0].message);
        return false;
      }
    }

    if (step === 1) {
      if (!values.income && values.income !== 0) {
        setError('Le revenu mensuel net est requis');
        return false;
      }
      if (Number(values.income) < 0) {
        setError('Le revenu doit être positif');
        return false;
      }
    }

    if (step === 2 && values.hasGuarantor) {
      const result = guarantorProfileSchema.safeParse(values.guarantor);
      if (!result.success) {
        setError(result.error.issues[0].message);
        return false;
      }
    }

    if (step === 3) {
      if (!values.gdprConsent) {
        setError('Vous devez accepter la politique de confidentialité pour envoyer votre dossier');
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    setError(null);
    setStep((s) => s - 1);
  };

  const handleSubmit = () => {
    if (!validateStep()) return;

    const data: SubmitCandidateData = {
      propertyId,
      person: values.person,
      employmentType: values.employmentType,
      income: Number(values.income),
      documents: values.documents,
      hasGuarantor: values.hasGuarantor,
      guarantor: values.hasGuarantor ? values.guarantor : undefined,
      coverLetter: values.coverLetter || undefined,
      gdprConsent: true,
    };

    onSubmit(data);
  };

  // ─── Step contents ───────────────────────────────────────────────────────────

  const renderStep0 = () => (
    <Stack gap={3}>
      <Typography variant="subtitle1" color="text.secondary">
        Vos coordonnées
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} gap={2}>
        <SmallInput
          label="Nom"
          value={values.person.lastName}
          onChange={(e) => handlePersonChange('lastName', e.target.value)}
          required
        />
        <SmallInput
          label="Prénom"
          value={values.person.firstName}
          onChange={(e) => handlePersonChange('firstName', e.target.value)}
          required
        />
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} gap={2}>
        <SmallInput
          label="Email"
          type="email"
          value={values.person.email}
          onChange={(e) => handlePersonChange('email', e.target.value)}
          required
        />
        <SmallInput
          label="Téléphone"
          type="tel"
          value={values.person.phone}
          onChange={(e) => handlePersonChange('phone', e.target.value)}
          required
        />
      </Stack>
      <TenantForm
        label="Adresse actuelle (optionnel)"
        person={values.person}
        onChange={handlePersonAddressChange}
        showAddress
      />
    </Stack>
  );

  const renderStep1 = () => (
    <Stack gap={3}>
      <Stack direction={{ xs: 'column', sm: 'row' }} gap={2}>
        <TextField
          select
          size="small"
          label="Situation professionnelle"
          value={values.employmentType}
          onChange={(e) =>
            setValues((prev) => ({ ...prev, employmentType: e.target.value as EmploymentType }))
          }
          sx={{ minWidth: 220 }}
          required
        >
          {employmentTypeValues.map((val) => (
            <MenuItem key={val} value={val}>
              {employmentTypeLabels[val]}
            </MenuItem>
          ))}
        </TextField>
        <SmallInput
          type="number"
          label="Revenus nets mensuels (€)"
          value={values.income === '' ? '' : values.income}
          onChange={(e) =>
            setValues((prev) => ({
              ...prev,
              income: e.target.value === '' ? '' : Number(e.target.value),
            }))
          }
          inputProps={{ min: 0 }}
          required
        />
      </Stack>
      <Box>
        <Typography variant="subtitle1" color="text.secondary" mb={1}>
          Pièces justificatives
        </Typography>
        <DocumentsSection
          documents={values.documents}
          onChange={(documents) => setValues((prev) => ({ ...prev, documents }))}
        />
      </Box>
    </Stack>
  );

  const renderStep2 = () => (
    <Stack gap={3}>
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={values.hasGuarantor}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, hasGuarantor: e.target.checked }))
              }
            />
          }
          label="J'ai une caution"
        />
      </FormGroup>

      {values.hasGuarantor && (
        <>
          <TenantForm
            label="Identité de la caution"
            person={values.guarantor.person}
            onChange={handleGuarantorPersonChange}
            showAddress
          />
          <Stack direction={{ xs: 'column', sm: 'row' }} gap={2}>
            <TextField
              select
              size="small"
              label="Situation professionnelle"
              value={values.guarantor.employmentType}
              onChange={(e) =>
                setValues((prev) => ({
                  ...prev,
                  guarantor: {
                    ...prev.guarantor,
                    employmentType: e.target.value as EmploymentType,
                  },
                }))
              }
              sx={{ minWidth: 220 }}
            >
              {employmentTypeValues.map((val) => (
                <MenuItem key={val} value={val}>
                  {employmentTypeLabels[val]}
                </MenuItem>
              ))}
            </TextField>
            <SmallInput
              type="number"
              label="Revenus nets mensuels (€)"
              value={values.guarantor.income || ''}
              onChange={(e) =>
                setValues((prev) => ({
                  ...prev,
                  guarantor: { ...prev.guarantor, income: Number(e.target.value) },
                }))
              }
              inputProps={{ min: 0 }}
            />
          </Stack>
          <Box>
            <Typography variant="subtitle1" color="text.secondary" mb={1}>
              Pièces justificatives de la caution
            </Typography>
            <DocumentsSection
              documents={values.guarantor.documents}
              onChange={(documents) =>
                setValues((prev) => ({
                  ...prev,
                  guarantor: { ...prev.guarantor, documents },
                }))
              }
            />
          </Box>
        </>
      )}
    </Stack>
  );

  const renderStep3 = () => (
    <Stack gap={3}>
      <Box>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Récapitulatif
        </Typography>
        <Stack gap={0.5}>
          <Typography variant="body2">
            <strong>Nom :</strong> {values.person.firstName} {values.person.lastName}
          </Typography>
          <Typography variant="body2">
            <strong>Email :</strong> {values.person.email}
          </Typography>
          <Typography variant="body2">
            <strong>Téléphone :</strong> {values.person.phone}
          </Typography>
          <Typography variant="body2">
            <strong>Situation :</strong> {employmentTypeLabels[values.employmentType]}
          </Typography>
          <Typography variant="body2">
            <strong>Revenus :</strong> {Number(values.income).toLocaleString('fr-FR')} €/mois
          </Typography>
          <Typography variant="body2">
            <strong>Documents :</strong> {values.documents.length} fichier(s)
          </Typography>
          {values.hasGuarantor && values.guarantor && (
            <Typography variant="body2">
              <strong>Caution :</strong> {values.guarantor.person.firstName}{' '}
              {values.guarantor.person.lastName} —{' '}
              {values.guarantor.documents.length} document(s)
            </Typography>
          )}
        </Stack>
      </Box>

      <TextField
        label="Lettre de motivation (optionnel)"
        multiline
        rows={4}
        size="small"
        value={values.coverLetter}
        onChange={(e) => setValues((prev) => ({ ...prev, coverLetter: e.target.value }))}
        placeholder="Présentez-vous brièvement..."
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={values.gdprConsent}
            onChange={(e) => setValues((prev) => ({ ...prev, gdprConsent: e.target.checked }))}
          />
        }
        label={
          <Typography variant="body2">
            J'accepte que mes données personnelles soient traitées dans le cadre de ma candidature
            à cette location, conformément au RGPD.
          </Typography>
        }
      />
    </Stack>
  );

  const stepContents = [renderStep0(), renderStep1(), renderStep2(), renderStep3()];

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <Stack gap={3}>
      {isMobile ? (
        <MobileStepper
          variant="dots"
          steps={STEPS.length}
          position="static"
          activeStep={step}
          nextButton={null}
          backButton={null}
          sx={{ background: 'transparent', justifyContent: 'center' }}
        />
      ) : (
        <Stepper activeStep={step} alternativeLabel>
          {STEPS.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      )}

      {error && <Alert severity="error">{error}</Alert>}

      <Box>{stepContents[step]}</Box>

      <Stack direction="row" gap={2} justifyContent="space-between">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          disabled={step === 0 || isLoading}
          variant="outlined"
        >
          Précédent
        </Button>

        {step < STEPS.length - 1 ? (
          <Button
            endIcon={<ArrowForwardIcon />}
            onClick={handleNext}
            variant="contained"
          >
            Suivant
          </Button>
        ) : (
          <Button
            endIcon={<SendIcon />}
            onClick={handleSubmit}
            variant="contained"
            disabled={isLoading}
          >
            Envoyer mon dossier
          </Button>
        )}
      </Stack>
    </Stack>
  );
};

export default CandidateForm;
