import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { candidateApi } from '../api/candidate.api';
import { candidateLinkQueryKey } from './useCandidateLink';

export const useToggleCandidateLink = (propertyId: string) => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: () => candidateApi.toggleLink(propertyId),
    onSuccess: (link) => {
      queryClient.invalidateQueries({ queryKey: candidateLinkQueryKey(propertyId) });
      enqueueSnackbar(
        link.isActive ? 'Lien réactivé' : 'Lien désactivé',
        { variant: 'info' },
      );
    },
    onError: () => {
      enqueueSnackbar('Erreur lors de la modification du lien', { variant: 'error' });
    },
  });
};
