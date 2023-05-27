import { useQuery } from '@tanstack/react-query';
import { getCookie, deleteCookie } from 'cookies-next';

async function getProfile() {
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
        `${process.env.hostName}/api/employer-profile/`,
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
    if (Object.hasOwn(errStringify, 'detail')) {
      if (errStringify.detail.includes('Invalid token.')) {
        deleteCookie('token');
        location.href = '/login';
      }
    }
    throw errStringify.message;
  }
}

function useGetProfile() {
  const query = useQuery(['profileCache'], () => getProfile(), {
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });

  return query;
}

export default useGetProfile;
