import { useQuery } from '@tanstack/react-query';
import { candidateApi } from '../api/candidate.api';

export const candidateLinkQueryKey = (propertyId: string) => ['candidate-link', propertyId];
export const candidateLinkByTokenQueryKey = (token: string) => ['candidate-link-token', token];

export const useCandidateLink = (propertyId: string) =>
  useQuery({
    queryKey: candidateLinkQueryKey(propertyId),
    queryFn: () => candidateApi.getLink(propertyId),
    enabled: !!propertyId,
  });

export const useCandidateLinkByToken = (token: string) =>
  useQuery({
    queryKey: candidateLinkByTokenQueryKey(token),
    queryFn: () => candidateApi.getLinkByToken(token),
    enabled: !!token,
    retry: false,
  });
