import { v4 as uuidv4 } from 'uuid';
import type {
  Candidate,
  CandidateLink,
  CandidateStatus,
  SubmitCandidateData,
} from '../types/candidate.types';
import { loadStore, saveStore } from '../../../lib/persistedStore';

const CANDIDATES_KEY = 'gesloc_candidates';
const LINKS_KEY = 'gesloc_candidate_links';

// État local simulant la base de données — remplacé par axios quand l'API sera prête
let candidateStore: Candidate[] = loadStore(CANDIDATES_KEY, []);
let linkStore: CandidateLink[] = loadStore(LINKS_KEY, []);

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export const candidateApi = {
  // ─── Public ──────────────────────────────────────────────────────────────

  getLinkByToken: async (token: string): Promise<CandidateLink | null> => {
    await delay();
    return linkStore.find((l) => l.token === token) ?? null;
  },

  submit: async (data: SubmitCandidateData): Promise<Candidate> => {
    await delay();
    const candidate: Candidate = {
      ...data,
      id: uuidv4(),
      status: 'en_attente',
      submittedAt: new Date().toISOString(),
    };
    candidateStore = [...candidateStore, candidate];
    saveStore(CANDIDATES_KEY, candidateStore);
    return candidate;
  },

  // ─── Private ─────────────────────────────────────────────────────────────

  getByProperty: async (propertyId: string): Promise<Candidate[]> => {
    await delay();
    return candidateStore.filter((c) => c.propertyId === propertyId);
  },

  getById: async (id: string): Promise<Candidate> => {
    await delay();
    const candidate = candidateStore.find((c) => c.id === id);
    if (!candidate) throw new Error(`Candidat introuvable (id: ${id})`);
    return { ...candidate };
  },

  update: async (data: {
    id: string;
    status?: CandidateStatus;
    notes?: string;
  }): Promise<Candidate> => {
    await delay();
    const index = candidateStore.findIndex((c) => c.id === data.id);
    if (index === -1) throw new Error(`Candidat introuvable (id: ${data.id})`);
    const updated: Candidate = { ...candidateStore[index], ...data };
    candidateStore = candidateStore.map((c) => (c.id === data.id ? updated : c));
    saveStore(CANDIDATES_KEY, candidateStore);
    return updated;
  },

  delete: async (id: string): Promise<void> => {
    await delay();
    candidateStore = candidateStore.filter((c) => c.id !== id);
    saveStore(CANDIDATES_KEY, candidateStore);
  },

  // ─── Link management ─────────────────────────────────────────────────────

  getLink: async (propertyId: string): Promise<CandidateLink | null> => {
    await delay();
    return linkStore.find((l) => l.propertyId === propertyId) ?? null;
  },

  createLink: async (propertyId: string, propertyName: string): Promise<CandidateLink> => {
    await delay();
    const existing = linkStore.find((l) => l.propertyId === propertyId);
    if (existing) return existing;
    const link: CandidateLink = {
      propertyId,
      propertyName,
      token: uuidv4(),
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    linkStore = [...linkStore, link];
    saveStore(LINKS_KEY, linkStore);
    return link;
  },

  toggleLink: async (propertyId: string): Promise<CandidateLink> => {
    await delay();
    const index = linkStore.findIndex((l) => l.propertyId === propertyId);
    if (index === -1) throw new Error('Lien introuvable');
    const updated: CandidateLink = {
      ...linkStore[index],
      isActive: !linkStore[index].isActive,
    };
    linkStore = linkStore.map((l) => (l.propertyId === propertyId ? updated : l));
    saveStore(LINKS_KEY, linkStore);
    return updated;
  },
};
