import type { Property } from '../types/property.types';

export const mockProperties: Property[] = [
  {
    id: '1',
    name: 'La Parade – Appt 7',
    owner: { lastName: 'NOTARIANNI', firstName: 'Chantal', address: { street: '19 rue Marius Touzet', postCode: '83100', city: 'Toulon' } },
    address: {
      number: 1600,
      street: 'Route des Milles',
      postCode: '13290',
      city: 'Aix-en-Provence',
      residence: 'Résidence La Parade',
    },
    surface: 32,
    image: '',
    buildingType: 'collectif',
    legalRegime: 'copropriété',
    constructionYear: 2008,
    roomCount: 2,
    building: 'Bâtiment Homère',
    apartmentNumber: '7',
    equipment: ['Cuisine équipée', 'Micro-onde', 'Lave-linge', 'Canapé convertible', 'Télévision'],
    heatingType: 'individuel',
    hotWaterType: 'individuel',
    internetAccess: true,
    internetType: 'fibre',
  },
  {
    id: '2',
    name: 'B22 Carqueiranne',
    owner: { lastName: 'Dupont', firstName: 'Jean' },
    address: {
      number: 22,
      street: 'Allée des Mimosas',
      postCode: '83320',
      city: 'Carqueiranne',
      residence: 'Résidence Les Pins',
    },
    surface: 62,
    image: '',
  },
];
