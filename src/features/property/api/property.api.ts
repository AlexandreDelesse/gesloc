import { v4 as uuidv4 } from 'uuid';
import { mockProperties } from './property.mock';
import type { CreatePropertyData, Property, UpdatePropertyData } from '../types/property.types';

// État local simulant la base de données — remplacé par axios quand l'API sera prête
let store: Property[] = [...mockProperties];

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export const propertyApi = {
  getAll: async (): Promise<Property[]> => {
    await delay();
    return [...store];
  },

  getById: async (id: string): Promise<Property> => {
    await delay();
    const property = store.find((p) => p.id === id);
    if (!property) throw new Error(`Bien introuvable (id: ${id})`);
    return { ...property };
  },

  create: async (data: CreatePropertyData): Promise<Property> => {
    await delay();
    const newProperty: Property = { ...data, id: uuidv4() };
    store = [...store, newProperty];
    return newProperty;
  },

  update: async (data: UpdatePropertyData): Promise<Property> => {
    await delay();
    const index = store.findIndex((p) => p.id === data.id);
    if (index === -1) throw new Error(`Bien introuvable (id: ${data.id})`);
    const updated: Property = { ...store[index], ...data };
    store = store.map((p) => (p.id === data.id ? updated : p));
    return updated;
  },

  delete: async (id: string): Promise<void> => {
    await delay();
    store = store.filter((p) => p.id !== id);
  },
};
