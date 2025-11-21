import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface RespondentsParams {
  pageSize?: number;
  currentPage?: number;
}

async function getEvaluationResponseRespondents(
  evaluation_template_id: number | null,
  params: RespondentsParams = {}
) {
  try {
    if (!evaluation_template_id) {
      return { 
        template: null, 
        employees_responded: [],
        total_records: 0,
        total_pages: 0,
        current_page: 1,
        page_size: 5
      };
    }

    const token = getCookie('token');
    const { pageSize = 5, currentPage = 1 } = params;
    
    const queryParams = new URLSearchParams({
      pageSize: pageSize.toString(),
      currentPage: currentPage.toString(),
    });

    const config: RequestInit = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/evaluation-templates/${evaluation_template_id}/responses/respondents/?${queryParams.toString()}`,
      config
    );

    if (!response.ok) {
      throw response.json();
    }

    const data = await response.json();
    // Response now includes template summary, paginated employees_responded, and pagination metadata
    return {
      template: data?.template || null,
      employees_responded: data?.employees_responded || [],
      total_records: data?.total_records || 0,
      total_pages: data?.total_pages || 0,
      current_page: data?.current_page || 1,
      page_size: data?.page_size || 5
    };
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.message;
    }
    throw errStringify.message;
  }
}

export function useGetEvaluationResponseRespondents(
  evaluation_template_id: number | null,
  params: RespondentsParams = {},
  enabled: boolean = false
) {
  const query = useQuery(
    ['evaluationResponseRespondents', evaluation_template_id, params.pageSize, params.currentPage],
    () => getEvaluationResponseRespondents(evaluation_template_id, params),
    {
      enabled: enabled && !!evaluation_template_id,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );
  return query;
}

export default useGetEvaluationResponseRespondents;

