import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

import { T_BusinessJob } from '@/types/business-mode';

async function fetchBusinessJobDetails(jobId: number): Promise<T_BusinessJob> {
  const token = getCookie('token');

  const config: RequestInit = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
  };

  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/business-jobs/${jobId}/`;

  const res = await fetch(url, config);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to fetch business job details.');
  }

  const data = await res.json();
  return data.data || data;
}

export function useGetBusinessJobDetails(jobId: number | null, enabled: boolean = true) {
  return useQuery<T_BusinessJob, Error>(
    ['businessJobDetailsCache', jobId],
    () => fetchBusinessJobDetails(jobId!),
    {
      enabled: enabled && !!jobId,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );
}
