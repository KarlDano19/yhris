import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function getRoleDetails(role_id: number) {
  try {
    const token = getCookie('token');
    const config = {
      method: 'GET',
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json',
      },
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/roles/${role_id}/`, config);
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

function useGetRoleDetails(role_id: number) {
  const query = useQuery(['roleDetailsCache'], () => getRoleDetails(role_id), {
    enabled: false,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });
  return query;
}

export default useGetRoleDetails;