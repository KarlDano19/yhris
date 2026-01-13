import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

import { T_SubmitApplicantReviewData, T_ApplicantReview } from '@/types/business-mode';

async function submitApplicantReview(data: T_SubmitApplicantReviewData): Promise<T_ApplicantReview> {
  const token = getCookie('token');

  const config: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify({
      business_job_application: data.applicationId,
      rating: data.rating,
      review_text: data.review_text || null,
    }),
  };

  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/applicants/reviews/`;

  const res = await fetch(url, config);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to submit review.');
  }

  const responseData = await res.json();
  return responseData.data || responseData;
}

export function useSubmitApplicantReview() {
  const queryClient = useQueryClient();

  return useMutation<T_ApplicantReview, Error, T_SubmitApplicantReviewData>(
    (data: T_SubmitApplicantReviewData) => submitApplicantReview(data),
    {
      onSuccess: () => {
        // Invalidate all related queries
        queryClient.invalidateQueries(['myBusinessJobsCache']);
        queryClient.invalidateQueries(['businessJobsCache']);
        queryClient.invalidateQueries(['myHiresCache']);
      },
    }
  );
}
