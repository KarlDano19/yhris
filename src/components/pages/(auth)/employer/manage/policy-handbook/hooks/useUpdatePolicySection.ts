import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getCookie } from 'cookies-next';

import { PolicyHandbookSectionData, PolicyHandbookSectionFormData } from '@/types/policyHandbook';

async function updatePolicySection(
  sectionId: number,
  data: Partial<PolicyHandbookSectionFormData>
): Promise<PolicyHandbookSectionData> {
  const token = getCookie('token');

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/policy-handbook/sections/${sectionId}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to update the section.');
  }

  return res.json();
}

export function useUpdatePolicySection() {
  const queryClient = useQueryClient();

  return useMutation<
    PolicyHandbookSectionData,
    Error,
    { sectionId: number; data: Partial<PolicyHandbookSectionFormData> }
  >(({ sectionId, data }) => updatePolicySection(sectionId, data), {
    onSuccess: () => {
      queryClient.invalidateQueries(['policyHandbookCache']);
    },
  });
}
