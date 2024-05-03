import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function getVouchersItems() {
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
        `http://localhost:3004/api/vouchers/`,
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

function useVouchersItems() {
  const query = useQuery(['vouchersItemCache'], () => getVouchersItems(), {
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });

  return query;
}

export default useVouchersItems;
