import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

import { T_ChecklistPhase } from '../../modal/PhaseModal';

async function updatePhase(data: T_ChecklistPhase): Promise<T_ChecklistPhase> {
  const token = getCookie('token');

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/employer-onboarding/checklist-phases/${data.id}/`, {
    method: 'PATCH',
    headers: {
      'content-type': 'application/json',
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

function useUpdatePhase() {
  const queryClient = useQueryClient();

  return useMutation<T_ChecklistPhase, Error, T_ChecklistPhase>(
    (data: T_ChecklistPhase) => updatePhase(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['checklistPhasesCache']);
      },
    }
  );
}

export default useUpdatePhase;
