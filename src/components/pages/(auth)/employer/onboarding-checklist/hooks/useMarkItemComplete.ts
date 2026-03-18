import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function markItemComplete({ itemId, is_completed }: { itemId: number; is_completed: boolean }) {
  const token = getCookie('token');
  const config = {
    method: 'PATCH',
    headers: {
      'content-type': 'application/json',
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify({ is_completed }),
  };
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employer-onboarding/checklist/${itemId}/`, config);
  if (!res.ok) {
    throw res.json();
  }
  return res.json();
}

function useMarkItemComplete() {
  const queryClient = useQueryClient();
  return useMutation(markItemComplete, {
    onSuccess: () => {
      queryClient.invalidateQueries(['employerChecklistCache']);
    },
  });
}

export default useMarkItemComplete;
