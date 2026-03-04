import { useMutation } from '@tanstack/react-query';
import { candidateApi } from '../api/candidate.api';
import type { SubmitCandidateData } from '../types/candidate.types';

export const useSubmitCandidate = () =>
  useMutation({
    mutationFn: (data: SubmitCandidateData) => candidateApi.submit(data),
  });
