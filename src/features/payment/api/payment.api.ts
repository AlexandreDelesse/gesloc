import { v4 as uuidv4 } from 'uuid';
import { mockPayments } from './payment.mock';
import type { CreatePaymentData, Payment, UpdatePaymentData } from '../types/payment.types';

// État local simulant la base de données
let store: Payment[] = [...mockPayments];

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export const paymentApi = {
  getByTenancy: async (tenancyId: string): Promise<Payment[]> => {
    await delay();
    return store.filter((p) => p.tenancyId === tenancyId);
  },

  createBatch: async (data: Omit<CreatePaymentData, 'id'>[]): Promise<Payment[]> => {
    await delay();
    const newPayments: Payment[] = data.map((d) => ({
      ...d,
      id: uuidv4(),
      status: d.status ?? 'en_attente',
    }));
    store = [...store, ...newPayments];
    return newPayments;
  },

  update: async (data: UpdatePaymentData): Promise<Payment> => {
    await delay();
    const index = store.findIndex((p) => p.id === data.id);
    if (index === -1) throw new Error(`Paiement introuvable (id: ${data.id})`);
    const updated: Payment = { ...store[index], ...data };
    store = store.map((p) => (p.id === data.id ? updated : p));
    return updated;
  },

  delete: async (id: string): Promise<void> => {
    await delay();
    store = store.filter((p) => p.id !== id);
  },
};
