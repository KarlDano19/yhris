import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function getAppliedApplicants(jobId: any, isArchived?: boolean) {
  try {
    const token = getCookie('token');
    
    // Build URL with optional is_archived parameter
    let url = `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${jobId}/applicants/`;
    if (isArchived !== undefined) {
      url += `?is_archived=${isArchived}`;
    }
    
    const config = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    if (token) {
      const res = await fetch(url, config);
      if (!res.ok) {
        throw res.json();
      }
      return res.json();
    }
    return [];
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.message;
    }
    throw errStringify.message;
  }
}

function useGetAppliedApplicants(jobId: any, isArchived?: boolean) {
  const query = useQuery(
    ['appliedApplicantsCache', jobId, isArchived], 
    () => getAppliedApplicants(jobId, isArchived), 
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      keepPreviousData: true,
      enabled: !!jobId, // Only run query if jobId exists
    }
  );

  return query;
}

export default useGetAppliedApplicants;
