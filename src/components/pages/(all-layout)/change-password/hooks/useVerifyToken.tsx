import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

export async function verifyToken(code: any) {
  const token = getCookie('token');
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/verify-code/`, {
    method: 'POST',
    body: JSON.stringify({
      code,
    }),
    headers: {
      'content-type': 'application/json',
      Authorization: `Token ${token}`,
    },
  });
  const responseJson = await res.json();
  return responseJson.is_token_valid;
}

function useVerifyToken(code: any) {
  const query = useQuery(['tokenVerification', code], () => verifyToken(code), {
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });

  return query;
}

export default useVerifyToken;
