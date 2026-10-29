import { useMutation } from '@tanstack/react-query';

import { AcknowledgeDirectiveParams } from '@/types/directives';

async function acknowledgeDirective({ directiveId, token }: AcknowledgeDirectiveParams) {
  const res = await fetch(`/api/directives/${directiveId}/acknowledge`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw { message: data.message || data.error, status: res.status };
  }

  return data;
}

/**
 * Hook for one-click acknowledgment using the signed link from the memo email.
 * No verification code needed — the link token identifies the recipient.
 */
const useAcknowledgeDirective = () => {
  return useMutation<unknown, { message?: string; status: number }, AcknowledgeDirectiveParams>({
    mutationFn: (params) => acknowledgeDirective(params),
  });
};

export default useAcknowledgeDirective;
