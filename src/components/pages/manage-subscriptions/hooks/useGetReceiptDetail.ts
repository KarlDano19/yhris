import { useQuery } from '@tanstack/react-query';

import { getCookie } from 'cookies-next';

async function getReceiptDetail(reference_id: string) {
  try {
    const token = getCookie('token');
    const config = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/receipt/${reference_id}/`, config);
    if (res.ok) {
      return res.json();
    }
    throw res.json();
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.message;
    }
    throw errStringify.message;
  }
}

function useGetReceiptDetail(reference_id: string) {
  const query = useQuery(['receiptDetailsCache'], () => getReceiptDetail(reference_id), {
    enabled: false,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });

  return query;
}

export default useGetReceiptDetail;
