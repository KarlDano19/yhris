import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

import { T_StartJobData, T_BusinessJobApplication } from '@/types/business-mode';

async function startJob(data: T_StartJobData): Promise<T_BusinessJobApplication> {
  const token = getCookie('token');

  const config: RequestInit = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
  };

  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/business-jobs/applications/${data.applicationId}/start/`;

  const res = await fetch(url, config);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to start job.');
  }

  const responseData = await res.json();
  return responseData.data || responseData;
}

export function useStartJob() {
  const queryClient = useQueryClient();

  return useMutation<T_BusinessJobApplication, Error, T_StartJobData>(
    (data: T_StartJobData) => startJob(data),
    {
      onSuccess: () => {
        // Invalidate all my applied jobs queries
        queryClient.invalidateQueries(['myAppliedBusinessJobs']);
        // Invalidate other related queries
        queryClient.invalidateQueries(['myBusinessJobsCache']);
        queryClient.invalidateQueries(['businessJobsCache']);
      },
    }
  );
}

