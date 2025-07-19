import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function getEvaluationTemplateItems() {
  try {
    let newFilters = { view_type: 'select' };
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/evaluation-templates/?${searchParams}`, config);
      if (!res.ok) {
        throw res.json();
      }
      const data = await res.json();
      
      // Handle paginated response structure
      if (data.records) {
        return data.records;
      }
      // Handle array response structure (no pagination from backend)
      else if (Array.isArray(data)) {
        return data;
      }
      
      return [];
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

function useGetEvaluationTemplateItems() {
  const query = useQuery(['evaluationTemplateItemsCache'], () => getEvaluationTemplateItems(), {
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });

  return query;
}

export default useGetEvaluationTemplateItems;
