import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

import { T_DocumentTemplate } from '@/types/custom-document-generator';

/** Sends a company's document to Gemini and gets back an unsaved template to review. */
async function extractDocumentTemplate(file: File): Promise<T_DocumentTemplate> {
  const token = getCookie('token');
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/document-templates/extract/`, {
    method: 'POST',
    headers: {
      Authorization: `Token ${token}`,
    },
    body: formData,
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to read the document.');
  }
  return res.json();
}

export function useExtractDocumentTemplate() {
  return useMutation<T_DocumentTemplate, Error, File>((file: File) => extractDocumentTemplate(file));
}
