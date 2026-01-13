import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

import { T_SubmitDailyProgressData, T_DailyProgress } from '@/types/business-mode';

async function submitDailyProgress(data: T_SubmitDailyProgressData): Promise<T_DailyProgress> {
  const token = getCookie('token');

  const formData = new FormData();
  formData.append('progress_date', data.progress_date);
  if (data.proof_file) {
    formData.append('proof_file', data.proof_file);
  }
  if (data.notes) {
    formData.append('notes', data.notes);
  }
  if (data.hours_worked !== undefined) {
    formData.append('hours_worked', data.hours_worked.toString());
  }

  const config: RequestInit = {
    method: 'POST',
    headers: {
      Authorization: `Token ${token}`,
    },
    body: formData,
  };

  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/business-jobs/applications/${data.applicationId}/daily-progress/`;

  const res = await fetch(url, config);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to submit daily progress.');
  }

  const responseData = await res.json();
  return responseData.data || responseData;
}

export function useSubmitDailyProgress() {
  const queryClient = useQueryClient();

  return useMutation<T_DailyProgress, Error, T_SubmitDailyProgressData>(
    (data: T_SubmitDailyProgressData) => submitDailyProgress(data),
    {
      onSuccess: () => {
        // Invalidate all my applied jobs queries
        queryClient.invalidateQueries(['myAppliedBusinessJobs']);
        // Invalidate other related queries
        queryClient.invalidateQueries(['myBusinessJobsCache']);
        queryClient.invalidateQueries(['businessJobsCache']);
        queryClient.invalidateQueries(['dailyProgressCache']);
      },
    }
  );
}

