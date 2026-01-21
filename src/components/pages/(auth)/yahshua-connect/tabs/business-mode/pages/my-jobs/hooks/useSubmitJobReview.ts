import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface T_SubmitJobReviewData {
  business_job_application: number;
  rating: number;
  comment?: string;
}

interface T_JobReviewResponse {
  message: string;
  review_id: number;
}

async function submitJobReview(data: T_SubmitJobReviewData): Promise<T_JobReviewResponse> {
  const token = getCookie('token');

  const config: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(data),
  };

  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/business-jobs/applications/review/`;

  const res = await fetch(url, config);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || errorData.detail || 'Failed to submit review.');
  }

  const responseData = await res.json();
  return responseData.data || responseData;
}

export function useSubmitJobReview() {
  const queryClient = useQueryClient();

  return useMutation<T_JobReviewResponse, Error, T_SubmitJobReviewData>(
    (data: T_SubmitJobReviewData) => submitJobReview(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['myAppliedBusinessJobs']);
        queryClient.invalidateQueries(['findBusinessJobsCache']);
      },
    }
  );
}
