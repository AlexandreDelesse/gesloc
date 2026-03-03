import { useMutation, useQueryClient } from '@tanstack/react-query';
import { propertyApi } from '../api/property.api';
import { UpdatePropertyData } from '../types/property.types';
import { PROPERTIES_QUERY_KEY } from './useProperties';
import { propertyQueryKey } from './useProperty';

export const useUpdateProperty = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdatePropertyData) => propertyApi.update(data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: PROPERTIES_QUERY_KEY });
      queryClient.setQueryData(propertyQueryKey(id), updated);
    },
  });
};
