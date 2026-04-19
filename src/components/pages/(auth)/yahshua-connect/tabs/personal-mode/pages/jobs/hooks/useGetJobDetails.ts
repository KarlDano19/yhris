import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function getYahshuaConnectJobDetails(jobId: any) {
  try {
    const token = getCookie('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const config = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/yahshua-connect/jobs/${jobId}/`, config);
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

function useGetYahshuaConnectJobDetails(jobId: any) {
  const query = useQuery(
    ['yahshuaConnectJobDetailCache', jobId], 
    () => getYahshuaConnectJobDetails(jobId), 
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      enabled: !!jobId, // Only fetch when jobId is truthy (not null, undefined, or empty)
    }
  );

  return query;
}

export default useGetYahshuaConnectJobDetails;

