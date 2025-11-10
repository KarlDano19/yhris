import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function getAppliedApplicants(jobId: any, isArchived?: boolean, recentOnly?: boolean, dateFrom?: string, dateTo?: string) {
  try {
    const token = getCookie('token');
    
    // Build URL with optional parameters
    let url = `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${jobId}/applicants/`;
    const params = new URLSearchParams();
    
    if (isArchived !== undefined) {
      params.append('is_archived', isArchived.toString());
    }
    
    if (recentOnly !== undefined) {
      params.append('recent_only', recentOnly.toString());
    }
    
    if (dateFrom) {
      params.append('from', dateFrom);
    }
    
    if (dateTo) {
      params.append('to', dateTo);
    }
    
    if (params.toString()) {
      url += `?${params.toString()}`;
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

function useGetAppliedApplicants(jobId: any, isArchived?: boolean, recentOnly?: boolean, dateFrom?: string, dateTo?: string) {
  const query = useQuery(
    ['appliedApplicantsCache', jobId, isArchived, recentOnly, dateFrom, dateTo], 
    () => getAppliedApplicants(jobId, isArchived, recentOnly, dateFrom, dateTo), 
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
