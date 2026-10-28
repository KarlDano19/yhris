import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getCookie } from 'cookies-next';

async function deletePolicySection(sectionId: number): Promise<{ message: string }> {
  const token = getCookie('token');

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/policy-handbook/sections/${sectionId}/`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to delete the section.');
  }

  return res.json();
}

export function useDeletePolicySection() {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, Error, number>((sectionId: number) => deletePolicySection(sectionId), {
    onSuccess: () => {
      queryClient.invalidateQueries(['policyHandbookCache']);
    },
  });
}
