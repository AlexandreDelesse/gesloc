import { z } from 'zod';
import { personSchema } from '../../../types/person.types';

// Cadre légal du contrat (loi du 6 juillet 1989 – meublé = titre Ier bis)
export const rentalFrameworkSchema = z.enum([
  'meublé-loi-89',    // Titre Ier bis – location meublée (notre cas)
  'vide-loi-89',      // Titre Ier – location vide
  'autre',
]);

// Destination des locaux
export const propertyUseSchema = z.enum(['habitation', 'mixte']);

// Type de règlement des charges
export const chargesTypeSchema = z.enum(['forfait', 'provision']);

// ─── Schéma principal ────────────────────────────────────────────────────────

export const tenancySchema = z.object({
  id: z.string(),

  // Parties
  tenant: personSchema,
  guarantor: personSchema.optional(), // caution (ex: Isaac TUIZIR)

  // Référence au bien
  propertyId: z.string(),

  // Cadre légal et destination
  legalFramework: rentalFrameworkSchema.default('meublé-loi-89'),
  propertyUse: propertyUseSchema.default('habitation'),

  // Durée du contrat
  startDate: z.string(), // ISO date – ex: "2025-09-01"
  durationMonths: z.number().int().positive(), // ex: 9

  // Conditions financières
  rentAmount: z.number().positive(),      // loyer HC mensuel en € – ex: 750
  chargesAmount: z.number().nonnegative(), // charges mensuelles en € – ex: 50
  chargesType: chargesTypeSchema.default('forfait'),
  paymentDueDay: z.number().int().min(1).max(28).default(5), // jour limite de paiement

  // Dépôt de garantie
  securityDeposit: z.number().nonnegative(), // ex: 750 (= 1 mois HC)
});

// ─── Commandes ───────────────────────────────────────────────────────────────

export const createTenancySchema = tenancySchema.omit({ id: true });

export const updateTenancySchema = createTenancySchema.partial().extend({
  id: z.string(),
});

// ─── Types inférés ───────────────────────────────────────────────────────────

export type Tenancy = z.infer<typeof tenancySchema>;
export type CreateTenancyData = z.infer<typeof createTenancySchema>;
export type UpdateTenancyData = z.infer<typeof updateTenancySchema>;

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Montant total dû à chaque échéance (loyer + charges) */
export const getTotalMonthlyAmount = (tenancy: Tenancy): number =>
  tenancy.rentAmount + tenancy.chargesAmount;

/** Date de fin du contrat (startDate + durationMonths) */
export const getTenancyEndDate = (tenancy: Tenancy): Date => {
  const end = new Date(tenancy.startDate);
  end.setMonth(end.getMonth() + tenancy.durationMonths);
  return end;
};

/** Vérifie si le bail est en cours à une date donnée */
export const isTenancyActive = (tenancy: Tenancy, at: Date = new Date()): boolean => {
  const start = new Date(tenancy.startDate);
  const end = getTenancyEndDate(tenancy);
  return at >= start && at < end;
};
