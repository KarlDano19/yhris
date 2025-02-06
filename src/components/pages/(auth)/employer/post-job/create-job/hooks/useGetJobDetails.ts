import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function getJobDetails(job_post_id: any) {
  try {
    const token = getCookie('token');
    const config = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${job_post_id}/`, config);
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
