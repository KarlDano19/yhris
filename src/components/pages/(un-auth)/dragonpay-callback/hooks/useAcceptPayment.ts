import { useMutation } from '@tanstack/react-query';

interface DataType {
  txnid: string;
  status: string;
}

async function acceptPayment(data: DataType) {
  try {
    const config = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(data),
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/dragonpay/accept/`, config);
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

function useAcceptPayment() {
  const query = useMutation({
    mutationFn: (data: DataType) => acceptPayment(data),
  });
  return query;
}

export default useAcceptPayment;
