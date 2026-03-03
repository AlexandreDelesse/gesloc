import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { paymentApi } from '../api/payment.api';
import { paymentsByTenancyQueryKey } from './usePaymentsByTenancy';
import type { Payment, UpdatePaymentData } from '../types/payment.types';

export const useUpdatePayment = (tenancyId: string) => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (data: UpdatePaymentData) => paymentApi.update(data),
    onSuccess: (updated) => {
      queryClient.setQueryData(
        paymentsByTenancyQueryKey(tenancyId),
        (prev: Payment[] | undefined) =>
          prev ? prev.map((p) => (p.id === updated.id ? updated : p)) : [updated],
      );
      enqueueSnackbar('Paiement mis à jour', { variant: 'success' });
    },
    onError: () => {
      enqueueSnackbar('Erreur lors de la mise à jour du paiement', { variant: 'error' });
    },
  });
};
