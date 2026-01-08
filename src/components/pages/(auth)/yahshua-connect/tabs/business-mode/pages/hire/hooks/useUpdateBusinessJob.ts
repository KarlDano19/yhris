import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

import { T_UpdateBusinessJobData, T_BusinessJobResponse } from '@/types/business-mode';

async function updateBusinessJob(data: T_UpdateBusinessJobData): Promise<T_BusinessJobResponse> {
  const token = getCookie('token');
  
  const { jobId, ...updateData } = data;

  const config: RequestInit = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(updateData),
  };

  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/business-jobs/${jobId}/`;

  const res = await fetch(url, config);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to update business job.');
  }

  const responseData = await res.json();
  return responseData.data || responseData;
}

export function useUpdateBusinessJob() {
  const queryClient = useQueryClient();

  return useMutation<T_BusinessJobResponse, Error, T_UpdateBusinessJobData>(
    (data: T_UpdateBusinessJobData) => updateBusinessJob(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['myBusinessJobsCache']);
        queryClient.invalidateQueries(['businessJobsCache']);
      },
    }
  );
}
