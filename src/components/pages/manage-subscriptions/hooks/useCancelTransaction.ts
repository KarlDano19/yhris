import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function cancelTransaction(referenceId: any) {
  try {
    const token = getCookie('token');
    const config = {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cancel-transactions/${referenceId}/`, config);
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

function useCancelTransaction() {
  const query = useMutation((data: any) => cancelTransaction(data));
  return query;
}

export default useCancelTransaction;
