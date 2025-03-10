import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface newFiltersProps {
  search?: string;
  from?: string;
  to?: string;
  current_page?: number;
  page_size?: number;
}

async function getLocationItems(filters: any) {
  try {
    let newFilters: newFiltersProps = {};
    if (filters.currentPage) newFilters.current_page = filters.currentPage;
    if (filters.pageSize) newFilters.page_size = filters.pageSize;
    if (filters.search) newFilters.search = filters.search;
    const searchParams = new URLSearchParams(Object.entries(newFilters).map(([key, value]) => [key, String(value)]));
    const token = getCookie('token');
    const config = {
      method: 'GET',
      headers: {
        Authorization: `Token ${token}`,
      },
    };
    if (token) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/locations/?${searchParams}`, config);
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

function useGetLocationItems(filters: any) {
  const query = useQuery({
    queryKey: ['locationItems'],
    queryFn: () => getLocationItems(filters),
  });
  return query;
}

export default useGetLocationItems;
