import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function getRoleTemplates() {
  try {
    const token = getCookie('token');
    const config = {
      method: 'GET',
      headers: {
        Authorization: `Token ${token}`,
      },
    };
    if (token) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/roles/templates/`, config);
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

function useGetRoleTemplates() {
  return useQuery({
    queryKey: ['roleTemplates'],
    queryFn: () => getRoleTemplates(),
  });
}

export default useGetRoleTemplates;