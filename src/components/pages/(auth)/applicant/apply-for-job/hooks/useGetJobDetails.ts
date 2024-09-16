import { useQuery } from '@tanstack/react-query';

async function getJobDetails(jobId: any) {
  try {
    const config = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      },
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/public/jobs/${jobId}/`, config);
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
