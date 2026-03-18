import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

import { T_EmployeePerformanceKPIs } from '@/types/analytics';

async function getEmployeePerformanceKPIs(filters: { from?: string; to?: string }): Promise<T_EmployeePerformanceKPIs> {
  const token = getCookie('token');
  const params = new URLSearchParams();
  if (filters.from) params.set('from', filters.from);
  if (filters.to) params.set('to', filters.to);

  const config = {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      Authorization: `Token ${token}`,
    },
  };

  if (token) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/analytics/employee-performance/?${params}`,
      config
    );
    if (!res.ok) throw res.json();
    const json = await res.json();
    return json;
  }
  return {} as T_EmployeePerformanceKPIs;
}

function useGetEmployeePerformanceKPIs(filters: { from?: string; to?: string } = {}) {
  return useQuery(
    ['analyticsEmployeePerformanceKPIs', filters.from, filters.to],
    () => getEmployeePerformanceKPIs(filters),
    { 
      keepPreviousData: true, 
      refetchOnWindowFocus: false 
    }
  );
}

export default useGetEmployeePerformanceKPIs;
