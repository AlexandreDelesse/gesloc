import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { tenancyApi } from '../api/tenancy.api';
import { tenanciesByPropertyQueryKey } from './useTenanciesByProperty';

export const useDeleteTenancy = (propertyId: string) => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (id: string) => tenancyApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenanciesByPropertyQueryKey(propertyId) });
      enqueueSnackbar('Bail supprimé avec succès', { variant: 'success' });
    },
    onError: () => {
      enqueueSnackbar('Erreur lors de la suppression du bail', { variant: 'error' });
    },
  });
};
