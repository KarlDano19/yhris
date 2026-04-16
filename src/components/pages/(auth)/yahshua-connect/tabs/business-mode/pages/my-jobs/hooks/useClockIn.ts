import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

import { T_ClockInData, T_ClockInResponse } from '@/types/business-mode';

async function clockIn(data: T_ClockInData): Promise<T_ClockInResponse> {
  const token = getCookie('token');

  const config: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
  };

  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/business-jobs/applications/${data.applicationId}/clock-in/`;

  const res = await fetch(url, config);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to clock in.');
  }

  const responseData = await res.json();
  return responseData;
}

export function useClockIn() {
  const queryClient = useQueryClient();

  return useMutation<T_ClockInResponse, Error, T_ClockInData>(
    (data: T_ClockInData) => clockIn(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['myAppliedBusinessJobs']);
        queryClient.invalidateQueries(['myBusinessJobsCache']);
        queryClient.invalidateQueries(['businessJobsCache']);
        queryClient.invalidateQueries(['timeRecordsCache']);
      },
    }
  );
}
