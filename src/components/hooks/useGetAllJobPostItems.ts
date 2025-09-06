import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface DateFilter {
  from?: string;
  to?: string;
}

async function getAllJobPostItems(dateFilter?: DateFilter) {
  try {
    let newFilters: any = { view_type: 'select' };
    
    // Add date filters if provided
    if (dateFilter?.from) {
      newFilters.from = dateFilter.from;
    }
    if (dateFilter?.to) {
      newFilters.to = dateFilter.to;
    }
    
    // Add analytics search type to filter by both created_at and updated_at
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/?${searchParams}`, config);
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

function useGetAllJobPostItems(dateFilter?: DateFilter) {
  const query = useQuery(
    ['allJobPostItemsCache', dateFilter], 
    () => getAllJobPostItems(dateFilter), 
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

  return query;
}

export default useGetAllJobPostItems; 