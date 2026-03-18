import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

type T_ReorderItem = { id: number; order_position: number };

async function reorderPhases(order: T_ReorderItem[]): Promise<void> {
  const token = getCookie('token');

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/employer-onboarding/checklist-phases/reorder/`, {
    method: 'PATCH',
    headers: {
      'content-type': 'application/json',
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify({ order }),
  });

  if (!res.ok) throw new Error(await res.text());
}

function useReorderPhases() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, T_ReorderItem[]>(
    (order: T_ReorderItem[]) => reorderPhases(order),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['checklistPhasesCache']);
      },
    }
  );
}

export default useReorderPhases;
