import type { CreateTenancyData, Tenancy, UpdateTenancyData } from '../types/tenancy.types';
import { httpClient } from '../../../lib/http-client';

export const tenancyApi = {
  getAll: async (): Promise<Tenancy[]> =>
    (await httpClient.get('tenancies')).data,

  getByProperty: async (propertyId: string): Promise<Tenancy[]> =>
    (await httpClient.get(`properties/${propertyId}/tenancies`)).data,

  getById: async (id: string): Promise<Tenancy> =>
    (await httpClient.get(`tenancies/${id}`)).data,

  create: async (data: CreateTenancyData): Promise<Tenancy> =>
    (await httpClient.post('tenancies', data)).data,

  update: async (data: UpdateTenancyData): Promise<Tenancy> =>
    (await httpClient.put(`tenancies/${data.id}`, data)).data,

  delete: async (id: string): Promise<void> =>
    (await httpClient.delete(`tenancies/${id}`)).data,
};
