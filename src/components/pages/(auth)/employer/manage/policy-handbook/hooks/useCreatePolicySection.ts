import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getCookie } from 'cookies-next';

import { PolicyHandbookSectionData, PolicyHandbookSectionFormData } from '@/types/policyHandbook';

async function createPolicySection(data: PolicyHandbookSectionFormData): Promise<PolicyHandbookSectionData> {
  const token = getCookie('token');

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/policy-handbook/sections/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to create the section.');
  }

  return res.json();
}

export function useCreatePolicySection() {
  const queryClient = useQueryClient();

  return useMutation<PolicyHandbookSectionData, Error, PolicyHandbookSectionFormData>(
    (data: PolicyHandbookSectionFormData) => createPolicySection(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['policyHandbookCache']);
      },
    }
  );
}
