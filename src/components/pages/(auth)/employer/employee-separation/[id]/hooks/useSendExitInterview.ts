import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface T_SendExitInterviewPayload {
  form_id: number;
}

async function sendExitInterview(separationId: string, payload: T_SendExitInterviewPayload) {
  const token = getCookie('token');
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/separation/${separationId}/exit-interview/send/`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.message ?? 'Failed to send exit interview.');
  }
  return res.json();
}

function useSendExitInterview(separationId: string) {
  const queryClient = useQueryClient();
  return useMutation(
    (payload: T_SendExitInterviewPayload) => sendExitInterview(separationId, payload),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['separationCaseCache', separationId]);
      },
    }
  );
}

export default useSendExitInterview;
