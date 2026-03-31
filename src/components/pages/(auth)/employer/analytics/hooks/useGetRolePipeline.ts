import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

import { T_RolePipeline } from '@/types/analytics';

interface RolePipelineFilters {
  from?: string;
  to?: string;
  current_page?: number;
  page_size?: number;
  enabled?: boolean;
}

async function getRolePipeline(filters: RolePipelineFilters): Promise<T_RolePipeline> {
  const token = getCookie('token');
  const params = new URLSearchParams();
  if (filters.from) params.set('from', filters.from);
  if (filters.to) params.set('to', filters.to);
  if (filters.current_page) params.set('current_page', String(filters.current_page));
  if (filters.page_size) params.set('page_size', String(filters.page_size));

  const config = {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      Authorization: `Token ${token}`,
    },
  };

  if (token) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/analytics/workforce-overview/role-pipeline/?${params}`,
      config
    );
    if (!res.ok) throw res.json();
    const json = await res.json();
    return json;
  }
  return { records: [], total_records: 0, total_pages: 1, current_page: 1, page_size: 10 };
}

function useGetRolePipeline(filters: RolePipelineFilters = {}) {
  const { enabled = true, ...queryFilters } = filters;
  return useQuery(
    ['analyticsRolePipeline', queryFilters.from, queryFilters.to, queryFilters.current_page, queryFilters.page_size],
    () => getRolePipeline(queryFilters),
    { 
      keepPreviousData: true, 
      enabled, 
      refetchOnWindowFocus: false 
    }
  );
}

export default useGetRolePipeline;
