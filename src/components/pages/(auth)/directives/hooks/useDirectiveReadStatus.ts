import { useQuery, UseQueryResult, UseQueryOptions } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';
import { ReadStatusData } from '@/types/directives';

/**
 * Hook to fetch directive read status
 */
const useDirectiveReadStatus = (
  directiveId: string | number, 
  options?: Partial<UseQueryOptions<ReadStatusData>>
): UseQueryResult<ReadStatusData> => {
  return useQuery<ReadStatusData>({
    queryKey: ['directive-read-status', directiveId],
    queryFn: async () => {
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/directives/${directiveId}/read-status/`;
        
        const token = getCookie('token');
        
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Token ${token}` } : {})
          },
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Failed to fetch read status: ${response.status}`);
        }
        
        return response.json();
      } catch (err: any) {
        console.error('Error fetching directive read status:', err);
        throw err;
      }
    },
    // Apply any options passed in
    ...options
  });
};

export default useDirectiveReadStatus;
