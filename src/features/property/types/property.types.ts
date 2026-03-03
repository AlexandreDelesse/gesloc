import { z } from 'zod';
import { addressSchema } from '../../../types/address.types';
import { personSchema } from '../../../types/person.types';

export const propertySchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Le nom du bien est requis'),
  owner: personSchema,
  address: addressSchema,
  surface: z.number().positive('La surface doit être positive'),
  image: z.string().optional(),
});

export const createPropertySchema = z.object({
  name: z.string().min(1, 'Le nom du bien est requis'),
  owner: personSchema,
  address: addressSchema,
  surface: z.number({ invalid_type_error: 'La surface doit être un nombre' }).positive('La surface doit être positive'),
  image: z.string().optional(),
});

export const updatePropertySchema = createPropertySchema.partial().extend({
  id: z.string(),
});

export type Property = z.infer<typeof propertySchema>;
export type CreatePropertyData = z.infer<typeof createPropertySchema>;
export type UpdatePropertyData = z.infer<typeof updatePropertySchema>;
