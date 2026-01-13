import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

import { T_UpdateApplicationStatusData, T_ApplicationStatusResponse } from '@/types/business-mode';

async function updateApplicationStatus(data: T_UpdateApplicationStatusData): Promise<T_ApplicationStatusResponse> {
  const token = getCookie('token');

  const config: RequestInit = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify({ status: data.status }),
  };

  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/business-jobs/applications/${data.applicationId}/status/`;

  const res = await fetch(url, config);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to update application status.');
  }

  const responseData = await res.json();
  return responseData.data || responseData;
}

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();

  return useMutation<T_ApplicationStatusResponse, Error, T_UpdateApplicationStatusData>(
    (data: T_UpdateApplicationStatusData) => updateApplicationStatus(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['myBusinessJobsCache']);
        queryClient.invalidateQueries(['businessJobsCache']);
        queryClient.invalidateQueries(['myHiresCache']);
      },
    }
  );
}
