import { useQuery } from '@tanstack/react-query';
import { candidateApi } from '../api/candidate.api';

export const candidateByIdQueryKey = (id: string) => ['candidate', id];

export const useCandidateById = (id: string) =>
  useQuery({
    queryKey: candidateByIdQueryKey(id),
    queryFn: () => candidateApi.getById(id),
    enabled: !!id,
  });
