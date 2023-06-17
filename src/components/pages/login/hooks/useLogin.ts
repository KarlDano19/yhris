import { useMutation } from '@tanstack/react-query';

import { T_Login } from '@/types/globals';

async function login(credentials: T_Login) {
  try {
    const config = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(credentials),
    };
    const res = await fetch(`${process.env.API_URL}/api/login/`, config);
    if (res.ok) {
      return res.json();
    }
    throw res.json();
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.message;
    }
    throw errStringify.message;
  }
}

function useLogin() {
  const query = useMutation((credentials: T_Login) => login(credentials));
  return query;
}

export default useLogin;
