import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function resendCompletionEmail(evaluation_scheduler_id: number, evaluation_form_ids: number[]): Promise<any> {
  const token = getCookie('token');

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/evaluation-schedulers/${evaluation_scheduler_id}/completed-forms/`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({ evaluation_form_ids }),
    },
  );

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to resend completion email.');
  }

  return res.json();
}

function useResendCompletionEmail() {
  return useMutation((props: { evaluation_scheduler_id: number; evaluation_form_ids: number[] }) =>
    resendCompletionEmail(props.evaluation_scheduler_id, props.evaluation_form_ids),
  );
}

export default useResendCompletionEmail;
