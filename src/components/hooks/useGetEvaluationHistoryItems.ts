import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface DateFilter {
  from?: string;
  to?: string;
}

async function getEvaluationHistoryItems(dateFilter?: DateFilter) {
  try {
    let newFilters: any = { view_type: 'select' };
    
    // Add date filters if provided
    if (dateFilter?.from) {
      newFilters.from = dateFilter.from;
    }
    if (dateFilter?.to) {
      newFilters.to = dateFilter.to;
    }
    
    // Add analytics search type to filter by both date_of_evaluation and created_at
    newFilters.search_type = 'analytics';
    
    const searchParams = new URLSearchParams(newFilters);
    const token = getCookie('token');
    const config = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    if (token) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/evaluation-histories/?${searchParams}`, config);
      if (!res.ok) {
        throw res.json();
      }
      return res.json();
    }
    return [];
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.message;
    }
    throw errStringify.message;
  }
}

function useGetEvaluationHistoryItems(dateFilter?: DateFilter) {
  const query = useQuery(
    ['evaluationHistoryItemsCache', dateFilter], 
    () => getEvaluationHistoryItems(dateFilter), 
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

  return query;
}

export default useGetEvaluationHistoryItems; 