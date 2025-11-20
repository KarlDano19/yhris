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

    // Build query string for template responses endpoint
    const queryParams = new URLSearchParams();
    if (params.from) queryParams.append('from', params.from);
    if (params.to) queryParams.append('to', params.to);
    if (params.search) queryParams.append('search', params.search);
    if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params.currentPage) queryParams.append('currentPage', params.currentPage.toString());

    // Use template responses endpoint for list view
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/evaluation-templates/responses/?${queryParams.toString()}`;
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
  // Include all params in cache key for proper caching with pagination
  const query = useQuery(
    ['templateResponsesCache', params.from, params.to, params.search, params.pageSize, params.currentPage],
    () => getTemplateResponses(params),
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );
  return query;
}

export default useGetTemplateResponses;
