import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function getEvaluationResponseHistoryDetails(evaluation_template_id: number | null) {
  try {
    if (!evaluation_template_id) {
      return {};
    }

    const token = getCookie('token');
    const config: RequestInit = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };

    const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/evaluation-templates/${evaluation_template_id}/responses`;

    const fetchSection = async (endpoint: string) => {
      const response = await fetch(endpoint, config);
      if (!response.ok) {
        throw response.json();
      }
      return response.json();
    };

    const [summary, respondents, questions, analytics] = await Promise.all([
      fetchSection(`${baseUrl}/summary/`),
      fetchSection(`${baseUrl}/respondents/`),
      fetchSection(`${baseUrl}/questions/`),
      fetchSection(`${baseUrl}/analytics/`),
    ]);

    return {
      template: summary?.template || null,
      employees_responded: respondents?.employees_responded || [],
      individual_responses: questions?.individual_responses || [],
      frequently_evaluated_employees: analytics?.frequently_evaluated_employees || [],
    };
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.message;
    }
    throw errStringify.message;
  }
}

function useGetEvaluationResponseHistoryDetails(evaluation_template_id: number | null) {
  const query = useQuery(
    ['evaluationResponseHistoryDetailsCache', evaluation_template_id],
    () => getEvaluationResponseHistoryDetails(evaluation_template_id),
    {
      enabled: !!evaluation_template_id,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );
  return query;
}

export default useGetEvaluationResponseHistoryDetails;
