import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function updateEvaluation(evaluation_id: string, data: any) {
  try {
    const token = getCookie('token');
    const config = {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(data),
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/evaluations/${evaluation_id}/`, config);
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

function useUpdateEvaluation() {
  const query = useMutation((props: any) => updateEvaluation(props.evaluationId, props.data));
  return query;
}

export default useUpdateEvaluation;
