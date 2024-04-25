import { useMutation } from '@tanstack/react-query';
import { getCookie, deleteCookie } from 'cookies-next';

async function logout() {
  try {
    const token = getCookie('token');
    const config = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    const res = await fetch(`/api/logout/`, config);
    if (!res.ok) {
      throw res.json();
    }
    return res.json();
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

function useLogout() {
  const query = useMutation((data: any) => logout());
  return query;
}

export default useLogout;
