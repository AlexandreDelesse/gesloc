import { z } from 'zod';
import { addressSchema } from './address.types';

export const personSchema = z.object({
  lastName: z.string().min(1, 'Le nom est requis'),
  firstName: z.string().min(1, 'Le prénom est requis'),
  address: addressSchema.optional(),
});

export type Person = z.infer<typeof personSchema>;
