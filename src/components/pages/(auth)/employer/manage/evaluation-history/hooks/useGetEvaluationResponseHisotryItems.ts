import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface EvaluationResponseHistoryItemsParams {
  from?: string;
  to?: string;
  search?: string;
  pageSize?: number;
  currentPage?: number;
}

async function getEvaluationResponseHistoryItems(params: EvaluationResponseHistoryItemsParams) {
  try {
    const token = getCookie('token');
    const config = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };

    // Build query string
    const queryParams = new URLSearchParams();
    if (params.from) queryParams.append('from', params.from);
    if (params.to) queryParams.append('to', params.to);
    if (params.search) queryParams.append('search', params.search);
    if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params.currentPage) queryParams.append('currentPage', params.currentPage.toString());
    queryParams.append('view_type', 'select');

    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/evaluation-history/?${queryParams.toString()}`;
    const res = await fetch(url, config);
    
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

function useGetEvaluationResponseHistoryItems(params: EvaluationResponseHistoryItemsParams) {
  const query = useQuery(
    ['evaluationResponseHistoryItemsCache', params],
    () => getEvaluationResponseHistoryItems(params),
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );
  return query;
}

export default useGetEvaluationResponseHistoryItems;
