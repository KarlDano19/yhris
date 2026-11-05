import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function deleteDocumentTemplate(id: number) {
  const token = getCookie('token');
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/document-templates/${id}/`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to delete the template.');
  }
  return res.json();
}

export function useDeleteDocumentTemplate() {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, number>((id: number) => deleteDocumentTemplate(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(['documentTemplatesCache']);
    },
  });
}
