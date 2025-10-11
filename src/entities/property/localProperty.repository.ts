import type { IpropertyRepository } from "./IPropertyRepository";
import type {
  CreatePropertyCmd,
  Property,
  UpdatePropertyCmd,
} from "./property.model";
import { v4 as uuid } from "uuid";

const PROPERTY_LOCAL_NAME = "properties";

const createProperty = (cmd: CreatePropertyCmd): Property => {
  const property: Property = {
    ...cmd,
    id: uuid(),
  };
  const properties = getProperties();
  const updatedProperties = [...properties, property];
  window.localStorage.setItem(
    PROPERTY_LOCAL_NAME,
    JSON.stringify(updatedProperties)
  );
  return property;
};

const getProperties = (): Property[] => {
  const strProperties = window.localStorage.getItem(PROPERTY_LOCAL_NAME);
  if (!strProperties) return [];
  return JSON.parse(strProperties);
};

const getPropertyById = (pId: string): Property | undefined => {
  const properties = getProperties();
  return properties.find((p) => p.id == pId);
};

const updateProperty = (cmd: UpdatePropertyCmd): void => {
  const properties = getProperties();
  const updatedProperties = properties.map((p) =>
    p.id == cmd.id ? { p, ...cmd } : p
  );
  // window.localStorage.setItem(PROPERTY_LOCAL_NAME, JSON.stringify(updatedProperties))
};

const deleteProperty = (pId: string): void => {
  const properties = getProperties();
  const updatedProperties = properties.filter((p) => p.id != pId);
  // window.localStorage.setItem(PROPERTY_LOCAL_NAME, JSON.stringify(updatedProperties))
};

export const localPropertyRepository: IpropertyRepository = {
  createProperty,
  getProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
};
