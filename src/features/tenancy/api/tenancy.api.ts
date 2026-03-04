import { v4 as uuidv4 } from 'uuid';
import { mockTenancies } from './tenancy.mock';
import type { CreateTenancyData, Tenancy, UpdateTenancyData } from '../types/tenancy.types';
import { loadStore, saveStore } from '../../../lib/persistedStore';

const KEY = 'gesloc_tenancies';

// État local simulant la base de données — remplacé par axios quand l'API sera prête
let store: Tenancy[] = loadStore(KEY, [...mockTenancies]);

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export const tenancyApi = {
  getAll: async (): Promise<Tenancy[]> => {
    await delay();
    return [...store];
  },

  getByProperty: async (propertyId: string): Promise<Tenancy[]> => {
    await delay();
    return store.filter((t) => t.propertyId === propertyId);
  },

  getById: async (id: string): Promise<Tenancy> => {
    await delay();
    const tenancy = store.find((t) => t.id === id);
    if (!tenancy) throw new Error(`Bail introuvable (id: ${id})`);
    return { ...tenancy };
  },

  create: async (data: CreateTenancyData): Promise<Tenancy> => {
    await delay();
    const newTenancy: Tenancy = { ...data, id: uuidv4() };
    store = [...store, newTenancy];
    saveStore(KEY, store);
    return newTenancy;
  },

  update: async (data: UpdateTenancyData): Promise<Tenancy> => {
    await delay();
    const index = store.findIndex((t) => t.id === data.id);
    if (index === -1) throw new Error(`Bail introuvable (id: ${data.id})`);
    const updated: Tenancy = { ...store[index], ...data };
    store = store.map((t) => (t.id === data.id ? updated : t));
    saveStore(KEY, store);
    return updated;
  },

  delete: async (id: string): Promise<void> => {
    await delay();
    store = store.filter((t) => t.id !== id);
    saveStore(KEY, store);
  },
};
