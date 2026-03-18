import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

import { T_PerformanceRate } from '@/types/analytics';

interface PerformanceRateFilters {
  from?: string;
  to?: string;
  department?: string;
  current_page?: number;
  page_size?: number;
  search?: string;
  enabled?: boolean;
}

async function getPerformanceRate(filters: PerformanceRateFilters): Promise<T_PerformanceRate> {
  const token = getCookie('token');
  const params = new URLSearchParams();
  if (filters.from) params.set('from', filters.from);
  if (filters.to) params.set('to', filters.to);
  if (filters.department) params.set('department', filters.department);
  if (filters.current_page) params.set('current_page', String(filters.current_page));
  if (filters.page_size) params.set('page_size', String(filters.page_size));
  if (filters.search) params.set('search', filters.search);

  const config = {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      Authorization: `Token ${token}`,
    },
  };

  if (token) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/analytics/employee-performance/performance-rate/?${params}`,
      config
    );
    if (!res.ok) throw res.json();
    const json = await res.json();
    return json;
  }
  return {
    performance_by_department: [],
    performance_trend: [],
    performance_table: { records: [], total_records: 0, total_pages: 1, current_page: 1, page_size: 10 },
  };
}

function useGetPerformanceRate(filters: PerformanceRateFilters = {}) {
  const { enabled = true, ...queryFilters } = filters;
  return useQuery(
    ['analyticsPerformanceRate', queryFilters.from, queryFilters.to, queryFilters.department, queryFilters.current_page, queryFilters.page_size, queryFilters.search],
    () => getPerformanceRate(queryFilters),
    { 
      keepPreviousData: true, 
      enabled, 
      refetchOnWindowFocus: false 
    }
  );
}

export default useGetPerformanceRate;
