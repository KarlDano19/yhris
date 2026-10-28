import { useMutation } from '@tanstack/react-query';

import { getCookie } from 'cookies-next';

async function getPolicyHandbookExport(): Promise<{ content: string }> {
  const token = getCookie('token');

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/policy-handbook/export-for-llm/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to export the policy handbook.');
  }

  return res.json();
}

export function useCopyPolicyHandbookForLLM() {
  return useMutation<{ content: string }, Error, void>(() => getPolicyHandbookExport());
}
