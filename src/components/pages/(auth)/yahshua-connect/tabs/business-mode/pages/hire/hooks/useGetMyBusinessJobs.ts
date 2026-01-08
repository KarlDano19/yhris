import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

import { T_MyBusinessJobsResponse } from '@/types/business-mode';

interface UseGetMyBusinessJobsParams {
  status?: string;
  page_size?: number;
  current_page?: number;
}

async function fetchMyBusinessJobs(params: UseGetMyBusinessJobsParams = {}): Promise<T_MyBusinessJobsResponse> {
  const token = getCookie('token');

  const searchParams = new URLSearchParams();
  if (params.status) searchParams.append('status', params.status);
  if (params.page_size) searchParams.append('page_size', params.page_size.toString());
  if (params.current_page) searchParams.append('current_page', params.current_page.toString());

  const config: RequestInit = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
  };

  const queryString = searchParams.toString();
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/business-jobs/my-jobs/${queryString ? `?${queryString}` : ''}`;

  const res = await fetch(url, config);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to fetch business jobs.');
  }

  const data = await res.json();
  return data.data || data;
}

export function useGetMyBusinessJobs(params: UseGetMyBusinessJobsParams = {}, enabled: boolean = true) {
  return useQuery<T_MyBusinessJobsResponse, Error>(
    ['myBusinessJobsCache', params],
    () => fetchMyBusinessJobs(params),
    {
      enabled,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );
}
