import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

import { T_RenderDocumentTemplate } from '@/types/custom-document-generator';

/**
 * Renders the filled template to PDF on the backend (same pipeline as memo/policy previews).
 * Returns an object URL the caller must revoke.
 */
async function renderDocumentTemplate(data: T_RenderDocumentTemplate): Promise<string> {
  const token = getCookie('token');
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/document-templates/${data.id}/render/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify({
      employee_id: data.employeeId || null,
      employee_issue_id: data.employeeIssueId || null,
      values: data.values,
    }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to generate the document.');
  }
  return URL.createObjectURL(await res.blob());
}

export function useRenderDocumentTemplate() {
  return useMutation<string, Error, T_RenderDocumentTemplate>((data: T_RenderDocumentTemplate) =>
    renderDocumentTemplate(data)
  );
}
