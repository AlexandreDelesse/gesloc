import type { CreatePropertyCmd, Property, UpdatePropertyCmd } from "./property.model";

export interface IpropertyRepository {
  createProperty: (cmd: CreatePropertyCmd) => Property;
  getProperties: () => Property[];
  getPropertyById: (pId: string) => Property | undefined;
  updateProperty: (cmd: UpdatePropertyCmd) => void;
  deleteProperty: (pId: string) => void;
}
