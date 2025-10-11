import type { Adress } from "../../shared/models/Adress.model";
import type { People } from "../../shared/models/People.model";

export interface Property {
  id: string;
  name: string;
  owner: People; //TODO: A changer en objet
  address: Adress; //TODO: A changer en objet
  surface: number;
  image: string;
}

export interface CreatePropertyCmd {
  name: string;
  owner: People; //TODO: A changer en objet
  address: Adress; //TODO: A changer en objet
  surface: number;
  image: string;
}

export interface UpdatePropertyCmd {
  id: string;
  name?: string;
  owner?: People; //TODO: A changer en objet
  address?: string; //TODO: A changer en objet
  surface?: number;
  image?: string;
}
