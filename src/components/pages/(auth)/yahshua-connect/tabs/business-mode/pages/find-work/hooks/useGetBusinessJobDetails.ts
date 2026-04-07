import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';
import { T_BusinessJob } from '@/types/business-mode';

async function getBusinessJobDetails(jobId: number | null, latitude?: number, longitude?: number): Promise<T_BusinessJob> {
  try {
    const token = getCookie('token');
    
    const searchParams = new URLSearchParams();
    if (latitude !== undefined) {
      searchParams.append('latitude', latitude.toString());
    }
    if (longitude !== undefined) {
      searchParams.append('longitude', longitude.toString());
    }

    const headers: Record<string, string> = {
      'content-type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Token ${token}`;
    }

    const config: RequestInit = {
      method: 'GET',
      headers,
    };
    
    const queryString = searchParams.toString();
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/business-jobs/${jobId}/${queryString ? `?${queryString}` : ''}`;
    
    const res = await fetch(url, config);
    if (!res.ok) {
      throw res.json();
    }
    const responseData = await res.json();
    
    // Handle response structure (data might be wrapped in 'data' field or at root level)
    return responseData.data || responseData;
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.message;
    }
    throw errStringify.message;
  }
}

function useGetBusinessJobDetails(jobId: number | null, latitude?: number, longitude?: number) {
  const query = useQuery<T_BusinessJob>(
    ['businessJobDetailCache', jobId, latitude, longitude],
    () => getBusinessJobDetails(jobId, latitude, longitude),
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      enabled: !!jobId, // Only fetch when jobId is truthy (not null, undefined, or empty)
    }
  );

  return query;
}

export default useGetBusinessJobDetails;

