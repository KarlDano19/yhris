import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface PermissionFiltersProps {
  search?: string;
  category?: string;
  current_page?: number;
  page_size?: number;
  group_by_category?: boolean;
}

async function getPermissionsList(filters: any) {
  try {
    let newFilters: PermissionFiltersProps = {};
    if (filters.currentPage) newFilters.current_page = filters.currentPage;
    if (filters.pageSize) newFilters.page_size = filters.pageSize;
    if (filters.search) newFilters.search = filters.search;
    if (filters.category) newFilters.category = filters.category;
    if (filters.groupByCategory) newFilters.group_by_category = filters.groupByCategory;

    const searchParams = new URLSearchParams(Object.entries(newFilters).map(([key, value]) => [key, String(value)]));
    const token = getCookie('token');
    const config = {
      method: 'GET',
      headers: {
        Authorization: `Token ${token}`,
      },
    };
    if (token) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/permissions/manage/?${searchParams}`, config);
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

function useGetPermissionsList(filters: any, enabled: boolean = true) {
  return useQuery({
    queryKey: ['permissionsList', filters],
    queryFn: () => getPermissionsList(filters),
    enabled: !!filters && enabled, // Only fetch when filters exist AND enabled is true
  });
}

export default useGetPermissionsList;