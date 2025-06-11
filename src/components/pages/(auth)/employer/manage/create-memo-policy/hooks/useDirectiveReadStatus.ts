import { useQuery, UseQueryResult, UseQueryOptions } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

import { ReadStatusData } from '@/types/directives';

/**
 * Format ISO datetime string to local timezone
 */
const formatDateTimeToLocal = (isoString: string | null): string => {
  if (!isoString) return '';
  
  // Parse the ISO string to a Date object
  const date = new Date(isoString);
  
  // Extract date components
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  
  // Format time in 12-hour format with AM/PM (using local timezone)
  const options = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  } as Intl.DateTimeFormatOptions;
  
  const timeString = date.toLocaleTimeString('en-US', options);
  
  // Return formatted string with HTML tags
  return `<strong>Date:</strong> ${month}/${day}/${year}&nbsp;&nbsp;&nbsp;&nbsp;<strong>Time:</strong> ${timeString}`;
};

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
        
        const data = await response.json();
        
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
        console.error('Error fetching directive read status:', err);
        throw err;
      }
    },
    // Apply any options passed in
    ...options
  });
};

export default useDirectiveReadStatus;
