import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';
import { T_ReorderFoldersData } from '@/types/employee-201-records/document-repository';

async function reorderFolders(employeeId: number, data: T_ReorderFoldersData): Promise<{ message: string }> {
  const token = getCookie('token');

  const config: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(data),
  };

  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/employee-201/employees/${employeeId}/document-folders/reorder/`;

  const res = await fetch(url, config);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to reorder folders.');
  }

  return res.json();
}

export function useReorderFolders(employeeId: number) {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, Error, T_ReorderFoldersData>(
    (data: T_ReorderFoldersData) => reorderFolders(employeeId, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['employeeDocumentFoldersCache', employeeId]);
      },
    }
  );
}
