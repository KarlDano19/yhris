import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getCookie } from 'cookies-next';

import { PolicyHandbookData, PolicyHandbookUpdateData } from '@/types/policyHandbook';

async function updatePolicyHandbook(data: PolicyHandbookUpdateData): Promise<PolicyHandbookData> {
  const token = getCookie('token');

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/policy-handbook/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to update the policy handbook.');
  }

  return res.json();
}

export function useUpdatePolicyHandbook() {
  const queryClient = useQueryClient();

  return useMutation<PolicyHandbookData, Error, PolicyHandbookUpdateData>(
    (data: PolicyHandbookUpdateData) => updatePolicyHandbook(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['policyHandbookCache']);
      },
    }
  );
}
