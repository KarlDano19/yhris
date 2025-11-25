import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function syncPosition() {
  try {
    const token = getCookie('token');
    const config = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };

    // Build URL with query parameter
    let url = `${process.env.NEXT_PUBLIC_API_URL}/api/positions/sync-third-party-integration/`;

    const res = await fetch(url, config);
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

function useSyncPosition() {
  const query = useMutation({
    mutationFn: () => syncPosition(),
  });

  return query;
}

export default useSyncPosition;