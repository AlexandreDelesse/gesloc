import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { tenancyApi } from '../api/tenancy.api';
import type { CreateTenancyData } from '../types/tenancy.types';
import { tenanciesByPropertyQueryKey } from './useTenanciesByProperty';

export const useCreateTenancy = (propertyId: string) => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (data: CreateTenancyData) => tenancyApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenanciesByPropertyQueryKey(propertyId) });
      enqueueSnackbar('Bail créé avec succès', { variant: 'success' });
    },
    onError: () => {
      enqueueSnackbar('Erreur lors de la création du bail', { variant: 'error' });
    },
  });
};
