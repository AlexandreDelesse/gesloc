import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { paymentApi } from '../api/payment.api';
import { paymentsByTenancyQueryKey } from './usePaymentsByTenancy';
import type { CreatePaymentData } from '../types/payment.types';

export const useCreatePaymentBatch = (tenancyId: string) => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (data: Omit<CreatePaymentData, 'id'>[]) => paymentApi.createBatch(data),
    onSuccess: (payments) => {
      queryClient.invalidateQueries({ queryKey: paymentsByTenancyQueryKey(tenancyId) });
      enqueueSnackbar(`${payments.length} échéances générées`, { variant: 'success' });
    },
    onError: () => {
      enqueueSnackbar('Erreur lors de la génération des paiements', { variant: 'error' });
    },
  });
};
