import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function deleteFolder(
  employeeId: number,
  folderId: number
): Promise<{ message: string }> {
  const token = getCookie('token');

  const config: RequestInit = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
  };

  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/employee-201/employees/${employeeId}/document-folders/${folderId}/`;

  const res = await fetch(url, config);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to delete folder.');
  }

  const responseData = await res.json();
  return responseData.data || responseData;
}

export function useDeleteFolder(employeeId: number) {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, Error, number>(
    (folderId: number) => deleteFolder(employeeId, folderId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['employeeDocumentFoldersCache', employeeId]);
        queryClient.invalidateQueries(['employeeDocumentsCache', employeeId]);
      },
    }
  );
}
