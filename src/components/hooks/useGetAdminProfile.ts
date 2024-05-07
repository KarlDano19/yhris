import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

import { generateKey, decryptToken } from '@/helpers/tokenEncryption';

async function getProfile() {
  try {
    // const key = await generateKey();
    const token = getCookie('token');
    // const secret = getCookie('secret');
    // const decryptedToken = await decryptToken(token, secret, key);
    const config = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    if (token) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/profiles/`, config);
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

function useGetAdminProfile() {
  const query = useQuery(['adminProfileCache'], () => getProfile(), {
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });

  return query;
}

export default useGetAdminProfile;
