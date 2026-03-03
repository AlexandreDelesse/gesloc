import { z } from 'zod';
import { addressSchema } from '../../../types/address.types';
import { personSchema } from '../../../types/person.types';

export const buildingTypeSchema = z.enum(['collectif', 'individuel']);
export const legalRegimeSchema = z.enum(['copropriété', 'monopropriété', 'autre']);
export const heatingTypeSchema = z.enum(['individuel', 'collectif']);

export const propertySchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Le nom du bien est requis'),
  owner: personSchema,
  address: addressSchema,
  surface: z.number().positive('La surface doit être positive'),
  image: z.string().optional(),

  // Champs issus du contrat de location
  buildingType: buildingTypeSchema.optional(),
  legalRegime: legalRegimeSchema.optional(),
  constructionYear: z.number().int().optional(),
  roomCount: z.number().int().positive().optional(),
  building: z.string().optional(),         // ex: "Bâtiment Homère"
  apartmentNumber: z.string().optional(),  // ex: "7"
  equipment: z.array(z.string()).optional(), // ex: ["Cuisine équipée", "Micro-onde", ...]
  heatingType: heatingTypeSchema.optional(),
  hotWaterType: heatingTypeSchema.optional(),
  internetAccess: z.boolean().optional(),
  internetType: z.string().optional(),     // ex: "fibre"
});

export const createPropertySchema = z.object({
  name: z.string().min(1, 'Le nom du bien est requis'),
  owner: personSchema,
  address: addressSchema,
  surface: z.number({ error: 'La surface doit être un nombre' }).positive('La surface doit être positive'),
  image: z.string().optional(),

  buildingType: buildingTypeSchema.optional(),
  legalRegime: legalRegimeSchema.optional(),
  constructionYear: z.number().int().optional(),
  roomCount: z.number().int().positive().optional(),
  building: z.string().optional(),
  apartmentNumber: z.string().optional(),
  equipment: z.array(z.string()).optional(),
  heatingType: heatingTypeSchema.optional(),
  hotWaterType: heatingTypeSchema.optional(),
  internetAccess: z.boolean().optional(),
  internetType: z.string().optional(),
});

export const updatePropertySchema = createPropertySchema.partial().extend({
  id: z.string(),
});

export type Property = z.infer<typeof propertySchema>;
export type CreatePropertyData = z.infer<typeof createPropertySchema>;
export type UpdatePropertyData = z.infer<typeof updatePropertySchema>;
