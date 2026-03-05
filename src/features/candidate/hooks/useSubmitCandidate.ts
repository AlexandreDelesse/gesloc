import { useMutation } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { candidateApi } from '../api/candidate.api';
import type { SubmitCandidateData } from '../types/candidate.types';

export const useSubmitCandidate = () => {
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (data: SubmitCandidateData) => candidateApi.submit(data),
    onError: () => {
      enqueueSnackbar('Une erreur est survenue lors de l\'envoi du dossier. Veuillez réessayer.', {
        variant: 'error',
      });
    },
  });
};
