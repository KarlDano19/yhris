import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface UpdateJobStatusData {
  jobId: number;
  is_active: boolean;
}

interface UpdateJobStatusResponse {
  message: string;
}

async function updateBusinessJobStatus(data: UpdateJobStatusData): Promise<UpdateJobStatusResponse> {
  const token = getCookie('token');

  const config: RequestInit = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify({ is_active: data.is_active }),
  };

  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/business-jobs/${data.jobId}/`;

  const res = await fetch(url, config);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to update job status.');
  }

  const responseData = await res.json();
  return responseData.data || responseData;
}

export function useUpdateBusinessJobStatus() {
  const queryClient = useQueryClient();

  return useMutation<UpdateJobStatusResponse, Error, UpdateJobStatusData>(
    (data: UpdateJobStatusData) => updateBusinessJobStatus(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['myBusinessJobsCache']);
        queryClient.invalidateQueries(['businessJobsCache']);
      },
    }
  );
}
