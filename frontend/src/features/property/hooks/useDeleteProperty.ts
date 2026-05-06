import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { propertyApi } from '../api/property.api';
import { PROPERTIES_QUERY_KEY } from './useProperties';

export const useDeleteProperty = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (id: string) => propertyApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROPERTIES_QUERY_KEY });
      enqueueSnackbar('Bien supprimé avec succès', { variant: 'success' });
    },
    onError: () => {
      enqueueSnackbar('Erreur lors de la suppression du bien', { variant: 'error' });
    },
  });
};
