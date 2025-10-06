//TODO: Ajouter le concept de personne pour regrouper, proprietaire, locataire. 

import type { Housing } from "../housing/housing.models";

//TODO: Agrémenter le concept de bail au fur et a mesure. 1ere version incomplete. 
export interface Tenancy {
    id: string,
    tenant: string, //TODO: De la meme manière, ajouter la notion de locataire.
    house: Housing,
    internet: string,
    tenancyStartDate: string,
    tenancyDuration: number, //Duration in month
    rentalPrice: number, //montnat du loyer en euros
    rentalCharges: number //montant des charges en euros
}

export interface CreateTenancyCmd {
    tenant: string, //TODO: De la meme manière, ajouter la notion de locataire.
    house: Housing,
    internet: string,
    tenancyStartDate: string,
    tenancyDuration: number, //Duration in month
    rentalPrice: number, //montnat du loyer en euros
    rentalCharges: number //montant des charges en euros
}

