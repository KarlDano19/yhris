import { useMutation } from '@tanstack/react-query';

interface DataType {
  google_access_token: string;
  password: string;
}

async function googleLoginLink(data: DataType) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sso/complete/google-login-oauth/link/`, {
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

function useGoogleLoginLink() {
  return useMutation({
    mutationFn: (data: DataType) => googleLoginLink(data),
  });
}

export default useGoogleLoginLink;
