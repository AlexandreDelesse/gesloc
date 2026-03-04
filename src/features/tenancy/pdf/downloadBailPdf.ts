import { pdf } from '@react-pdf/renderer';
import { createElement } from 'react';
import type { Tenancy } from '../types/tenancy.types';
import type { Property } from '../../property/types/property.types';
import BailDocument from './BailDocument';

export const downloadBailPdf = async (tenancy: Tenancy, property: Property): Promise<void> => {
  const blob = await pdf(createElement(BailDocument, { tenancy, property })).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `bail-${tenancy.tenant.lastName.toLowerCase()}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
};
