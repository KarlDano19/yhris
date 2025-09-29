import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface RoleFiltersProps {
  search?: string;
  role_type?: string;
  current_page?: number;
  page_size?: number;
  view_type?: string;
}

async function getRolesList(filters: any) {
  try {
    let newFilters: RoleFiltersProps = {};
    if (filters.currentPage) newFilters.current_page = filters.currentPage;
    if (filters.pageSize) newFilters.page_size = filters.pageSize;
    if (filters.search) newFilters.search = filters.search;
    if (filters.roleType) newFilters.role_type = filters.roleType;
    if (filters.viewType) newFilters.view_type = filters.viewType;

    const searchParams = new URLSearchParams(Object.entries(newFilters).map(([key, value]) => [key, String(value)]));
    const token = getCookie('token');
    const config = {
      method: 'GET',
      headers: {
        Authorization: `Token ${token}`,
      },
    };
    if (token) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/roles/?${searchParams}`, config);
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

function useGetRolesList(filters: any, enabled: boolean = true) {
  return useQuery({
    queryKey: ['rolesList', filters],
    queryFn: () => getRolesList(filters),
    enabled: !!filters && enabled, // Only fetch when filters exist AND enabled is true
  });
}

export default useGetRolesList;