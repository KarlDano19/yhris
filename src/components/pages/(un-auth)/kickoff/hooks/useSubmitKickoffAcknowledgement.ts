import { useMutation, useQueryClient } from '@tanstack/react-query';

import { T_KickoffAcknowledgementPayload, T_KickoffAcknowledgementResponse } from '@/types/kickoff';

async function submitKickoffAcknowledgement(
  token: string,
  data: T_KickoffAcknowledgementPayload
): Promise<T_KickoffAcknowledgementResponse> {
  const config: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/kickoff/${token}/acknowledge/`,
    config
  );

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to submit acknowledgement.');
  }

  const responseData = await res.json();
  return responseData.data || responseData;
}

export function useSubmitKickoffAcknowledgement(token: string) {
  const queryClient = useQueryClient();

  return useMutation<T_KickoffAcknowledgementResponse, Error, T_KickoffAcknowledgementPayload>(
    (data: T_KickoffAcknowledgementPayload) => submitKickoffAcknowledgement(token, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['kickoffPortal', token]);
      },
    }
  );
}
