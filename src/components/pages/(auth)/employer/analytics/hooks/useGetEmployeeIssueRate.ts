import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

import { T_EmployeeIssueRate } from '@/types/analytics';

interface EmployeeIssueRateFilters {
  from?: string;
  to?: string;
  current_page?: number;
  page_size?: number;
  search?: string;
  enabled?: boolean;
}

async function getEmployeeIssueRate(filters: EmployeeIssueRateFilters): Promise<T_EmployeeIssueRate> {
  const token = getCookie('token');
  const params = new URLSearchParams();
  if (filters.from) params.set('from', filters.from);
  if (filters.to) params.set('to', filters.to);
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
      `${process.env.NEXT_PUBLIC_API_URL}/api/analytics/employee-performance/employee-issue-rate/?${params}`,
      config
    );
    if (!res.ok) throw res.json();
    const json = await res.json();
    return json;
  }
  return {
    issue_type_distribution: [],
    monthly_issue_volume: [],
    issues_table: { records: [], total_records: 0, total_pages: 1, current_page: 1, page_size: 10 },
  };
}

function useGetEmployeeIssueRate(filters: EmployeeIssueRateFilters = {}) {
  const { enabled = true, ...queryFilters } = filters;
  return useQuery(
    ['analyticsEmployeeIssueRate', queryFilters.from, queryFilters.to, queryFilters.current_page, queryFilters.page_size, queryFilters.search],
    () => getEmployeeIssueRate(queryFilters),
    { 
      keepPreviousData: true, 
      enabled, 
      refetchOnWindowFocus: false 
    }
  );
}

export default useGetEmployeeIssueRate;
