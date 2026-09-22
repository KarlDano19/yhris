import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

export interface UserSelectOption {
  id: number;
  name: string | null;
  email: string;
  is_active?: boolean;
}

async function getUserSelect(search?: string): Promise<UserSelectOption[]> {
  try {
    const params = new URLSearchParams();
    params.append('view_type', 'select');
    if (search) params.append('search', search);

    const token = getCookie('token');
    const config = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    if (token) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user-accounts/?${params}`, config);
      if (!res.ok) throw res.json();
      // The select endpoint returns the flat array of users directly (no envelope).
      const data = await res.json();
      return Array.isArray(data) ? data : (data?.records ?? []);
    }
    return [];
  } catch (error: any) {
    let errStringify = await error;
    if (Object.hasOwn(errStringify, 'detail')) throw errStringify;
    throw errStringify.message;
  }
}

function useGetUserSelect(search?: string) {
  return useQuery(['userSelectCache', search], () => getUserSelect(search), {
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
  });
}

export default useGetUserSelect;
