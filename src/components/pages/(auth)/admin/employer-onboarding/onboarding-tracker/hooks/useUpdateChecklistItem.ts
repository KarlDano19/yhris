import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function updateChecklistItem({
  itemId,
  data,
}: {
  itemId: number;
  data: { is_completed?: boolean; is_skipped?: boolean };
}) {
  const token = getCookie('token');
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/admin/employer-onboarding/items/${itemId}/`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(data),
    }
  );
  if (!res.ok) throw new Error('Failed to update checklist item.');
  return res.json();
}

function useUpdateChecklistItem(recordId: string) {
  const queryClient = useQueryClient();
  return useMutation(updateChecklistItem, {
    onSuccess: () => {
      queryClient.invalidateQueries(['onboardingDetailCache', recordId]);
      queryClient.invalidateQueries(['onboardingListCache']);
    },
  });
}

export default useUpdateChecklistItem;
