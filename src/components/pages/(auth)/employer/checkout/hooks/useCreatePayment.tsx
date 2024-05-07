import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function usePayment(data: any) {
  try {
    let paymentType = '';
    if (data.info.payment === 'dragonpay') {
      paymentType = 'dragonpay';
    }
    if (data.info.payment === 'maya') {
      paymentType = 'maya';
    }
    if (data.info.payment === 'paymongo') {
      paymentType = 'paymongo';
    }
    const token = getCookie('token');
    const config = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(data),
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/${paymentType}/`, config);
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

function useCreatePayment() {
  const query = useMutation((data: any) => usePayment(data));
  return query;
}

export default useCreatePayment;
