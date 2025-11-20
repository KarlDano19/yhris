import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function getEvaluationResponseQuestions(evaluation_template_id: number | null) {
  try {
    if (!evaluation_template_id) {
      return [];
    }

    const token = getCookie('token');
    const config: RequestInit = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/evaluation-templates/${evaluation_template_id}/responses/questions/`,
      config
    );

    if (!response.ok) {
      throw response.json();
    }

    const data = await response.json();
    return data?.individual_responses || [];
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.message;
    }
    throw errStringify.message;
  }
}

export function useGetEvaluationResponseQuestions(
  evaluation_template_id: number | null,
  enabled: boolean = false
) {
  const query = useQuery(
    ['evaluationResponseQuestions', evaluation_template_id],
    () => getEvaluationResponseQuestions(evaluation_template_id),
    {
      enabled: enabled && !!evaluation_template_id,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );
  return query;
}

export default useGetEvaluationResponseQuestions;

