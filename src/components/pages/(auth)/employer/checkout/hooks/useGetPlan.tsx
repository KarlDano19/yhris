import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function getPlans(slug: any) {
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
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/plans/${slug}/`, config);
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

function useGetPlans(slug: any) {
  const query = useQuery(['planDetail', {}], () => getPlans(slug), {
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });

  return query;
}

export default useGetPlans;
