import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function applyToBusinessJob(jobId: number) {
  try {
    const token = getCookie('token');

    const config: any = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Token ${token}`,
      },
    };
    
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/business-jobs/${jobId}/apply/`;
    
    const res = await fetch(url, config);
    if (!res.ok) {
      const error = await res.json();
      throw error;
    }
    
    const responseData = await res.json();
    return responseData.data || responseData;
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.message;
    }
    throw errStringify.message || errStringify;
  }
}

export default function useApplyToBusinessJob() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (jobId: number) => applyToBusinessJob(jobId),
    onSuccess: () => {
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries(['findBusinessJobsCache']);
      queryClient.invalidateQueries(['businessJobDetailCache']);
    },
  });
}

