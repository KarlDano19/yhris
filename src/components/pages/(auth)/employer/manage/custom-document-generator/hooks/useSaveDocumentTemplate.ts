import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

import { T_DocumentTemplate, T_SaveDocumentTemplate } from '@/types/custom-document-generator';

/** Creates the template when it has no id yet, otherwise updates it. */
async function saveDocumentTemplate(data: T_SaveDocumentTemplate): Promise<T_DocumentTemplate> {
  const token = getCookie('token');
  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('html', data.html);
  formData.append('fields', JSON.stringify(data.fields));
  if (data.letterhead) formData.append('letterhead', data.letterhead);
  else if (data.removeLetterhead) formData.append('remove_letterhead', 'true');
  formData.append('letterhead_first_page_only', String(data.letterheadFirstPageOnly));
  formData.append('margin_top_mm', String(data.marginTopMm));
  formData.append('margin_bottom_mm', String(data.marginBottomMm));
  if (data.originalFile) formData.append('original_file', data.originalFile);
  formData.append('standard_type', data.standardType);

  const url = data.id
    ? `${process.env.NEXT_PUBLIC_API_URL}/api/document-templates/${data.id}/`
    : `${process.env.NEXT_PUBLIC_API_URL}/api/document-templates/`;

  const res = await fetch(url, {
    method: data.id ? 'PATCH' : 'POST',
    headers: {
      Authorization: `Token ${token}`,
    },
    body: formData,
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to save the template.');
  }
  return res.json();
}

export function useSaveDocumentTemplate() {
  const queryClient = useQueryClient();

  return useMutation<T_DocumentTemplate, Error, T_SaveDocumentTemplate>(
    (data: T_SaveDocumentTemplate) => saveDocumentTemplate(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['documentTemplatesCache']);
      },
    }
  );
}
