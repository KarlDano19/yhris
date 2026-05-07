import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function getSeparationStats() {
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/separations/?view_type=separation_dashboard`, config);
      if (!res.ok) throw res.json();
      const data = await res.json();
      return data.data ?? data;
    }
    return null;
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, 'response')) throw errStringify.response.data.message;
    throw errStringify.message;
  }
}

function useGetSeparationStats() {
  return useQuery(['separationStatsCache'], () => getSeparationStats(), {
    refetchOnWindowFocus: false,
  });
}

export default useGetSeparationStats;
