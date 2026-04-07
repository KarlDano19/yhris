import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function getAvailableUsers() {
  try {
    const token = getCookie('token');
    const config = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    if (token) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/available-users/`, config);
      if (!res.ok) {
        throw res.json();
      }
      const data = await res.json();
      return data.records || data || [];
    }
    return [];
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.message;
    }
    throw errStringify.message || 'Failed to fetch users';
  }
}

function useGetAvailableUsers() {
  const query = useQuery(
    ['availableUsersCache'],
    () => getAvailableUsers()
  );

  return query;
}

export default useGetAvailableUsers;

