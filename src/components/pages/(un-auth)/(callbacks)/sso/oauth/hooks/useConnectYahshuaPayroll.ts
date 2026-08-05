import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface DataType {
  code: string;
}

async function connectYahshuaPayroll(data: DataType) {
  try {
    const token = getCookie('token');

    const newData = {
      code: data.code,
    };
    const config = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(newData),
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sso/connect/yahshua-payroll-oauth/`, config);
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

function useConnectYahshuaPayroll() {
  return useMutation({
    mutationFn: (data: DataType) => connectYahshuaPayroll(data),
  });
}

export default useConnectYahshuaPayroll;
