import { useMutation } from '@tanstack/react-query';

import { T_Register } from '@/types/globals';

async function register(user: T_Register) {
  try {
    const data = {
      name: user.name,
      email: user.email,
      password: user.password,
      confirm_password: user.confirmPassword,
      account_type: user.accountType.toLowerCase(),
    };
    const config = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(data),
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/register/`, config);
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

function useRegisterAccount() {
  const query = useMutation((user: T_Register) => register(user));
  return query;
}

export default useRegisterAccount;
