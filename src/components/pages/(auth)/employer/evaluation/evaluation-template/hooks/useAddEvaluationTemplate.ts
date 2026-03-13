import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function addEvaluationTemplate(data: any) {
  try {
    const token = getCookie('token');
    const config = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(data),
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/evaluation-templates/`, config);
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

function useAddEvaluationTemplate() {
  const query = useMutation((data: any) => addEvaluationTemplate(data));
  return query;
}

export default useAddEvaluationTemplate;
