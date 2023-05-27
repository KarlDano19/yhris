import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function getSeparationItems(filters: any) {
  try {
    const searchParams = new URLSearchParams(filters);
    const token = getCookie('token');
    const config = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    if (token) {
      const res = await fetch(
        `${process.env.hostName}/api/separations/?${searchParams}`,
        config
      );
      if (res.ok) {
        return res.json();
      }
      throw res.json();
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

function useGetSeparationItems(filters: any) {
  const query = useQuery(
    ['separationsItemCache', filters],
    () => getSeparationItems(filters),
    {
      keepPreviousData: true,
    }
  );

  return query;
}

export default useGetSeparationItems;
