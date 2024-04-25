import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function getClientItems() {
  try {
    const token = getCookie('token');
    const config = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`
      },
    };
    if (token) {
      const res = await fetch(
        `http://localhost:3004/api/clients/`,
        config
      );
      if (!res.ok) {
        throw res.json();
      }
      return res.json();
    }
    return {};
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.message;
    }
    throw errStringify.message;
  }
}

function useClientItems() {
  const query = useQuery(['departmentsItemCache'], () => getClientItems(), {
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });

  return query;
}

export default useClientItems;
