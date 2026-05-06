import type { Property } from '../types/property.types';

export const mockProperties: Property[] = [
  {
    id: '1',
    name: 'La Parade',
    owner: { lastName: 'Dupont', firstName: 'Jean' },
    address: {
      number: 12,
      street: 'Rue de la Parade',
      postCode: '13100',
      city: 'Aix-en-Provence',
    },
    surface: 45,
    image: '',
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
