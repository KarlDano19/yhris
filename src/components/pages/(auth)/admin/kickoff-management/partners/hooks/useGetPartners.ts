import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function getPartners(filters: any) {
  try {
    const searchParams = new URLSearchParams({ ...filters });
    const token = getCookie('token');
    const config = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    if (token) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/partners/?${searchParams}`, config);
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

function useGetPartners(filters: any) {
  const query = useQuery(['partnerItemsCache'], () => getPartners(filters), {
    enabled: false,
    keepPreviousData: true,
  });
  return query;
}

export default useGetPartners;
