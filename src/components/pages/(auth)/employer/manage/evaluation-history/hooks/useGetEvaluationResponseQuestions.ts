import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface DateFilter {
  from?: any;
  to?: any;
}

interface PaginationParams {
  pageSize?: number;
  currentPage?: number;
  dateFilter?: DateFilter;
}

async function getEvaluationResponseQuestions(
  evaluation_template_id: number | null,
  pagination?: PaginationParams
) {
  try {
    if (!evaluation_template_id) {
      return {
        sections: [],
        total_records: 0,
        total_pages: 1,
        current_page: 1,
        page_size: 5
      };
    }

    const token = getCookie('token');
    const queryParams = new URLSearchParams();
    if (pagination?.pageSize) {
      queryParams.append('pageSize', pagination.pageSize.toString());
    }
    if (pagination?.currentPage) {
      queryParams.append('currentPage', pagination.currentPage.toString());
    }

    // Add date filter parameters if provided
    if (pagination?.dateFilter?.from) {
      const fromDate = pagination.dateFilter.from instanceof Date 
        ? pagination.dateFilter.from.toLocaleDateString('en-CA') 
        : pagination.dateFilter.from;
      queryParams.append('dateFrom', fromDate);
    }
    if (pagination?.dateFilter?.to) {
      const toDate = pagination.dateFilter.to instanceof Date 
        ? pagination.dateFilter.to.toLocaleDateString('en-CA') 
        : pagination.dateFilter.to;
      queryParams.append('dateTo', toDate);
    }

    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/evaluation-templates/${evaluation_template_id}/responses/questions/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const config: RequestInit = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      throw response.json();
    }

    const data = await response.json();
    // Backend now returns { sections: [...], total_records, total_pages, current_page, page_size }
    return {
      sections: data?.data?.sections || data?.sections || [],
      total_records: data?.data?.total_records || data?.total_records || 0,
      total_pages: data?.data?.total_pages || data?.total_pages || 1,
      current_page: data?.data?.current_page || data?.current_page || 1,
      page_size: data?.data?.page_size || data?.page_size || 5
    };
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
  enabled: boolean = false,
  pagination?: PaginationParams
) {
  const query = useQuery(
    [
      'evaluationResponseQuestions', 
      evaluation_template_id, 
      pagination?.pageSize, 
      pagination?.currentPage,
      pagination?.dateFilter?.from,
      pagination?.dateFilter?.to
    ],
    () => getEvaluationResponseQuestions(evaluation_template_id, pagination),
    {
      enabled: enabled && !!evaluation_template_id,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );
  return query;
}

export default useGetEvaluationResponseQuestions;

