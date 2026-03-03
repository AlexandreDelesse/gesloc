import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { propertyApi } from '../api/property.api';
import { UpdatePropertyData } from '../types/property.types';
import { PROPERTIES_QUERY_KEY } from './useProperties';
import { propertyQueryKey } from './useProperty';

export const useUpdateProperty = (id: string) => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (data: UpdatePropertyData) => propertyApi.update(data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: PROPERTIES_QUERY_KEY });
      queryClient.setQueryData(propertyQueryKey(id), updated);
      enqueueSnackbar('Bien mis à jour avec succès', { variant: 'success' });
    },
    onError: () => {
      enqueueSnackbar('Erreur lors de la mise à jour du bien', { variant: 'error' });
    },
  });
};
