import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function updateVoucher(voucher_id: number | null) {
  try {
    const token = getCookie('token');
    const config = {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/vouchers/${voucher_id}/`, config);
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

function useUpdateVoucher() {
  const query = useMutation((voucher_id: number | null) => updateVoucher(voucher_id));
  return query;
}

export default useUpdateVoucher;
