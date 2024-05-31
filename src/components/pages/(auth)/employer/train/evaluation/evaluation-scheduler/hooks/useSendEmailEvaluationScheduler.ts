import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function sendEmailEvaluationScheduler(evaluation_template_id: number | null) {
  try {
    const token = getCookie('token');
    const config = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/evaluation-schedulers/${evaluation_template_id}/send-email/`,
      config
    );
    if (!res.ok) {
      throw res.json();
    }
    return res.json();
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.message;
    }
    throw errStringify.message;
  }
}

function useSendEmailEvaluationScheduler() {
  const query = useMutation((evaluation_template_id: number | null) =>
    sendEmailEvaluationScheduler(evaluation_template_id)
  );
  return query;
}

export default useSendEmailEvaluationScheduler;
