import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function usePayment(data: any) {
  try {
    let paymentLink = '';
    if (data.info.payment === 'dragonpay') {
      paymentLink = '/pay-using-dragonpay-links/';
    }
    if (data.info.payment === 'maya') {
      paymentLink = '/pay-using-maya-links/';
    }
    if (data.info.payment === 'paymongo') {
      paymentLink = '/pay-using-paymongo-links/';
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
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api${paymentLink}`, config);
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
