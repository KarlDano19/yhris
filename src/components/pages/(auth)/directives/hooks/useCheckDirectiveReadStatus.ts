import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';
import { CheckReadStatusResponse } from '@/types/directives';

/**
 * Hook to check if a directive has been read by a specific user
 */
const useCheckDirectiveReadStatus = (directiveId: string | number, email: string | null): UseQueryResult<CheckReadStatusResponse> => {
  return useQuery<CheckReadStatusResponse>({
    queryKey: ['directive-read-check', directiveId, email],
    queryFn: async () => {
      if (!email) {
        return { has_read: false };
      }
      
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/directives/${directiveId}/check-read/?email=${encodeURIComponent(email)}`;
        
        const token = getCookie('token');
        
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Token ${token}` } : {})
          },
        });
        
        if (!response.ok) {
          // If the endpoint doesn't exist yet, just return false instead of throwing
          if (response.status === 404) {
            console.warn('Check read endpoint not found, defaulting to not read');
            return { has_read: false };
          }
          
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Failed to check read status: ${response.status}`);
        }
        
        return response.json();
      } catch (err: any) {
        console.error('Error checking directive read status:', err);
        // Default to not read in case of error
        return { has_read: false };
      }
    },
    // Enable the query only if we have an email
    enabled: !!email,
  });
};

export default useCheckDirectiveReadStatus; 