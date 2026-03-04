import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { candidateApi } from '../api/candidate.api';
import { candidateLinkQueryKey } from './useCandidateLink';

export const useCreateCandidateLink = (propertyId: string) => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (propertyName: string) => candidateApi.createLink(propertyId, propertyName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: candidateLinkQueryKey(propertyId) });
      enqueueSnackbar('Lien de candidature créé', { variant: 'success' });
    },
    onError: () => {
      enqueueSnackbar('Erreur lors de la création du lien', { variant: 'error' });
    },
  });
};
