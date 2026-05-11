import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

type T_Filters = {
  dateFrom?: string;
  dateTo?: string;
  currentPage?: number;
  pageSize?: number;
};

async function getCompletedEvaluationForms(evaluation_scheduler_id: number, filters: T_Filters) {
  try {
    const token = getCookie('token');
    const params = new URLSearchParams();
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);
    if (filters.currentPage) params.append('currentPage', String(filters.currentPage));
    if (filters.pageSize) params.append('pageSize', String(filters.pageSize));

    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/evaluation-schedulers/${evaluation_scheduler_id}/completed-forms/?${params.toString()}`;

    const config = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };

    if (token) {
      const res = await fetch(url, config);
      if (!res.ok) {
        throw res.json();
      }
      return res.json();
    }
    return {};
  } catch (error: any) {
    let errStringify = await error;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.detail;
    }
    if (Object.hasOwn(errStringify, 'detail')) {
      throw errStringify;
    }
    throw errStringify.message;
  }
}

function useGetCompletedEvaluationForms(evaluation_scheduler_id: number | null, filters: T_Filters = {}) {
  return useQuery(
    ['completedEvaluationFormsCache', evaluation_scheduler_id, filters.dateFrom, filters.dateTo, filters.currentPage, filters.pageSize],
    () => getCompletedEvaluationForms(evaluation_scheduler_id!, filters),
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      enabled: !!evaluation_scheduler_id,
    },
  );
}

export default useGetCompletedEvaluationForms;
