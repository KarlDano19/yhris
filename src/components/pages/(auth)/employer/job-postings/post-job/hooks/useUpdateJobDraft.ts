import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

import { T_CreateJobDraftData } from '@/types/job_posting';

type T_UpdateJobDraftData = T_CreateJobDraftData & { draftId: number };

async function updateJobDraft(data: T_UpdateJobDraftData) {
  const token = getCookie('token');

  const formData = new FormData();

  formData.append('draft_data', JSON.stringify(data.draft_data));

  if (data.source) {
    formData.append('source', data.source);
  }

  if (data.uploaded_job_description) {
    formData.append('uploaded_job_description', data.uploaded_job_description);
  }

  if (data.uploaded_custom_poster) {
    formData.append('uploaded_custom_poster', data.uploaded_custom_poster);
  }

  const config: RequestInit = {
    method: 'PATCH',
    headers: {
      Authorization: `Token ${token}`,
    },
    body: formData,
  };

  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/job-drafts/${data.draftId}/`;

  const res = await fetch(url, config);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to update draft');
  }

  const responseData = await res.json();
  return responseData.data || responseData;
}

export function useUpdateJobDraft() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: T_UpdateJobDraftData) => updateJobDraft(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobDraftsCache'] });
      queryClient.invalidateQueries({ queryKey: ['jobDraftsTableCache'] });
    },
  });
}
