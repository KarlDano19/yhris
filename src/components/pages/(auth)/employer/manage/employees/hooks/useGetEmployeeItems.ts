import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface newFiltersProps {
  search?: string;
  from?: string;
  to?: string;
  current_page?: number;
  page_size?: number;
  is_active?: string;
}

async function getEmployeeItems(filters: any) {
  try {
    let newFilters: newFiltersProps = {};
    if (filters.currentPage) newFilters.current_page = filters.currentPage;
    if (filters.pageSize) newFilters.page_size = filters.pageSize;
    if (filters.search) newFilters.search = filters.search;
    if (filters.from) newFilters.from = filters.from.toLocaleDateString('en-CA');
    if (filters.to) newFilters.to = filters.to.toLocaleDateString('en-CA');
    if (filters.is_active) newFilters.is_active = filters.is_active;
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employees/?${searchParams}`, config);

      if (res.status === 401 || res.status === 403) {
        const error = await res.json();
        if (error.detail?.includes('Invalid token') || error.detail?.includes('Token has expired')) {
          window.dispatchEvent(new CustomEvent('token-expired'));
          throw new Error('Token has expired');
        }
      }
      if (!res.ok) {
        const error = await res.json();
        throw res.json();
      }
      return res.json();
    }
    return [];
  } catch (err: any) {
    if (err.message === 'Token has expired') {
      throw err;
    }
    if (err.then) {
      let errStringify = await err;
      if (Object.hasOwn(errStringify, 'response')) {
        throw errStringify.response.data.message;
      }
      throw errStringify.message;
    }
  }
}

function useGetEmployeeItemsList(filters: any) {
  const query = useQuery(
    [
      'employeesListItemsCache',
      filters.currentPage,
      filters.pageSize,
      filters.search,
      filters.from,
      filters.to,
      filters.is_active,
    ],
    () => getEmployeeItems(filters),
    {
      refetchOnWindowFocus: true,
      keepPreviousData: true,
    }
  );

  return query;
}

export default useGetEmployeeItemsList;
