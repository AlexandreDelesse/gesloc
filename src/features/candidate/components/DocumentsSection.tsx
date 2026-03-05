import { useRef, useState, type ChangeEvent } from 'react';
import { Alert, Box, Button, Chip, Stack, Typography } from '@mui/material';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DeleteIcon from '@mui/icons-material/Delete';
import { v4 as uuidv4 } from 'uuid';
import {
  documentTypeLabels,
  documentTypeValues,
  type CandidateDocument,
  type DocumentType,
} from '../types/candidate.types';

interface Props {
  documents: CandidateDocument[];
  onChange: (documents: CandidateDocument[]) => void;
}

const DocumentsSection = ({ documents, onChange }: Props) => {
  const inputRefs = useRef<Record<DocumentType, HTMLInputElement | null>>(
    {} as Record<DocumentType, HTMLInputElement | null>,
  );
  const [fileError, setFileError] = useState<string | null>(null);

  const handleFileChange = (type: DocumentType) => (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    setFileError(null);
    const oversized = files.find((f) => f.size > MAX_FILE_SIZE);
    if (oversized) {
      setFileError(`"${oversized.name}" dépasse la limite de 5 Mo.`);
      e.target.value = '';
      return;
    }

    const readers = files.map(
      (file) =>
        new Promise<CandidateDocument | null>((resolve) => {
          const reader = new FileReader();
          reader.onload = () =>
            resolve({
              id: uuidv4(),
              type,
              fileName: file.name,
              mimeType: file.type,
              file: reader.result as string,
            });
          reader.onerror = () => resolve(null);
          reader.readAsDataURL(file);
        }),
    );

    Promise.all(readers).then((results) => {
      const newDocs = results.filter((d): d is CandidateDocument => d !== null);
      if (newDocs.length < results.length) {
        setFileError('Un ou plusieurs fichiers n\'ont pas pu être lus.');
      }
      if (newDocs.length > 0) {
        onChange([...documents, ...newDocs]);
      }
    });

    // Reset input so the same file can be re-added if removed
    e.target.value = '';
  };

  const handleRemove = (id: string) => {
    onChange(documents.filter((d) => d.id !== id));
  };

  return (
    <Stack gap={2}>
      {fileError && <Alert severity="error" onClose={() => setFileError(null)}>{fileError}</Alert>}
      {documentTypeValues.map((type) => {
        const docsOfType = documents.filter((d) => d.type === type);

        return (
          <Box key={type}>
            <Box display="flex" alignItems="center" gap={1} mb={0.5}>
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                {documentTypeLabels[type]}
              </Typography>
              <Button
                size="small"
                startIcon={<AttachFileIcon />}
                onClick={() => inputRefs.current[type]?.click()}
                sx={{ minWidth: 0, px: 1, fontSize: '0.75rem' }}
              >
                Ajouter
              </Button>
              <input
                ref={(el) => { inputRefs.current[type] = el; }}
                type="file"
                accept="application/pdf,image/*"
                multiple
                hidden
                onChange={handleFileChange(type)}
              />
            </Box>
            {docsOfType.length > 0 && (
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {docsOfType.map((doc) => (
                  <Chip
                    key={doc.id}
                    label={doc.fileName}
                    size="small"
                    onDelete={() => handleRemove(doc.id)}
                    deleteIcon={<DeleteIcon />}
                    variant="outlined"
                    sx={{ maxWidth: 240 }}
                  />
                ))}
              </Stack>
            )}
          </Box>
        );
      })}
    </Stack>
  );
};

export default DocumentsSection;
