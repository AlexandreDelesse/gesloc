import { useQuery } from '@tanstack/react-query';
import { propertyApi } from '../api/property.api';

export const PROPERTIES_QUERY_KEY = ['properties'] as const;

export const useProperties = () =>
  useQuery({
    queryKey: PROPERTIES_QUERY_KEY,
    queryFn: propertyApi.getAll,
  });
