import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface UserRoleFiltersProps {
  search?: string;
  current_page?: number;
  page_size?: number;
}

async function getUsersWithRoles(filters: any) {
  try {
    let newFilters: UserRoleFiltersProps = {};
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/roles/?${searchParams}`, config);
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

function useGetUsersWithRoles(filters: any, enabled: boolean = true) {
  return useQuery({
    queryKey: ['usersWithRoles', filters],
    queryFn: () => getUsersWithRoles(filters),
    enabled: !!filters && enabled, // Only fetch when filters exist AND enabled is true
    staleTime: 30000, // 30 seconds
  });
}

export default useGetUsersWithRoles;