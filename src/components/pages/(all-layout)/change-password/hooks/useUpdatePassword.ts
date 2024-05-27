import { useMutation } from '@tanstack/react-query';

import { T_UserPassword } from '@/types/globals';

export async function updatePassword(data: T_UserPassword) {
  try {
    const config = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(data),
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reset-password/`, config);
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

function useUpdatePassword() {
  const query = useMutation((data: T_UserPassword) => updatePassword(data));
  return query;
}

export default useUpdatePassword;
