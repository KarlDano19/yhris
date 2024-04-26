import { useMutation } from '@tanstack/react-query';

export async function logout() {
  try {
    const config = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
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
    throw errStringify.message;
  }
}

function useLogout() {
  const query = useMutation((data: any) => logout());
  return query;
}

export default useLogout;
