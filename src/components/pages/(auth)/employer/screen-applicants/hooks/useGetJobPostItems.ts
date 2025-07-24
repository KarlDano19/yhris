import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function getJobPostItems(filters: any) {
  try {
    let newFilters = { ...filters };
    // Always set view_type to 'screen-applicants' for this hook
    newFilters.view_type = 'screen-applicants';
    if (filters.currentPage) newFilters.current_page = filters.currentPage;
    if (filters.pageSize) newFilters.page_size = filters.pageSize;
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

function useGetJobPostItems(filters: any) {
  const query = useQuery(['jobPostItemCache', {}], () => getJobPostItems(filters), {
    enabled: false,
    keepPreviousData: true,
  });

  return query;
}

export default useGetJobPostItems;
