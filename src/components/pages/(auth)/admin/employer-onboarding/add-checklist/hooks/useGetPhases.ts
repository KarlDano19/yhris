import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

import { T_ChecklistPhase } from '../PhaseModal';
import { DEFAULT_CHECKLIST_PHASES } from '../../defaultPhases';

async function getPhases(): Promise<T_ChecklistPhase[]> {
  try {
    const token = getCookie('token');
    if (token) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/employer-onboarding/checklist-phases/`, {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          Authorization: `Token ${token}`,
        },
      });
      if (!res.ok) throw res.json();
      return res.json();
    }
    return DEFAULT_CHECKLIST_PHASES;
  } catch {
    return DEFAULT_CHECKLIST_PHASES;
  }
}

function useGetPhases() {
  return useQuery(['checklistPhasesCache'], () => getPhases(), {
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });
}

export default useGetPhases;
