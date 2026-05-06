import apiClient from '../../../lib/api-client';
import type { CreatePropertyData, Property, UpdatePropertyData } from '../types/property.types';

// Shape returned by GET /api/biens (backend Bien entity, camelCase)
interface BienDto {
  id: string;
  nom: string;
  surface: number;
  loyer?: number;
  imageBase64?: string;
  adresse: {
    numero?: number;
    rue: string;
    codePostal: string;
    ville: string;
    residence?: string;
  };
  bailleur?: {
    nom: string;
    prenom?: string;
  };
}

// Backend Bien → frontend Property
function toProperty(b: BienDto): Property {
  return {
    id: b.id,
    name: b.nom,
    surface: b.surface,
    image: b.imageBase64,
    address: {
      number: b.adresse?.numero,
      street: b.adresse?.rue ?? '',
      postCode: b.adresse?.codePostal ?? '',
      city: b.adresse?.ville ?? '',
      residence: b.adresse?.residence,
    },
    // Bailleur becomes owner — will be properly replaced in Phase 4
    owner: {
      lastName: b.bailleur?.nom ?? '',
      firstName: b.bailleur?.prenom ?? '',
    },
  };
}

// Frontend Property → backend CreateBienRequest body
function toCreateBody(data: CreatePropertyData) {
  return {
    nom: data.name,
    surface: data.surface,
    imageBase64: data.image ?? null,
    // type and bailleurId will be added in Phase 4 (Bailleur module)
    type: 0, // 0 = Appartement (enum default)
    bailleurId: null,
    adresse: {
      numero: data.address.number ?? null,
      rue: data.address.street,
      codePostal: data.address.postCode,
      ville: data.address.city,
      residence: data.address.residence ?? null,
    },
  };
}

export const propertyApi = {
  getAll: async (): Promise<Property[]> => {
    const { data } = await apiClient.get<BienDto[]>('/api/biens');
    return data.map(toProperty);
  },

  getById: async (id: string): Promise<Property> => {
    const { data } = await apiClient.get<BienDto>(`/api/biens/${id}`);
    return toProperty(data);
  },

  create: async (data: CreatePropertyData): Promise<Property> => {
    const { data: created } = await apiClient.post<BienDto>('/api/biens', toCreateBody(data));
    return toProperty(created);
  },

  update: async (data: UpdatePropertyData): Promise<Property> => {
    const { data: updated } = await apiClient.put<BienDto>(`/api/biens/${data.id}`, {
      ...toCreateBody(data as CreatePropertyData),
      bailleurId: null,
    });
    return toProperty(updated);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/biens/${id}`);
  },
};
