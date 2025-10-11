import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function getUserRoles(userId: number) {
  try {
    const token = getCookie('token');
    const config = {
      method: 'GET',
      headers: {
        Authorization: `Token ${token}`,
      },
    };
    
    if (token) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}/roles/`, config);
      if (!res.ok) {
        throw res.json();
      }
      return res.json();
    }
    return null;
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.message;
    }
    throw errStringify.message;
  }
}

function useGetUserRoles(userId: number, enabled: boolean = true) {
  return useQuery({
    queryKey: ['userRoles', userId],
    queryFn: () => getUserRoles(userId),
    enabled: !!userId && enabled, // Only fetch when userId exists AND enabled is true
    staleTime: 0, // Always fetch fresh data for role assignments
    cacheTime: 300000, // Cache for 5 minutes
  });
}

export default useGetUserRoles;
