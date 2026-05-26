import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function getPlanItems() {
  try {
    const token = getCookie('token');
    const config: any = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      },
    };
    if (token) {
      config.headers['Authorization'] = `Token ${token}`;
    }
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/plans/`, config);
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

function useGetPlanItems() {
  const query = useQuery(['planItemsPublicCache'], () => getPlanItems(), {
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });

  return query;
}

export default useGetPlanItems;
