import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

import { T_JobDraftResponse } from '@/types/job_posting_draft';

async function deleteJobDraft(draftId: number): Promise<T_JobDraftResponse> {
  const token = getCookie('token');

  const config: RequestInit = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
  };

  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/job-drafts/${draftId}/`;

  const res = await fetch(url, config);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to delete draft');
  }

  const responseData = await res.json();
  return responseData.data || responseData;
}

export function useDeleteJobDraft() {
  const queryClient = useQueryClient();

  return useMutation<T_JobDraftResponse, Error, number>({
    mutationFn: (draftId: number) => deleteJobDraft(draftId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobDraftsCache'] });
    },
  });
}
