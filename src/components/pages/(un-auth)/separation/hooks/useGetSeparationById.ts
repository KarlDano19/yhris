import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { SeparationData } from '@/types/separation';

/**
 * Hook to fetch a separation by ID
 */
export const useGetSeparationById = (separationId: string | number): UseQueryResult<SeparationData> => {
  return useQuery<SeparationData>({
    queryKey: ['separation', separationId],
    queryFn: async () => {
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/separations/${separationId}/`;
        
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Failed to fetch separation: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
      } catch (err) {
        console.error('Error in fetch:', err);
        throw err;
      }
    },
  });
};

export default useGetSeparationById;