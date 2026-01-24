import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

import { T_ReviewDailyProgressData, T_DailyProgress } from '@/types/business-mode';

async function reviewDailyProgress(data: T_ReviewDailyProgressData): Promise<T_DailyProgress> {
  const token = getCookie('token');

  const config: RequestInit = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify({
      status: data.status,
      client_feedback: data.client_feedback,
    }),
  };

  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/business-jobs/applications/daily-progress/${data.progressId}/`;

  const res = await fetch(url, config);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to review daily progress.');
  }

  const responseData = await res.json();
  return responseData.data || responseData;
}

export function useReviewDailyProgress() {
  const queryClient = useQueryClient();

  return useMutation<T_DailyProgress, Error, T_ReviewDailyProgressData>(
    (data: T_ReviewDailyProgressData) => reviewDailyProgress(data),
    {
      onSuccess: () => {
        // Invalidate all related queries
        queryClient.invalidateQueries(['myAppliedBusinessJobs']);
        queryClient.invalidateQueries(['myBusinessJobsCache']);
        queryClient.invalidateQueries(['businessJobsCache']);
        queryClient.invalidateQueries(['myHiresCache']);
        queryClient.invalidateQueries(['dailyProgressCache']);
      },
    }
  );
}

