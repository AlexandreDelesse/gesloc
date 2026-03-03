import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { tenancyApi } from '../api/tenancy.api';
import type { UpdateTenancyData } from '../types/tenancy.types';
import { tenanciesByPropertyQueryKey } from './useTenanciesByProperty';
import { tenancyQueryKey } from './useTenancy';

export const useUpdateTenancy = (id: string, propertyId: string) => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (data: UpdateTenancyData) => tenancyApi.update(data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: tenanciesByPropertyQueryKey(propertyId) });
      queryClient.setQueryData(tenancyQueryKey(id), updated);
      enqueueSnackbar('Bail mis à jour avec succès', { variant: 'success' });
    },
    onError: () => {
      enqueueSnackbar('Erreur lors de la mise à jour du bail', { variant: 'error' });
    },
  });
};
