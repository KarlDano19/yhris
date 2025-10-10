import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface newFiltersProps {
  view_type: string;
  current_page?: number;
  page_size?: number;
  search?: string;
}

async function getEmployeePaginatedSelect(filters: any) {
  try {
    let newFilters: newFiltersProps = { view_type: 'paginated_select' };
    if (filters.current_page) newFilters.current_page = filters.current_page;
    if (filters.page_size) newFilters.page_size = filters.page_size;
    if (filters.search) newFilters.search = filters.search;
    
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
    return {
      records: [],
      total_records: 0,
      total_pages: 1,
      starting: 0,
      ending: 0
    };
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

function useGetEmployeePaginatedSelect(filters: any) {
  // Normalize search term: trim spaces and check if it's meaningful
  const normalizedSearch = filters?.search?.trim();
  const hasValidSearch = normalizedSearch && normalizedSearch.length >= 2;
  
  // Allow API call even without search to load initial 500 employees
  // Only skip if filters is explicitly null (disabled state)
  const shouldMakeApiCall = filters !== null;
  
  // Create normalized filters for consistent cache keys
  const normalizedFilters = filters ? {
    ...filters,
    search: hasValidSearch ? normalizedSearch : undefined
  } : filters;
  
  const query = useQuery(['employeePaginatedSelectCache', normalizedFilters], () => getEmployeePaginatedSelect(normalizedFilters), {
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    enabled: shouldMakeApiCall,
    staleTime: 15 * 60 * 1000,
    cacheTime: Infinity,
  });

  return query;
}

export default useGetEmployeePaginatedSelect;
