import { useMutation, useQueryClient } from '@tanstack/react-query';
import { propertyApi } from '../api/property.api';
import { CreatePropertyData } from '../types/property.types';
import { PROPERTIES_QUERY_KEY } from './useProperties';

export const useCreateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePropertyData) => propertyApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROPERTIES_QUERY_KEY });
    },
  });
};
