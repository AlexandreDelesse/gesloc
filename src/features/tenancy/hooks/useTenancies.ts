import { useQuery } from '@tanstack/react-query';
import { tenancyApi } from '../api/tenancy.api';

export const TENANCIES_QUERY_KEY = ['tenancies'] as const;

export const useTenancies = () =>
  useQuery({
    queryKey: TENANCIES_QUERY_KEY,
    queryFn: tenancyApi.getAll,
  });
