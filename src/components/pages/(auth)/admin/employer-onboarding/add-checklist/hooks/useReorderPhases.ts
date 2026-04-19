import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

type T_PhaseOrderItem = {
  id: number;
  order: number;
};

async function reorderPhases(phases: T_PhaseOrderItem[]): Promise<void> {
  const token = getCookie('token');
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/admin/employer-onboarding/checklist-phases/reorder/`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({ phases }),
    }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to reorder phases.');
  }
}

function useReorderPhases() {
  const queryClient = useQueryClient();
  return useMutation((phases: T_PhaseOrderItem[]) => reorderPhases(phases), {
    onSuccess: () => {
      queryClient.invalidateQueries(['checklistPhasesCache']);
    },
  });
}

export default useReorderPhases;
