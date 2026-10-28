import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getCookie } from 'cookies-next';

import { PolicyHandbookSectionData } from '@/types/policyHandbook';

export interface T_PolicyHandbookSyncResult {
  synced_count: number;
  sections: PolicyHandbookSectionData[];
}

async function syncPolicyHandbookFromHris(): Promise<T_PolicyHandbookSyncResult> {
  const token = getCookie('token');

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/policy-handbook/sync-from-hris/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to sync the policy handbook from HRIS.');
  }

  return res.json();
}

export function useSyncPolicyHandbookFromHris() {
  const queryClient = useQueryClient();

  return useMutation<T_PolicyHandbookSyncResult, Error, void>(() => syncPolicyHandbookFromHris(), {
    onSuccess: () => {
      queryClient.invalidateQueries(['policyHandbookCache']);
    },
  });
}
