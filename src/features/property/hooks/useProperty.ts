import { useQuery } from '@tanstack/react-query';
import { propertyApi } from '../api/property.api';

export const propertyQueryKey = (id: string) => ['properties', id] as const;

export const useProperty = (id: string) =>
  useQuery({
    queryKey: propertyQueryKey(id),
    queryFn: () => propertyApi.getById(id),
    enabled: !!id,
  });
