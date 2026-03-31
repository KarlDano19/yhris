import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

import { T_JobPostingEdit } from '@/types/job_posting';

async function getJobDetails(job_post_id: any): Promise<T_JobPostingEdit> {
  try {
    let newFilters = { view_type: 'edit' };
    const searchParams = new URLSearchParams(newFilters);
    const token = getCookie('token');
    const config = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${job_post_id}/?${searchParams}`, config);
    if (!res.ok) {
      throw res.json();
    }
    return res.json();
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.message;
    }
    throw errStringify.message;
  }
}

function useGetJobDetails(jobId: any) {
  const query = useQuery(['jobPostDetailPublicCache', jobId], () => getJobDetails(jobId), {
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });

  return query;
}

export default useGetJobDetails;
