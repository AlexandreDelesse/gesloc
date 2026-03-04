import type { CreatePaymentData, Payment, UpdatePaymentData } from '../types/payment.types';
import { httpClient } from '../../../lib/http-client';

export const paymentApi = {
  getByTenancy: async (tenancyId: string): Promise<Payment[]> =>
    (await httpClient.get(`tenancies/${tenancyId}/payments`)).data,

  createBatch: async (data: Omit<CreatePaymentData, 'id'>[]): Promise<Payment[]> => {
    const tenancyId = data[0].tenancyId;
    return (await httpClient.post(`tenancies/${tenancyId}/payments/batch`, data)).data;
  },

  update: async (data: UpdatePaymentData): Promise<Payment> =>
    (await httpClient.put(`payments/${data.id}`, { status: data.status, paidAt: data.paidAt })).data,

  delete: async (id: string): Promise<void> =>
    (await httpClient.delete(`payments/${id}`)).data,
};
