import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface DirectivesFiltersProps {
  search?: string;
  from?: string;
  to?: string;
  currentPage?: number;
  pageSize?: number;
}

async function getDirectivesItems(filters: any) {
  try {
    let newFilters: DirectivesFiltersProps = {};
    if (filters.currentPage) newFilters.currentPage = filters.currentPage;
    if (filters.pageSize) newFilters.pageSize = filters.pageSize;
    if (filters.search) newFilters.search = filters.search;
    if (filters.from) newFilters.from = filters.from.toLocaleDateString('en-CA');
    if (filters.to) newFilters.to = filters.to.toLocaleDateString('en-CA');
    
    const searchParams = new URLSearchParams(Object.entries(newFilters).map(([key, value]) => [key, String(value)]));
    const token = getCookie('token');
    const config = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    if (token) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/directives/?${searchParams}`,
        config
      );
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

function useGetDirectivesItems(filters: any) {
  const query = useQuery(
    ['directivesItemCache', filters],
    () => getDirectivesItems(filters),
    {
      enabled: true,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  return query;
}

export default useGetDirectivesItems;
