import JSZip from 'jszip';
import type { Candidate } from '../types/candidate.types';
import { documentTypeLabels, employmentTypeLabels } from '../types/candidate.types';

const buildSummaryText = (candidate: Candidate): string => {
  const lines: string[] = [
    '═══════════════════════════════════════',
    '  DOSSIER DE CANDIDATURE',
    '═══════════════════════════════════════',
    '',
    '── CANDIDAT ────────────────────────────',
    `Nom          : ${candidate.person.firstName} ${candidate.person.lastName}`,
    `Email        : ${candidate.person.email}`,
    `Téléphone    : ${candidate.person.phone}`,
  ];

  if (candidate.person.address) {
    const { number, street, postCode, city } = candidate.person.address;
    lines.push(`Adresse      : ${number ? number + ' ' : ''}${street}, ${postCode} ${city}`);
  }

  lines.push(
    '',
    '── SITUATION PROFESSIONNELLE ───────────',
    `Statut       : ${employmentTypeLabels[candidate.employmentType]}`,
    `Revenus nets : ${candidate.income.toLocaleString('fr-FR')} €/mois`,
    '',
    '── DOCUMENTS FOURNIS ───────────────────',
  );

  if (candidate.documents.length === 0) {
    lines.push('Aucun document fourni');
  } else {
    candidate.documents.forEach((doc, i) => {
      lines.push(`  ${i + 1}. [${documentTypeLabels[doc.type]}] ${doc.fileName}`);
    });
  }

  if (candidate.hasGuarantor && candidate.guarantor) {
    const g = candidate.guarantor;
    lines.push(
      '',
      '── CAUTION ─────────────────────────────',
      `Nom          : ${g.person.firstName} ${g.person.lastName}`,
      `Statut       : ${employmentTypeLabels[g.employmentType]}`,
      `Revenus nets : ${g.income.toLocaleString('fr-FR')} €/mois`,
      '',
      '── DOCUMENTS CAUTION ───────────────────',
    );
    if (g.documents.length === 0) {
      lines.push('Aucun document fourni');
    } else {
      g.documents.forEach((doc, i) => {
        lines.push(`  ${i + 1}. [${documentTypeLabels[doc.type]}] ${doc.fileName}`);
      });
    }
  }

  if (candidate.coverLetter) {
    lines.push('', '── LETTRE DE MOTIVATION ────────────────', candidate.coverLetter);
  }

  lines.push(
    '',
    '═══════════════════════════════════════',
    `Dossier soumis le : ${new Date(candidate.submittedAt).toLocaleDateString('fr-FR')}`,
    '═══════════════════════════════════════',
  );

  return lines.join('\n');
};

/** Converts a base64 data URL to a Uint8Array for JSZip */
const dataUrlToUint8Array = (dataUrl: string): Uint8Array => {
  const base64 = dataUrl.split(',')[1];
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
};

export const exportDossier = async (candidate: Candidate): Promise<void> => {
  const zip = new JSZip();

  const candidateName = `${candidate.person.lastName}_${candidate.person.firstName}`.replace(
    /\s+/g,
    '_',
  );

  // Summary text file
  zip.file('résumé.txt', buildSummaryText(candidate));

  // Candidate documents
  if (candidate.documents.length > 0) {
    const folder = zip.folder('documents_candidat')!;
    candidate.documents.forEach((doc, i) => {
      const prefix = `${String(i + 1).padStart(2, '0')}_${documentTypeLabels[doc.type].replace(/[^a-zA-Z0-9]/g, '_')}`;
      const ext = doc.fileName.split('.').pop() ?? 'bin';
      folder.file(`${prefix}.${ext}`, dataUrlToUint8Array(doc.file));
    });
  }

  // Guarantor documents
  if (candidate.hasGuarantor && candidate.guarantor && candidate.guarantor.documents.length > 0) {
    const folder = zip.folder('documents_caution')!;
    candidate.guarantor.documents.forEach((doc, i) => {
      const prefix = `${String(i + 1).padStart(2, '0')}_${documentTypeLabels[doc.type].replace(/[^a-zA-Z0-9]/g, '_')}`;
      const ext = doc.fileName.split('.').pop() ?? 'bin';
      folder.file(`${prefix}.${ext}`, dataUrlToUint8Array(doc.file));
    });
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `dossier_${candidateName}.zip`;
  a.click();
  URL.revokeObjectURL(url);
};
