import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function deleteJobDraft(draftId: number) {
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

  return useMutation({
    mutationFn: (draftId: number) => deleteJobDraft(draftId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobDraftsCache'] });
    },
  });
}
