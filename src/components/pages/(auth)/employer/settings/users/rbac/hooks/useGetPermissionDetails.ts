import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function getPermissionDetails(permission_id: number) {
  try {
    const token = getCookie('token');
    const config = {
      method: 'GET',
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json',
      },
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/permissions/${permission_id}/`, config);
    if (!res.ok) {
      throw res.json();
    }
    return res.json();
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.message;
    }
    throw errStringify.message;
  }
}

function useGetPermissionDetails(permission_id: number | null) {
  const query = useQuery(
    ['permissionDetailsCache', permission_id], 
    () => getPermissionDetails(permission_id!), 
    {
      enabled: !!permission_id, // Only fetch if permission_id is not null
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );
  return query;
}

export default useGetPermissionDetails;