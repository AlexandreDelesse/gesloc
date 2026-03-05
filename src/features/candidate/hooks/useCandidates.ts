import { useQuery } from '@tanstack/react-query';
import { candidateApi } from '../api/candidate.api';

export const candidatesQueryKey = (propertyId: string) => ['candidates', propertyId] as const;

export const useCandidates = (propertyId: string) =>
  useQuery({
    queryKey: candidatesQueryKey(propertyId),
    queryFn: () => candidateApi.getByProperty(propertyId),
    enabled: !!propertyId,
  });
