import { pdf } from '@react-pdf/renderer';
import type { Payment } from '../types/payment.types';
import type { Tenancy } from '../../tenancy/types/tenancy.types';
import type { Property } from '../../property/types/property.types';
import QuittanceDocument from './QuittanceDocument';

export const downloadQuittancePdf = async (
  payment: Payment,
  tenancy: Tenancy,
  property: Property,
): Promise<void> => {
  const blob = await pdf(
    <QuittanceDocument payment={payment} tenancy={tenancy} property={property} />,
  ).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `quittance-${payment.period}-${tenancy.tenant.lastName.toLowerCase()}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
};
