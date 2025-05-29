import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';
import { DirectiveData } from '@/types/directives';

/**
 * Hook to fetch a directive by ID
 */
export const useGetDirectiveById = (directiveId: string | number): UseQueryResult<DirectiveData> => {
    return useQuery<DirectiveData>({
      queryKey: ['directive', directiveId],
      queryFn: async () => {
        console.log(`Fetching directive data for ID: ${directiveId}`);
        
        try {
          const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/directives/${directiveId}/`;
          
          console.log(`Using API URL: ${apiUrl}`);
          const token = getCookie('token');
          
          const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { 'Authorization': `Token ${token}` } : {})
            },
          });
          
          console.log(`API response status: ${response.status}`);
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Error response:', errorData);
            throw new Error(errorData.message || `Failed to fetch directive: ${response.status}`);
          }
          
          const data = await response.json();
          console.log('Directive data:', data);
          return data;
        } catch (err) {
          console.error('Error in fetch:', err);
          throw err;
        }
      },
    });
  };

export default useGetDirectiveById;
