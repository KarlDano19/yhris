import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function deleteDocument(
  employeeId: number,
  documentId: number
): Promise<{ message: string }> {
  const token = getCookie('token');

  const config: RequestInit = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
  };

  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/employee-201/employees/${employeeId}/documents/${documentId}/`;

  const res = await fetch(url, config);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to delete document.');
  }

  const responseData = await res.json();
  return responseData.data || responseData;
}

export function useDeleteDocument(employeeId: number) {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, Error, number>(
    (documentId: number) => deleteDocument(employeeId, documentId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['employeeDocumentsCache', employeeId]);
        queryClient.invalidateQueries(['employeeDocumentFoldersCache', employeeId]);
      },
    }
  );
}
