import type { People } from "../../shared/models/People.model"

export interface Housing {
    id: string,
    name: string,
    owner: People, //TODO: A changer en objet
    address: string //TODO: A changer en objet
    surface: number,
    image: string,
}

export interface CreateHousingCmd {
    name: string,
    owner: string, //TODO: A changer en objet
    address: string //TODO: A changer en objet
    surface: number,
    images: string[],
}