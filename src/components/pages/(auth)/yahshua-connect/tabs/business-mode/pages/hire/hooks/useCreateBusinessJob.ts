import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

import { T_CreateBusinessJobData, T_BusinessJobResponse } from '@/types/business-mode';

async function createBusinessJob(data: T_CreateBusinessJobData): Promise<T_BusinessJobResponse> {
  const token = getCookie('token');

  const config: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(data),
  };

  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/business-jobs/`;

  const res = await fetch(url, config);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to create business job.');
  }

  const responseData = await res.json();
  return responseData.data || responseData;
}

export function useCreateBusinessJob() {
  const queryClient = useQueryClient();

  return useMutation<T_BusinessJobResponse, Error, T_CreateBusinessJobData>(
    (data: T_CreateBusinessJobData) => createBusinessJob(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['myBusinessJobsCache']);
        queryClient.invalidateQueries(['businessJobsCache']);
      },
    }
  );
}
