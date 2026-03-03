import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { propertyApi } from '../api/property.api';
import { CreatePropertyData } from '../types/property.types';
import { PROPERTIES_QUERY_KEY } from './useProperties';

export const useCreateProperty = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (data: CreatePropertyData) => propertyApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROPERTIES_QUERY_KEY });
      enqueueSnackbar('Bien créé avec succès', { variant: 'success' });
    },
    onError: () => {
      enqueueSnackbar('Erreur lors de la création du bien', { variant: 'error' });
    },
  });
};
