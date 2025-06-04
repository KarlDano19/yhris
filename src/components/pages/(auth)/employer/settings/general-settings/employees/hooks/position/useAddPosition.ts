import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function addPosition(position: any) {
  try {
    const token = getCookie('token');

    const config = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(position),
    };

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/positions/`, config);
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

function useAddPosition() {
  const query = useMutation((position: any) => addPosition(position));

  return query;
}

export default useAddPosition;
