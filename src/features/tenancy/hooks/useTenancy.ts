import { useQuery } from '@tanstack/react-query';
import { tenancyApi } from '../api/tenancy.api';

export const tenancyQueryKey = (id: string) => ['tenancies', id] as const;

export const useTenancy = (id: string) =>
  useQuery({
    queryKey: tenancyQueryKey(id),
    queryFn: () => tenancyApi.getById(id),
    enabled: !!id,
  });
