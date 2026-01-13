import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

import { T_DailyProgressResponse } from '@/types/business-mode';

type QueryParams = {
  applicationId: number;
  status?: string;
  date_from?: string;
  date_to?: string;
  page_size?: number;
  current_page?: number;
};

async function getDailyProgress(params: QueryParams): Promise<T_DailyProgressResponse> {
  const token = getCookie('token');

  const queryParams = new URLSearchParams();
  if (params.status) queryParams.append('status', params.status);
  if (params.date_from) queryParams.append('date_from', params.date_from);
  if (params.date_to) queryParams.append('date_to', params.date_to);
  if (params.page_size) queryParams.append('page_size', params.page_size.toString());
  if (params.current_page) queryParams.append('current_page', params.current_page.toString());

  const config: RequestInit = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
  };

  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/business-jobs/applications/${params.applicationId}/daily-progress/?${queryParams.toString()}`;

  const res = await fetch(url, config);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to fetch daily progress.');
  }

  const responseData = await res.json();
  return responseData.data || responseData;
}

export function useGetDailyProgress(params: QueryParams, enabled: boolean = true) {
  return useQuery<T_DailyProgressResponse, Error>(
    ['dailyProgressCache', params.applicationId, params.status, params.date_from, params.date_to, params.current_page],
    () => getDailyProgress(params),
    {
      enabled: enabled && !!params.applicationId,
      refetchOnWindowFocus: false,
      staleTime: 30000, // 30 seconds
    }
  );
}

