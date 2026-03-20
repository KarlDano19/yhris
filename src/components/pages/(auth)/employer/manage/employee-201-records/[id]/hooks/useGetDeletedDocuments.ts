import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

import { T_EmployeeDocumentTrash } from '@/types/employee-201-records/document-repository';

async function getDeletedDocuments(employeeId: number): Promise<T_EmployeeDocumentTrash[]> {
  try {
    const token = getCookie('token');
    const config = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };

    if (token) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/employee-201/employees/${employeeId}/documents/trash/`,
        config
      );

      if (!res.ok) {
        throw await res.json();
      }

      const data = await res.json();
      return data.data || data;
    }
    return [];
  } catch (error: any) {
    let errStringify = await error;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.detail;
    }
    if (Object.hasOwn(errStringify, 'detail')) {
      throw errStringify;
    }
    throw errStringify.message || 'Failed to fetch deleted documents';
  }
}

function useGetDeletedDocuments(employeeId: number) {
  const query = useQuery(
    ['employeeDocumentsTrashCache', employeeId],
    () => getDeletedDocuments(employeeId),
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      enabled: !!employeeId,
    }
  );
  return query;
}

export default useGetDeletedDocuments;
