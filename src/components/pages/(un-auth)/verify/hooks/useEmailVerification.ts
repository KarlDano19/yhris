import { useMutation } from '@tanstack/react-query';

async function emailVerification(data: any) {
  try {
    const config = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(data),
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/verify-email/`, config);
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

function useEmailVerification() {
  const query = useMutation((data: any) => emailVerification(data));
  return query;
}

export default useEmailVerification;
