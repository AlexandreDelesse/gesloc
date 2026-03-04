import type {
  Candidate,
  CandidateLink,
  CandidateStatus,
  SubmitCandidateData,
} from '../types/candidate.types';
import { httpClient } from '../../../lib/http-client';

export const candidateApi = {
  // ─── Public ──────────────────────────────────────────────────────────────

  getLinkByToken: async (token: string): Promise<CandidateLink | null> => {
    try {
      return (await httpClient.get(`candidate-links/${token}`)).data;
    } catch {
      return null;
    }
  },

  submit: async (data: SubmitCandidateData): Promise<Candidate> =>
    (await httpClient.post('candidates', data)).data,

  // ─── Private ─────────────────────────────────────────────────────────────

  getByProperty: async (propertyId: string): Promise<Candidate[]> =>
    (await httpClient.get(`properties/${propertyId}/candidates`)).data,

  getById: async (id: string): Promise<Candidate> =>
    (await httpClient.get(`candidates/${id}`)).data,

  update: async (data: {
    id: string;
    status?: CandidateStatus;
    notes?: string;
  }): Promise<Candidate> =>
    (await httpClient.put(`candidates/${data.id}`, { status: data.status, notes: data.notes })).data,

  delete: async (id: string): Promise<void> =>
    (await httpClient.delete(`candidates/${id}`)).data,

  // ─── Link management ─────────────────────────────────────────────────────

  getLink: async (propertyId: string): Promise<CandidateLink | null> => {
    try {
      return (await httpClient.get(`properties/${propertyId}/candidate-link`)).data;
    } catch {
      return null;
    }
  },

  createLink: async (propertyId: string, propertyName: string): Promise<CandidateLink> =>
    (await httpClient.post(`properties/${propertyId}/candidate-link`, { propertyName })).data,

  toggleLink: async (propertyId: string): Promise<CandidateLink> =>
    (await httpClient.patch(`properties/${propertyId}/candidate-link/toggle`)).data,
};
