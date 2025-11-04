import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function addLocationToYP(locationData: { id: string; data: any }) {
  try {
    const token = getCookie('token');
    const config = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(locationData.data),
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/locations/sync-create/`, config);
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

function useAddLocationToYP() {
  const query = useMutation((locationData: { id: string; data: any }) => addLocationToYP(locationData));

  return query;
}

export default useAddLocationToYP;
