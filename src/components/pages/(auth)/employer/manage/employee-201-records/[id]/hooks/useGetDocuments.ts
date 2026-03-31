import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';
import { T_EmployeeDocument } from '@/types/employee-201-records/document-repository';

type GetDocumentsParams = {
  employeeId: number;
  folderId?: number | null;
  search?: string;
  viewType?: 'all' | 'paginated';
};

async function getDocuments(params: GetDocumentsParams): Promise<T_EmployeeDocument[]> {
  try {
    const { employeeId, folderId, search, viewType = 'all' } = params;
    const token = getCookie('token');

    let url = `${process.env.NEXT_PUBLIC_API_URL}/api/employee-201/employees/${employeeId}/documents/?view_type=${viewType}`;

    if (folderId !== undefined) {
      if (folderId === null) {
        url += '&folder=root';
      } else {
        url += `&folder_id=${folderId}`;
      }
    }

    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }

    const config = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };

    if (token) {
      const res = await fetch(url, config);

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
    throw errStringify.message || 'Failed to fetch documents';
  }
}

function useGetDocuments(params: GetDocumentsParams) {
  const query = useQuery(
    ['employeeDocumentsCache', params.employeeId, params.folderId, params.search],
    () => getDocuments(params),
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      enabled: !!params.employeeId,
    }
  );
  return query;
}

export default useGetDocuments;
