import { useQuery } from '@tanstack/react-query';
import { tenancyApi } from '../api/tenancy.api';

export const tenanciesByPropertyQueryKey = (propertyId: string) =>
  ['tenancies', 'byProperty', propertyId] as const;

export const useTenanciesByProperty = (propertyId: string) =>
  useQuery({
    queryKey: tenanciesByPropertyQueryKey(propertyId),
    queryFn: () => tenancyApi.getByProperty(propertyId),
    enabled: !!propertyId,
  });
