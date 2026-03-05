import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { candidateApi } from '../api/candidate.api';
import { candidatesQueryKey } from './useCandidates';
import { candidateByIdQueryKey } from './useCandidateById';

export const useDeleteCandidate = (propertyId: string) => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (id: string) => candidateApi.delete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: candidatesQueryKey(propertyId) });
      queryClient.removeQueries({ queryKey: candidateByIdQueryKey(id) });
      enqueueSnackbar('Candidature supprimée', { variant: 'success' });
    },
    onError: () => {
      enqueueSnackbar('Erreur lors de la suppression', { variant: 'error' });
    },
  });
};
