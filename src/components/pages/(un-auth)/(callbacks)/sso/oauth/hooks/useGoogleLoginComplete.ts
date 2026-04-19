import { useMutation } from '@tanstack/react-query';

interface DataType {
  google_access_token: string;
  account_type: string;
}

async function googleLoginComplete(data: DataType) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sso/complete/google-login-oauth/create/`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(data),
    });
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

function useGoogleLoginComplete() {
  return useMutation({
    mutationFn: (data: DataType) => googleLoginComplete(data),
  });
}

export default useGoogleLoginComplete;
