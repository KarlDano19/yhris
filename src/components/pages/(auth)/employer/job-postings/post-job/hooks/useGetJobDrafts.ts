import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

import { T_JobPostingDraft } from '@/types/job_posting';

async function getJobDrafts(): Promise<T_JobPostingDraft[]> {
  try {
    const token = getCookie('token');
    const config = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };

    if (token) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/job-drafts/`, config);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch drafts');
      }
      const data = await res.json();
      // Handle both wrapped and direct array responses
      return Array.isArray(data) ? data : (data.data || []);
    }
    return [];
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch drafts');
  }
}

function useGetJobDrafts() {
  const query = useQuery({
    queryKey: ['jobDraftsCache'],
    queryFn: () => getJobDrafts(),
    refetchOnWindowFocus: false,
  });
  return query;
}

export default useGetJobDrafts;
