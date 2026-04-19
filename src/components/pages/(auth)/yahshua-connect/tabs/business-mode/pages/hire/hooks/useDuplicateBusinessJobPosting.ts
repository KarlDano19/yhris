import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface DuplicateResponse {
  message: string;
  id: number;
}

async function duplicateBusinessJobPosting(jobPostingId: number): Promise<DuplicateResponse> {
  const token = getCookie('token');

  const config: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
  };

  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/business-jobs/${jobPostingId}/duplicate/`;

  const res = await fetch(url, config);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to duplicate business job posting.');
  }

  const responseData = await res.json();
  return responseData.data || responseData;
}

export function useDuplicateBusinessJobPosting() {
  return useMutation<DuplicateResponse, Error, number>(
    (jobPostingId: number) => duplicateBusinessJobPosting(jobPostingId)
  );
}
