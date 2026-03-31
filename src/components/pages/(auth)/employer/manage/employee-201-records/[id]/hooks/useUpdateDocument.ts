import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';
import { T_UpdateDocumentData, T_DocumentResponse } from '@/types/employee-201-records/document-repository';

async function updateDocument(
  employeeId: number,
  documentId: number,
  data: T_UpdateDocumentData
): Promise<T_DocumentResponse> {
  const token = getCookie('token');

  const config: RequestInit = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(data),
  };

  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/employee-201/employees/${employeeId}/documents/${documentId}/`;

  const res = await fetch(url, config);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to update document.');
  }

  const responseData = await res.json();
  return responseData.data || responseData;
}

export function useUpdateDocument(employeeId: number) {
  const queryClient = useQueryClient();

  return useMutation<T_DocumentResponse, Error, { documentId: number; data: T_UpdateDocumentData }>(
    ({ documentId, data }) => updateDocument(employeeId, documentId, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['employeeDocumentsCache', employeeId]);
        queryClient.invalidateQueries(['employeeDocumentFoldersCache', employeeId]);
      },
    }
  );
}
