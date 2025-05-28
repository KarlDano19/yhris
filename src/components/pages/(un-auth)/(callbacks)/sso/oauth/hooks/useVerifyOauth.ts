import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface DataType {
  code: string;
  provider: string | string[];
}

async function verifyOauth(data: DataType) {
  try {
    const token = getCookie('token');
    const newData = {
      code: data.code
    }
    const config = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(newData),
    };
    // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sso/complete/${data.provider}-oauth/`, config);
    const res = await fetch(`https://yp2.yahshuasolutions.com/api/sso/complete/${data.provider}-oauth/`, config);
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

function useVerifyOauth() {
  const query = useMutation({
    mutationFn: (data: DataType) => verifyOauth(data),
  });
  return query;
}

export default useVerifyOauth;
