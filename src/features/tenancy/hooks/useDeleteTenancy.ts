import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { tenancyApi } from '../api/tenancy.api';
import { tenanciesByPropertyQueryKey } from './useTenanciesByProperty';
import { tenancyQueryKey } from './useTenancy';

export const useDeleteTenancy = (propertyId: string) => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (id: string) => tenancyApi.delete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: tenanciesByPropertyQueryKey(propertyId) });
      queryClient.removeQueries({ queryKey: tenancyQueryKey(id) });
      enqueueSnackbar('Bail supprimé avec succès', { variant: 'success' });
    },
    onError: () => {
      enqueueSnackbar('Erreur lors de la suppression du bail', { variant: 'error' });
    },
  });
};
