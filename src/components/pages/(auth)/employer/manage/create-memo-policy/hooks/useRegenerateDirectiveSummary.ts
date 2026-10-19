import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function regenerateDirectiveSummary(directiveId: number) {
  const token = getCookie('token');
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/directives/${directiveId}/regenerate-summary/`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    }
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to regenerate the summary.');
  }
  return res.json();
}

function useRegenerateDirectiveSummary() {
  return useMutation((directiveId: number) => regenerateDirectiveSummary(directiveId));
}

export default useRegenerateDirectiveSummary;
