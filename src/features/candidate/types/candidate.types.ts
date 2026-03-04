import { z } from 'zod';
import { personSchema } from '../../../types/person.types';

// ─── Document types ───────────────────────────────────────────────────────────

export const documentTypeValues = [
  'identite',
  'justificatif_revenus',
  'avis_imposition',
  'contrat_travail',
  'autre',
] as const;
export type DocumentType = (typeof documentTypeValues)[number];

export const documentTypeLabels: Record<DocumentType, string> = {
  identite: "Pièce d'identité",
  justificatif_revenus: 'Justificatif de revenus',
  avis_imposition: "Avis d'imposition",
  contrat_travail: 'Contrat de travail',
  autre: 'Autre document',
};

// ─── Employment types ─────────────────────────────────────────────────────────

export const employmentTypeValues = [
  'cdi',
  'cdd',
  'independant',
  'etudiant',
  'retraite',
  'autre',
] as const;
export type EmploymentType = (typeof employmentTypeValues)[number];

export const employmentTypeLabels: Record<EmploymentType, string> = {
  cdi: 'CDI',
  cdd: 'CDD',
  independant: 'Indépendant / Freelance',
  etudiant: 'Étudiant',
  retraite: 'Retraité',
  autre: 'Autre',
};

// ─── Schemas ──────────────────────────────────────────────────────────────────

export const candidateDocumentSchema = z.object({
  id: z.string(),
  type: z.enum(documentTypeValues),
  fileName: z.string(),
  mimeType: z.string(),
  file: z.string(), // base64 data URL
});
export type CandidateDocument = z.infer<typeof candidateDocumentSchema>;

export const candidatePersonSchema = personSchema.extend({
  email: z.string().email("L'adresse email est invalide"),
  phone: z.string().min(1, 'Le numéro de téléphone est requis'),
});
export type CandidatePerson = z.infer<typeof candidatePersonSchema>;

export const guarantorProfileSchema = z.object({
  person: personSchema,
  employmentType: z.enum(employmentTypeValues),
  income: z.number({ invalid_type_error: 'Le revenu est requis' }).min(0, 'Le revenu doit être positif'),
  documents: z.array(candidateDocumentSchema),
});
export type GuarantorProfile = z.infer<typeof guarantorProfileSchema>;

export const candidateStatusValues = ['en_attente', 'accepté', 'refusé'] as const;
export type CandidateStatus = (typeof candidateStatusValues)[number];

export const candidateStatusLabels: Record<CandidateStatus, string> = {
  en_attente: 'En attente',
  accepté: 'Accepté',
  refusé: 'Refusé',
};

export const candidateSchema = z.object({
  id: z.string(),
  propertyId: z.string(),
  person: candidatePersonSchema,
  employmentType: z.enum(employmentTypeValues),
  income: z.number({ invalid_type_error: 'Le revenu est requis' }).min(0, 'Le revenu doit être positif'),
  documents: z.array(candidateDocumentSchema),
  hasGuarantor: z.boolean(),
  guarantor: guarantorProfileSchema.optional(),
  coverLetter: z.string().optional(),
  status: z.enum(candidateStatusValues),
  notes: z.string().optional(),
  submittedAt: z.string(),
  gdprConsent: z.boolean(),
});
export type Candidate = z.infer<typeof candidateSchema>;

export const submitCandidateSchema = candidateSchema
  .omit({ id: true, status: true, notes: true, submittedAt: true })
  .extend({
    gdprConsent: z.literal(true, {
      errorMap: () => ({ message: 'Vous devez accepter la politique de confidentialité' }),
    }),
  });
export type SubmitCandidateData = z.infer<typeof submitCandidateSchema>;

// ─── Candidate link ───────────────────────────────────────────────────────────

export const candidateLinkSchema = z.object({
  propertyId: z.string(),
  propertyName: z.string(),
  token: z.string(),
  isActive: z.boolean(),
  createdAt: z.string(),
});
export type CandidateLink = z.infer<typeof candidateLinkSchema>;
