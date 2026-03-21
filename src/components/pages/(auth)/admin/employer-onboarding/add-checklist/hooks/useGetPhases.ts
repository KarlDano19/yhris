import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

import { T_ChecklistPhase } from '../../modal/PhaseModal';

async function getPhases(): Promise<T_ChecklistPhase[]> {
  const token = getCookie('token');
  if (!token) return [];
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/employer-onboarding/checklist-phases/`, {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      Authorization: `Token ${token}`,
    },
  });
  if (!res.ok) return [];
  return res.json();
}

function useGetPhases() {
  return useQuery(['checklistPhasesCache'], () => getPhases(), {
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });
}

export default useGetPhases;
