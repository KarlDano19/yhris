import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function markChecklistItemComplete(checklistId: number): Promise<void> {
  const token = getCookie('token');
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/employer-onboarding/checklist/${checklistId}/complete/`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    }
  );
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to mark as complete.');
  }
}

function useMarkChecklistItemComplete() {
  const queryClient = useQueryClient();
  return useMutation((checklistId: number) => markChecklistItemComplete(checklistId), {
    onSuccess: () => {
      queryClient.invalidateQueries(['employerChecklistCache']);
    },
  });
}

export default useMarkChecklistItemComplete;
