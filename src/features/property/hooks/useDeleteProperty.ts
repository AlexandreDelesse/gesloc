import { useMutation, useQueryClient } from '@tanstack/react-query';
import { propertyApi } from '../api/property.api';
import { PROPERTIES_QUERY_KEY } from './useProperties';

export const useDeleteProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => propertyApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROPERTIES_QUERY_KEY });
    },
  });
};
