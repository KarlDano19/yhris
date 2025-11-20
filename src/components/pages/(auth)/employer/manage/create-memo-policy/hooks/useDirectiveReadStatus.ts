import { useQuery, UseQueryResult, UseQueryOptions } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

import { ReadStatusData } from '@/types/directives';
import { formatDateTimeToLocal } from '@/helpers/date';

async function getDirectiveReadStatus(directiveId: string | number) {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/directives/${directiveId}/read-status/`;
    const token = getCookie('token');
    
    const config = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Token ${token}` } : {})
      },
    };
    
    const res = await fetch(apiUrl, config);
    
    if (!res.ok) {
      throw res.json();
    }
    
    const data = await res.json();
    
    // Process timestamps in verified_reads to convert to local time
    if (data.verified_reads) {
      data.verified_reads = data.verified_reads.map((read: any) => ({
        ...read,
        read_at_original: read.read_at, // Keep original timestamp
        read_at: formatDateTimeToLocal(read.read_at) // Format for display
      }));
    }
    
    return data;
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.message;
    }
    throw errStringify.message;
  }
}

/**
 * Hook to fetch directive read status
 */
const useDirectiveReadStatus = (
  directiveId: string | number, 
  options?: Partial<UseQueryOptions<ReadStatusData>>
): UseQueryResult<ReadStatusData> => {
  return useQuery<ReadStatusData>({
    queryKey: ['directive-read-status', directiveId],
    queryFn: () => getDirectiveReadStatus(directiveId),
    refetchOnWindowFocus: false,
    // Apply any options passed in
    ...options
  });
};

export default useDirectiveReadStatus;
