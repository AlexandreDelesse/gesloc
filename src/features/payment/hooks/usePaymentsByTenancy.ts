import { useQuery } from '@tanstack/react-query';
import { paymentApi } from '../api/payment.api';

export const paymentsByTenancyQueryKey = (tenancyId: string) =>
  ['payments', 'byTenancy', tenancyId] as const;

export const usePaymentsByTenancy = (tenancyId: string) =>
  useQuery({
    queryKey: paymentsByTenancyQueryKey(tenancyId),
    queryFn: () => paymentApi.getByTenancy(tenancyId),
    enabled: !!tenancyId,
  });
