import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

import { T_CreateJobDraftData, T_JobDraftResponse } from '@/types/job_posting_draft';

async function createJobDraft(data: T_CreateJobDraftData): Promise<T_JobDraftResponse> {
  const token = getCookie('token');

  const formData = new FormData();

  // Append draft_data as JSON string
  formData.append('draft_data', JSON.stringify(data.draft_data));
  formData.append('current_step', data.current_step.toString());

  if (data.draft_name) {
    formData.append('draft_name', data.draft_name);
  }

  if (data.source) {
    formData.append('source', data.source);
  }

  // Append files if present
  if (data.uploaded_job_description) {
    formData.append('uploaded_job_description', data.uploaded_job_description);
  }

  if (data.uploaded_custom_poster) {
    formData.append('uploaded_custom_poster', data.uploaded_custom_poster);
  }

  const config: RequestInit = {
    method: 'POST',
    headers: {
      Authorization: `Token ${token}`,
    },
    body: formData,
  };

  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/job-drafts/`;

  const res = await fetch(url, config);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to create draft');
  }

  const responseData = await res.json();
  return responseData.data || responseData;
}

export function useCreateJobDraft() {
  const queryClient = useQueryClient();

  return useMutation<T_JobDraftResponse, Error, T_CreateJobDraftData>({
    mutationFn: (data: T_CreateJobDraftData) => createJobDraft(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobDraftsCache'] });
    },
  });
}
