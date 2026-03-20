import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

import { T_RestoreResponse } from '@/types/employee-201-records/document-repository';

async function restoreFolder(
  employeeId: number,
  folderId: number
): Promise<T_RestoreResponse> {
  const token = getCookie('token');

  const config: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
  };

  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/employee-201/employees/${employeeId}/document-folders/${folderId}/restore/`;

  const res = await fetch(url, config);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to restore folder.');
  }

  const responseData = await res.json();
  return responseData.data || responseData;
}

export function useRestoreFolder(employeeId: number) {
  const queryClient = useQueryClient();

  return useMutation<T_RestoreResponse, Error, number>(
    (folderId: number) => restoreFolder(employeeId, folderId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['employeeDocumentFoldersTrashCache', employeeId]);
        queryClient.invalidateQueries(['employeeDocumentFoldersCache', employeeId]);
        queryClient.invalidateQueries(['employeeDocumentsCache', employeeId]);
      },
    }
  );
}
