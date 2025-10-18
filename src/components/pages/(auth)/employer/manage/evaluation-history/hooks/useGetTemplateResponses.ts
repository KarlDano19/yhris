import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface TemplateResponsesParams {
  from?: string;
  to?: string;
  search?: string;
  pageSize?: number;
  currentPage?: number;
}

async function getTemplateResponses(params: TemplateResponsesParams) {
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
    queryParams.append('search_type', 'analytics'); // This will get templates with responses
    queryParams.append('view_type', 'select'); // Get all records without pagination for grouping

    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/evaluation-histories/?${queryParams.toString()}`;
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

function useGetTemplateResponses(params: TemplateResponsesParams) {
  const query = useQuery(
    ['templateResponsesCache', params],
    () => getTemplateResponses(params),
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );
  return query;
}

export default useGetTemplateResponses;
