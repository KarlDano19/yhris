import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function addPositionToYP(positionData: { id: string; data: any }) {
  try {
    const token = getCookie('token');
    const config = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(positionData.data),
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/positions/sync-create/`, config);
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

function useAddPositionToYP() {
  const query = useMutation((positionData: { id: string; data: any }) => addPositionToYP(positionData));

  return query;
}

export default useAddPositionToYP;
