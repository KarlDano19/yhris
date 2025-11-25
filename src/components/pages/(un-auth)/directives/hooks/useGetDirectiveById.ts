import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { DirectiveData } from '@/types/directives';

/**
 * Hook to fetch a directive by ID and handle recipient emails
 */
export const useGetDirectiveById = (directiveId: string | number): UseQueryResult<DirectiveData> => {
  return useQuery<DirectiveData>({
    queryKey: ['directive', directiveId],
    queryFn: async () => {
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/directives/${directiveId}/`;
        
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Failed to fetch directive: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Handle recipient emails from the 'to' field
        if (typeof data.to === 'string') {
          try {
            const parsedTo = JSON.parse(data.to);
            if (Array.isArray(parsedTo)) {
              data.to = parsedTo;
            }
          } catch (e) {
            console.warn('Failed to parse directive.to field:', e);
            data.to = [];
          }
        }
        
        return data;
      } catch (err) {
        console.error('Error in fetch:', err);
        throw err;
      }
    },
  });
};

export default useGetDirectiveById;
