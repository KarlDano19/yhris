import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

import { T_ClockOutData, T_ClockOutResponse } from '@/types/business-mode';

async function clockOut(data: T_ClockOutData): Promise<T_ClockOutResponse> {
  const token = getCookie('token');

  const config: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
  };

  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/business-jobs/applications/${data.applicationId}/clock-out/`;

  const res = await fetch(url, config);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to clock out.');
  }

  const responseData = await res.json();
  return responseData;
}

export function useClockOut() {
  const queryClient = useQueryClient();

  return useMutation<T_ClockOutResponse, Error, T_ClockOutData>(
    (data: T_ClockOutData) => clockOut(data),
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
