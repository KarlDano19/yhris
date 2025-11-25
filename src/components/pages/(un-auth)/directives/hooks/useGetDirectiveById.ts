import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { DirectiveData } from '@/types/directives';

async function getDirectiveById(directiveId: string | number) {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/directives/${directiveId}/`;
    
    const config = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    };
    
    const res = await fetch(apiUrl, config);
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const error: any = new Error(errorData.message || `Failed to fetch directive: ${res.status}`);
      error.status = res.status;
      throw error;
    }
    
    const data = await res.json();
    
    // Handle recipient emails from the 'to' field
    if (typeof data.to === 'string') {
      try {
        const parsedTo = JSON.parse(data.to);
        if (Array.isArray(parsedTo)) {
          data.to = parsedTo;
        }
      } catch (e) {
        data.to = [];
      }
    }
    
    return data;
  } catch (err: any) {
    throw err;
  }
}

/**
 * Hook to fetch a directive by ID and handle recipient emails
 */
export const useGetDirectiveById = (directiveId: string | number): UseQueryResult<DirectiveData> => {
  return useQuery<DirectiveData>({
    queryKey: ['directive', directiveId],
    queryFn: () => getDirectiveById(directiveId),
    refetchOnWindowFocus: false,
  });
};

export default useGetDirectiveById;