import type { Tenancy } from "./tenancy.model";

export const tenancies: Tenancy[] = [
    {
        id: "1",
        house: {
            name: "La parade - Aix",
            address: "La parade - Aix en provence",
            id: "1",
            image: "",
            owner: "Notarianni Chantal",
            surface: 32
        },
        internet: 'Fibre',
        rentalCharges: 50,
        rentalPrice: 750,
        tenancyDuration: 9,
        tenancyStartDate: "2025-09-01T00:00:00",
        tenant: "Elisa Tuizir"
    },
    {
        id: "2",
        house: {
            name: "La parade - Aix",
            address: "La parade - Aix en provence",
            id: "1",
            image: "",
            owner: "Notarianni Chantal",
            surface: 32
        },
        internet: 'Fibre',
        rentalCharges: 50,
        rentalPrice: 750,
        tenancyDuration: 9,
        tenancyStartDate: "2024-09-01T00:00:00",
        tenant: "Ryan Benabdallah"
    },


]