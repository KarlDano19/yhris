import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';
import { T_CreateFolderData, T_FolderResponse } from '@/types/employee-201-records/document-repository';

async function createFolder(
  employeeId: number,
  data: T_CreateFolderData
): Promise<T_FolderResponse> {
  const token = getCookie('token');

  const config: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(data),
  };

  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/employee-201/employees/${employeeId}/document-folders/`;

  const res = await fetch(url, config);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to create folder.');
  }

  const responseData = await res.json();
  return responseData.data || responseData;
}

export function useCreateFolder(employeeId: number) {
  const queryClient = useQueryClient();

  return useMutation<T_FolderResponse, Error, T_CreateFolderData>(
    (data: T_CreateFolderData) => createFolder(employeeId, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['employeeDocumentFoldersCache', employeeId]);
      },
    }
  );
}
