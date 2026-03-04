import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { candidateApi } from '../api/candidate.api';
import { candidatesQueryKey } from './useCandidates';
import { candidateByIdQueryKey } from './useCandidateById';
import type { CandidateStatus } from '../types/candidate.types';

export const useUpdateCandidate = (propertyId: string) => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (data: { id: string; status?: CandidateStatus; notes?: string }) =>
      candidateApi.update(data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: candidatesQueryKey(propertyId) });
      queryClient.invalidateQueries({ queryKey: candidateByIdQueryKey(updated.id) });
      enqueueSnackbar('Candidature mise à jour', { variant: 'success' });
    },
    onError: () => {
      enqueueSnackbar('Erreur lors de la mise à jour', { variant: 'error' });
    },
  });
};
