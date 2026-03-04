import type {
  CreatePropertyData,
  Property,
  UpdatePropertyData,
} from "../types/property.types";
import { httpClient } from "../../../lib/http-client";

export const propertyApi = {
  getAll: async (): Promise<Property[]> =>
    (await httpClient.get("properties")).data,

  getById: async (id: string): Promise<Property> =>
    (await httpClient.get(`properties/${id}`)).data,

  create: async (data: CreatePropertyData): Promise<Property> =>
    (await httpClient.post("properties", data)).data,

  update: async (data: UpdatePropertyData): Promise<Property> =>
    (await httpClient.put(`properties/${data.id}`, data)).data,

  delete: async (id: string): Promise<void> =>
    (await httpClient.delete(`properties/${id}`)).data,
};
