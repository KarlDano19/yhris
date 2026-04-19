import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

import { T_BusinessJobApplication } from '@/types/business-mode';

interface UploadProofData {
  applicationId: number;
  proof_of_completion: File;
}

async function uploadProofOfCompletion(data: UploadProofData): Promise<T_BusinessJobApplication> {
  const token = getCookie('token');

  const formData = new FormData();
  formData.append('proof_of_completion', data.proof_of_completion);

  const config: RequestInit = {
    method: 'PATCH',
    headers: {
      Authorization: `Token ${token}`,
    },
    body: formData,
  };

  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/business-jobs/applications/${data.applicationId}/proof/`;

  const res = await fetch(url, config);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to upload proof of completion.');
  }

  const responseData = await res.json();
  return responseData.data || responseData;
}

export function useUploadProofOfCompletion() {
  const queryClient = useQueryClient();

  return useMutation<T_BusinessJobApplication, Error, UploadProofData>(
    (data: UploadProofData) => uploadProofOfCompletion(data),
    {
      onSuccess: () => {
        // Invalidate all my applied jobs queries
        queryClient.invalidateQueries(['myAppliedBusinessJobs']);
        // Invalidate other related queries
        queryClient.invalidateQueries(['myBusinessJobsCache']);
        queryClient.invalidateQueries(['businessJobsCache']);
      },
    }
  );
}

