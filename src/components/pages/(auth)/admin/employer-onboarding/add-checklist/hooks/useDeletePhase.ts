import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function deletePhase(id: number): Promise<void> {
  const token = getCookie('token');

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/employer-onboarding/checklist-phases/${id}/`, {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json',
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) throw new Error(await res.text());
}

function useDeletePhase() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>(
    (id: number) => deletePhase(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['checklistPhasesCache']);
      },
    }
  );
}

export default useDeletePhase;
