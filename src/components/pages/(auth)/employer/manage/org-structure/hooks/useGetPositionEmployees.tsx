import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';
import { Employee } from '../types';

interface UseGetPositionEmployeesParams {
  orgStructureId: number | string;
  page?: number;
  pageSize?: number;
  search?: string;
  enabled?: boolean;
}

interface PositionEmployeesResponse {
  employees: Employee[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalRecords: number;
    totalPages: number;
  };
}

async function getPositionEmployees(orgStructureId: number | string, page: number, pageSize: number, search: string = '') {
  try {
    const token = getCookie('token');
    const config = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    
    if (token) {
      // Build URL with search parameter if provided
      let url = `${process.env.NEXT_PUBLIC_API_URL}/api/org-structures/${orgStructureId}/employees/?current_page=${page}&page_size=${pageSize}`;
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }
      
      const res = await fetch(url, config);
      if (!res.ok) {
        throw res.json();
      }
      return res.json();
    }
    return { employees: [], pagination: { currentPage: 1, pageSize: 10, totalRecords: 0, totalPages: 0 } };
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.message;
    }
    throw errStringify.message;
  }
}

const useGetPositionEmployees = ({ 
  orgStructureId, 
  page = 1, 
  pageSize = 10,
  search = '',
  enabled = true 
}: UseGetPositionEmployeesParams) => {
  const query = useQuery<PositionEmployeesResponse>(
    ['orgStructurePositionEmployees', orgStructureId, page, pageSize, search],
    () => getPositionEmployees(orgStructureId, page, pageSize, search),
    {
      enabled: enabled && !!orgStructureId,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  return query;
};

export default useGetPositionEmployees;

