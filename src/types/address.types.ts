import { z } from 'zod';

export const addressSchema = z.object({
  number: z.string().optional(),
  street: z.string().min(1, 'La rue est requise'),
  postCode: z.string().min(1, 'Le code postal est requis'),
  city: z.string().min(1, 'La ville est requise'),
  residence: z.string().optional(),
});

export type Address = z.infer<typeof addressSchema>;
