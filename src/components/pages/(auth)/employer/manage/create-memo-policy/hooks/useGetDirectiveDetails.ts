import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function getDirectiveDetails(directive_id: number | null) {
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
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/directives/${directive_id}/manage/`,
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

function useGetDirectiveDetails(directive_id: number | null) {
  const query = useQuery(['directiveDetailsCache', directive_id], () => getDirectiveDetails(directive_id), {
    enabled: false,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
  });

  return query;
}

export default useGetDirectiveDetails;

