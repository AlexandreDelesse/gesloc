import type { Tenancy } from '../types/tenancy.types';

// Données issues du contrat "Bail location Aix" – Résidence La Parade
export const mockTenancies: Tenancy[] = [
  {
    id: '1',
    tenant: {
      lastName: 'TUIZIR',
      firstName: 'Elisa',
      address: {
        street: 'Avenue de la Marne – Les Hauts Cépages, Le Nuragus',
        postCode: '13260',
        city: 'Cassis',
      },
    },
    guarantor: {
      lastName: 'TUIZIR',
      firstName: 'Isaac',
    },
    propertyId: '1', // Résidence La Parade – Appt n°7, Bâtiment Homère
    legalFramework: 'meublé-loi-89',
    propertyUse: 'habitation',
    startDate: '2025-09-01',
    durationMonths: 9,
    rentAmount: 750,
    chargesAmount: 50,
    chargesType: 'forfait',
    paymentDueDay: 5,
    securityDeposit: 750,
  },
];
