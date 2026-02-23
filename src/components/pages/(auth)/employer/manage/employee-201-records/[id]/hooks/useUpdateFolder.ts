import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';
import { T_UpdateFolderData, T_FolderResponse } from '@/types/employee-201-records/document-repository';

async function updateFolder(
  employeeId: number,
  folderId: number,
  data: T_UpdateFolderData
): Promise<T_FolderResponse> {
  const token = getCookie('token');

  const config: RequestInit = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(data),
  };

  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/employee-201/employees/${employeeId}/document-folders/${folderId}/`;

  const res = await fetch(url, config);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to update folder.');
  }

  const responseData = await res.json();
  return responseData.data || responseData;
}

export function useUpdateFolder(employeeId: number) {
  const queryClient = useQueryClient();

  return useMutation<T_FolderResponse, Error, { folderId: number; data: T_UpdateFolderData }>(
    ({ folderId, data }) => updateFolder(employeeId, folderId, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['employeeDocumentFoldersCache', employeeId]);
      },
    }
  );
}
