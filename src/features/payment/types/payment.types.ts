import { z } from 'zod';

export const paymentStatusSchema = z.enum(['en_attente', 'payé', 'en_retard']);

export const paymentSchema = z.object({
  id: z.string(),
  tenancyId: z.string(),
  period: z.string(),           // "YYYY-MM"
  rentAmount: z.number(),
  chargesAmount: z.number(),
  dueDate: z.string(),          // ISO date – ex: "2025-09-05"
  paidAt: z.string().optional(), // ISO datetime when payment was recorded
  status: paymentStatusSchema.default('en_attente'),
});

export const createPaymentSchema = paymentSchema.omit({ id: true });

export const updatePaymentSchema = paymentSchema.partial().extend({
  id: z.string(),
});

export type Payment = z.infer<typeof paymentSchema>;
export type PaymentStatus = z.infer<typeof paymentStatusSchema>;
export type CreatePaymentData = z.infer<typeof createPaymentSchema>;
export type UpdatePaymentData = z.infer<typeof updatePaymentSchema>;

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Montant total du paiement */
export const getPaymentTotal = (payment: Payment): number =>
  payment.rentAmount + payment.chargesAmount;

/** Retourne true si le paiement est en retard (échéance dépassée et non payé) */
export const isPaymentLate = (payment: Payment, at: Date = new Date()): boolean =>
  payment.status !== 'payé' && new Date(payment.dueDate) < at;

/** Formate une période "YYYY-MM" en libellé français, ex: "Septembre 2025" */
export const formatPeriod = (period: string): string => {
  const [year, month] = period.split('-');
  return new Date(Number(year), Number(month) - 1, 1).toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric',
  });
};
