import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

import { T_ChecklistPhase } from '../../modal/PhaseModal';

type T_CreatePhaseData = Pick<T_ChecklistPhase, 'name' | 'description' | 'checklists'>;

async function createPhase(data: T_CreatePhaseData): Promise<T_ChecklistPhase> {
  const token = getCookie('token');

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/employer-onboarding/checklist-phases/`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

function useCreatePhase() {
  const queryClient = useQueryClient();

  return useMutation<T_ChecklistPhase, Error, T_CreatePhaseData>(
    (data: T_CreatePhaseData) => createPhase(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['checklistPhasesCache']);
      },
    }
  );
}

export default useCreatePhase;
